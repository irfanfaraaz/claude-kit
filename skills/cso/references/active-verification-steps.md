# Active Verification Steps

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Active Verification Steps

For any finding >= 7/10 confidence, attempt active verification:

1. **Trace the data flow:** Follow user input from entry point to the vulnerable code
2. **Check for guards:** Look for middleware, validators, sanitizers upstream
3. **Test the path:** If Bash is available, attempt to trigger the condition (non-destructively)
4. **Check runtime context:** Is this code reachable in production? Dead code is not a finding.
5. **Cross-reference:** Does another phase's finding confirm or contradict this one?
