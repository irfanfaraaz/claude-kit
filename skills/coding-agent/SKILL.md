---
name: coding-agent
description: "Invoke when ready to CODE a feature. Manages the entire feature development lifecycle through 8-step session cycles - reads project state, selects next feature(s), implements code with testing choices, commits work, and updates progress. Use this AFTER you've set up a project with /project-initializer. Critical: This does NOT auto-trigger. Only invoke /coding-agent when you have an actual coding task (building features, fixing bugs, implementing changes). For planning, questions, or general understanding, ask normally without this skill."
type: behavioral
---

# Coding Agent Skill

## Purpose

The Coding Agent autonomously drives feature development by cycling through a structured 8-step session workflow. It reads project state, selects the next feature to implement, writes and tests code, commits changes, and updates project artifacts. Each session is self-contained and can be resumed by reading project state.

## Usage

**Invoke manually when you have a coding task:**
```
/coding-agent
```

OR with optional context:
```
/coding-agent "Start working on [feature name]"
```

**Important:** This skill does NOT auto-trigger. You stay in normal mode for:
- General project questions
- Planning and understanding code
- Architecture discussions
- Debugging

Only invoke `/coding-agent` when you're ready to code a feature.

**What happens when invoked:**
1. Read project state (features.json, git log, claude-progress.txt)
2. Run health checks (init.sh)
3. Select the next feature (or let you choose)
4. Implement code
5. Ask about testing: (A) run tests, (B) mark untested, (C) ask later
6. Commit to git
7. Update artifacts
8. Ask user to continue or exit

---

## Session Cycle: 8 Steps

### Step 1: Onboarding (Project State Discovery)

**Goal:** Understand the current project state, what's been done, what's planned, and what blockers exist.

**Actions:**
- Read `features.json` to see all features, their status (pending/in-progress/completed), and descriptions
- Read git log (last 10 commits) to understand recent work: `git log --oneline -10`
- Read `claude-progress.txt` (if exists) to see notes from previous sessions
- Read `.claude/session-notes.txt` (if exists) for context on blockers or incomplete work
- Check current branch: `git branch -v`
- List any uncommitted changes: `git status --short`

**Output to user:**
```
Coding Agent: Session Started
- Features: [X completed, Y in-progress, Z pending]
- Recent work: [last 3 commits summarized]
- Current branch: [branch name]
- Uncommitted changes: [none | Y files]
- Ready to proceed?
```

**Continue if:** No blocking uncommitted changes; at least 1 pending feature
**Abort if:** Uncommitted changes block work; all features completed

---

### Step 2: Health Check (Project Validation)

**Goal:** Verify the project can be built/tested and dependencies are healthy.

**Actions:**
- Run `./init.sh health` if it exists, or:
  - Check for `package.json` → run `npm install` (if needed) and `npm run build`
  - Check for `pyproject.toml` → run `poetry install` and basic import test
  - Check for `Dockerfile` → attempt `docker build --dry-run`
- Report any build/dependency errors
- Confirm database migrations are up-to-date (if applicable)

**Output to user:**
```
Health Check Results:
- Dependencies: ✓ OK | ✗ FAILED
- Build: ✓ OK | ✗ FAILED
- Tests: ✓ Ready | ✗ Cannot run
- Warnings: [list any]
```

**Continue if:** Dependencies and build OK; tests available
**Abort if:** Critical build failure; missing dependencies

---

### Step 3: Feature Selection (Pick Next Work)

**Goal:** Choose the highest-priority feature to work on this session.

**Selection Criteria (in order):**
1. Status = "pending" (not started)
2. Lowest ID/sequence number (first in queue)
3. Not marked "blocked" in features.json
4. Estimated size ≤ 1 session (check `estimatedHours` field if present)
5. No unsatisfied dependencies (check `dependsOn` field)

