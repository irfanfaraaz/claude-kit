---
name: memory-management
description: Use mem0 memory tool to store and retrieve context across sessions. Use when storing project decisions, user preferences, technical patterns, session state, or when maintaining consistency across conversations.
---

# Memory Management with mem0

## Core Principle

Always use the mem0 memory tool to store context that should persist across sessions and maintain consistency.

## When to Store Memories

Store memories for:
- **Project decisions**: Architecture choices, design patterns, technology selections
- **User preferences**: Coding style, tool preferences, workflow patterns
- **Technical patterns**: Reusable solutions, troubleshooting fixes, implementation approaches
- **Session state**: Current task progress, active work items, context that spans multiple sessions

## Memory Storage Patterns

### Project Decisions
Store architectural decisions and design patterns that affect the project.

### User Preferences
Store coding and workflow preferences.

### Technical Patterns
Store reusable solutions and patterns.

### Session State
Store current task context.

## Memory Retrieval

Search memories at session start using relevant keywords:
- Use project-specific terms when starting work on a project
- Search for user preferences when making style decisions
- Look for technical patterns when solving similar problems

## Memory Updates

Update memories when context changes significantly:
- When project architecture evolves
- When user preferences change
- When better patterns are discovered
- When troubleshooting reveals new solutions

## Best Practices

1. **Be specific**: Store concrete information, not vague concepts
2. **Use keywords**: Include searchable terms in memory content
3. **Update regularly**: Keep memories current with project evolution
4. **Avoid duplication**: Check existing memories before storing new ones
5. **Store actionable info**: Focus on information that affects future decisions
