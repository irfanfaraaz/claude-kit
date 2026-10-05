# How to Recreate This Motion Design

Moved here word for word from SKILL.md, to keep SKILL.md short.

## How to Recreate This Motion Design

### Step 1 — Install Dependencies

```bash
npm install lottie-web
```

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity .15s cubic-bezier(.4, 0, .2, 1),
              transform .15s cubic-bezier(.4, 0, .2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Duration scale:** `.15s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`965px`) → `screens/scroll/scroll-017.png`
- **33%** (`1873px`) → `screens/scroll/scroll-033.png`
- **50%** (`2839px`) → `screens/scroll/scroll-050.png`
- **67%** (`3804px`) → `screens/scroll/scroll-067.png`
- **83%** (`4712px`) → `screens/scroll/scroll-083.png`
- **100%** (`5677px`) → `screens/scroll/scroll-100.png`
