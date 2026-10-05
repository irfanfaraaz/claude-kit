# Verification

The harness can tell you the build compiled. It cannot tell you the page is good. This phase is you looking at the thing.

Run it before handing back. Every time.

## Capture

```bash
python scripts/verify.py http://localhost:3000 ./verify \
  --depths 0,10,20,30,40,50,60,70,80,90,100 \
  --widths 1440,768,390
```

Writes numbered screenshots per viewport width, plus `report.json` with console errors, failed requests, and total transferred bytes.

If Playwright isn't installed:

```bash
pip install playwright && playwright install chromium
```

If it can't be installed, say so and ask the user to check the page manually against the checklist below. Don't claim a verification you didn't run.

## Inspect

Actually open the screenshots with the `view` tool and look at them. Reading the filenames is not inspection.

Go through in order and check:

**Layout**
- [ ] Nothing overlapping or clipped at any width
- [ ] No horizontal scrollbar at 390px
- [ ] Pinned sections release cleanly — no dead scroll where nothing happens
- [ ] No section where the content is shorter than the scroll distance driving it

**Motion**
- [ ] Every scrubbed section shows a *different* state across its depth range. If frames 40% and 50% look identical, the binding is broken or the section is too tall.
- [ ] The signature moment is visible in the top third of the depth range
- [ ] Frame sequences show no missing/black frames
- [ ] Scrub backwards manually in the browser — does it look correct in reverse?

**Content**
- [ ] Every CTA points at a real URL, not `#` or a placeholder
- [ ] Captions match what's actually in the image (this is the most common real error — a caption from one context attached to an asset from another)
- [ ] No invented statistics
- [ ] Alt text present on content images

**Weight**
- [ ] `report.json` total transfer is within the budget you stated
- [ ] Above-the-fold renders before the heavy assets land

## Fix, then re-verify

Fix what you found and capture again. A second pass catches the thing the first fix broke.

## Report

Tell the user what you checked and what you found, in a few lines:

```
Verified at 1440 / 768 / 390, 11 scroll depths.
Fixed: horizontal overflow at 390 (exhibit track), founder caption said "AIS Live" — the photo is from Africa AI.
Known: hero frames are 9.1MB, mobile gets the static poster.
Not checked: nothing.
```

Findings are the point. A verification report with no findings usually means the screenshots weren't opened.
