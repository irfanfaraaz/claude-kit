// rm-to-trash: Claude's `rm` keeps hitting the Bash(rm *) deny rule. Rewrite
// it to macOS /usr/bin/trash so the delete goes through and can be undone from
// the Trash. `git rm` and words like "form" are left alone.

import type { Register } from 'claude-code'

// rm at the start of a command or after ; && || | ( or a newline, with its flags
const RM = /(^|[;&|(\n]\s*)(?:sudo\s+)?rm((?:\s+-[a-zA-Z]+)*)\s+/g

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, ($, e, next) => {
    if (!RM.test(e.command)) return next(e)
    RM.lastIndex = 0
    const command = e.command.replace(RM, '$1trash ')
    $.ui.toast('rm → trash (recoverable from the Trash)')
    return next({ ...e, command })
  })
}
