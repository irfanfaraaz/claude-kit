---
name: context7-documentation
description: Use Context7 MCP server to reference up-to-date documentation for libraries and frameworks. Use when working with libraries mentioned by the user, when documentation is needed for implementation, or when verifying API usage patterns.
---

# Context7 Documentation Lookup

## Core Principle

Always use the Context7 MCP server to reference documentation for libraries mentioned by the user.

## When to Use Context7

Use Context7 when:
- User mentions a library or framework (e.g., "refer AI SDK (llmstxt) for context")
- Documentation is needed for implementation details
- Verifying API usage patterns or best practices
- Understanding library-specific conventions or patterns

## Token Strategy

1. **Start with 5000 tokens**: Initial search for documentation
2. **Increase to 20000 tokens**: If first search didn't return relevant documentation
3. **Maximum three searches**: Only search three times maximum for any specific piece of documentation

## Usage Pattern

1. Identify the library or framework mentioned
2. Use Context7 MCP server to fetch documentation
3. Start with 5000 tokens
4. If results are insufficient, increase to 20000 tokens
5. Limit to three total searches per library

## Best Practices

- **Be specific**: Include library name and version if mentioned
- **Use incrementally**: Start with lower token count, increase if needed
- **Respect limits**: Don't exceed three searches per library
- **Focus on relevance**: Use documentation to answer specific questions, not general browsing
