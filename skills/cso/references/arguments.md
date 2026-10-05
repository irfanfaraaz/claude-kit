# Arguments

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Arguments

| Flag | Scope |
|------|-------|
| `/cso` | Full audit (all phases) |
| `/cso --comprehensive` | Monthly deep scan, 2/10 confidence bar |
| `/cso --infra` | Phases 0-6 only (infrastructure) |
| `/cso --code` | Phases 8-9 only (OWASP Top 10:2025 + code) |
| `/cso --skills` | Phase 8 only (skill supply chain) |
| `/cso --diff` | Audit only changed files (git diff against main) |
| `/cso --supply-chain` | Phases 3, 8 only (dependency + skill supply chain) |
| `/cso --owasp` | Phase 9 only (OWASP Top 10:2025) |
| `/cso --scope <path>` | Limit audit to specific directory or file |
