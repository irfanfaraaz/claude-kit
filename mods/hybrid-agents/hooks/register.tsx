// hybrid-agents: Irfan's standing "hybrid approach", so he stops typing it.
// A subagent spawned with no model runs on Sonnet (forks keep the parent's).
// A prompt that points at a plan file gets the hybrid rule as context.

import type { Register } from 'claude-code'

const PLAN = /docs\/superpowers\/plans\/|\bplan[\w-]*\.md\b/i
const RULE =
  'Hybrid approach (standing preference): do small tasks inline yourself; hand large or ' +
  'parallel tasks to subagents running the sonnet model, in the background where possible.'

export const register: Register = on => {
  on('agent.spawn', async ($, e, next) => {
    if (e.fork || e.model !== undefined) return next(e)
    $.ui.toast(`subagent ${e.subagentType || 'general'} → sonnet`)
    return next({ ...e, model: 'sonnet' })
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.origin.kind !== 'composer' || !PLAN.test(e.text)) return next(e)
    return next({ ...e, context: [...(e.context ?? []), RULE] })
  })
}
