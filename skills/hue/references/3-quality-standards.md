# 3. QUALITY STANDARDS

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- 3. QUALITY STANDARDS
  - Preview
  - Philosophy
  - Design Principles
  - Craft Rules
  - Anti-Patterns
  - Colors
  - Fonts
  - Type Scale
  - Spacing
  - Radii
  - Elevation
  - Motion
  - Platform Mapping
  - Components


## 3. QUALITY STANDARDS

These are non-negotiable. Every generated skill must meet all of them.

### Preview
- The `preview.html` must look like a real app dashboard, not a component library. Use real-looking content, proper hierarchy, proper density.

### Philosophy
- 2-4 sentences that capture the *attitude*, not just the aesthetics. "Subtract, don't add" is a philosophy. "Clean and modern" is not.
- Reference the design lineage — what real-world objects, brands, movements, or eras this draws from.
- Include the primary tension that gives the language its character.

### Design Principles
- 5-7 principles. Each: **Bold Title.** + one sentence.
- Every principle must be falsifiable — you can point at a screen and say "this violates principle 3."
- No platitudes. "User-friendly" is not a principle. "Type does the heavy lifting — hierarchy comes from scale and weight, never from color or icons" is.

### Craft Rules
- 5-6 rules in Section 2 of SKILL.md. Each is a *how-to-compose* instruction.
- Include: visual hierarchy layers, typography discipline (font budget per screen), spacing semantics, color strategy, composition approach.
- Use tables for layer/hierarchy definitions — they're scannable and unambiguous.
- Include the squint test or equivalent quick-validation method.

### Anti-Patterns
- 8-12 specific bans. Each starts with "No" and names the exact thing.
- Be precise: "No border-radius > 16px on cards" not "avoid large corners."
- Include both visual anti-patterns (gradients, shadows) and behavioral ones (toast popups, skeleton screens).
- Anti-patterns are what prevent the skill from producing generic output. They're the immune system.

### Colors
- Coherent palette. Every color must have a *role*, not just a hex code.
- Mentally verify contrast: text on background must exceed 4.5:1 for body, 3:1 for large text.
- Both dark and light mode values. Derive secondary mode from primary — don't just invert. Warm light mode needs warm dark mode.
- Include semantic colors: accent, success, warning, error.
- Token names follow this schema:

| Token | Role |
|-------|------|
| `--background` | Page/canvas background |
| `--bg` | Alias for `--background` (short form used in hero/landing templates) |
| `--surface1` | Primary elevated surface (cards) |
| `--surface2` | Secondary surface (nested, grouped) |
| `--surface3` | Tertiary surface (inputs, wells) |
| `--border` | Subtle/decorative borders |
| `--border-visible` | Intentional borders |
| `--text1` | Primary text (headings, body) |
| `--text2` | Secondary text (descriptions, labels) |
| `--text3` | Tertiary text (placeholders, timestamps) |
| `--text4` | Disabled text |
| `--accent` | Primary interactive color |
| `--accent-subtle` | Tinted backgrounds for accent |
| `--success` | Positive states |
| `--warning` | Caution states |
| `--error` | Destructive/error states |
| `--success-bg` | Tinted background behind success text/badges |
| `--warning-bg` | Tinted background behind warning text/badges |
| `--error-bg` | Tinted background behind error text/badges |

**Status tint derivation rule:** each `--*-bg` comes from the same status ramp as its foreground — light mode uses the lightest ramp step (`{hue.50}`), dark mode the darkest (`{hue.900}`); the foreground stays `{hue.500}` in both. This matches how `tokens-template.md` (status ramp table) and `components-template.md` (tags, alerts) consume them.

