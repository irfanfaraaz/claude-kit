---
name: project-setup-guide
description: Set up the two-agent pattern for a new project. Run once at the start with /project-initializer to create features.json and init.sh structure. Then use /coding-agent to implement features. Entirely optional - skip if you prefer working without structure. No automatic hooks or background processes.
type: reference
---

# Project Setup Guide

## The Two-Agent Pattern (Manual, Optional)

The two-agent pattern is **completely optional and manual**. No hooks. No automatic triggers. You control when it activates.

### Option 1: Use the Pattern (Recommended for Long Projects)

**Step 1: One-time setup**
```
/project-initializer "Your project description"
```

This creates:
- `features.json` — your feature tracking ground truth
- `init.sh` — health check script
- `claude-progress.txt` — session log
- Project-specific `.claude/CLAUDE.md` rules

**Step 2: When ready to code**
```
/coding-agent
```

The agent:
- Reads features.json and project state
- Lets you pick next feature
- Implements, tests (your choice), commits
- Updates progress automatically

**Repeat** each time you want to code.

### Option 2: Skip the Pattern (For Small/Urgent Projects)

Just ask normally. No skills. No structure. Claude Code stays in regular mode.

```
You: Build a login page with email/password
[Work normally, no /project-initializer or /coding-agent]
```

## When to Use Each

| Need | Action |
|------|--------|
| **Planning, exploring, understanding code** | Ask normally (no skills) |
| **Building features** | Use `/coding-agent` (or work normally) |
| **Testing what you built** | Use `/feature-verify` |
| **Checking progress** | Use `/project-status` |
| **Long-running project (10+ features)** | Set up pattern with `/project-initializer` |
| **Small project (1-3 features)** | Skip pattern, ask normally |

## Understanding the Pattern

### Features.json

Ground truth file tracking all features:

```json
[
  {
    "id": 1,
    "name": "User Registration",
    "description": "Users can sign up with email/password",
    "passes": true,
    "blocked_by": null
  },
  {
    "id": 2,
    "name": "Email Verification",
    "description": "Verify email before account activation",
    "passes": "untested",
    "blocked_by": 1
  }
]
```

**Important fields:**
- `passes`: true (tested ✅) | false (tested ❌) | "untested" (coded but not tested ⚠️)
- `blocked_by`: ID of blocking feature (null if no blocker)

### Init.sh

Health check script that verifies your app can start:

```bash
#!/bin/bash
npm install
npm run build
npm run test:smoke
```

### Claude Progress File

Session history (read-only reference):

```
[2026-03-14 14:32] Session: "User Registration" PASSED
  - Commits: abc1234 (1 file, +234 -45)
  - Tests: Passed all smoke tests
  - Next: Email Verification

[2026-03-14 10:15] Session: "Login Page" PASSED
  - Commits: def5678 (3 files, +512 -128)
  - Tests: Untested (manual testing later)
  - Next: User Registration
```

## Troubleshooting

**"Features.json not found"**
- Run `/project-initializer` once at project start

**"Can I modify features.json?"**
- Yes, but only edit manually as needed. `/coding-agent` updates it automatically.

**"How do I disable the pattern?"**
- Just stop using `/coding-agent`. Features.json stays for reference.
- Or delete files: `rm features.json init.sh claude-progress.txt`

**"Can I mix manual work with /coding-agent?"**
- Yes. The pattern is optional. Use it when helpful, skip it when not.

**"What if I'm using git?"**
- Commit normally: `git add . && git commit -m "..."`
- `/coding-agent` respects your git state
- Features are just metadata — doesn't force git structure

## Summary

The two-agent pattern is:
- ✅ Optional
- ✅ Manual (you invoke `/coding-agent`, not automatic)
- ✅ Non-intrusive (doesn't force git structure or hooks)
- ✅ Lightweight (just JSON files for tracking)
- ✅ Removable (delete files anytime)

**To use:** `/project-initializer` → `/coding-agent`

**To skip:** Ask normally without the skills.

---
