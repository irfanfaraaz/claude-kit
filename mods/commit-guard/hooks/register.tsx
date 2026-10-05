// commit-guard: Irfan's git rules, enforced before the command runs.
// 1. docs/superpowers never gets committed: it is unstaged right before a commit.
// 2. No git push unless his last prompt said push (or PR).
// 3. A commit on main/master/staging/prod asks him first, unless his prompt named that branch.

import type { EngineInterface, Register } from 'claude-code'

const DANGER = /^(main|master|staging|prod|production)$/
const NEVER = 'docs/superpowers'

let lastPrompt = ''

// ponytail: reads a leading `cd <dir>` off the command, else the session cwd
async function repoRoot($: EngineInterface, command: string): Promise<string> {
  const cd = /^\s*cd\s+("([^"]+)"|'([^']+)'|(\S+))/.exec(command)
  const dir = cd?.[2] ?? cd?.[3] ?? cd?.[4]?.replace(/;$/, '')
  return dir?.replace(/^~/, (await $.env.get('HOME')) ?? '~') ?? (await $.session.cwd())
}

async function git($: EngineInterface, root: string, ...args: string[]): Promise<string> {
  const r = await $.process.run(['git', '-C', root, ...args], { timeoutMs: 5000 })
  return r.exitCode === 0 ? r.stdout.trim() : ''
}

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind === 'composer') lastPrompt = e.text
    return next(e)
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const cmd = e.command

    if (/\bgit\s+push\b/.test(cmd) && !/\b(push|pr|pull request)\b/i.test(lastPrompt)) {
      $.ui.toast('commit-guard: blocked git push, you did not ask for it')
      return { deny: 'commit-guard: Irfan did not ask to push. Commit only, then ask him before pushing.' }
    }

    if (!/\bgit\s+commit\b/.test(cmd)) return next(e)
    const root = await repoRoot($, cmd)

    const staged = await git($, root, 'diff', '--cached', '--name-only', '--', NEVER)
    if (staged !== '') {
      await git($, root, 'reset', '-q', '--', NEVER)
      $.ui.toast(`commit-guard: unstaged ${staged.split('\n').length} file(s) under ${NEVER}`)
    }

    const branch = await git($, root, 'rev-parse', '--abbrev-ref', 'HEAD')
    if (DANGER.test(branch) && !new RegExp(`\\b${branch}\\b`, 'i').test(lastPrompt)) {
      const answer = await $.ui.ask(`commit-guard: Claude wants to commit on ${branch}. Allow?`, [
        'Allow this commit',
        'Block it',
      ])
      if (answer !== 'Allow this commit') {
        return { deny: `commit-guard: Irfan blocked a commit on ${branch}. Ask which branch to use.` }
      }
    }

    return next(e)
  })
}
