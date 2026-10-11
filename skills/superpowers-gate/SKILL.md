---
name: superpowers-gate
description: "Routes a coding task to the right amount of process: small fixes done directly, features through superpowers brainstorming and writing-plans, then built with subagents. Use when the user gives any coding task (feature, fix, refactor, change, bug) before invoking another superpowers skill or writing code."
---

# Superpowers gate

Pick the lightest route that fits, say the route in one line, then follow it. Full process on a one-line fix wastes the user's time; no process on a feature produces the wrong thing.

## Rules for every route

- **TDD only when asked.** Do not invoke `tdd` or `superpowers:test-driven-development` unless the user asks or a ticket says `TDD: yes`. Check work with the typecheck during the work and the full checks at the end.
- **No worktrees.** Work in the current folder on one branch. A worktree means a fresh `node_modules` install, which the user does not want. Skip `superpowers:using-git-worktrees` and any worktree step in other skills.
- **One committer.** Only the main agent runs git. Subagents edit files and report back; two agents running git in one folder corrupt each other's commits.
- **UI work goes to `impeccable-gate`.** When a task or ticket is about how a page or component looks or feels, invoke `impeccable-gate` for that part.

## Pick the route

| Route | When | Do |
|---|---|---|
| Direct | Typo, copy, config value, one-file fix, clear small change | Implement now. No skills. |
| Bug | Something broken, failing or slow, cause unknown | `superpowers:systematic-debugging`, then fix directly if small or go to Feature if the fix is big |
| Feature | New behaviour, several files, or design choices to make | Feature steps below |

Unsure between Direct and Feature: ask the user one question with both options and your pick.

## Feature steps

1. **Brainstorm.** Invoke `superpowers:brainstorming`. It writes the spec to `docs/superpowers/specs/`.
2. **Plan.** Invoke `superpowers:writing-plans`. For each task, also write which other tasks it waits for, so the plan can become tickets later.
3. **Choose the build.** Tell the user which build fits and why, in two lines, then wait for their pick:
   - **Normal:** the user stays in the loop. Invoke `superpowers:subagent-driven-development` (tasks one after another). Use `superpowers:executing-plans` instead if the user wants to build inline.
   - **Sprint:** the user wants to walk away, or the plan has many tasks. Go to step 4.
4. **Tickets (Sprint only).** `/to-tickets` is user-only, so read `~/.claude/skills/to-tickets/SKILL.md` and follow it with the plan file as input. Tracker: local files in `.scratch/<sprint>/issues/`, or GitHub issues if the user chose GitHub mode. Ignore its `/setup-matt-pocock-skills` line. It shows the ticket list to the user for approval before saving. If `.scratch/` is not in the repo's `.gitignore`, tell the user.
5. **Build (Sprint only).** Invoke `run-sprint` with the sprint folder (or `--github <project-number>`). It handles grading, the board, commits, Blocked tickets, end checks, the UI round and `/code-review`.
6. **PR.** When the user asks for a PR, invoke the `pr` skill for the body.

## Spec without brainstorming

If a feature was worked out in chat and brainstorming was skipped, read `~/.claude/skills/to-spec/SKILL.md` and follow it to write the spec into `docs/superpowers/specs/` (not an issue tracker). Then continue at step 2.
