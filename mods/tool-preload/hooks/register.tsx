// tool-preload: Claude spent 316 ToolSearch calls loading the same tools.
// Mark the everyday ones as always loaded. Costs a few k tokens of schema at
// session start (cached after the first turn).

import type { Register } from 'claude-code'

const KEEP = new RegExp(
  [
    '^mcp__plugin_context-mode_context-mode__ctx_(execute|execute_file|batch_execute|search|fetch_and_index|index)$',
    '^mcp__jcodemunch__(search_symbols|get_file_outline|find_references|find_importers|get_blast_radius|search_text|get_context_bundle|get_symbol_source)$',
    '^mcp__plugin_claude-mem_mcp-search__(search|smart_search|get_observations|timeline)$',
    '^mcp__plugin_supabase_supabase__(execute_sql|list_tables)$',
    '^(WebSearch|WebFetch|TaskCreate|TaskUpdate|TaskList|TaskGet|SendMessage)$',
  ].join('|'),
)

export const register: Register = on => {
  on('tool.describe', async ($, e, next) => {
    const described = await next(e)
    return KEEP.test(e.tool) ? { ...described, isDeferred: false } : described
  })
}
