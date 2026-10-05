// carousel-ship: after `python3 render.py` runs for a carousel, offer the next
// steps as buttons above the prompt (caption + copy, queue the Threads chain,
// log the ledger), each run through the page's own skill. Also refuses a
// Zernio post whose Threads text or any thread part is over 500 characters.

import { atom, read, update } from 'claude-code'
import type { RenderElement, Register } from 'claude-code'

import type { Page } from '../types'

const LIMIT = 500
const offer = atom({ plugin: 'carousel-ship', key: 'offer' } as const, null as Page | null)

const STEPS: { key: string; hotkey: string; label: string; ask: string }[] = [
  { key: 'caption', hotkey: 'a', label: 'Caption + copy', ask: 'Write the Instagram caption for the post just rendered and copy it to my clipboard with pbcopy.' },
  { key: 'threads', hotkey: 't', label: 'Queue Threads', ask: 'Queue the companion Threads chain for the post just rendered via Zernio. Keep every thread part at 500 characters or less.' },
  { key: 'ledger', hotkey: 'l', label: 'Log ledger', ask: 'Log the post just rendered in the content ledger.' },
]

let pending: Page | null = null

type ThreadItem = { content?: string; text?: string }
type Platform = { platform?: string; platformSpecificData?: { threadItems?: ThreadItem[] } }

type ZernioArgs = { content?: string; platforms?: Platform[] }

function denyReason(args: ZernioArgs): string | null {
  const threads = (args.platforms ?? []).filter(p => p.platform === 'threads')
  if (threads.length === 0) return null
  const parts = [args.content ?? '', ...threads.flatMap(p => p.platformSpecificData?.threadItems ?? []).map(i => i.content ?? i.text ?? '')]
  const bad = parts.flatMap((t, i) => ([...t].length > LIMIT ? [`part ${i + 1}: ${[...t].length} chars`] : []))
  return bad.length === 0
    ? null
    : `carousel-ship: Threads allows ${LIMIT} characters per part. Too long: ${bad.join(', ')}. Split those parts and retry.`
}

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    if (/render\.py/.test(e.command) && ran.isError !== true && ran.deny === undefined) {
      pending = /Piousdeenn/i.test(e.command) ? 'piousdeenn-carousel' : /My Islamic Page/i.test(e.command) ? 'my-islamic-carousel' : null
    }
    return ran
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId === undefined && pending !== null) {
      const page = pending
      pending = null
      await update($, offer, () => page)
    }
    return result
  })

  // Zernio posts go through call_tool (posts_create_post / posts_update_post) or the direct tools.
  on('tool.call', { tool: 'mcp__plugin_zernio_zernio__call_tool' }, ($, e, next) => {
    const input = e as unknown as { name?: string; arguments?: ZernioArgs }
    if (!/posts_(create|update)/.test(input.name ?? '')) return next(e)
    const reason = denyReason(input.arguments ?? {})
    return reason === null ? next(e) : ($.ui.toast(reason), { deny: reason })
  })
  on('tool.call', { tool: 'mcp__plugin_zernio_zernio__posts_create' }, ($, e, next) => {
    const reason = denyReason(e as unknown as ZernioArgs)
    return reason === null ? next(e) : ($.ui.toast(reason), { deny: reason })
  })
  on('tool.call', { tool: 'mcp__plugin_zernio_zernio__posts_update' }, ($, e, next) => {
    const reason = denyReason(e as unknown as ZernioArgs)
    return reason === null ? next(e) : ($.ui.toast(reason), { deny: reason })
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next): Promise<RenderElement> => {
    const below = await next(e)
    const page = await read($, offer)
    if (page === null || e.props.hasSurvey || e.props.isWorking) return below
    const { Box, Text, Button } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Box>
          <Text dimColor>carousel ({page === 'piousdeenn-carousel' ? 'piousdeenn' : 'my page'}): </Text>
          {STEPS.map(s => (
            <Box key={s.key} marginRight={2}>
              <Button plain hotkey={s.hotkey} label={s.label} onPress={() => {
                void $.command.run({ command: page, args: s.ask }).catch(err => $.ui.toast(`could not run /${page}: ${String(err)}`))
              }} />
            </Box>
          ))}
          <Button key="dismiss" plain hotkey="x" label="done" onPress={() => void update($, offer, () => null)} />
        </Box>
        {below}
      </Box>
    )
  })
}
