# Typography

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Typography

### Font Stack

- **Google Sans** — Heading 1, Heading 2
- **Google Sans Code** — Body, Caption
- **SFMono-Regular** — Code

### Font Sources

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

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Google Sans | 3rem | 700 |
| Heading 2 | Google Sans | clamp(1.75rem,3.5vw,2.75rem) | 700 |
| Body | Google Sans Code | 1rem | 400 |
| Caption | Google Sans Code | clamp(1.375rem,2.5vw,2rem) | 400 |
| Code | SFMono-Regular | 14px | 400 |

### Typography Rules

- Body/UI: **Google Sans**, Headings: **Google Sans Code** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings
