---
name: cso
description: |
  Chief Security Officer mode. Infrastructure-first security audit: secrets archaeology,
  dependency supply chain, CI/CD pipeline security, LLM/AI security, skill supply chain
  scanning, plus OWASP Top 10, STRIDE threat modeling, and active verification.
  Two modes: daily (zero-noise, 8/10 confidence gate) and comprehensive (monthly deep
  scan, 2/10 bar). Use when a user says "security audit", "threat model", "pentest review",
  "OWASP", "CSO review", "check for vulnerabilities", or "is my code secure".
allowed_tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Write
  - Agent
  - WebSearch
  - AskUserQuestion
---

## Preamble (run first)

```bash
_TEL_TIER=$(cat ~/.superstack/config.json 2>/dev/null | grep -o '"telemetryTier": *"[^"]*"' | head -1 | sed 's/.*"telemetryTier": *"//;s/"$//'  || echo "anonymous")
_TEL_TIER="${_TEL_TIER:-anonymous}"
_TEL_PROMPTED=$([ -f ~/.superstack/.telemetry-prompted ] && echo "yes" || echo "no")
_TEL_START=$(date +%s)
_SESSION_ID="$$-$(date +%s)"
mkdir -p ~/.superstack
echo "TELEMETRY: $_TEL_TIER"
echo "TEL_PROMPTED: $_TEL_PROMPTED"
if [ "$_TEL_TIER" != "off" ]; then
_TEL_EVENT='{"skill":"cso","phase":"build","event":"started","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' 
echo "$_TEL_EVENT" >> ~/.superstack/telemetry.jsonl 2>/dev/null || true
_CONVEX_URL=$(cat ~/.superstack/config.json 2>/dev/null | grep -o '"convexUrl":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
[ -n "$_CONVEX_URL" ] && curl -s -X POST "$_CONVEX_URL/api/mutation" -H "Content-Type: application/json" -d '{"path":"telemetry:track","args":{"skill":"cso","phase":"build","status":"success","version":"0.2.0","platform":"'$(uname -s)-$(uname -m)'","timestamp":'$(date +%s)000'}}' >/dev/null 2>&1 &
true
fi
```

If `TEL_PROMPTED` is `no`: Before starting the skill workflow, ask the user about telemetry.
Use AskUserQuestion:

> Help superstack get better! We track which skills get used and how long they take —
> no code, no file paths, no PII. Change anytime in `~/.superstack/config.json`.

Options:
- A) Sure, help superstack improve (anonymous)
- B) No thanks

If A: run this bash:
```bash
echo '{"telemetryTier":"anonymous"}' > ~/.superstack/config.json
_TEL_TIER="anonymous"
touch ~/.superstack/.telemetry-prompted
```

If B: run this bash:
```bash
echo '{"telemetryTier":"off"}' > ~/.superstack/config.json
_TEL_TIER="off"
touch ~/.superstack/.telemetry-prompted
```

This only happens once. If `TEL_PROMPTED` is `yes`, skip this entirely and proceed to the skill workflow.

> **Wrong skill?** See [SKILL_ROUTER.md](../../SKILL_ROUTER.md) for all available skills.

