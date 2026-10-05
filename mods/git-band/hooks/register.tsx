// git-band: one line above the prompt with the session repo's git state, so
// nobody has to ask "which branch did that land on". Runs git and gh locally,
// no model calls. Refreshes at start, after each turn and after git commands.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement } from 'claude-code'

import type { GitInfo, PrInfo } from '../types'

const DANGER = /^(main|master|staging|prod|production)$/
const info = atom({ plugin: 'git-band', key: 'info' } as const, null as GitInfo | null)
const pr = atom({ plugin: 'git-band', key: 'pr' } as const, null as PrInfo | null)

// Files Claude wrote this session (absolute paths); a reload forgets them.
const claudeFiles = new Set<string>()

async function git($: EngineInterface, root: string, ...args: string[]): Promise<string | null> {
  const r = await $.process.run(['git', '-C', root, ...args], { timeoutMs: 5000 })
  return r.exitCode === 0 ? r.stdout.trim() : null
}

async function refresh($: EngineInterface): Promise<void> {
  const repo = await $.session.repo()
  if (repo === null) return void (await update($, info, () => null))
  const root = repo.root
  const branch = (await git($, root, 'rev-parse', '--abbrev-ref', 'HEAD')) ?? '?'
  const upstream = await git($, root, 'rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')
  const counts = upstream === null ? null : await git($, root, 'rev-list', '--left-right', '--count', '@{u}...HEAD')
  const [behind, ahead] = (counts ?? '0 0').split(/\s+/).map(Number)
  const status = (await git($, root, 'status', '--porcelain')) ?? ''
  const paths = status === '' ? [] : status.split('\n').map(l => l.slice(3).split(' -> ').pop() ?? '')
  const byClaude = paths.filter(p => claudeFiles.has(`${root}/${p}`)).length
  const gitDir = await git($, root, 'rev-parse', '--absolute-git-dir')
  const commonDir = await git($, root, 'rev-parse', '--path-format=absolute', '--git-common-dir')
  const stash = await git($, root, 'stash', 'list')

  await update($, info, () => ({
    branch,
    upstream,
    ahead: ahead || 0,
    behind: behind || 0,
    changed: paths.length,
    byClaude,
    worktree: gitDir !== null && commonDir !== null && gitDir !== commonDir ? root.split('/').pop() ?? null : null,
    stash: stash === null || stash === '' ? 0 : stash.split('\n').length,
  }))
}

async function refreshPr($: EngineInterface): Promise<void> {
  const repo = await $.session.repo()
  if (repo === null || repo.remote === null) return
  const r = await $.process.run(['gh', 'pr', 'view', '--json', 'number,state,statusCheckRollup'], {
    cwd: repo.root,
    timeoutMs: 15000,
  })
  if (r.exitCode !== 0) return void (await update($, pr, () => null))
  try {
    const j = JSON.parse(r.stdout) as {
      number: number
      state: string
      statusCheckRollup?: { conclusion?: string; status?: string; state?: string }[]
    }
    const checks = j.statusCheckRollup ?? []
    const states = checks.map(c => (c.conclusion || c.state || c.status || '').toUpperCase())
    const ci: PrInfo['ci'] =
      checks.length === 0 ? 'none'
      : states.some(s => /FAIL|ERROR|CANCEL|TIMED_OUT/.test(s)) ? 'failing'
      : states.some(s => /PENDING|QUEUED|IN_PROGRESS|EXPECTED|^$/.test(s)) ? 'running'
      : 'passing'
    await update($, pr, () => ({ number: j.number, state: j.state.toLowerCase(), ci }))
  } catch {
    await update($, pr, () => null)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    void refresh($)
    void refreshPr($)
    $.clock.every(5 * 60_000, () => void refreshPr($))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId === undefined) void refresh($)
    return result
  })

  on('tool.call', { tool: /^(Edit|Write|NotebookEdit)$/ }, async ($, e, next) => {
    const ran = await next(e)
    const input = e as unknown as { file_path?: string; notebook_path?: string }
    const path = input.file_path ?? input.notebook_path
    if (ran.deny === undefined && ran.isError !== true && path !== undefined) claudeFiles.add(path)
    return ran
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    if (!/\bgit\b/.test(e.command)) return ran
    await refresh($)
    if (/\bgit\s+commit\b/.test(e.command) && ran.isError !== true && ran.deny === undefined) {
      const repo = await $.session.repo()
      const head = repo === null ? null : await git($, repo.root, 'log', '-1', '--format=%h %s')
      const now = await read($, info)
      if (head !== null) $.ui.toast(`commit ${head.slice(0, 60)} → ${now?.branch ?? '?'}`)
    }
    if (/\bgit\s+push\b|\bgh\s+pr\b/.test(e.command)) void refreshPr($)
    return ran
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next): Promise<RenderElement> => {
    const below = await next(e)
    const g = await read($, info)
    if (e.props.hasSurvey || g === null) return below
    const p = await read($, pr)
    const { Box, Text } = $.ui.resolve(e)
    const yours = g.changed - g.byClaude
    const ciColor = p?.ci === 'failing' ? 'red' : p?.ci === 'running' ? 'yellow' : 'green'

    return (
      <Box flexDirection="column">
        <Box flexWrap="wrap">
          <Text color={DANGER.test(g.branch) ? 'red' : 'cyan'} bold>⎇ {g.branch}</Text>
          {g.upstream !== null && <Text dimColor> → {g.upstream}</Text>}
          {(g.ahead > 0 || g.behind > 0) && (
            <Text color={g.ahead > 0 ? 'yellow' : undefined} dimColor={g.ahead === 0}>
              {' · '}{g.ahead} not pushed{g.behind > 0 ? `, ${g.behind} behind` : ''}
            </Text>
          )}
          {g.upstream === null && <Text color="yellow"> · no upstream</Text>}
          <Text dimColor>
            {' · '}
            {g.changed === 0 ? 'clean' : `${g.changed} changed (${g.byClaude} Claude, ${yours} you)`}
          </Text>
          {p !== null && (
            <Text dimColor>
              {' · '}PR #{p.number} {p.state}
            </Text>
          )}
          {p !== null && p.ci !== 'none' && <Text color={ciColor}> CI {p.ci}</Text>}
          {g.worktree !== null && <Text dimColor> · wt {g.worktree}</Text>}
          {g.stash > 0 && <Text dimColor> · stash {g.stash}</Text>}
        </Box>
        {below}
      </Box>
    )
  })
}
