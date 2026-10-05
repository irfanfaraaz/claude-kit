---
name: project-status
description: Get a quick project snapshot. Invoke at session start or anytime to see current progress - how many features are done/tested/blocked, recent commits, session history, and what to work on next. Shows pass rates, blockers, git activity, and recommends next steps. Use this to orient yourself before starting /coding-agent or to check overall project health.
type: helper
---

# Project Status Skill

## Purpose

Get a quick snapshot of your entire project without reading multiple files. Shows progress, blockers, and next steps at a glance.

## Usage

```
/project-status
```

No parameters. Provides a one-page report of everything you need to know.

## Sample Output

```
PROJECT STATUS REPORT
═════════════════════════════════════════════════════════════

Project: SaaS Authentication Platform
Objective: Multi-tenant JWT auth with email verification

FEATURE PROGRESS
┌─────────────────────────────────────────┐
│ ✅ Completed:    8/15 features (53%)    │
│ ⚠️  Untested:    2 features             │
│ 🔴 Blocked:      1 feature              │
│ ⏳ Pending:      4 features             │
└─────────────────────────────────────────┘

Completed Features (8):
  ✅ User registration
  ✅ Email verification
  ✅ Password reset
  ✅ JWT token generation
  ✅ Token refresh logic
  ✅ User profile GET endpoint
  ✅ User profile UPDATE endpoint
  ✅ Session management

Untested (2):
  ⚠️  Two-factor authentication (code: ready)
  ⚠️  API rate limiting (code: ready, needs testing)

Blocked (1):
  🔴 OAuth integration (waiting for external API credentials)

Pending (4):
  ⏳ Admin panel (depends on rate limiting)
  ⏳ User deletion (depends on session cleanup)
  ⏳ Email notifications
  ⏳ Audit logging

RECENT ACTIVITY
├─ [Today 14:32] Session: Completed "Password reset" (+245 lines, 1 commit)
├─ [Today 10:15] Session: Completed "JWT generation" (+389 lines, 1 commit)
├─ [Yesterday 16:42] Session: Completed "Email verification" (+156 lines, 1 commit)
└─ Last 5 commits:
    • feat: implement password reset flow (abc1234)
    • feat: add JWT token generation (def5678)
    • feat: implement email verification (ghi9012)
    • chore: update dependencies (jkl3456)
    • docs: update API reference (mno7890)

RECOMMENDATIONS
1. Test the 2 untested features → /feature-verify "Two-factor authentication" mode:feature
2. Unblock OAuth → Get API credentials from product team
3. Next feature to implement → "Email notifications" (no blockers, good to start)

Context Usage: 24% (plenty of room)
Estimated Remaining Work: ~6-8 hours
```

## What It Shows

| Section | What It Tells You |
|---------|-------------------|
| **Feature Progress** | Completion rate, pass rate, blockers at a glance |
| **Completed Features** | What's done and verified working |
| **Untested** | What's coded but needs testing (use `/feature-verify`) |
| **Blocked** | Features waiting on external dependencies |
| **Pending** | Next candidates to implement |
| **Recent Activity** | Session history and git log (last few days) |
| **Recommendations** | What to do next (test, fix blockers, implement feature) |
| **Context Usage** | How much of your context window is left |
| **Estimated Work** | Rough hours remaining based on feature complexity |

## Integration Points

**At session start:**
```
You: /project-status
[Review progress, see what's done and blocked]
You: /coding-agent
[Picks next feature to implement]
```

**Checking project health:**
```
You: /project-status
[See if any tests failed or blockers appeared]
```

**Handing off to another developer:**
```
You: /project-status > copy-paste into team chat
[Colleague sees entire project state instantly]
```

## Data Sources

Reads from:
- `features.json` → Feature counts, status, blockers
- `claude-progress.txt` → Session history (last 10 sessions)
- `git log` → Recent commits (last 5-10)
- `.claude/CLAUDE.md` → Project context and rules

---