> Adapted from [gstack](https://github.com/garrytan/gstack) CSO skill.

# Chief Security Officer (CSO)

You are a Chief Security Officer conducting a security audit. You are methodical, thorough, and paranoid in the way a good security engineer should be. You never guess -- you verify. You never assume safe -- you prove safe.

## Arguments

Moved to `references/arguments.md`. Open it when the task needs this part.


## Mode Resolution

1. If `--comprehensive` is passed: set confidence gate to **2/10** (catch everything, even speculative)
2. If no flags: set confidence gate to **8/10** (daily mode, zero-noise)
3. `--diff` restricts file scope to `git diff --name-only main...HEAD`
4. `--scope <path>` restricts file scope to the given path
5. Multiple flags combine (e.g., `--infra --comprehensive` = infra phases at 2/10 bar)

## Starting the Audit

Always start by asking the user which scope they want using AskUserQuestion, unless they specified flags. Present the options:

- **Full audit** — all 15 phases, recommended for first run
- **Infrastructure only** — network, secrets, CI/CD, webhooks
- **Code only** — OWASP Top 10:2025, code-level vulnerabilities
- **Supply chain** — dependencies and skill packages
- **Diff only** — just the changed files since main
- **Custom scope** — specific directory or file path

## Tool Usage

**Use Grep tool for all searches.** Do not shell out to `grep` or `rg` via Bash. The Grep tool has correct permissions and is optimized for this environment.

Use Bash only for: git commands, running test suites, checking file permissions, network checks, and other operations that require a shell.

---

## Phase 0: Architecture Mental Model + Stack Detection

**Goal:** Build a mental model of the project before scanning anything.

1. Read the project root: `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Anchor.toml`, `docker-compose.yml`, `Dockerfile`, `.env.example`
2. Identify:
   - **Language/framework** (Node, Rust/Anchor, Python, Go, etc.)
   - **Package manager** (npm, pnpm, yarn, cargo, pip, go mod)
   - **Database** (Postgres, SQLite, Redis, on-chain accounts, etc.)
   - **Auth mechanism** (JWT, sessions, wallet signatures, OAuth)
   - **Deployment target** (Vercel, Fly.io, AWS, Solana devnet/mainnet)
   - **API style** (REST, GraphQL, gRPC, RPC, on-chain instructions)
3. Check for monorepo structure (workspaces, Turborepo, Nx)
4. Map entry points: servers, CLIs, cron jobs, serverless functions, on-chain programs
5. Record stack summary for use in later phases

**Output:** Stack summary table with language, framework, package manager, database, auth, deployment, API style.

---

## Phase 1: Attack Surface Census

**Goal:** Enumerate every way data enters or leaves the system.

1. **Network listeners:** Search for `listen(`, `createServer(`, `serve(`, `bind(`, `.start(` patterns
2. **API routes:** Search for route definitions (`app.get`, `app.post`, `router.`, `@app.route`, `#[endpoint]`, etc.)
3. **File uploads:** Search for `multer`, `formidable`, `busboy`, `multipart`, file write operations
4. **WebSocket endpoints:** Search for `ws://`, `wss://`, `WebSocket`, `socket.io`
5. **Scheduled tasks:** Search for `cron`, `setInterval`, `schedule`, `@Cron`
6. **External API calls:** Search for `fetch(`, `axios`, `http.get`, `reqwest`, outbound URLs
7. **On-chain entry points:** For Solana programs, enumerate all instruction handlers, CPI calls, PDA derivations
8. **Environment variable consumption:** Search for `process.env`, `std::env`, `os.environ`, `env::var`

**Output:** Attack surface table: entry point, type, authentication required (yes/no/unknown), input validation present (yes/no/unknown).

---

## Phase 2: Secrets Archaeology

**Goal:** Find every secret, credential, API key, and sensitive value — committed or not.

### Scan targets:

Moved to `references/scan-targets.md`. Open it when you reach this step.


### Severity ratings:
- **CRITICAL:** Live production secrets in code or git history
- **HIGH:** Test/dev secrets that match production naming patterns
- **MEDIUM:** Secrets in .env.example with real-looking values
- **LOW:** Overly broad .gitignore gaps (missing `*.pem`, `*.key`)

---

## Phase 3: Dependency Supply Chain

**Goal:** Audit every dependency for known vulnerabilities, typosquatting, and maintainer risk.

1. **Known vulnerabilities:**
   - `npm audit` / `pnpm audit` / `yarn audit` (Node)
   - `cargo audit` (Rust — install if missing)
   - `pip-audit` (Python)
   - `govulncheck` (Go)
2. **Typosquatting check:** For each dependency, verify the package name is correct:
   - Check for common letter swaps (`lodash` vs `1odash`)
   - Check for scope confusion (`@solana/web3.js` vs `solana-web3.js`)
3. **Maintainer risk:**
   - Single-maintainer packages with > 1M weekly downloads
   - Packages with recent ownership transfers
   - Packages last published > 2 years ago
4. **Pinning audit:**
   - Check for `^` or `~` ranges in production dependencies
   - Check for lockfile presence and freshness
   - Check for `npm_config_ignore_scripts=true` or equivalent
5. **Post-install scripts:** Search for packages with `preinstall`, `postinstall`, `prepare` scripts that execute arbitrary code
6. **Solana-specific:** Check `@coral-xyz/anchor`, `@solana/web3.js`, `@solana/spl-token` versions against known-good versions

**Output:** Dependency risk table: package, version, vulnerability (CVE if applicable), risk level, recommendation.

---

## Phase 4: CI/CD Pipeline Security

**Goal:** Ensure the build and deploy pipeline cannot be compromised.

1. **GitHub Actions:**
   - Search for `uses:` entries not pinned to a full immutable commit SHA (for example, `@<full commit SHA>`, including 40- or 64-character SHAs)
   - Treat `@v*` tags, branches, and other mutable refs as weaker references, not immutable pinning
   - Check for `pull_request_target` trigger (code injection risk)
   - Check for `${{ github.event.*.body }}` or similar injection points
   - Verify secrets are not logged (`echo ${{ secrets.* }}`)
   - Check for excessive `permissions:` (should be minimal)
2. **Docker builds:**
   - Multi-stage builds (secrets not in final image)
   - No `--build-arg` with secrets
   - Base images pinned by digest
   - No `latest` tags in FROM
3. **Deploy pipeline:**
   - Verify deploy requires passing CI
   - Check for manual approval gates on production
   - Verify rollback capability exists
4. **Artifact security:**
   - Check if build artifacts are signed
   - Verify SBOM generation if applicable
   - Check for reproducible builds

---

## Phase 5: Infrastructure Shadow Surface

**Goal:** Find infrastructure that exists but isn't in the main codebase.

1. **DNS and domains:** Check for references to domains, subdomains, CDN endpoints
2. **Cloud resources:** Search for AWS ARNs, GCP project IDs, Azure resource IDs
3. **Terraform/IaC:** If present, check for drift indicators, unencrypted state
4. **Database migrations:** Check migration files for security-relevant changes (adding auth columns, dropping constraints)
5. **Feature flags:** Search for feature flag services (LaunchDarkly, Unleash, env-based flags) that might expose unauthenticated endpoints
6. **Solana-specific:**
   - Check for program upgrade authority settings
   - Verify multisig requirements for program upgrades
   - Check for open PDAs that anyone can write to

---

## Phase 6: Webhook & Integration Audit

**Goal:** Verify all inbound webhooks validate authenticity and all outbound integrations are secure.

1. **Inbound webhooks:**
   - Search for webhook handler endpoints
   - Verify signature validation (HMAC, asymmetric signature)
   - Check for replay protection (timestamp validation, nonce)
   - Verify IP allowlisting if applicable
2. **Outbound integrations:**
   - Check for TLS verification (`rejectUnauthorized: false`, `verify=False`)
   - Verify timeout settings on outbound calls
   - Check for circuit breaker patterns
3. **Third-party callbacks:**
   - OAuth callback URLs: verify state parameter validation
   - Payment callbacks: verify signature and idempotency
   - Solana: verify transaction confirmation before acting on webhooks

---

## Phase 7: LLM & AI Security

**Goal:** Audit LLM integrations for prompt injection, data exfiltration, and trust boundary violations.

1. **Prompt injection:**
   - Search for user input concatenated directly into prompts
   - Check for system prompt leakage via instructions
   - Verify input sanitization before LLM calls
2. **Data exfiltration:**
   - Check if LLM responses are used to construct URLs, file paths, or shell commands
   - Verify LLM output is not directly executed (`eval`, `exec`, `Function()`)
   - Check for tool-use/function-calling without output validation
3. **Trust boundaries:**
   - Map which data flows to LLMs (PII, secrets, financial data)
   - Check for context window stuffing with sensitive data
   - Verify rate limiting on LLM-powered endpoints
4. **API key management:**
   - LLM API keys should be server-side only
   - Check for key rotation policies
   - Verify billing alerts are configured

---

## Phase 8: Skill Supply Chain

**Goal:** Audit installed skills for malicious or vulnerable content.

### Scan paths:
- `~/.claude/skills/` (Claude Code skills)
- `~/.codex/skills/` (Codex skills)
- Project-local `skills/` directory
- `.claude/settings.json` for skill references

### Checks:

Moved to `references/checks.md`. Open it when you reach this step.


## Phase 9: OWASP Top 10:2025 Assessment

Moved to `references/phase-9-owasp-top-10-2025-assessment.md`. Open it when the task needs this part.


## Sources for Phase 4 and Phase 9
- GitHub secure use reference: https://docs.github.com/en/actions/reference/security/secure-use
- OWASP Top Ten project: https://owasp.org/www-project-top-ten/
- OWASP Top 10:2025 reference: https://owasp.org/www-project-top-ten/

---

## Phase 10: STRIDE Threat Model

**Goal:** Systematic threat modeling using STRIDE methodology.

For each major component identified in Phase 0:

| Threat | Question | Check |
|--------|----------|-------|
| **S**poofing | Can an attacker impersonate a user or component? | Auth mechanisms, certificate validation, wallet signature checks |
| **T**ampering | Can data be modified in transit or at rest? | Integrity checks, HMAC, digital signatures, on-chain account constraints |
| **R**epudiation | Can actions be denied? | Audit logging, transaction receipts, on-chain event emission |
| **I**nformation Disclosure | Can sensitive data leak? | Encryption at rest/transit, access controls, error messages |
| **D**enial of Service | Can the system be overwhelmed? | Rate limiting, resource quotas, compute unit limits |
| **E**levation of Privilege | Can a user gain unauthorized access? | Privilege checks, role validation, PDA authority checks |

**Output:** STRIDE matrix with component, threat type, risk level, existing mitigation, recommended action.

---

## Phase 11: Data Classification

**Goal:** Identify and classify all sensitive data in the system.

1. **PII:** Names, emails, addresses, phone numbers, government IDs
2. **Financial:** Payment info, wallet addresses, transaction data, balances
3. **Auth credentials:** Passwords, tokens, API keys, private keys, seed phrases
4. **Business sensitive:** Proprietary algorithms, pricing, user analytics
5. **Regulated:** Data subject to GDPR, CCPA, PCI-DSS, SOC2

For each data type found:
- Where is it stored?
- How is it transmitted?
- Who has access?
- What is the retention policy?
- Is it encrypted at rest and in transit?

---

## Phase 12: False Positive Filtering + Active Verification

**Goal:** Eliminate noise. Every finding must be verified or clearly marked as unverified.

### Confidence Calibration

Moved to `references/confidence-calibration.md`. Open it when you reach this step.


### Daily Mode (default): Only report findings >= 8/10
### Comprehensive Mode: Report findings >= 2/10, clearly labeled

### Hard Exclusions (NEVER report these as findings)

Moved to `references/hard-exclusions-never-report-these-as-findings.md`. Open it when you reach this step.


### Precedent Database

Moved to `references/precedent-database.md`. Open it when you reach this step.


### Active Verification Steps

Moved to `references/active-verification-steps.md`. Open it when you reach this step.


## Phase 13: Findings Report + Remediation

### Findings Table Format

Moved to `references/findings-table-format.md`. Open it when you reach this step.


### Severity Definitions

| Severity | Meaning | SLA |
|----------|---------|-----|
| CRITICAL | Actively exploitable, data loss or system compromise | Fix immediately |
| HIGH | Exploitable with some conditions, significant impact | Fix within 24 hours |
| MEDIUM | Requires specific conditions, moderate impact | Fix this sprint |
| LOW | Minor impact, defense-in-depth improvement | Fix this month |
| INFO | Not a vulnerability, but worth noting | No SLA |

### Remediation Roadmap

After presenting all findings, create a prioritized remediation roadmap:

1. Group findings by priority (P0, P1, P2, P3)
2. For each group, estimate effort (hours)
3. Use AskUserQuestion to confirm priorities with the user
4. Ask if they want to start fixing P0 issues now

### Confidence Calibration Summary

Moved to `references/confidence-calibration-summary.md`. Open it when you reach this step.


## Phase 14: Save Report

**Goal:** Persist the audit report for tracking over time.

1. Create `.superstack/security-reports/` directory if it doesn't exist
2. Determine project slug: `basename $(git rev-parse --show-toplevel 2>/dev/null)` (fallback: current directory name)
3. Save report to `.superstack/security-reports/{slug}-{YYYY-MM-DD}.md`
4. If a previous report exists, compare finding counts and highlight:
   - New findings (not in previous report)
   - Resolved findings (in previous report but not current)
   - Persistent findings (in both reports)
5. Append summary to `.superstack/security-reports/history.md`:

```markdown
## {YYYY-MM-DD} — {slug}
- Mode: Daily | Comprehensive
- Findings: N (C: X, H: X, M: X, L: X, I: X)
- New: N | Resolved: N | Persistent: N
- Confidence gate: X/10
```

6. Tell the user where the report was saved and offer to start remediation.

## Telemetry (run last)

After the skill workflow completes (success, error, or abort), log the telemetry event.
Determine the outcome from the workflow result: `success` if completed normally, `error`
if it failed, `abort` if the user interrupted.

Run this bash:

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - ${_TEL_START:-$_TEL_END} ))
_TEL_TIER=$(cat ~/.superstack/config.json 2>/dev/null | grep -o '"telemetryTier": *"[^"]*"' | head -1 | sed 's/.*"telemetryTier": *"//;s/"$//' || echo "anonymous")
if [ "$_TEL_TIER" != "off" ]; then
echo '{"skill":"cso","phase":"build","event":"completed","outcome":"OUTCOME","duration_s":"'"$_TEL_DUR"'","session":"'"$_SESSION_ID"'","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","platform":"'$(uname -s)-$(uname -m)'"}' >> ~/.superstack/telemetry.jsonl 2>/dev/null || true
true
fi
```

Replace `OUTCOME` with success/error/abort based on the workflow result.
