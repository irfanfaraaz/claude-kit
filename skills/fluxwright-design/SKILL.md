---
name: fluxwright-design
description: "Design system skill for fluxwright. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details."
---

# fluxwright Design System

You are building UI for **fluxwright**. Light-themed, warm palette, sans-serif typography (Google Sans), compact density on a 4px grid.

## Visual Reference

Moved to `references/visual-reference.md`. Open it when the task needs this part.


## Ultra Reference Files

Moved to `references/ultra-reference-files.md`. Open it when the task needs this part.


## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Solid colors only** — no gradients anywhere. Every surface is a single flat color.
- **Type pairing** — Google Sans for body/UI text, Google Sans Code for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#c8f135` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.

## Color System

Moved to `references/color-system.md`. Open it when the task needs this part.


## Typography

Moved to `references/typography.md`. Open it when the task needs this part.


## Spacing & Layout

Moved to `references/spacing-layout.md`. Open it when the task needs this part.


## Component Patterns

Moved to `references/component-patterns.md`. Open it when the task needs this part.


## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (2 items)
- **Hero** — Hero section (detected from heading structure)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (3 items)

When building pages, follow this section order and structure.

## Animation & Motion

Moved to `references/animation-motion.md`. Open it when the task needs this part.


## Depth & Elevation

### Shadow Tokens

- Raised (cards, buttons): `0 0 0 1px var(--tw-prose-kbd-shadows),0 3px 0 var(--tw-prose-kbd-shadows)`

### Z-Index Scale

`100`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No gradients** — solid colors only, everywhere
- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Google Sans and Google Sans Code and SFMono-Regular are allowed
- **No arbitrary border-radius** — use the scale: .3125rem, .375rem
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Google Sans, Google Sans Code, SFMono-Regular only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.svg`
- **Site URL:** `https://fluxwright.com`
- **Brand color:** `#c8f135`
- **Brand typeface:** Google Sans

## Quick Reference

Moved to `references/quick-reference.md`. Open it when the task needs this part.


## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for fluxwright
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "fluxwright" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# fluxwright DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 9 · Fonts: 3 · Components: 4
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![fluxwright Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography pairs **Google Sans Code** for display/headings with **Google Sans** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#c8f135** as the single accent color — used sparingly for interactive elements and emphasis. Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

Moved to `references/2-color-palette-roles.md`. Open it when the task needs this part.


## 3. Typography Rules

**Font Stack:**
- **Google Sans** — Heading 1, Heading 2
- **Google Sans Code** — Body, Caption
- **SFMono-Regular** — Code

**Font Sources:**

```css
@font-face {
  font-family: "Google Sans";
  src: url("fonts/GoogleSans-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Google Sans";
  src: url("fonts/GoogleSans-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Google Sans Code";
  src: url("fonts/GoogleSansCode-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Google Sans Code";
  src: url("fonts/GoogleSansCode-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Google Sans | 3rem | 700 |
| Heading 2 | Google Sans | clamp(1.75rem,3.5vw,2.75rem) | 700 |
| Body | Google Sans Code | 1rem | 400 |
| Caption | Google Sans Code | clamp(1.375rem,2.5vw,2rem) | 400 |
| Code | SFMono-Regular | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **Google Sans** for body/UI text, **Google Sans Code** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

Moved to `references/4-component-stylings.md`. Open it when the task needs this part.


## 5. Layout Principles

Moved to `references/5-layout-principles.md`. Open it when the task needs this part.


## 6. Depth & Elevation

Moved to `references/6-depth-elevation.md`. Open it when the task needs this part.


## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

Moved to `references/8-do-s-and-don-ts.md`. Open it when the task needs this part.


## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 40rem | css |
| md | 48rem | css |
| lg | 64rem | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Moved to `references/10-agent-prompt-guide.md`. Open it when the task needs this part.


## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# fluxwright — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Lottie**

## Scroll Journey

Moved to `references/scroll-journey-2.md`. Open it when the task needs this part.


## Full Page Screenshots

Moved to `references/full-page-screenshots.md`. Open it when the task needs this part.


## Section Screenshots

Moved to `references/section-screenshots.md`. Open it when the task needs this part.


## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Lottie** | lottie |  ([CDN](https://unpkg.com/@lottiefiles/lottie-player@2)) |
| Lottie (6 players) | vector | JSON-based vector animations |

## Scroll Journey

Moved to `references/scroll-journey.md`. Open it when the task needs this part.


## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| parallax / sticky scroll | CSS | 1 | — | — | — |
| vector animation | Lottie | 6 | — | — | — |

### CSS Implementation

### Lottie Implementation

## Motion Tokens (CSS Variables)

Moved to `references/motion-tokens-css-variables.md`. Open it when the task needs this part.


## How to Recreate This Motion Design

Moved to `references/how-to-recreate-this-motion-design.md`. Open it when the task needs this part.


## Layout & Grid (LAYOUT.md)

# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 26, 28, 32, 48, 80` px

| Spacing | Semantic Use |
|---------|-------------|
| 4px | Tight — within a component |
| 8px | Medium — between sibling items |
| 16px | Wide — between sections |
| 32px | Vast — major section breaks |

## Flex Layouts

Moved to `references/flex-layouts.md`. Open it when the task needs this part.


## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `div.grid.grid-cols-1` | `502px 502px` | 48px | 2 |
| `div.border-rule.grid` | `350.328px 350.328px 350.344px` | — | 6 |
| `div.border-rule.grid` | `350.328px 350.328px 350.344px` | — | 3 |
| `div.border-rule.grid` | `350.328px 350.328px 350.344px` | — | 3 |
| `div.border-rule.grid` | `350.328px 350.328px 350.344px` | — | 3 |
| `div.grid.grid-cols-1` | `350.656px 350.672px 350.656px` | — | 3 |
| `div.border-rule.grid` | `525.5px 525.5px` | — | 6 |

## Structural Containers

Moved to `references/structural-containers.md`. Open it when the task needs this part.


## Layout Rules

- **Container max-width:** `1100px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

Moved to `references/detected-components.md`. Open it when the task needs this part.


## Cards

Moved to `references/cards.md`. Open it when the task needs this part.


## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#333333` for all dividers within components
- Use `#c8f135` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), fill 0.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.2s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

Apply these to all interactive elements. Never invent new durations or easings.

## Link Interactions

Moved to `references/link-interactions.md`. Open it when the task needs this part.


## Interaction Rules

- Accent color `#c8f135` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.2s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

Moved to `references/design-tokens-json-files.md`. Open it when the task needs this part.


## Bundled Fonts (fonts/)

Moved to `references/bundled-fonts-fonts.md`. Open it when the task needs this part.


## Screenshots Inventory (screens/)

Moved to `references/screenshots-inventory-screens.md`. Open it when the task needs this part.


## Scroll Journey

> Shows the cinematic state at each point of the page

| Scroll | Y Position | File |
|--------|-----------|------|
| 0% | 0px | `screens/scroll/scroll-000.png` |
| 17% | 965px | `screens/scroll/scroll-017.png` |
| 33% | 1873px | `screens/scroll/scroll-033.png` |
| 50% | 2839px | `screens/scroll/scroll-050.png` |
| 67% | 3804px | `screens/scroll/scroll-067.png` |
| 83% | 4712px | `screens/scroll/scroll-083.png` |
| 100% | 5677px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| FluxWright - AI automation for businesses | `https://fluxwright.com` | `screens/pages/home.png` |
| Privacy Policy - fluxwright | `https://fluxwright.com/privacy` | `screens/pages/privacy.png` |
| Terms of Service - fluxwright | `https://fluxwright.com/terms` | `screens/pages/terms.png` |
| 404 - Page Not Found | `https://fluxwright.com/404` | `screens/pages/404.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| home | #2 (section) | `screens/sections/home-section-2.png` |
| privacy | #1 (section) | `screens/sections/privacy-section-1.png` |
| terms | #1 (section) | `screens/sections/terms-section-1.png` |
| 404 | #1 (section) | `screens/sections/404-section-1.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

