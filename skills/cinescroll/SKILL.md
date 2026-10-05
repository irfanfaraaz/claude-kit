---
name: cinescroll
description: "Build premium scroll-driven landing pages where scroll position controls what happens on screen — frame-scrubbed hero sequences, pinned narrative beats, data that counts up as you read it. Use this skill whenever the user wants a landing page, marketing site, product page, portfolio, or agency site that feels cinematic, interactive, \"premium\", \"scroll-driven\", \"like Apple's site\", or \"not generic AI slop\" — and also whenever they ask to redesign, upgrade, or \"make less boring\" an existing site, even if they never say the word \"scroll\". Covers the full pipeline: brief interview, asset generation, mechanism selection, build, and a visual verification pass."
---

# Cinescroll

Build landing pages where **scroll is the interaction**, not just the way you move down a document.

The failure mode this skill exists to prevent: a page where every section fades and slides up on entry, every card lifts on hover, and nothing is actually bound to scroll position. That reads as generated. It is the default. Do not ship it.

The thing you are aiming for instead: the visitor's scroll wheel is a scrub bar. They can move a moment forward and backward, they feel in control of the pacing, and at least one moment on the page is something they have not seen on another site.

## Non-negotiables

1. **One signature moment.** Exactly one section gets expensive, memorable motion. Everything else supports it. A page where five things compete is a page where nothing lands.
2. **Mechanism follows content.** Do not reach for the same effect twice. Pick per section from the decision table in `references/motion-mechanisms.md`.
3. **Reversibility.** Anything bound to scroll must look correct when scrubbed *backwards*. Play-once-on-enter animations are not scroll-driven; they are entrance animations wearing a costume.
4. **Real content or no content.** Do not generate a page full of "Lorem"-grade marketing filler. If the user has copy, keep their voice. If they don't, write specific copy about their actual business — see the writing rules in `references/design-system.md`.
5. **Verify visually before handing back.** Phase 6 is not optional.

## The pipeline

Run these in order. Do not skip phase 1 to start building — the interview *is* the thing that makes each output different instead of a template.

| Phase | What happens | Reference |
|---|---|---|
| 1. Recon | Read what already exists — their site, brand assets, prior builds | below |
| 2. Interview | 6 questions that define the journey, not the features | `references/interview.md` |
| 3. Plan | Section map with a mechanism assigned to each | `references/motion-mechanisms.md` |
| 4. Assets | Write a shotlist, hand off, validate the drop | `references/asset-brief.md` |
| 5. Build | Scroll kit + design tokens | `assets/scrollkit.js`, `references/design-system.md` |
| 6. Verify | Screenshot at scroll depths, inspect, fix | `references/verification.md` |

---

## Phase 1 — Recon

Before asking the user anything, gather what you can yourself. Arriving at the interview already informed changes the questions you ask and makes the whole thing feel less like a form.

- If they gave a URL, fetch it. Pull the actual copy, the color values, the font stack, the nav structure, the claims they make.
- Look in the working directory for brand assets, logos, prior builds, screenshots, a `brand.md`.
- If they reference public numbers (members, revenue, customers, reviews), search for the current figures. Live, real numbers are a large part of why a page feels credible — see "Receipts" in `references/design-system.md`.

Report back what you found in two or three lines, then run the interview. Do not dump a full audit.

## Phase 2 — Interview

Read `references/interview.md` and ask those questions. Use the `ask_user_input` tool if available; otherwise ask them as a short numbered list in one message — never one question per turn.

The interview is the skill's core IP. Six questions, and none of them are "what colors do you like."

**If the user says "just build it" or "you decide":** don't run a 6-question form at them. Make the calls yourself, state your assumptions in four lines, and build. Let them correct you against something real. A visible wrong guess beats an invisible interrogation.

## Phase 3 — Plan

Produce a **section map** before writing any code. For each section:

```
[section name] — [what the visitor believes after it] — [mechanism] — [assets needed]
```

Then check the map against these:

- Is there exactly one signature moment, and is it in the top third of the page?
- Does any mechanism appear twice? If so, change one.
- Does the page have a calm stretch? A page at constant intensity is exhausting and the loud parts stop reading as loud.
- Could you delete a section and lose nothing? Delete it.