**Platform mapping must emit all tokens above.** `--bg` is an alias for `--background` — emit both in the `:root` block. `--border-visible` must be emitted alongside `--border`. `--accent-subtle` must be emitted (not `--accent-bg` — that's a deprecated name). `--success-bg` / `--warning-bg` / `--error-bg` must be emitted in both modes. See `references/platform-mapping-template.md`.

### Fonts
- Display, body, and mono roles. Always three.
- **Google Fonts only** for web skills. Name the exact font and weights needed.
- **System fonts** for SwiftUI skills (SF Pro, SF Rounded, SF Mono, New York).
- Include fallback stacks. Always.
- State *why* the font fits the aesthetic. "Geometric sans with humanist details" tells Claude how to judge edge cases.
- **`mono_for_code` + `mono_for_metrics`:** Two independent flags decide where the mono font applies. `mono_for_code` covers code blocks, file paths, shell commands, inline technical tokens. `mono_for_metrics` covers pricing, counts, timestamps, percentages, ID strings. Many brands use mono for code but NOT for metrics (e.g. Cursor: mono inside IDE screenshots, but `$20` pricing stays in the sans). Decide each flag by checking the brand's actual site.

  | Brand type | Example | `mono_for_code` | `mono_for_metrics` |
  |------------|---------|-----------------|--------------------|
  | Dev-tool / terminal | Linear, Nothing | `true` | `true` |
  | Dev-tool with editorial marketing | Cursor, Vercel, Raycast | `true` | `false` |
  | Consumer / editorial | Apple, mymind, Notion | `false` | `false` |

  **Backwards compat:** older skills may have `mono_for_data: true/false`. Treat `true` as both new flags true, `false` as both false.
- **`locked_weight`** (optional, top-level): Set only when the brand genuinely uses a single font weight across all text (h1 through body all at the same weight). Most brands do not — leave unset. If set, ALL type scale rows use this weight; see Type Scale section below for the table treatment.

### Type Scale
- 7 sizes minimum: display, heading, subheading, body, body-sm, caption, label. These names are canonical — identical in `references/tokens-template.md` and `references/platform-mapping-template.md`. Never invent alternates like `--h1`/`--h2`.
- Every size gets: px value, line-height ratio, letter-spacing, weight, and use case.
- Follow this structure:

| Token | Size | Line Height | Letter Spacing | Weight | Use |
|-------|------|-------------|----------------|--------|-----|
| `--display` | Npx | ratio | em | weight | use case |
| `--heading` | Npx | ratio | em | weight | use case |
| `--subheading` | Npx | ratio | em | weight | use case |
| `--body` | Npx | ratio | em | weight | use case |
| `--body-sm` | Npx | ratio | em | weight | use case |
| `--caption` | Npx | ratio | em | weight | use case |
| `--label` | Npx | ratio | em | weight | use case |

- **Locked-weight variant:** If `locked_weight` is set in the model, the weight column in the type scale table becomes a single row at the top (e.g. "All sizes: weight 400") instead of repeating per row. Drop the `Weight` column from the table or set every cell to `—`. Use this only for brands that genuinely run a single weight across all text (Cursor is one example).

### Spacing
- 8px base grid. Always.
- Scale: `2xs` (2px), `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px), `4xl` (96px).
- Every value gets a semantic use case.

### Radii
- Define separately for: cards, buttons, inputs, tags/pills.
- State the corner philosophy — sharp (0-4px), soft (8-16px), round (20-24px), pill (999px).
- If the platform is iOS, note `RoundedRectangle(cornerRadius:, style: .continuous)`.

### Elevation
- Pick one primary elevation strategy:

| Strategy | When | How |
|----------|------|-----|
| **Flat** | Industrial, minimal | No shadows. Borders or background change only. |
| **Subtle** | Warm, friendly | Small y-offset (1-3px), diffused blur, low opacity. |
| **Glow** | Dark-mode-forward, premium | Colored shadow matching accent, no y-offset. |
| **Material** | Glass, depth-heavy | Blur + transparency + saturation. |

### Motion
- Pick one motion personality:

| Personality | Easing | Duration | Behavior |
|-------------|--------|----------|----------|
| **Mechanical** | `ease-out` or linear | 120-200ms | Precise, no overshoot. Click, not swoosh. |
| **Smooth** | `ease-in-out` | 200-350ms | Calm transitions, no bounce. |
| **Playful** | Spring (damping 0.7-0.8) | 300-500ms | Overshoot + settle. Things feel alive. |
| **None** | Instant | 0-100ms | Content appears, no choreography. |

### Platform Mapping
- Generate REAL, valid, copy-paste-ready code. Not pseudocode.
- CSS: `:root` block with all custom properties. Include dark mode via `[data-theme="dark"]` or `@media (prefers-color-scheme: dark)`.
- SwiftUI: `Color` extension with static properties, `Font` extension with static methods, relevant `ViewModifier`s.
- Tailwind: `extend` block for `tailwind.config.js` mapping all tokens.

### Components
- Every component gets: when to use, variants, exact token mapping per variant.
- Minimum components: cards, buttons (4 variants), inputs, lists, navigation, tags/chips, overlays (modal + bottom sheet), state patterns (empty, loading, error, disabled).
- Use tables for variant specifications — scannable, unambiguous.
