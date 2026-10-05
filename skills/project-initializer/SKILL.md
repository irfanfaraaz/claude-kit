---
name: project-initializer
description: Set up the two-agent pattern for a new project. Run once at start with /project-initializer "project description". Creates features.json (your feature tracking ground truth), init.sh (health check), claude-progress.txt (session log), and lean project CLAUDE.md (following best practices from ~/.claude/docs/project-init-guide.md). After setup, use /coding-agent to implement features. Entirely optional - skip for small/urgent projects. Use when managing long-running feature development (10+ features).
type: generator
---

## Purpose

The project-initializer sets up the two-agent pattern for structured feature-driven development. It's a one-time setup that creates:

- `features.json` — ground truth tracking all planned features
- `init.sh` — health check script (builds, tests, verifies app starts)
- `claude-progress.txt` — session log (what was done each session)
- `.claude/CLAUDE.md` — lean, focused project-specific guidelines

The generated CLAUDE.md follows best practices from `~/.claude/docs/project-init-guide.md`:
- **WHAT**: Tech stack, project structure
- **WHY**: Project purpose and context
- **HOW**: Commands to build, test, verify
- Kept concise (< 300 lines, ideally < 100)
- Progressive disclosure with pointers to `agent_docs/` if needed

After setup, you invoke `/coding-agent` to implement features one session at a time. The pattern prevents one-shot attempts, ensures features are tracked, catches broken builds early, and keeps you making progress across multiple context windows.

---

## Usage

```
/project-initializer "Your project description"
```

**Example:**
```
/project-initializer "SaaS platform for real-time collaborative editing. Features: multi-user login, document creation/sharing, real-time sync via WebSocket, comment threads. Stack: Next.js, Supabase, TypeScript."
```

---

## What It Does

The agent creates 4 key files for the two-agent pattern:

### File 1: features.json

Ground truth tracking all planned features:

```json
[
  {
    "id": 1,
    "name": "User Registration",
    "description": "Users can sign up with email/password",
    "steps": [
      "Navigate to signup page",
      "Enter email and password",
      "Submit form",
      "Receive verification email",
      "Confirm email",
      "Account activated"
    ],
    "passes": null,
    "blocked_by": null,
    "priority": 1
  },
  {
    "id": 2,
    "name": "Login",
    "description": "Users can log in with email/password",
    "steps": [
      "Navigate to login page",
      "Enter credentials",
      "Submit",
      "Redirected to dashboard"
    ],
    "passes": null,
    "blocked_by": null,
    "priority": 2
  }
]
```

**Key fields:**
- `passes`: null (not started), true (tested ✅), false (tested ❌), "untested" (coded ⚠️)
- `blocked_by`: ID of blocking feature (null if no blocker)
- `steps`: User-facing test steps (verify feature works)

The `/coding-agent` updates `passes` after each feature. This is immutable except for the `passes` field — prevents accidental deletions.

### File 2: init.sh

Health check script (your project-specific setup):

```bash
#!/bin/bash
set -e

echo "🚀 Starting health check..."

# Install deps
npm install

# Build
npm run build

# Run smoke test
npm run test:smoke

echo "✅ App is healthy"
```

The `/coding-agent` runs this at every session start. Catches broken builds before you start coding.

### File 3: claude-progress.txt

Session log (read-only reference):

```
## Session 1 (2026-03-14 10:00)
✅ Completed: User Registration
- Commits: abc1234 (1 file, +234 -45)
- Tests: Passed all steps
- Next: Login feature

## Session 2 (2026-03-14 14:30)
✅ Completed: Login
- Commits: def5678 (3 files, +512 -128)
- Tests: Untested (manual testing deferred)
- Next: Email verification
```

Written by `/coding-agent` after each session. Helps you understand what was done and what's next.

### File 4: .claude/CLAUDE.md (Project Rules)

Project-specific instructions:

```markdown
# Project Context

## Overview
SaaS platform for real-time collaborative editing.

## Tech Stack
- Frontend: Next.js 16 + React 19
- Backend: Next.js API routes
- Database: Supabase (PostgreSQL)
- Auth: Supabase auth (JWT)
- Real-time: WebSocket via Supabase Realtime

## Two-Agent Pattern Rules

### Before Coding
1. Check features.json status
2. Run ./init.sh to verify app health
3. Pick next unblocked feature

### While Coding
- Follow existing code patterns
- Add tests for new code
- Update features.json after testing (passes: true/false/"untested")

### After Coding
- Commit to git
- Log session in claude-progress.txt
- Continue to next feature or exit
```

This documents your project so `/coding-agent` understands your stack and conventions.

---

## What It Asks

The agent asks clarifying questions:

1. **Tech stack**: What language/framework? (e.g., Next.js, Python FastAPI, Go)
2. **Main features**: What are the core 5-10 features? (List them briefly)
3. **Success criteria**: How do you test if a feature works? (e.g., "users can login and see dashboard")
4. **Setup**: How do you start the dev environment? (e.g., `npm install && npm run dev`)
5. **Testing**: How do you run tests? (e.g., `npm test` or `pytest`)

You provide these answers, the agent creates the 4 files.

---

## CLAUDE.md Best Practices

The generated project CLAUDE.md follows lean, focused design principles:

- **< 300 lines** ideally (best: < 100 lines)
- **WHAT / WHY / HOW** framework
- **Universal applicability** — only instructions relevant to all tasks
- **Progressive disclosure** — pointers to `agent_docs/` for complex topics
- **No code style guidelines** — use linters instead

**Full guide:** `~/.claude/docs/project-init-guide.md` (read before customizing your project CLAUDE.md)

## Important Notes

- **One-time setup**: Run this once at project start. Don't re-run unless you want to overwrite features.json.
- **No code generation**: This skill creates METADATA files only (JSON, bash, markdown). It doesn't generate your app code.
- **No dependencies installed**: The skill creates `init.sh`, but doesn't run `npm install`. You do that manually.
- **Customizable after**: After creation, edit features.json/init.sh/CLAUDE.md as needed. They're yours to own.
- **Git-friendly**: All files are git-safe (no secrets, no build artifacts).
- **Lightweight**: Just 4 files. No scaffolding, no project structure changes.
- **Review the guide**: Read `~/.claude/docs/project-init-guide.md` to understand best practices for project CLAUDE.md files before customizing.

