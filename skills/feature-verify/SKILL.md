---
name: feature-verify
description: Test features after coding them. Invoke after implementing a feature to run tests and mark pass/fail status in features.json. Three modes - quick (30sec smoke test), feature (2-5min targeted tests), or full (10+ min regression suite). Use when /coding-agent asks "Test this feature?" or whenever you want to verify a feature works. Reports results and updates features.json with pass/fail status. Use Puppeteer MCP for automated browser testing or cmux browser for interactive visual testing.
type: helper
---

# Feature Verify Skill

## Purpose

After you code a feature with `/coding-agent`, you can verify it works using this skill. It provides three testing depths so you control the testing overhead: quick health check, targeted feature test, or full regression suite.

## Usage

After implementing a feature (or during `/coding-agent` if you chose testing option A):

```
/feature-verify "Feature name" mode:quick
```

Replace `"Feature name"` with the feature from features.json (e.g., "Login System", "User Settings").

## Testing Modes

### Quick Mode (30 seconds)
```
/feature-verify mode:quick
```
- Runs `init.sh` health check only
- Verifies app starts without errors
- Quick smoke test — no feature-specific tests
- Use when: You want fast feedback that the app isn't broken

**Example output:**
```
✅ Health Check: PASSED
- App starts: OK
- Dependencies: OK
- Ready to implement more features
```

### Feature Mode (2-5 minutes)
```
/feature-verify "Login" mode:feature
```
- Tests the specific feature you just coded
- Runs unit tests + E2E browser tests (Puppeteer MCP)
- Walks through feature steps: load page → interact → verify results
- Use when: You want confidence the feature actually works

**Example output:**
```
✅ Login Feature: PASSED
- E2E: User can enter email, password, click submit, redirected to dashboard
- Coverage: 8/8 test cases passed
- Updated features.json: "passes": true
```

### Full Mode (10+ minutes)
```
/feature-verify mode:full
```
- Runs entire features.json test suite
- Tests all completed features (regression testing)
- Use when: Before releasing or to catch unexpected breakage

**Example output:**
```
✅ Full Test Suite: PASSED (12 of 12)
- Login: ✅ PASSED
- Signup: ✅ PASSED
- Dashboard: ✅ PASSED
- Email Verification: ✅ PASSED
...
- Overall: 12 passed, 0 failed
```

## What It Does

1. **Finds the feature** in features.json by name
2. **Runs appropriate tests:**
   - quick: init.sh (Puppeteer smoke test)
   - feature: Unit tests + feature-specific E2E tests
   - full: Entire test suite (all features)
3. **Updates features.json:**
   - Pass: `"passes": true`
   - Fail: `"passes": false` + logs error details
4. **Reports results:** ✅ PASS or ❌ FAIL with details

## Testing Tools Used

| Tool | Purpose | Mode |
|------|---------|------|
| init.sh | App health check | quick, feature |
| Puppeteer MCP | Automated browser testing | feature, full |
| cmux browser | Interactive visual testing | manual override |
| npm test / bun test | Unit/integration tests | feature, full |

## Integration with /coding-agent

When `/coding-agent` finishes implementing a feature, it asks:

```
Testing Options:
(A) Run tests → marks passes: true/false
(B) Mark untested → skips tests
(C) Ask later → defer decision

Choose (1/2/3):
```

If you choose (A), the agent runs tests. If you choose (B) or (C), you can use `/feature-verify` anytime to test later.

## Error Handling

**If tests fail:**
- Feature-verify reports the error
- Updates features.json: `"passes": false`
- Suggests next steps: fix code, run tests again

**If feature name not found:**
- Lists available features in features.json
- Ask you to pick from the list

---