**Actions:**
- Filter features.json for candidates
- Present top 3 candidates to user with:
  - Feature ID, name, description
  - Estimated scope (lines of code, files involved)
  - Dependencies (if any)
  - Risk level (low/medium/high)
- Ask user to confirm selection or override

**Output:**
```
Feature Selection
Top candidates:
1. [feature-name] — [brief description] — Est. 2 hours
2. [feature-name] — [brief description] — Est. 4 hours
3. [feature-name] — [brief description] — Est. 3 hours

Select feature (1/2/3) or provide custom:
```

**Continue:** Only if user confirms a feature
**User Control:** Can override selection or defer session

---

### Step 4: Code (Implementation)

**Goal:** Implement the selected feature end-to-end: design, code, test stubs.

**Actions:**
1. **Design phase:**
   - Read relevant source files (architecture, existing patterns)
   - Create implementation plan (files to create/modify, functions, data structures)
   - Identify dependencies and integration points

2. **Coding phase:**
   - Create or modify files following project conventions
   - Write main feature logic
   - Add docstrings and inline comments
   - Follow existing code style (indentation, naming, structure)

3. **Integration phase:**
   - Update imports in files that depend on new code
   - Connect to API routes, database, or UI as needed
   - Add error handling for edge cases

4. **Test stub phase (NOT full test):**
   - Create skeleton test file (if tests exist in project)
   - Write 2-3 basic test cases as placeholders
   - Do NOT run tests yet (Step 5 decides)

**Output after coding:**
```
Implementation Complete
- Files created: [list]
- Files modified: [list]
- Lines added: N
- Status: Ready for testing

Next: Test Choice
```

**Continue:** Automatically after coding phase
**Abort if:** Critical syntax error; cannot resolve imports

---

### Step 5: Testing Choice (User Decides Test Depth)

**Goal:** Let user decide if full testing or quick verification is preferred.

**Prompt:**
```
Testing Options:
1. [Quick] Verify syntax and imports only — ~2 min
2. [Full] Run full test suite including new tests — ~5-10 min
3. [Manual] Skip automated tests, I'll test manually later

Choose (1/2/3):
```

**Actions:**
- **Option 1 (Quick):**
  - Lint/syntax check: `npm run lint` or `pylint` or equivalent
  - Import verification: `npm run build` or `python -m py_compile`
  - Report any syntax errors; do NOT fix (ask user)

- **Option 2 (Full):**
  - Run full test suite: `npm test` or `pytest`
  - Report coverage and failures
  - Do NOT auto-fix failing tests (ask user)

- **Option 3 (Manual):**
  - Skip all automation
  - Proceed to commit phase

**Output:**
```
Test Results:
- Syntax: ✓ OK | ✗ FAILED
- [Coverage/Results if applicable]
- Ready to commit: [yes/no]
```

**Continue to Step 6** if tests pass or user chooses Manual
**Abort** if tests fail and user hasn't authorized skipping

---

### Step 6: Commit (Save Work to Git)

**Goal:** Commit the feature with clear messaging.

**Actions:**
1. Stage all changes: `git add .`
2. Create commit message:
   ```
   [FEATURE] <feature-name>

   - Implement <main functionality>
   - Add <files/components>
   - Update <integration points>

   Closes: <feature-id>
   ```
3. Commit: `git commit -m "<message>"`
4. Show commit hash and summary
5. Update feature status in features.json to "completed" or "in-progress" as appropriate

**Output:**
```
Committed: abc1234
Message: [FEATURE] Feature Name
Files: N changed, +M insertions, -L deletions

Updated features.json: feature-name → completed
```

**Continue:** Automatically to Step 7
**Abort if:** Commit fails (e.g., no changes to commit)

---

### Step 7: Update Artifacts (Project Metadata)

**Goal:** Update all tracking documents to reflect session progress.

**Actions:**
1. **Update features.json:**
   - Mark feature as "completed" with completion date
   - Update any dependent features that now unblock

