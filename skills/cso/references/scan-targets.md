# Scan targets:

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Scan targets:
1. **Current codebase:** Search for high-entropy strings, Base64 blobs, hex strings > 32 chars
2. **Git history:** `git log --all --diff-filter=A -- '*.env' '*.pem' '*.key' '*.secret'`
3. **Common patterns:**
   - `PRIVATE_KEY`, `SECRET_KEY`, `API_KEY`, `TOKEN`, `PASSWORD`, `CREDENTIAL`
   - `sk_live_`, `pk_live_`, `ghp_`, `gho_`, `github_pat_`, `xoxb-`, `xoxp-`
   - `-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----`
   - `mongodb://`, `postgres://`, `mysql://`, `redis://` with credentials
   - Solana keypair files: `[` followed by 64 numbers (byte array format)
4. **Config files:** `.env`, `.env.*`, `config.json`, `secrets.yaml`, `credentials.json`
5. **CI secrets:** Check `.github/workflows/*.yml` for hardcoded secrets vs `${{ secrets.* }}`
6. **Docker:** Check Dockerfiles for `ARG`/`ENV` with secrets, build args leaking to image layers
7. **Git hooks:** Check `.git/hooks/` and `.husky/` for credential exposure
