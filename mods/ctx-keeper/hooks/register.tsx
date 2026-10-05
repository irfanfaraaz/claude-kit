// ctx-keeper: a band above the prompt with the prompt-cache countdown, context
// size, cache rewrite cost, 5h/week limits and session cost (cache-keeper's
// pills), plus Irfan's hand-off flow. When context passes 350k and nothing is
// still running (no turn, no open tasks, no subagents), it runs /re-fresh,
// copies the hand-off to the clipboard (and saves it), compacts, then sends the
// hand-off back with "do nothing, reply ready".

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement } from 'claude-code'

import type { Meter, Phase } from '../types'

const THRESHOLD = 350_000
const CACHE_MIN = 60 // settings.json promptCacheTtl "1h" (main chat); subagents stay 5m
const WARN_MIN = 1
const COOLDOWN_MS = 10 * 60_000
// Auto keep-warm: from Irfan's idle gaps, pinging pays off up to ~20m; past that a rewrite is cheaper.
// ponytail: with a 1h cache this never fires inside the 20m window; raise AUTO_WARM_MAX_MIN (~180) to bridge 1-3h breaks
const PING_AT_MIN = CACHE_MIN - 1
const AUTO_WARM_MAX_MIN = 20
const LIMIT_STOP_PCT = 90

const meter = atom({ plugin: 'ctx-keeper', key: 'meter' } as const, {
  tokens: 0,
  fiveHour: null,
  week: null,
  usd: null,
  lastTurnAt: 0,
} as Meter)
const phase = atom({ plugin: 'ctx-keeper', key: 'phase' } as const, 'idle' as Phase)
const autoWarm = atom({ plugin: 'ctx-keeper', key: 'autoWarm' } as const, true as boolean)

const REFRESH_ARGS =
  'full Goal: continue the current work in this same chat right after compaction. Stays here, nothing travels.'

// ponytail: 1h cache-write price per Mtok (2x input) by model family; edit if pricing changes
function usdPerMtok(model: string): number {
  if (/haiku/i.test(model)) return 2
  if (/sonnet/i.test(model)) return 6
  return 10
}

function fmtK(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
}

