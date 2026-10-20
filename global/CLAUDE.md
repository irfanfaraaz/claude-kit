# Global Claude Code Configuration

## jcodemunch Routing (v1.80.9)

Call the jcodemunch_guide tool at session start and strictly follow its instructions.

## Code Retrieval Strategy: Combo Approach (Stress-Tested on Real Data)

**CRITICAL: Use jcodemunch FIRST, then add Context-Mode only if you need code content. Don't use both for the same query.**

Based on comprehensive testing with pebbo_mvp-oct (747 files, 2054 symbols):

### Tool Comparison: Verified Real Numbers

| Tool             | Single Query  | 5 Queries      | Context Cost | Context Saved      | Best For                             |
| ---------------- | ------------- | -------------- | ------------ | ------------------ | ------------------------------------ |
| **jcodemunch**   | ~180 tokens   | ~900 tokens    | 0KB          | 100%               | Symbol lookup, references, structure |
| **Context-Mode** | N/A           | ~21,431 tokens | 83.7KB       | 50% (84KB sandbox) | Code content, implementation details |
| **Grep**         | ~1,500 tokens | ~7,500 tokens  | 100% flood   | 0%                 | Simple regex (last resort)           |

### Phase 1: jcodemunch (Discovery)

- Cost: ~180 tokens per search, <20ms
- Returns: File locations, function signatures, references
- Use when: Finding code, understanding relationships

### Phase 2: Context-Mode (If Needed)

- Cost: ~16-21K tokens, 50% sandboxed
- Returns: Full code content, implementation details
- Use when: Need to see actual code, understand logic

### Phase 3: Grep (Fallback)

- Cost: ~1,500+ tokens, 100% context flood
- Use only if above two fail

### jcodemunch Index Maintenance

- Auto-rebuilds on major file changes
- Rebuild manually: delete `~/.code-index/` after large refactors
- Signals stale index: "symbol not found" for recent code, wrong file paths

## Decision Tree: Use jcodemunch First, Then Context-Mode If Needed

**jcodemunch (~180 tokens, <20ms):**

- Search symbols: `search_symbols('functionName')`
- Find references: `find_references('code')`
- File outline: `get_file_outline('file.js')`
- Blast radius: `get_blast_radius` — run before any refactor to see what breaks
- Importers: `find_importers` — run before deleting or renaming a symbol
- Dead code: `find_dead_code` — run periodically to detect unreachable code
- Freshness: `check_freshness` — run at session start to verify the index is up to date; rebuild if stale (see jcodemunch Index Maintenance)
- Use when: "Where is X?", "What uses X?", "List functions in X"

**Context-Mode (~16-21K tokens, 50% sandboxed):**

- Batch index: `ctx_batch_execute(['command1', 'command2'])`
- Search indexed: `ctx_search(['query'])`
- Use when: "Show me code", "How does X work?", need full implementation

**Grep (1,500+ tokens, floods context 100%):**

- Use only if both fail above

## Stress Test Results (Exercise Page APIs)

| Metric                 | jcodemunch          | Context-Mode          |
| ---------------------- | ------------------- | --------------------- |
| **Cost for 5 queries** | ~900 tokens         | ~21,431 tokens        |
| **Speed**              | 95ms                | 2-4s                  |
| **Context entered**    | 0KB                 | 83.7KB                |
| **Context protected**  | 100%                | 50% (84KB sandbox)    |
| **Best for**           | Metadata, structure | Code content, details |

## The Core Principle

**jcodemunch saves tokens when Claude reads your code** — structural lookups avoid full file reads
**context-mode saves tokens when MCP tools return large outputs** — keeps data in sandbox, not context

## Context-Mode: Session Continuity

- Tracks file edits, git ops, tasks, errors in SQLite
- Survives context window compaction
- BM25 indexed search for fast retrieval
- Result: 50% context protected + indexed for follow-ups
- At project start, index key specs/design docs once using `ctx_index`; query them later with `ctx_search` instead of re-fetching the same docs repeatedly

When context window fills up and conversation compacts:

**Without Context-Mode:**

- ❌ All session state lost
- ❌ Must manually re-explain what you were doing
- ❌ Previous decisions/files forgotten

## Web Content Retrieval

- **WebFetch hook** redirects to `ctx_fetch_and_index` (context-mode)
- Automatically sandboxes web content (50% context protection)
- Use for: fetching specific URLs, reading documentation, processing web pages
- Benefit: Web output stays in sandbox, not context

## Subagent Tool Awareness

Subagents do NOT automatically discover available MCP tools, skills, or plugins. They will default to built-in tools (Grep, Read, Bash) unless explicitly told otherwise.

**CRITICAL: When dispatching any subagent, you MUST:**

