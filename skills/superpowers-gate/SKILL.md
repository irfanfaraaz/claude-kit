---
name: superpowers-gate
description: "Use when user gives a coding task (feature, fix, refactor, change). Runs BEFORE brainstorming, writing-plans, or TDD. Decides whether to implement directly, ask the user, or offer workflow options."
---

# Superpowers gate: decide and optionally ask

When the user gives a **coding task** (feature, fix, refactor, change), do this **before** invoking any Superpowers skill or writing code:

## 1. Classify the task

- **Tiny**: Single file or 1–2 edits, obvious fix, config/tweak, rename, copy-paste adaptation. No ambiguity.
- **Small**: One component/API/screen, clear scope, low risk. Could still benefit from a short brainstorm.
- **Medium**: Multiple components, flows, or integrations; some design choices.
- **Large**: Multi-step, architecture, or "project" scope.

## 2. Act or ask

- **Tiny**  
  → Implement directly. Do **not** ask. Do **not** invoke brainstorm/plan/TDD.

- **Small**  
  → One-line question only:  
  *"Quick change—go ahead or brainstorm first? (say 'go' or 'brainstorm')"*

- **Medium / Large**  
  → Short offer:  
  *"This looks like a [medium/large] change. I can: **(A)** Brainstorm then implement, **(B)** Write a plan then execute, **(C)** Just implement. Which?"*

## 3. Respect explicit intent

If the user already says things like "just fix it", "no need to plan", "quick", "only change X", or "don't overthink it" → **skip the ask** and implement.  
If they say "let's plan first" or "brainstorm" → **skip the ask** and run the requested workflow.

## 4. After they choose

- **Go / Just implement / C** → Implement without brainstorm or plan.
- **Brainstorm / A** → Run brainstorming (or `/brainstorm`), then implement.
- **Plan / B** → Run write-plan (or `/write-plan`), then execute or implement in one go.

Keep the ask to one line. Don't list every Superpowers skill; A/B/C is enough.
