export type Meter = {
  tokens: number
  fiveHour: number | null
  week: number | null
  usd: number | null
  lastTurnAt: number
}

export type Phase = 'idle' | 'refresh' | 'compact' | 'paste'

declare module 'claude-code' {
  interface PluginState {
    'ctx-keeper': { meter: Meter; phase: Phase; autoWarm: boolean }
  }
}