1. **Assess which tools are relevant** to the subagent's task — MCP servers, skills, plugins
2. **List them explicitly in the subagent prompt** with tool names and brief usage hints
3. **Specify priority order** so the subagent tries efficient tools first

**Always include these three core MCPs:**
- **jcodemunch** — Code discovery. `search_symbols`, `get_file_outline`, `find_references`, `find_importers`, `get_blast_radius`. Use before Grep.
- **context-mode** — Sandbox large outputs. `ctx_execute`, `ctx_execute_file`, `ctx_batch_execute`, `ctx_search`. Use before Read for large files.
- **claude-mem** — Memory/observations. `smart_search`, `search`, `timeline`. Use for recalling prior context.

**Additionally, discover and pass any other relevant tools** (MCP servers, skills, plugins) based on the specific task at hand. Don't hardcode a list — assess what's available and relevant at dispatch time.

**Additionally, do your own discovery first** using jcodemunch and pass findings (file paths, function signatures, line numbers) into the subagent prompt as context.

## Anti-Patterns

- Never bypass Context-Mode for tools that produce large outputs
- Never use grep when jcodemunch can answer the same question
- Never re-fetch a doc URL that was already indexed — use `ctx_search` instead
- Never dispatch a subagent without first doing jcodemunch discovery to provide it with precise file paths and line numbers

## Scope Discipline — Do Only What Was Asked

**Read as widely as you like. List every intended write before making it.**

- Reading, searching, inspecting, running tests, fetching — go as wide and deep as the task needs, no permission required. Investigate thoroughly; that is not overdoing it.
- Before writing, say what you are about to change and where, as a short list. Then make exactly those changes. Anything discovered mid-way that is not on the list goes back to the user as a line, not into the diff.
- Editing files, refactoring, re-running generators, regenerating outputs, deleting, installing, committing — only when asked for **that specific thing**.
- Noticing an unrelated problem is not permission to fix it. **State it in one line and stop.** "X is also broken, want me to fix it?" — then wait.
- Do not re-run a build, render, or generator "to verify" unless the user asked for the output. If a change cannot affect the output, say so instead of regenerating.
- Do not silently expand an edit. If the fix needs adjacent changes to be correct, say what they are and why before making them.
- Never make a change and explain it afterwards as a fait accompli. The user should hear about a non-requested edit **before** it happens, not in the summary.
- When the scope of a change is ambiguous, read as much as you need to understand it, then list the options and ask. Read wide, write narrow.

This is not about effort or caution. Unrequested edits cost the user review time and hide the change they actually asked for.

## Other Global Preferences

- Keep responses concise and direct
- Skip unnecessary preamble
- Prefer code over explanation
- **Questions: always give options and a pick.** Every question to me, including open brainstorming questions, comes with 2–4 concrete options (each with a one-line plain explanation), room for me to answer in my own words, and your recommended option marked with one line on why. Never send an open question with no options. Prefer AskUserQuestion when a picker fits.
- **Versions: never assume.** When picking a version of a package, tool, runtime or service (brew formula, crate, npm package, Postgres, Node, etc.), check and use the latest stable release or the most widely used one. Pin an older version only when something specifically requires it, and say why.

## Response Formatting Rules

- Add a blank line after EVERY bullet point

- Add 2 blank lines before every new section/heading

- Never write paragraphs longer than 4 lines

- Put key insights in short bullets, not dense paragraphs

- Never stack multiple ideas into one bullet

### Readability (keep output human-scannable)

- One sentence per bullet. If a bullet needs a comma-spliced second clause, split it into two bullets

- Limit inline `code` spans to ~3 per sentence. Past that, the line turns to visual noise — break it up or pull the code onto its own line

- Lead each bullet with the takeaway in plain words, then the supporting detail. Don't bury the point mid-sentence

- Cap bold to one phrase per bullet. Bolding three things bolds nothing

- For any sequence of 3+ steps or fields, use a numbered/bulleted list — never a comma-chained sentence

- Prefer a short list of 5 clear lines over a dense paragraph holding the same 5 facts

- Leave whitespace between logical groups. A blank line is free and does more for readability than any formatting

- Default to terse. Add length only when the reasoning genuinely needs it, not to sound thorough

### Bullet glyph

- Use the literal `•` character as the bullet marker, not `-` or `*`

- The terminal renders `-` list markers as a bare hyphen, which reads as clumsy; a literal `•` always shows a proper dot

- Keep one space after the `•`, then the text — e.g. `• point goes here`

- Still follow all spacing rules above (blank line after every bullet, one idea per bullet)

### Headings and text emphasis

- Use real markdown headings (`##`, `###`) for section titles, not bold-as-a-fake-heading

- Reserve `##` for top-level sections and `###` for sub-sections — keep the hierarchy shallow (rarely deeper than `###`)

- Use **bold** for the key term or takeaway in a line — one phrase, not a whole sentence

