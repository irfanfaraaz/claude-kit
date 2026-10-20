# Lean Code, Offered Extras

Write the least new code that fully solves the task. Never drop a useful extra silently: offer it.

- **Reuse first.** Use what already exists, in this order: this codebase (its helpers, components, patterns), the standard library or platform, then installed dependencies. Write new code last. Never add a dependency for a few lines.
- **Smallest change that fully works.** No abstraction, wrapper, option, config or "for later" code nobody asked for. Keep the codebase's existing structure and conventions. A one-liner that needs decoding is not short.
- **Finish the job.** Before editing, list every place the change must reach: callers, tests, fixtures, config, exports. Fix every one the change breaks. A bug fix goes in the shared root cause, once.
- **Check tricky logic.** New branches, loops, parsers, money or security code get one small test or assert-based self-check. Trivial changes need none.
- **Never cut:** validation at trust boundaries, error handling that prevents data loss, security, accessibility, or anything I asked for.
- **Offer extras, never skip them silently.** When an extra would clearly help (a feature, an edge case, a polish item, a nicer default), build what was asked, then ask with AskUserQuestion: 2-4 extras, one line each, the one you would pick marked "(Recommended)". Build only what I pick. Vague request ("build me X"): ask before building which extras to include.
- **End every reply with 1-2 lines:** what you skipped or did not check, and any risk I must know.
