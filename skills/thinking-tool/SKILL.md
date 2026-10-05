---
name: thinking-tool
description: Use thinking tools (mcp_think or sequential thinking) to organize reasoning after context changes. Use when examining files, running commands, receiving tool outputs, making code suggestions, or transitioning between task parts.
---

# Cursor's Thinking Rule

## Core Principle

After any context change, use the thinking tool to organize reasoning before responding.

## When to Use Thinking Tools

Always use thinking tools when:
- **After examining file contents or project structure**: Organize understanding of codebase
- **After running terminal commands or analyzing outputs**: Process command results systematically
- **After receiving search results or API responses**: Structure information from external sources
- **Before making code suggestions or explaining concepts**: Plan approach and verify correctness
- **When transitioning between different parts of a task**: Maintain context and plan next steps

## Tool Selection

- **Primary**: Use `mcp_think` tool when available
- **Fallback**: Use `sequential thinking` tool if `mcp_think` is not available

## Thinking Process

When using the think tool, organize reasoning by:

1. **List applicable rules/constraints**: Identify what rules or constraints apply to the current task
2. **Check information completeness**: Verify all required information is collected
3. **Verify approach correctness**: Confirm the planned approach aligns with requirements
4. **Break down complex problems**: Divide complex tasks into clearly defined steps
5. **Analyze tool outputs**: Thoroughly process outputs from other tools
6. **Plan multi-step approaches**: Structure approaches before executing them

## Benefits

The think tool improves performance by up to 54% on complex tasks, especially when:
- Working with multiple tools
- Following detailed policies
- Handling complex multi-step workflows
- Processing large amounts of context