- Use *italics* for emphasis, asides, or the first mention of a named concept

- Use `inline code` only for actual code, file paths, commands, or identifiers — never for plain emphasis

- Don't mix three emphasis styles in one line; pick the one that carries the most meaning

## Post-Implementation Explanation

After every implementation, always explain:

- What you changed and why

- How it works

- Any side effects or things to watch out for

## Task Checklist

For any task with 2 or more steps, keep a live checklist from start to finish.

- **Create it before the first action.** Use the task/todo tool (TaskCreate / TodoWrite) with one item per concrete step. Pure one-line questions need no checklist.

- **One item in progress at a time.** Mark it in progress when you start it and completed the moment it is done. Do not batch completions at the end.

- **Add what you discover.** A new step found mid-task goes on the list as its own item. Out-of-scope discoveries still follow Scope Discipline: tell the user, do not silently add work.

- **Never mark done what is not done.** A failed, skipped or blocked step stays open, with the reason written on it.

- **No "done" until the list is clear.** Before reporting completion, every item must be completed or explicitly marked skipped or blocked.

- **Show the final state.** End the reply with the checklist, one line per item, marked ✅ done, ⏭️ skipped (with reason) or ⛔ blocked (with reason).

## Never Trim Features for Effort

- **NEVER drop, defer, or scope down a feature because it "takes more time" or "is more work."** An AI is doing the implementation, not a human — implementation effort is not a cost the user is paying in labor.
- Do not present choices framed around effort ("faster" vs "more work", "cheaper" vs "expensive"). Frame choices around outcome, UX, and correctness only.
- When given a task, implement it fully and properly. Pick the cleanest correct approach, not the smallest one. Do not defer parts as "v1 / follow-up" unless the user explicitly asks to split scope.
- Effort/time is only relevant if the user explicitly raises it.

## Dev Workflow

For any coding task, invoke the `superpowers-gate` skill first. It holds the full routing. In short:

- **Small fix:** implement directly, no skills.
- **Bug:** `superpowers:systematic-debugging` first.
- **Feature:** `superpowers:brainstorming` (spec), then `superpowers:writing-plans` (plan), then build:
  - **Normal:** `superpowers:subagent-driven-development`.
  - **Sprint (walk away):** `/to-tickets` (local files in `.scratch/`, or GitHub issues for personal projects), then `run-sprint`.
- **UI work:** `impeccable-gate` picks the impeccable commands.
- **PR body:** the `pr` skill.
- **`/to-spec`:** only when brainstorming was skipped.
- **Reviews in subagent builds (STRICT):** each task gets one review and one fix round. After the fix lands, commit and mark the task done — never a re-review. The final whole-branch review is the only second look.

## TDD: Off by Default, Batched When On (STRICT)

- **TDD is off by default.** Use it only when I say "TDD" (or a ticket says `TDD: yes`).
- **Small patch fixes never need TDD,** even in a project that uses it.

When TDD is on, batch the test runs:

1. **Write all the tests first.** Write every new test for the batch before you run any of them.
2. **Run them once.** One run shows all the red tests together.
3. **Fix everything.** Fix all the issues with no test run in between.
4. **Run everything once at the end.** One full run of all the checks. If it fails, fix all the failures, then run once more.

- **Never run tests one at a time,** per fix or per ticket.
- **The batching is for runs that build:** `cargo test`, `cargo build`, `cargo clippy`, `next build`, and test suites that compile or start the app.
- **Fast checks are fine at any time:** a typecheck on the changed files, a quick lint, or a similar check that does not build.
- **Always run test suites and builds in the background** (`run_in_background: true`). Keep working, or wait for the finish notice. Never block the chat on a long run.

## AIOS (call it from any repo)

AIOS lives in `~/aios`. When I ask to search my agents, /aios: commands, skills or frequent tasks, look here, from any folder:

- Agents: `~/aios/agents/_index.md` and `~/aios/agents/custom/`. To use one, read its file and act as that agent.
- Commands: `~/aios/plugins/aios/commands/_index.md`. Run as `/aios:<name>`.
- Skills: the installed skills list.
- Frequent tasks: `~/aios/CHEATSHEET.md`.

Use absolute `~/aios/...` paths. Relative `agents/...` paths only work inside `~/aios`.

Standing rules: TDD only when asked or when a ticket says TDD: yes. No git worktrees (they force a fresh `node_modules` install), so work on one branch in the current folder. Only the main agent runs git; subagents never commit.

---

## Optional Patterns & Integration

See reference docs for optional/less-frequent guidance:

- **Codex Integration** — See `~/.claude/docs/codex-integration.md` (do/don't rules)
- **Two-Agent Pattern** — See `~/.claude/docs/two-agent-pattern.md` (project tracking framework, optional)

@instructions/lean-code.md
