# Checks:

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Checks:
1. **Skill manifest validation:**
   - Verify each skill has a valid `SKILL.md` with frontmatter
   - Check for unexpected `allowed_tools` (especially `Bash` with no constraints)
   - Flag skills that request `Write` + `Bash` together (can modify and execute)
2. **Skill content scanning:**
   - Search for encoded/obfuscated content in skill files
   - Check for URLs that download and execute code
   - Look for instructions that override safety guidelines
   - Search for `ignore previous instructions`, `you are now`, `system prompt` patterns
3. **Skill provenance:**
   - Check if skills come from known sources (official repos, verified publishers)
   - Flag skills with no clear origin
   - Check git history for skill modifications
4. **Reference file scanning:**
   - Check `references/` directories for unexpected file types
   - Verify referenced URLs are legitimate
   - Check for large binary files in skill directories
