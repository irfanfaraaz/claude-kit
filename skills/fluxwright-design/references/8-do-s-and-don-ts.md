# 8. Do's and Don'ts

Moved here word for word from SKILL.md, to keep SKILL.md short.

## 8. Do's and Don'ts

### Do's

- Use `#c8f135` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **Google Sans** (body) with **Google Sans Code** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .3125rem, .375rem
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Google Sans and Google Sans Code and SFMono-Regular
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No gradient backgrounds
- No blur or backdrop-blur effects
- No zebra striping on tables/lists
