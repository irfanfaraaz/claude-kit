# Hard Exclusions (NEVER report these as findings)

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Hard Exclusions (NEVER report these as findings)

These 22 patterns are categorically NOT vulnerabilities. Reporting them is a false positive:

1. **Source map files in dev** — `*.map` files in development builds
2. **Console.log in development** — logging statements in dev/debug code
3. **TODO/FIXME comments** — unless they describe a known security issue
4. **Missing HTTPS in localhost** — local development does not need TLS
5. **Test credentials in test files** — `test/`, `__tests__/`, `*.test.*`, `*.spec.*`
6. **Example/placeholder values in docs** — README, docs/, examples/
7. **Type assertion as security issue** — TypeScript `as` casts are type-level only
8. **Unused imports** — code quality issue, not security
9. **Any ESLint/linter warning** — unless it directly indicates a vulnerability
10. **Missing rate limiting on dev server** — only matters in production
11. **Self-signed certs in dev/test** — expected for local development
12. **Open CORS in dev** — only a finding in production configuration
13. **Hardcoded ports** — port numbers are not secrets
14. **Package-lock.json conflicts** — merge issue, not security
15. **Deprecated API warnings** — unless the deprecation IS the vulnerability
16. **Missing CSP in development** — only matters in production
17. **Git merge artifacts** — `<<<<<<<`, `=======`, `>>>>>>>` are not vulnerabilities
18. **Empty catch blocks** — code quality issue unless swallowing auth errors
19. **Magic numbers** — code style issue, not security
20. **Missing input validation on internal functions** — only public-facing entry points matter
21. **Anchor IDL files** — IDL JSON is public interface documentation, not a leak
22. **Solana program derived addresses** — PDAs are deterministic and public by design
