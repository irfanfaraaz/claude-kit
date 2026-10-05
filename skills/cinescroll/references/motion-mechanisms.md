# Motion Mechanisms

Most scroll-driven pages fail because the builder picked one technique and applied it everywhere. Pick per section. The point of this file is the decision table.

All recipes use `scrollkit.js` (in `assets/`), which is dependency-free. If the project already has GSAP + ScrollTrigger, use that instead — don't add a second system.

---

## The decision table

| If the section's content is... | Use | Why not something else |
|---|---|---|
| Photoreal motion of a physical object or place | **Frame scrub** | Video `currentTime` seeks badly on Safari/Android; CSS can't fake photoreal parallax |
| A number, a quantity, growth over time | **Counter + path draw** | The value *is* the content; scrubbing pixels wastes the mechanism |
| Geographic or network spread | **SVG path draw / dot bloom** | Far lighter than video, scrubs perfectly, stays sharp at any size |
| A set of peer items (gallery, case studies, exhibits) | **Pinned horizontal track** | Vertical stacking makes 6 items feel like 6 sections of work to read |
| A single idea that needs to land alone | **Pin + staged text** | Competing content in view dilutes it |
| A process, before/after, or transformation | **Pin + crossfade or mask wipe** | Two states side by side is a diagram; one state becoming another is an argument |
| A quote, a fact, a moment of quiet | **No mechanism at all** | This is a real answer. Use it at least once. |
| Long body copy | **Nothing, or a progress indicator** | Motion on reading text is hostile |
| Persistent state across the whole page | **Sticky counter / progress rail** | Cheap, distinctive, and almost nobody does it |

**Rule:** no mechanism appears twice on one page. If you need a second gallery, find a different treatment for it or merge them.

---

## 1. Frame scrub

The Apple product-page technique. Extract a video into a numbered image sequence and draw the frame matching scroll progress onto a canvas.

**Wins at:** photoreal motion under total user control, forwards and backwards. This is the most expensive mechanism you have and the most memorable. Spend it once.

**Costs:** weight. Budget honestly:

| Frames | Resolution | Format | Approx. total |
|---|---|---|---|
| 90 | 1280×720 | WebP q70 | 3–5 MB |
| 150 | 1600×900 | WebP q70 | 8–12 MB |
| 240 | 1920×1080 | WebP q70 | 18–28 MB |

Use 90–120 frames. Past ~120 the smoothness gain is not perceptible and the weight is. Generate with `scripts/frames.py`, which extracts, resizes, converts to WebP, and writes a `manifest.json`.

```js
Scrollkit.frameSequence({
  el: '#hero-canvas',
  manifest: '/frames/hero/manifest.json',
  scrub: '#hero',        // the element whose scroll progress drives it
  pin: true,
  preload: 'eager',      // block the section until loaded
  fallbackBelow: 768     // static poster on mobile
});
```

**Non-negotiables for frame scrub:**
- Preload with a real progress state. A half-loaded scrub looks broken, not loading.
- Never put one above the fold without a poster frame rendering instantly underneath.
- Mobile gets the poster unless the user explicitly asks otherwise and accepts the weight.
- Give the section `height: 300vh` or more. Under ~250vh the scrub feels twitchy.

**The pacing rule:** scroll distance per frame is what "speed" means here. If it feels too fast, increase section height. Never fix it by easing.

---

## 2. Counter + path draw

Numbers that count as you read them, and lines/maps that draw themselves.

**Wins at:** proof sections, growth, reach, "we did X of Y." Vastly lighter than video and it scrubs perfectly because it's math, not pixels.

```js
Scrollkit.counter({ el: '.stat-value', from: 0, to: 41500, scrub: '.proof', format: 'comma' });
Scrollkit.drawPath({ el: 'svg .route', scrub: '.proof' });
Scrollkit.bloom({ els: 'svg .city', scrub: '.proof', stagger: 0.6 });
```

For a map: inline the SVG (don't `<img>` it), give each point a class, and bloom them in with a stagger tied to scroll. This is the single highest ratio of impressiveness to kilobytes available to you.

**Common mistake:** counting to a fake round number. Count to the real figure, pulled live if possible, and show where it came from. `41,528` is credible in a way `40,000+` is not.

---

## 3. Pinned horizontal track

Section pins; content translates sideways as you scroll down.

**Wins at:** peer items — case studies, exhibits, product variants, a timeline.

```js
Scrollkit.pinTrack({ pin: '.exhibits', track: '.exhibits__track', gutter: 48 });
```

Section height is computed from track width. 5–7 items is the sweet spot. Above 8, people bail mid-track.

**Non-negotiables:**
- Show a partial next item at the right edge so the sideways affordance is obvious before they scroll.
- Give it a progress rail. Horizontal tracks destroy the user's sense of how much is left.
- On mobile, fall back to a native swipe carousel with scroll-snap. Do not pin on mobile.

---

## 4. Pin + staged reveal

Section pins and content changes in stages as scroll advances — text swaps, images crossfade, a mask wipes.

**Wins at:** one idea at a time, transformation, before/after.

```js
Scrollkit.stages({
  pin: '.thesis',
  stages: ['.stage-1', '.stage-2', '.stage-3'],
  scrub: true
});
```

Three stages. Maybe four. Five is a section people scroll past.

**The typewriter variant** — text revealing character by character bound to scroll — is worth knowing because it reads as much more crafted than a fade and costs nothing:

```js
Scrollkit.typewrite({ el: '.thesis__line', scrub: '.thesis' });
```

Use it on *one* line on the whole page. It stops being special the second time.

---

## 5. Sticky progress rail / source counter

A persistent element that accumulates state as the visitor descends. A counter that goes `0/9 sources` → `9/9`. A table of contents that fills in. A receipt tally.

**Wins at:** almost any page, and it is the cheapest distinctive thing in this file. It makes the page feel *authored* — like a document with structure — rather than a stack of blocks.

```js
Scrollkit.rail({
  el: '.rail',
  items: '[data-source]',
  onUpdate: (n, total) => railLabel.textContent = `${n}/${total} sourced`
});
```

Pairs naturally with the "every claim has a receipt" signature move. Give each claim a `data-source` attribute with the actual URL, and let the rail unlock them.

---

## 6. Deliberate absence

At least one section with no scroll binding. Generous space, good type, a real quote or a real fact, and nothing moving.

This is a mechanism. Treat it as a choice you made, put it right before or right after the signature moment, and the signature moment will hit twice as hard.

---

## Things that are not scroll mechanisms

Do not count these toward the page having motion:

- Fade-and-slide-up on section entry. Everything has this. It is the tell.
- Hover lift on cards.
- Autoplaying background video loops.
- A parallax background image at 0.5× speed.
- Marquee logo strips.

They're not banned — a single entry fade on a quiet section is fine. They just don't make a page scroll-driven, and a page built entirely from them is the exact output this skill exists to beat.

---

## Performance floor

- All scroll reads batched into one `rAF` loop. Scrollkit handles this; don't add your own `scroll` listeners alongside it.
- Animate `transform` and `opacity` only. Animating `top`, `height`, or `filter` will drop frames on mid-range Android.
- `will-change` on pinned and scrubbed elements only, removed when the section is out of view.
- Nothing above the fold blocks on a large download.
- Test with CPU throttled 4×. If the signature moment stutters there, it stutters for a third of the real audience.
