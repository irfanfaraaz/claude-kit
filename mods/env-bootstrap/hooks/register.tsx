// env-bootstrap: per-project shell setup done once, not in every command.
// Claude ran `nvm use 22` 140 times (backend-mastery-course) and sourced
// .env.clone.local 120+ times (pebbo_mvp-oct). Here Node goes on PATH at
// session start, the env file is loaded into each Bash call, and Claude is told.

import type { EngineInterface, Register } from 'claude-code'

type Project = { dir: string; node?: string; envFile?: string }

// Paths relative to $HOME. Add a row to cover another repo.
const PROJECTS: Project[] = [
  { dir: 'Developer/backend-mastery-course', node: '22' },
  { dir: 'Developer/work/Pebbo/pebbo_mvp-oct', envFile: '.env.clone.local' },
]

const NVM_PREFIX = /(?:source|\.)\s+\S*nvm\.sh\s*(?:>\s*\/dev\/null\s*)?(?:2>&1\s*)?(?:&&|;)\s*/g
const NVM_USE = /nvm use\s+\S*\s*(?:>\s*\/dev\/null\s*)?(?:2>&1\s*)?(?:&&|;)\s*/g

let active: (Project & { root: string }) | null = null

async function pick($: EngineInterface, cwd: string): Promise<void> {
  const home = (await $.env.get('HOME')) ?? ''
  const hit = PROJECTS.find(p => cwd === `${home}/${p.dir}` || cwd.startsWith(`${home}/${p.dir}/`))
  active = hit === undefined ? null : { ...hit, root: `${home}/${hit.dir}` }
  if (active?.node === undefined) return

  const versions = (await $.fs.list(`${home}/.nvm/versions/node`))
    .map(f => f.name)
    .filter(n => n.startsWith(`v${active?.node}.`))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  const latest = versions.pop()
  if (latest === undefined) return void $.ui.toast(`env-bootstrap: no Node ${active.node} under ~/.nvm`)
  const path = (await $.env.get('PATH')) ?? ''
  await $.env.set('PATH', `${home}/.nvm/versions/node/${latest}/bin:${path}`)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await pick($, e.cwd)
    if (active !== null) {
      $.ui.status(`env: ${[active.node && `node ${active.node}`, active.envFile].filter(Boolean).join(' · ')}`)
    }
    return next(e)
  })

  on('prompt.context', async ($, e, next) => {
    if (active === null) return next(e)
    const lines = [
      active.node && `Node ${active.node} is already first on PATH. Do not run nvm or source nvm.sh.`,
      active.envFile &&
        `${active.envFile} is loaded automatically into every Bash call in ${active.root}. Do not source it yourself.`,
    ].filter(Boolean)
    return next({ ...e, blocks: [...e.blocks, { name: 'env-bootstrap', text: lines.join('\n') }] })
  })

  on('tool.call', { tool: 'Bash' }, ($, e, next) => {
    if (active === null) return next(e)
    let command = e.command
    if (active.node !== undefined) command = command.replace(NVM_PREFIX, '').replace(NVM_USE, '')
    if (active.envFile !== undefined && !command.includes(active.envFile)) {
      command = `set -a; . "${active.root}/${active.envFile}" 2>/dev/null; set +a; ${command}`
    }
    return command === e.command ? next(e) : next({ ...e, command })
  })
}
