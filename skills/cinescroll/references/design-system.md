# Design System

Motion is half of why a page feels premium. The other half is type, space, and copy. A beautifully scrubbed hero sitting above generic SaaS cards still reads as generated.

## Commit to tokens before components

Write these down before any component code. Four to six colors, two typefaces maximum, one spacing scale, one radius value.

```
--ink        #___    text, near-black but not #000
--paper      #___    background
--field      #___    secondary surface (used sparingly)
--accent     #___    ONE accent. Used under 5 times on the page.
--rule       #___    hairlines and dividers
```

**One accent.** Not a palette of three. The discipline of a single accent color is most of what separates designed from decorated.

## Typography

Two families maximum, and if two, make them genuinely different — not two sans-serifs that look alike at a glance. One family with real weight range often beats two.

Set an actual type scale (1.25 or 1.333 ratio) rather than picking sizes ad hoc. On a scroll-driven page the display sizes go bigger than you think — a pinned section can carry type at 8–12vw because it owns the whole viewport.

Body copy under 80 characters per line. Serif body gets more line-height than sans.

### Typographic tells to avoid

These appear in generated pages regardless of subject:

- Accenting one word in a headline in a different color or italic
- ALL CAPS tracked-out eyebrow labels above every heading
- Meta strings joined with middle dots (`A · B · C`)
- `WORD — fragment` constructions with a spaced em dash
- A monospace face used only for small data labels
- An arrow appended to link and button text
- Numbered markers (01 / 02 / 03) on content that isn't a sequence

Each is legitimate for some brief. None is a choice when it shows up on every brief.

## Visual-default tells to avoid

Calibrate against these clusters — they're where generated design lands by default:

1. Cream background (~#F4F1EA) + high-contrast serif display + terracotta accent (~#D97757)
2. Near-black background + one acid-green or vermilion accent
3. Broadsheet layout: hairline rules, zero radius, dense newspaper columns
4. The SaaS card kit: content chopped into identical rounded cards, one radius on everything, the same soft grey shadow under each, gradient washes as decoration

If the brief pins a direction, follow the brief — it always wins, including when it asks for one of these. Where the brief leaves an axis free, don't spend that freedom on a default.

## Structure carries information

Borders, rules, numbering, and labels should encode something true about the content, not decorate it. Before adding a numbered marker, check the content is actually a sequence. Before adding a border, check it's separating things that are genuinely separate.

## Receipts

On a trust-driven page, sourcing is a design element, not a footnote.

- Pull live numbers where you can, rather than hardcoding. A figure that's current today and stale in a month is worse than a figure that updates.
- Attach a real URL to every hard claim via `data-source`, and surface the tally (see the rail mechanism).
- Screenshots of real artifacts — a leaderboard, a dashboard, a review, a DM — outperform any generated equivalent by a wide margin. Go find them. They're usually somewhere.

Never invent a statistic to fill a layout. If the number doesn't exist, change the section.

## Copy

Words are design content, not filler.

- Keep the client's voice if they have one. Lift their actual copy off their existing site before rewriting anything.
- Write from the visitor's perspective, in plain language. Name things by what people understand.
- Active voice. A CTA says what happens: "Book the call," not "Submit."
- The same action keeps the same name everywhere on the page.
- One job per line. Cut every sentence that's setting up another sentence.

If you're generating copy because none exists, write about their actual business with specifics — real service names, real cities, real constraints. Generic copy makes even excellent motion feel like a demo.

## Quality floor — non-negotiable

Build to this without announcing it:

- Responsive to 360px width
- Visible keyboard focus on every interactive element
- `prefers-reduced-motion: reduce` respected — scrubbed sections collapse to their final state, not to nothing
- Real alt text on content images, `aria-hidden` on decorative ones
- Color contrast passing AA on body text
- No layout shift on load (reserve space for images and canvases)

## Restraint

Spend your boldness in one place. One element is the memorable thing; everything around it is quiet and disciplined. Cut any decoration that doesn't serve the brief.

Before handing back, look at the page and remove one thing.