Show the map to the user. One round of correction here saves thirty minutes of rebuilding.

## Phase 4 — Assets

Read `references/asset-brief.md`.

**This skill does not generate assets.** No API key, no provider dependency, no wallet. You write a precise shotlist; the user generates on whatever platform they prefer; you validate what comes back and build with it. They have better tools and better taste than an endpoint call.

The order of preference is always: **real assets the user owns → real assets you can find → generated.** A real, slightly imperfect photo of the actual team beats a flawless generated one every time, because the visitor can tell, and on a trust-driven page that is the whole ballgame.

The handoff:

1. Write `ASSETS.md` at the project root — a numbered shotlist with a job, a prompt, a spec, and a target filename per asset. Three to six entries. A shotlist of twelve means you skipped looking for real assets.
2. Tell the user to drop files into `assets/raw/` matching those filenames, and **stop**. Don't build placeholder sections while waiting.
3. When they say they're done, validate:

```bash
python scripts/check_assets.py ./assets/raw --brief ./ASSETS.md
```

This reports resolution, duration and fps, flags missing files, and **detects scene cuts in video**. A clip with a cut cannot be scrubbed — the frame sequence will appear to jump and the section reads as broken. Catching it here instead of after the build is the difference between a five-minute fix and a rebuild. Exit code 2 means blockers; do not proceed past them.

4. Then run `scripts/frames.py` on each video asset and continue to phase 5.

If the user has no assets and no way to generate any, say so and build a zero-asset page — `counter`, `drawPath`, `bloom`, `typewrite`, `rail` and deliberate absence need no imagery and will beat a page padded with generated stock. Don't push them toward a paid API.

## Phase 5 — Build

- Copy `assets/scrollkit.js` into the project. It is dependency-free — no GSAP license question, nothing to install, ~7KB. Read its header comment for the API.
- Read `references/design-system.md` and commit to a token set before writing components.
- Build the signature section first and look at it. If it doesn't land, the rest of the page won't save it.

Standing technical requirements:

- Every scroll binding runs through `requestAnimationFrame`, never directly in the scroll handler.
- `prefers-reduced-motion: reduce` collapses every scrubbed section to its final state. Scrollkit does this for you; don't defeat it.
- Frame sequences preload before the section is reachable, and degrade to a static poster below 768px unless the user explicitly wants the weight on mobile.
- Pinned sections need a real fallback on short viewports — a pin taller than the viewport traps the user.
- Nothing above the fold waits on a 20MB download to render.

## Phase 6 — Verify

Read `references/verification.md` and run it. Screenshot at scroll depths, inspect the frames yourself, fix what's broken, then hand back.

Tell the user what you checked and what you found. "I verified it" with no findings usually means you didn't look.

---

## When the user gives feedback

They will say things like "the hero feels bland" and "this scrolls too fast." That is good feedback, not vague feedback — it is about *feel*, which is the right axis for this work.

- "Bland" almost always means *no mechanism*, not *wrong colors*. Check whether that section is actually bound to anything.
- "Too fast" means the scroll distance driving the animation is too short. Increase the section's height; don't slow the easing.
- "Too much" means you broke rule 1 and have more than one signature moment.

Change what they asked for and one adjacent thing you think is wrong, and say which one was your call. Don't silently redesign around them.

## Reference files

- `references/interview.md` — the six questions and how to read the answers
- `references/motion-mechanisms.md` — the decision table, when each mechanism wins, implementation recipes
- `references/asset-brief.md` — the shotlist format, prompt rules, style registers, zero-asset fallback
- `references/design-system.md` — tokens, typography, copy, and the specific defaults to avoid
- `references/verification.md` — the screenshot QA pass
- `assets/scrollkit.js` — the scroll binding library
- `scripts/check_assets.py` — validate a dropped asset folder; detects scene cuts
- `scripts/frames.py` — video → optimized frame sequence + manifest
- `scripts/verify.py` — Playwright scroll-depth screenshot capture

No script in this skill requires an API key or a network connection. `ffmpeg` and (for verification) `playwright` are the only dependencies.
