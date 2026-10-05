# Findings Table Format

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Findings Table Format

Present each finding as:

```
### [SEVERITY] Finding-ID: Title

**Confidence:** X/10
**Phase:** Phase N — Phase Name
**Category:** OWASP A0X / STRIDE Letter / Infrastructure
**Location:** file:line (or directory)

**Description:**
One paragraph explaining the vulnerability.

**Exploit Scenario:**
Step-by-step description of how an attacker would exploit this.
(REQUIRED for all findings >= 7/10 confidence)

**Evidence:**
Code snippet or command output proving the finding.

**Remediation:**
Specific fix with code example if applicable.

**Priority:** P0 (fix now) / P1 (fix this sprint) / P2 (fix this month) / P3 (backlog)
```
