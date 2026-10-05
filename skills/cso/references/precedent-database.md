# Precedent Database

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Precedent Database

When you encounter a pattern, check these precedents before reporting:

| Pattern | Verdict | Reasoning |
|---------|---------|-----------|
| `.env.example` with placeholder values | NOT a finding | Example files are documentation |
| `console.log` in production code | FINDING only if it logs secrets | Check what is logged |
| `eval()` in build scripts | NOT a finding (usually) | Build-time only, not runtime |
| `eval()` in runtime code | FINDING | Code injection risk |
| `dangerouslySetInnerHTML` with sanitized input | Verify sanitizer | Check if DOMPurify or equivalent is used |
| `dangerouslySetInnerHTML` with raw user input | CRITICAL finding | XSS confirmed |
| Hardcoded JWT secret in test file | NOT a finding | Test-only credential |
| Hardcoded JWT secret in config file | CRITICAL finding | Production credential exposure |
| `rejectUnauthorized: false` in test | NOT a finding | Test environment |
| `rejectUnauthorized: false` in production | HIGH finding | TLS bypass |
| `chmod 777` in Dockerfile | HIGH finding | Excessive permissions |
| `chmod 755` on binary in Dockerfile | NOT a finding | Normal executable permission |
| Solana `SystemProgram.transfer` without signer check | Verify context | May be legitimate if called from validated instruction |
| Anchor `#[account(mut)]` without constraint | Verify if constraint needed | Missing `has_one` or `constraint` may be intentional |
| `Keypair.generate()` in test file | NOT a finding | Test keypair |
| `Keypair.generate()` in production code | VERIFY | May be legitimate for ephemeral operations |
| Private key in `.env` (gitignored) | LOW finding | Should use vault/KMS, but gitignored is baseline |
| Private key in committed file | CRITICAL finding | Immediate rotation required |