2. **Update claude-progress.txt:**
   - Add session summary (date, feature, status, commits)
   - Log any blockers or notes for next session
   - Keep last 20 sessions (rotate old ones)

3. **Update git tags (if applicable):**
   - Tag release if milestone reached: `git tag -a feature-<name> -m "..."`

4. **Update README or CHANGELOG (if exists):**
   - Add feature to changelog under "In Development" or "Completed"

**Example claude-progress.txt entry:**
```
[2026-03-14] Session by Coding Agent
- Feature: feature-33-self-learning-playbooks
- Status: Completed
- Commits: abc1234 (1 file, +234 -45)
- Tests: Passed syntax check
- Blockers: None
- Next: feature-34 (depends on this feature)
```

**Output:**
```
Artifacts Updated:
- features.json: 1 feature marked complete
- claude-progress.txt: Session logged
- Changelog: Updated (if exists)
```

**Continue:** Automatically to Step 8

---

### Step 8: Continue or Exit (User Decision)

**Goal:** Ask user if they want to continue with another feature or end the session.

**Prompt:**
```
Session Summary:
- Completed: <feature-name>
- Remaining: <N> pending features
- Time elapsed: <estimate>

Options:
1. Continue with next feature (repeat from Step 3)
2. End session (save state, await user command)
3. Custom instruction

Choose (1/2/3):
```

**Actions:**
- **Option 1:** Loop back to Step 3 (Feature Selection) with fresh session context
- **Option 2:** Log final session state, save all artifacts, exit gracefully
- **Option 3:** Accept custom instruction and execute (or escalate to user if outside scope)

**Continue:** Option 1 → back to Step 3
**Exit:** Option 2 → save state, provide final summary, await next session start

---

## Constraints

1. **Scope:** One feature per session cycle (Steps 1-7). Multiple features require multiple session invocations (Step 8 Option 1).
2. **Testing:** Agent runs automated tests if available but does NOT auto-fix failures. User must approve test repairs.
3. **Blocking Changes:** Will not proceed if uncommitted changes exist from previous sessions. User must resolve manually.
4. **Communication:** At every step, prompt user for confirmation before major decisions (feature selection, test choice, commit).
5. **Error Handling:** If any step fails, report error + provide recovery options. Do NOT silently continue.
6. **File Safety:** Will not delete files. Will not force-push to main branch without explicit user approval.

---

## User Control

**At any step, user can:**
- `pause` — Save state and end session (go to Step 8 Option 2)
- `skip [step]` — Skip a step (e.g., `skip testing` → go straight to commit)
- `override [selection]` — Override agent's feature/test/commit choice
- `help` — Show help for current step
- `status` — Show full session state at any point
- `revert` — Undo last commit and return to Step 6 (ask for confirmation)
- `exit` — Force exit; save state to claude-progress.txt

**User input is always respected.** Agent will not auto-proceed if user responds with a control command.

---

## Error Handling

| Error | Recovery |
|-------|----------|
| **Build fails** | Report error, show logs, ask user to fix or skip tests |
| **Test fails** | Show failures, ask user to approve skipping or fix code |
| **Commit fails** | Show git error, ask user to resolve (e.g., push branch) |
| **No features pending** | Report all completed, ask user to add more features or end |
| **Uncommitted changes detected** | Abort session, ask user to commit/reset/stash |
| **Missing dependencies** | Report missing, ask user to install or skip health check |
| **Feature blocked** | Report blocker, skip to next feature, ask user to unblock |
| **User cancels at any step** | Honor immediately, save state, exit gracefully |

---

## Notes

- Each session is **stateless** except for artifacts (features.json, claude-progress.txt, git). The agent re-reads all state at Step 1.
- The 8-step cycle is **idempotent**: running the same session twice produces the same result (up to feature selection).
- **No infinite loops:** Step 8 requires explicit user choice to continue. Default is to exit.
- **Transparency:** All decisions (feature selection, test choice) are logged to claude-progress.txt with reasoning.
