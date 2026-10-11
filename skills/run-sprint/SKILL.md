---
name: run-sprint
description: "Runs a sprint of tickets while the user is away: grades each ticket for Sonnet or Opus, builds them with subagents (in parallel when they touch different files), commits one ticket at a time, parks stuck tickets in Blocked, then runs the full checks, a UI round and a code review once at the end. Use when the user types /run-sprint, picks the Sprint build in superpowers-gate, or asks to run, drain or work through a set of tickets."
argument-hint: "<.scratch/<sprint> folder> [--no-board] | --github <project-number>"
---

# Run sprint

The user is away. Work through every ticket, never stop to ask mid-sprint, and leave a clear report. Save tokens: no build after each ticket, no QA agent on each ticket.

## Rules

- **No worktrees.** One branch, current folder.
- **Only the main agent runs git.** Builders edit files and report back.
- **Stage by name only:** `git add -- <files>`. Never `git add -A`, `git add .` or `git commit -a`.
- **Nothing merges.** No PR unless the user says yes at the end.
- **TDD only when a ticket says `TDD: yes`.** Then the builder uses `superpowers:test-driven-development`.
- **During the sprint, only a typecheck on changed files.** No lint, no build, no full test run until the end.
- **Never stop to ask the user mid-sprint.** Park problems in Blocked with a note.

## Ticket fields

Tickets come from `to-tickets`. Read and write these lines, keeping their `**Field:**` bold format:

| Field | Values | Meaning |
|---|---|---|
| `Status` | `ready-for-agent` or `ready` | Ready |
| `Status` | `building` | Building (left over from a stopped run) |
| `Status` | `done` | Done |
| `Status` | `blocked` | Blocked |
| `Blocked by` | ticket numbers, or "None" | dependencies |
| `TDD` | `yes` or `no` | builder uses TDD only on `yes` |
| `Model` | `sonnet` or `opus` | any other value counts as blank |

## Start

1. **Clean tree check.** Run `git status --porcelain`. If anything outside `<sprint>/` is dirty, stop and report the files. Never stash or revert the user's own work.
   - Exception (resume): if the dirty files belong to a ticket with `Status: building`, report them and stop too. The user decides whether to keep or discard them.
2. **Read the tickets.** Local: every file in `<sprint>/issues/`. GitHub mode: see "GitHub mode". Build the graph from each `Blocked by` line.
3. **Check the graph.** A ticket with no `Status` line: mark it Blocked with the note "missing Status line". Tickets in a `Blocked by` cycle: mark each Blocked with the note "dependency cycle: #A, #B, ...". Continue with the rest.
4. **Resume.** A ticket with `Status: building` (from a stopped run, tree clean): set it back to Ready.
5. **Grade each ticket** yourself (no extra agent). Write `Model: sonnet` for easy or medium, `Model: opus` for hard (cross-cutting, unclear design, tricky state or concurrency). Keep the line only if it already says `sonnet` or `opus`.
6. **Board** (skip with `--no-board`). Local: rebuild `<sprint>/board.md` from the Status lines every time the sprint starts:

   ```markdown
   ---
   kanban-plugin: board
   ---

   ## Ready

   - [ ] 01 Ticket title

   ## Building

   ## Done

   ## Blocked
   ```

7. **Branch.** On main or master: create `sprint/<sprint-name>` (or switch to it if it exists). Otherwise stay on the current branch.

## Loop

Repeat until no ticket is Ready with all blockers Done:

1. **Pick the frontier:** Ready tickets whose blockers are all Done.
2. **Plan files.** For each frontier ticket, write down the files it will touch (from the ticket and the code).
3. **Tiny tickets: build them yourself.** A ticket that touches one file and needs only a few lines: the main agent implements it directly, runs the typecheck, and commits. A builder agent costs a large fixed startup in tokens, which is wasted on a few lines.
4. **Dispatch builders** for the rest with the Agent tool, `model` set from the ticket's `Model:` line.
   - Run two tickets at once only when both are independent AND their file lists do not overlap. If unsure, run them one after another.
   - Shared files (lockfiles, barrel `index` files, route tables, config) count as overlap.
   - Never run two package installs at once.
   - Set `Status: building` and move the card to Building.
5. **Builder prompt** (keep it short, point to files):
   > Implement ticket `<path>`. Spec: `<spec path>`. Touch only these files unless you must: `<file list>`. Do not run git, lint or build. TDD: `<yes|no>`. When done, run a typecheck on only the files you changed and report: every file changed or created, typecheck result, anything unclear.
6. **Check the report.** If the builder touched a file outside its list that another running builder also uses, wait until that builder finishes before committing or reverting.
7. **On success:** `git add -- <reported files>`, commit `feat(<sprint>): #NN <title>` (GitHub mode: NN is the issue number), set `Status: done`, move the card to Done.
8. **On failure** (typecheck fails, builder reports it cannot finish): send the error back to a fresh builder once. After the second failure:
   - Revert that ticket's changes: `git checkout -- <changed tracked files>` and delete its new untracked files with `git clean -f -- <new files>`. Use the union of both builders' reports. Never touch files outside that union.
   - Set `Status: blocked`, move the card to Blocked, and write a `## Blocked note` section in the ticket (GitHub: an issue comment) saying what failed and what is needed.
   - Tickets that wait on it stay Ready and get "waiting on #NN".

## Stop conditions

Go to the End when:
- no ticket is runnable (all remaining are done, blocked or waiting), or
- GitHub mode: a `gh` call fails (pause; never guess a card's state).

## End

1. **Full checks**, once: typecheck, lint, build, then tests if the repo has a test script. On failure: one fresh fixer agent, then re-run the checks. Commit the fix as `fix(<sprint>): end-of-sprint checks`, staging by name.
2. **UI round:** if any changed file is UI (components, pages, styles), invoke `impeccable-gate` with `--sprint` on the changed screens.
3. **Code review:** run `/code-review` on the sprint diff (base branch to HEAD). Fix what it finds and commit.
4. **Report** to the user:
   - Done: ticket list with commit hashes.
   - Blocked: each ticket with its note.
   - Waiting: tickets that never started because of a blocked ticket.
   - Checks: pass or fail per check.
   - Notes: e.g. "run /impeccable init".
5. **Ask:** "Want a visual recap? (y/n)". Yes: one HTML page built with `diagram-design:diagram-design`.
6. **Ask:** "Want a PR? (y/n)". Yes: write the body with the `pr` skill. GitHub mode: include `Closes #N` for each Done ticket.

## GitHub mode

`/run-sprint --github <project-number>`:

**Setup check** (stop and tell the user the exact fix if one fails):
- `gh auth status` shows the `project` scope. Fix: `gh auth refresh -s project`.
- The project's Status field has the options Ready, Building, Done, Blocked. If not, tell the user to add them (GitHub's default is Todo, In Progress, Done).
- Every sprint issue is on the project. If not, add it with `gh project item-add <project-number> --owner <owner> --url <issue-url>`.

**During the sprint:**
- The card's Status field is the ticket's Status; issue bodies need no Status line.
- Read issues with `gh issue view <N> --json body,title,labels`.
- Write `Model:` back with `gh issue edit <N> --body-file <file>`.
- Move cards with `gh project item-edit` on the Status field.
- Blocked notes go as `gh issue comment <N>`.
- Resume: a re-run reads each card's Status; Building counts as Ready.
- Never close issues. They close when the user merges a PR with `Closes #N`.
