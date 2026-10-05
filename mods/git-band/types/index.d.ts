export type GitInfo = {
  branch: string
  upstream: string | null
  ahead: number
  behind: number
  changed: number
  byClaude: number
  worktree: string | null
  stash: number
}

export type PrInfo = { number: number; state: string; ci: 'passing' | 'failing' | 'running' | 'none' }

declare module 'claude-code' {
  interface PluginState {
    'git-band': { info: GitInfo | null; pr: PrInfo | null }
  }
}
