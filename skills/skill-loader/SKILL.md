---
name: skill-loader
description: Discover and load symlinked skills from ~/.cursor/skills/ when needed. Use when a required skill wasn't auto-discovered by Cursor, or when checking for available skills.
---

# Skill Loader - Discover Symlinked Skills

## Problem

Cursor IDE doesn't automatically discover skills stored in symlinked directories. Skills symlinked from `~/.agents/skills/` to `~/.cursor/skills/` won't appear in the auto-discovered skills list.

## Solution

When you need a skill that wasn't auto-discovered, or when checking for available skills:

1. **Check for symlinks**: Scan `~/.cursor/skills/` for symlinked directories
2. **Read symlinked skills**: Use `read_file` or `list_dir` to access symlinked skill files
3. **Load on-demand**: Read the `SKILL.md` file from symlinked directories when:
   - A task matches a symlinked skill's description
   - The user asks about skills or mentions a skill name
   - You need capabilities that aren't in the auto-discovered skills list

## Implementation

### When to Check for Symlinked Skills

- When a task requires capabilities not found in auto-discovered skills
- When user mentions a skill name that wasn't in the available skills list
- When explicitly asked to list or check available skills
- When a symlinked skill's description matches the current task

### How to Discover Symlinked Skills

1. Use `list_dir` on `~/.cursor/skills/` to see all entries
2. Identify symlinks (they'll appear as links in directory listings)
3. Read the `SKILL.md` file from each symlinked directory using `read_file`
4. Use the skill's instructions when relevant to the task

### Example Workflow

```
User: "Use the aws-diagrams skill"
→ Check if aws-diagrams is in auto-discovered skills
→ If not, check ~/.cursor/skills/aws-diagrams (might be symlinked)
→ If symlink exists, read ~/.cursor/skills/aws-diagrams/SKILL.md
→ Follow the skill's instructions
```

## Using QMD to Load or Read Skills

When the **qmd** skill is available and skills are indexed in a qmd collection, prefer qmd for searching and retrieving skill content:

1. **Search for skills by topic**: Use `qmd query "topic or task"` or `qmd vsearch "concept"` to find relevant SKILL.md files by description.
2. **Retrieve a skill**: Use `qmd get "<path/to/SKILL.md>" --full` or `qmd get "#docid" --full` to load full skill content.
3. **List or discover**: Use `qmd status` and `qmd ls <collection>` to see indexed skills; then `qmd get` to read them.

**When to use qmd for skills:**

- User asks to "search skills" or "find a skill for X" — use `qmd query "X"` or `qmd vsearch "X"` (if skills collection exists).
- User asks to "load skill Y" — use `qmd get` for the SKILL.md path or docid if known.
- Faster than scanning directories when the skills tree is indexed.

**Fallback:** If qmd is not installed or skills are not in a collection, use `list_dir` + `read_file` on `~/.cursor/skills/` and `~/.agents/skills/` as above.

## Notes

- Don't proactively load all symlinked skills at conversation start (inefficient)
- Only load symlinked skills when they're needed or relevant
- Symlinked skills work the same as regular skills once loaded
- The symlink target is typically `~/.agents/skills/[skill-name]`
- When qmd indexes skills, use it to search and read other skills (see "Using QMD" above)