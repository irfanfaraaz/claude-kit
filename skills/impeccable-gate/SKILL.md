---
name: impeccable-gate
description: "Picks and runs the right impeccable commands, in the right order, for a UI task: a small UI fix, a new screen, or a check-and-fix loop that improves a page. Use when the user types /impeccable-gate, asks to improve, polish or fix the look of a page or component, or when superpowers-gate or run-sprint hands over UI work."
argument-hint: "<page | component | route> [\"what is wrong\"] [--rounds N] [--sprint]"
---

# Impeccable gate

This skill only chooses impeccable commands. The impeccable plugin does the design work. Run a command by invoking the Skill `impeccable:impeccable` with args `"<command> <target>"`.

## Rules

- **Polish is always last.** Never run another command after `polish` in the same round.
- **Run only what the diagnosis points to.** Never run every fix or style command.
- **Only the main agent commits.** Fixer subagents edit files and report back.
- **Typecheck changed files only** after a fix. No lint, no build.
- **Screenshots and a Before | After table only when the user asks,** or when a PR is opened for a UI change.

## Command map (left to right)

| Stage | Command | Use when |
|---|---|---|
| Setup | `init` | no PRODUCT.md |
| Setup | `document` | no DESIGN.md |
| Setup | `extract` | repeated UI that should become components |
| Plan / build | `shape` | plan a new screen first |
| Plan / build | new-work request (`craft` is a deprecated alias) | build the new screen |
| Diagnose | `critique` | UX review, score /40 (report only) |
| Diagnose | `audit` | tech check, score /20 (report only) |
| Fix | `harden` | edge cases, error and empty states |
| Fix | `clarify` | confusing copy |
| Fix | `adapt` | breaks on other screen sizes |
| Fix | `optimize` | feels slow |
| Fix | `onboard` | first-run experience |
| Fix | `distill` | too cluttered |
| Style | `layout` | spacing off |
| Style | `typeset` | type off |
| Style | `colorize` | too gray |
| Style | `bolder` | too bland |
| Style | `quieter` | too loud |
| Motion | `animate` | needs motion |
| Motion | `delight` | needs charm |
| Motion | `overdrive` | wow factor |
| Polish | `polish` | always last |
| Utilities | `hooks`, `doctor`, `live`, `generate` | only when the user asks |

## Step 1: Setup check

If PRODUCT.md or DESIGN.md is missing:
- **User present:** run `init` (and `document` if DESIGN.md is missing) once.
- **Sprint mode (`--sprint`, user away):** skip. Add "run /impeccable init" to the sprint report.

In sprint mode, never ask the user anything. Tell every checker and fixer: "The user is away. Ask no questions; where a command would ask, print `Questions skipped: user away`, pick the recommended option, and continue."

## Step 2: Pick the mode

| Mode | When | Commands |
|---|---|---|
| Small UI fix | one named problem ("spacing off on the card") | the one matching command from the map, then `polish` |
| New screen | the screen does not exist yet | `shape`, then a new-work request, then `polish` |
| Improve | "make this better", "polish this page", or no named problem | the loop in Step 3 |

Say the mode in one line, then run it.

## Step 3: Improve loop

Each round:
1. A **fresh checker subagent** runs `critique` and `audit` on the target and returns both scores and the P0 to P2 findings, each with its suggested command.
2. A **fresh fixer subagent** runs only the suggested commands, in map order (fix, then style, then motion), then `polish`. It runs a typecheck on the files it changed and reports the file list.
3. The **main agent** stages the reported files by name and commits: `ui(<target>): round N, critique X/<max>, audit Y/20` (critique's max is usually 40, lower when heuristics are n/a).

Rounds:
- **Sprint mode (`--sprint`):** 1 round.
- **Standalone:** up to 3 rounds (or `--rounds N`). Stop early when neither score rose since the last round.

Use fresh agents each round on purpose: an agent that saw the last edit judges the intent, not the page.

## Step 4: Report

One short block: mode, rounds run, scores per round, commands run, files changed, anything skipped.