function extractHandoff(answer: string): string {
  const blocks = [...answer.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map(m => (m[1] ?? "").trim())
  const longest = blocks.sort((a, b) => b.length - a.length)[0]
  return longest !== undefined && longest.length > 200 ? longest : answer.trim()
}

// Module state: a hot reload resets it, which only forgets open tasks.
const openTasks = new Set<string>()
let isTurnRunning = false
let lastAnswerOk = true
let lastFlowAt = 0
let pendingHandoff: string | null = null
let warnedFor = 0
let lastHumanAt = Date.now() // end of the last human turn; starts at load so a reload cannot ping forever
let pingInFlight = false

function autoWarmBlock(m: Meter, now: number): string | null {
  if (m.fiveHour !== null && m.fiveHour >= LIMIT_STOP_PCT) return `5h ≥${LIMIT_STOP_PCT}%`
  if (lastHumanAt > 0 && now - lastHumanAt >= AUTO_WARM_MAX_MIN * 60_000) return `idle ${AUTO_WARM_MAX_MIN}m+`
  return null
}

function ping($: EngineInterface): void {
  pingInFlight = true
  void $.prompt.submit({ text: 'Cache keep-warm ping. Reply with only: ok' })
}

async function startFlow($: EngineInterface): Promise<void> {
  if ((await read($, phase)) !== 'idle') return
  lastFlowAt = await $.clock.now()
  await update($, phase, () => 'refresh')
  $.ui.toast('ctx-keeper: writing the hand-off with /re-fresh')
  try {
    await $.command.run({ command: 're-fresh', args: REFRESH_ARGS })
  } catch (error) {
    $.ui.toast(`ctx-keeper: /re-fresh failed: ${String(error)}`)
    await update($, phase, () => 'idle')
  }
}

async function finishFlow($: EngineInterface, answer: string): Promise<void> {
  const handoff = extractHandoff(answer)
  if (handoff.length < 100) {
    $.ui.toast('ctx-keeper: /re-fresh gave no hand-off, stopped before compacting')
    await update($, phase, () => 'idle')
    return
  }

  // pbcopy is the Mac clipboard and works from the desktop app too; ui.copy is the fallback.
  const pb = await $.process.run(['pbcopy'], { stdin: handoff, timeoutMs: 5000 }).catch(() => null)
  const copied = pb?.exitCode === 0 ? { isCopied: true } : await $.ui.copy({ text: handoff })
  const home = (await $.env.get('HOME')) ?? ''
  const dir = `${home}/.claude/mods-data/ctx-keeper/handoffs`
  const stamp = new Date(await $.clock.now()).toISOString().replace(/[:T]/g, '-').slice(0, 16)
  await $.process.run(['mkdir', '-p', dir])
  await $.fs.write(`${dir}/${stamp}.md`, handoff)
  $.ui.toast(
    `ctx-keeper: hand-off ${copied.isCopied ? 'copied' : 'not copied'} and saved to ${dir}/${stamp}.md. Compacting.`,
  )

  // Same path as typing /compact; the session.compact hook below sends the paste.
  pendingHandoff = handoff
  await update($, phase, () => 'compact')
  await $.command.run({
    command: 'compact',
    args: 'A hand-off prompt is sent right after this. Keep the current task state and file paths.',
  })
}

async function paste($: EngineInterface): Promise<void> {
  const handoff = pendingHandoff
  pendingHandoff = null
  if (handoff === null) return void (await update($, phase, () => 'idle'))
  await update($, phase, () => 'paste')
  await $.prompt.submit({
    text:
      'Hand-off from before compaction is below. Read it and do nothing else: no tools, no work. ' +
      'Reply with only the word: ready\n\n' +
      handoff,
  })
}

// The size is measured AFTER turn.complete, so the check runs on each measure
// and after each turn, once nothing is running.
async function maybeStart($: EngineInterface): Promise<void> {
  if (isTurnRunning || !lastAnswerOk || openTasks.size > 0) return
  if ((await read($, phase)) !== 'idle') return
  const m = await read($, meter)
  if (m.tokens < THRESHOLD || (await $.clock.now()) - lastFlowAt <= COOLDOWN_MS) return
  const agents = await $.agent.list().catch(() => [])
  if (agents.some(a => /run|pend|start|active/i.test(a.status))) return
  $.clock.after(0, () => void startFlow($))
}

export const register: Register = on => {
  on('session.compact', async ($, e, next) => {
    const result = await next(e)
    if ((await read($, phase)) !== 'compact') return result
    if (result.skip !== undefined) {
      pendingHandoff = null
      $.ui.toast(`ctx-keeper: compact skipped (${result.skip}); hand-off is on the clipboard`)
      await update($, phase, () => 'idle')
    } else {
      $.clock.after(0, () => void paste($))
    }
    return result
  })

  on('turn.start', async ($, e, next) => {
    isTurnRunning = true
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    // A reload kills any flow in flight, but $.state keeps its phase: reset it.
    await update($, phase, () => 'idle')
    // Every 30s: redraw, auto-ping before the cache goes cold, else warn.
    $.clock.every(30_000, () => {
      void (async () => {
        $.ui.invalidate('ui.render')
        const m = await read($, meter)
        if (m.lastTurnAt === 0) return
        const now = await $.clock.now()
        const idleMin = (now - m.lastTurnAt) / 60_000
        const left = CACHE_MIN - idleMin
        const canPing =
          (await read($, autoWarm)) &&
          !isTurnRunning &&
          !pingInFlight &&
          (await read($, phase)) === 'idle' &&
          autoWarmBlock(m, now) === null
        if (canPing && left > 0 && idleMin >= PING_AT_MIN) return ping($)
        if (!canPing && left > 0 && left <= WARN_MIN && warnedFor !== m.lastTurnAt) {
          warnedFor = m.lastTurnAt
          $.ui.toast(`ctx-keeper: cache goes cold in ${Math.ceil(left)}m.`)
        }
      })()
    })
    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    const five = e.rateLimits.find(r => r.kind === 'five_hour')
    const week = e.rateLimits.find(r => r.kind === 'seven_day')
    await update($, meter, m => ({
      ...m,
      tokens: e.context.tokens ?? m.tokens,
      fiveHour: five?.percentUsed ?? m.fiveHour,
      week: week?.percentUsed ?? m.week,
      usd: e.cost?.usd ?? m.usd,
    }))
    void maybeStart($)
    return next(e)
  })

  // Open tasks: a hand-off waits until the task list is clear.
  // Task tools are not in every build, so the matchers are patterns.
  on('tool.call', { tool: /^TaskCreate$/ }, async ($, e, next) => {
    const ran = await next(e)
    const id = /#?(\d+)/.exec(ran.text ?? '')?.[1]
    if (id !== undefined) openTasks.add(id)
    return ran
  })
  on('tool.call', { tool: /^TaskUpdate$/ }, async ($, e, next) => {
    const input = e as unknown as { taskId?: string; status?: string }
    if (input.taskId !== undefined && (input.status === 'completed' || input.status === 'deleted')) {
      openTasks.delete(String(input.taskId))
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result
    isTurnRunning = false
    lastAnswerOk = e.reason === 'answer'

    const now = await $.clock.now()
    await update($, meter, m => ({ ...m, lastTurnAt: now }))
    if (!pingInFlight) lastHumanAt = now
    pingInFlight = false
    const current = await read($, phase)

    if (current === 'refresh') {
      const answer = e.answer
      $.clock.after(0, () => void finishFlow($, answer))
      return result
    }
    if (current === 'paste') {
      await update($, phase, () => 'idle')
      $.ui.toast('ctx-keeper: hand-off pasted, Claude is waiting for you')
      return result
    }

    void maybeStart($)
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next): Promise<RenderElement> => {
    const below = await next(e)
    if (e.props.hasSurvey) return below
    const { Box, Text, Button } = $.ui.resolve(e)
    const m = await read($, meter)
    const current = await read($, phase)
    const now = await $.clock.now()
    const model = await $.session.model()
    const isAutoOn = await read($, autoWarm)

    const leftMin = m.lastTurnAt === 0 ? null : Math.round(CACHE_MIN - (now - m.lastTurnAt) / 60_000)
    const isWarm = leftMin !== null && leftMin > 0
    const cacheColor = !isWarm ? 'red' : leftMin <= WARN_MIN ? 'yellow' : 'green'
    const ctxColor = m.tokens >= THRESHOLD ? 'red' : m.tokens >= THRESHOLD * 0.8 ? 'yellow' : 'green'
    const rewriteUsd = (m.tokens / 1_000_000) * usdPerMtok(model)
    const warmUsd = rewriteUsd / 20 // cache read is 0.1x input, 1h write is 2x
    const limits = [
      m.fiveHour === null ? null : `5h ${Math.round(m.fiveHour)}%`,
    ]
      .filter(Boolean)
      .join(' · ')

    return (
      <Box flexDirection="column">
        <Box flexWrap="wrap" marginY={1}>
          <Text color={cacheColor}>● </Text>
          <Text dimColor>
            {leftMin === null ? 'cache n/a' : isWarm ? `cache warm ${leftMin}m` : 'cache cold'}
            {' | '}
          </Text>
          <Text color={ctxColor}>ctx {fmtK(m.tokens)}/{fmtK(THRESHOLD)}</Text>
          <Text dimColor>
            {' | '}${rewriteUsd.toFixed(2)} | ${warmUsd.toFixed(2)}
            {limits === '' ? '' : ` | ${limits}`}
          </Text>
          {isAutoOn && isWarm && autoWarmBlock(m, now) !== null && (
            <Text color="yellow"> | auto-warm off ({autoWarmBlock(m, now)})</Text>
          )}
          {current !== 'idle' && <Text color="red"> ● {current}</Text>}
          {!e.props.isWorking && current === 'idle' && <Text>   </Text>}
          {!e.props.isWorking && current === 'idle' && (
            <Button key="auto" plain hotkey="w" label={`auto-warm: ${isAutoOn ? 'on' : 'off'}`} onPress={() => {
              void update($, autoWarm, v => !v).then(() => $.ui.invalidate('ui.render'))
            }} />
          )}
          {!e.props.isWorking && current === 'idle' && <Text>   </Text>}
          {!e.props.isWorking && current === 'idle' && (
            <Button key="compact" plain hotkey="c" label="compact" onPress={() => {
              void $.command.run({ command: 'compact', args: '' }).catch(err => $.ui.toast(`ctx-keeper: compact failed: ${String(err)}`))
            }} />
          )}
          {!e.props.isWorking && current === 'idle' && <Text>   </Text>}
          {!e.props.isWorking && current === 'idle' && (
            <Button key="handoff" plain hotkey="h" label="hand-off now" onPress={() => {
              void startFlow($)
            }} />
          )}
        </Box>
        {below}
      </Box>
    )
  })
}
