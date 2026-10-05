---
name: refactor
description: Refactor code with specific focus (performance, readability, maintainability). Use when improving code quality, optimizing code structure, or applying better design patterns.
disable-model-invocation: true
---

# Refactor Code

Refactor code to improve quality, maintainability, performance, or readability.

## Refactor Focus: `$ARGUMENTS`

Common refactor focuses:

- `readability` - Improve code readability and clarity
- `performance` - Optimize for speed and efficiency
- `maintainability` - Make code easier to maintain
- `structure` - Improve code organization and structure
- `patterns` - Apply better design patterns
- `types` - Improve type safety and annotations
- `error-handling` - Improve error handling patterns
- `testing` - Make code more testable

## Refactoring Process

### 1. Analyze Current Code

- Read the code to be refactored (file or selection)
- Understand current implementation
- Identify refactoring opportunities
- Check for existing patterns in codebase

### 2. Identify Improvements

Based on focus (`$ARGUMENTS`), identify:

- Code smells (duplication, complexity, etc.)
- Performance bottlenecks
- Maintainability issues
- Pattern inconsistencies
- Type safety gaps

### 3. Plan Refactoring

- Determine refactoring strategy
- Identify affected areas
- Check for dependencies
- Plan incremental changes if needed

### 4. Apply Refactoring

- Make changes incrementally
- Maintain functionality (no behavior changes)
- Follow existing codebase patterns
- Update related code if needed

### 5. Verify Changes

- Ensure functionality preserved
- Run tests if available
- Check for type errors
- Verify no regressions

## Refactoring Principles

**Before Refactoring:**

- ✅ Understand what the code does
- ✅ Have tests (or create them first)
- ✅ Make small, incremental changes
- ✅ Keep functionality identical

**During Refactoring:**

- ✅ Follow existing codebase patterns
- ✅ Maintain code style and conventions
- ✅ Update related documentation
- ✅ Preserve all functionality

**After Refactoring:**

- ✅ Code is cleaner and more maintainable
- ✅ No functionality changes
- ✅ Tests still pass
- ✅ Code follows best practices

## Common Refactoring Patterns

### Extract Function/Method

- Break down large functions
- Extract reusable logic
- Improve single responsibility

### Simplify Conditionals

- Reduce nesting
- Use early returns
- Simplify boolean logic

### Remove Duplication

- Extract common patterns
- Create reusable utilities
- Consolidate similar code

### Improve Naming

- Use descriptive names
- Follow naming conventions
- Clarify intent

### Optimize Performance

- Reduce unnecessary computations
- Optimize data structures
- Improve algorithm efficiency

## Output Report

### Refactoring Summary

**Focus**: `$ARGUMENTS`
**Files Modified**: [list]
**Changes Made**:

- [Specific improvement 1]
- [Specific improvement 2]
- [Specific improvement 3]

### Before/After Examples

**Before**:

```language
// Original code
```

**After**:

```language
// Refactored code
```

**Improvement**: [Explanation of what was improved]

### Verification

- ✅ Functionality preserved
- ✅ Code follows patterns
- ✅ No regressions
- ✅ Improved [focus area]

## Notes

- Refactoring should not change behavior
- Make incremental, testable changes
- Follow existing codebase conventions
- Document significant structural changes
