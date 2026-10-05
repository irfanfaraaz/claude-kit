# Asset Brief

This skill does not generate assets. It writes you a **shotlist** and waits.

That's deliberate. You have better tools than an API call — Flow, Midjourney, Runway, Higgsfield, whatever you use — and you have taste. A script prompting an endpoint has neither. The skill's job is to know exactly *what* is needed and *why*, specify it precisely, and then get out of the way.

There is no API key, no wallet, no provider dependency. The skill works the same whether you generate in Flow or shoot on a phone.

## The handoff

**Phase 4a — Claude writes `ASSETS.md`.**
A numbered shotlist at the project root. Each entry specifies exactly one asset: what it's for, what it must show, the prompt to use, the technical spec, and the filename to save it as.

**Phase 4b — the user generates and drops files into `assets/raw/`.**
Using whatever platform they like. Filenames must match the shotlist.

**Phase 4c — validation.**
```bash
python scripts/check_assets.py ./assets/raw --brief ./ASSETS.md
```
Checks every file in the shotlist is present, reports resolution and duration, and — for video — **detects cuts**. A clip with a scene change is unusable for scrubbing, and this catches it before it's baked into a frame sequence.

**Phase 4d — build continues.**
Frame sequences via `scripts/frames.py`, stills copied and optimized, then phase 5.

---

## Writing the shotlist

Before writing anything, do the inventory. Three buckets:

1. **Real, owned** — their photos, screenshots, recordings, logo. Use these first, always.
2. **Real, findable** — their own public posts, leaderboards, reviews, dashboards, press. Go look. If they claim something, find the artifact that proves it. This step is skipped constantly and it's usually the highest-value ten minutes of the build.
3. **Gaps** — only what's left after 1 and 2. These go in the shotlist.

A shotlist of twelve items means you skipped step 2. A good one is three to six.

### Entry format

Every entry follows this shape. Be specific enough that the user doesn't have to make design decisions you should have made.

```markdown
## 01 — Hero scrub
**Section:** Hero (signature moment)
**Job:** Carry the opening 300vh of scroll. Visitor should feel they're
        pushing into the subject, under their own control.
**Type:** Video → frame sequence
**Spec:** 16:9, ≥1600px wide, 4–5s, 24fps+, no audio needed
**Save as:** `assets/raw/01-hero.mp4`

**Prompt:**
> Slow continuous push-in toward [subject]. Camera never cuts. Matte
> finish, even studio lighting. Palette limited to [--ink] and [--paper]
> with [--accent] only on [specific element]. No text, no watermarks,
> no logos.

**Must:** one continuous motion, identical lighting start to end
**Must not:** cuts, scene changes, camera whip, text overlays
**Nice:** if the motion returns near its starting frame it loops and can
        be scrubbed both ways indefinitely
```

### Rules for the prompts you write

- **One subject, one continuous motion, locked style, no cuts.** Say it explicitly in the prompt. Cuts are the number one reason generated video is unscrubbable, and models add them unprompted.
- **Pin the palette to the actual token values** from the design system. Don't write "brand colors" — write the hex.
- **Always append:** no text, no watermarks, no logos, consistent lighting throughout.
- **Never prompt for realistic human faces** on a trust-driven page. Generated people are a negative asset — visitors clock them and it costs you the credibility the rest of the page was building.
- Write prompts that are **platform-neutral**. Don't assume Veo syntax or Midjourney parameters. If a platform-specific hint helps, put it in a `**Tip:**` line the user can ignore.

## Style registers

Pick one register and hold it across every generated asset on the page. Mixed registers read as a moodboard, not a site.

| Register | Good for |
|---|---|
| Low-poly geometric | Human activity, teaching, collaboration — without generated faces |
| Isometric technical | Process, systems, architecture |
| Duotone photographic | Unifying mismatched real photos into one look |
| Abstract material (cloth, liquid, smoke, ink) | Frame-scrub hero moments |
| Editorial line illustration | Trust-forward, document-feeling pages |

Choose a register that is **obviously stylized**, never almost-photoreal. Photoreal-but-slightly-wrong is the uncanny middle and it makes a page feel cheap. Deliberately stylized reads as art direction.

## Stating the budget

Put a payload estimate at the bottom of `ASSETS.md` so the user knows what they're committing to before they generate:

```
01 hero scrub     110 frames @1600 webp   ≈  8.4 MB
02–04 stills      3 × 1200 webp           ≈  0.5 MB
05 map            inline SVG              ≈  0.04 MB
                                    total ≈  9.0 MB
```

If the hero is over ~12MB, cut frame count before cutting resolution — smoothness degrades more gracefully than sharpness.

## When the user has nothing

Some people will land here with no assets, no generation tool, and no budget. Say so plainly and design around it rather than pushing them toward a paid API.

A zero-asset page is entirely buildable and can be excellent. Lean on the mechanisms that need no imagery:

- `counter` + `drawPath` + `bloom` — data, maps, networks, growth
- `typewrite` and `stages` — one idea at a time, pure type
- `rail` — the sticky source counter
- Deliberate absence — space and typography

That's a page with five mechanisms and zero megabytes of assets. It leans typographic and abstract. It will beat a page padded with generated stock imagery, comfortably.

## Iterating

When an asset comes back wrong, diagnose in `ASSETS.md` rather than rewriting from scratch:

- **Has a cut** → add "single continuous take, camera never cuts" and shorten the duration
- **Style drifts across the clip** → lock lighting and material explicitly, shorten to 3s
- **Wrong palette** → restate the hex values; some models ignore color names but respect hex
- **Motion too fast to scrub** → not an asset problem. Increase the section height in the build.
