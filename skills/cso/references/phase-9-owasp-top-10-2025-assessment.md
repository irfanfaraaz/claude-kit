# Phase 9: OWASP Top 10:2025 Assessment

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Phase 9: OWASP Top 10:2025 Assessment

**Goal:** Systematic check against OWASP Top 10:2025 with active verification.

### A01: Broken Access Control
- Check for missing authorization on API routes
- Search for IDOR patterns (user ID in URL without ownership check)
- Verify role-based access control implementation
- Solana: check for missing signer constraints, unchecked account ownership

### A02: Security Misconfiguration
- Check for debug mode in production configs
- Search for default credentials
- Verify security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Check CORS configuration (`Access-Control-Allow-Origin: *`)
- Verify directory listing is disabled

### A03: Software Supply Chain Failures
- Cross-reference with Phase 3 dependency audit and Phase 4 CI/CD integrity audit
- Check for vulnerable, unsupported, or unmaintained third-party components
- Verify version tracking, vulnerability scanning, and change-management processes exist
- Check CI/CD dependencies such as GitHub Actions, container base images, and build tooling for mutable or untrusted sources

### A04: Cryptographic Failures
- Search for weak algorithms: `MD5`, `SHA1` (for security purposes), `DES`, `RC4`
- Check for hardcoded encryption keys
- Verify TLS configuration (minimum version, cipher suites)
- Solana: verify proper use of `ed25519`, check for weak randomness in key generation

### A05: Injection
- **SQL:** Search for string concatenation in queries (`"SELECT.*" + `, `` `SELECT ${` ``)
- **Command:** Search for `exec(`, `spawn(`, `system(` with user input
- **XSS:** Search for `dangerouslySetInnerHTML`, `innerHTML`, unescaped output in templates
- **LDAP/XPath:** If applicable, check injection points
- **Solana:** Check for unchecked instruction data deserialization

### A06: Insecure Design
- Check for rate limiting on auth endpoints
- Verify account lockout mechanisms
- Check for security-relevant business logic flaws
- Review error messages for information leakage

### A07: Authentication Failures
- Check password policies (if applicable)
- Verify session management (expiry, rotation, secure flags)
- Check for credential stuffing protections
- Solana: verify wallet signature validation, check for replay attacks

### A08: Software or Data Integrity Failures
- Check for unsigned updates or deployments
- Verify CI/CD pipeline integrity (cross-ref Phase 4)
- Check for deserialization of untrusted data
- Solana: verify program upgrade authority, check IDL integrity

### A09: Security Logging and Alerting Failures
- Check for security event logging (failed logins, privilege changes)
- Verify log injection protections
- Check for sensitive data in logs (passwords, tokens, keys)
- Verify alerting exists for security events

### A10: Mishandling of Exceptional Conditions
- Check for fail-open behavior on errors or missing inputs
- Verify exceptions and abnormal states are handled securely and consistently
- Review error paths for sensitive-data leakage
- Check timeout, retry, fallback, and privilege-failure handling
