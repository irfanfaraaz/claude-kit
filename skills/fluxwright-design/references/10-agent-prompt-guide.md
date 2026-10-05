# 10. Agent Prompt Guide

Moved here word for word from SKILL.md, to keep SKILL.md short.

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f7f4ee
Border: 1px solid #333333
Radius: .375rem
Padding: 16px
Font: Google Sans
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #c8f135, text white
Ghost: bg transparent, border #333333
Padding: 8px 16px
Radius: .375rem
Hover: opacity 0.9 or lighter shade
Focus: ring with #c8f135
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f7f4ee
Label: #6b6b6b (muted, 12px, uppercase)
Value: #0a0a0a (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #333333
Focus: border-color #c8f135
Label: #6b6b6b 12px
Spacing: 16px between fields
Radius: .375rem
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Google Sans, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
