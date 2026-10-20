---
name: brag-gate
description: "Makes one 20-30 s launch video for a project by combining /brag (story, music, share copy), /iso-glow (glowing flow along wires), /anatomy (the idea as a real isometric machine) and /anatomy-reveal (that machine coming apart and back together), all in one dark look with one tasteful accent colour. Use when the user types /brag-gate, or asks for a launch video that combines brag with anatomy, anatomy-reveal or iso-glow."
argument-hint: "[project dir or URL] [--accent sodium|ember|verdigris|brass] [--duration 20-30] [--format landscape|vertical|square]"
---

# Brag gate

This skill picks which of the 4 skills a project needs, gives them one shared look, and joins their scenes into one video. The other skills do the drawing. This one keeps them looking like one film.

## Rules for every run

1. **One look for every scene.** Write `brag-output/work/look.css` first (references/look.md) and load it in every scene page. Mixed looks make the result read as 4 videos stitched together.
2. **Dark, warm and one accent.** No purple-to-blue gradients, no neon cyan on navy, no second accent colour. Generic "AI" colours make a project look generated, not built. The full list of banned and allowed colours is in references/look.md.
3. **The accent is the token, the signal or the thing that moves.** Only what is live glows. If everything glows, nothing does.
4. **Every frame is a pure function of time.** Each scene page exposes `frame(t)`. All scenes are captured at the same size and fps with the same capture script, so the cuts match.
5. **This look overrides the parts.** `/anatomy-reveal` defaults to white paper: use the kit's dark theme. `/iso-glow` forbids headless browsers for its interactive page, but the video needs frame capture, so capture its `frame(t)` page like every other scene.
6. **Write only to `brag-output/`.** Keep frames, scripts and stems in `brag-output/work/`. Never commit `brag-output/`.

## Pick the pieces

Not every project needs all 4. Choose from what the project actually does.

| Piece | Use it for | Skip it when |
|---|---|---|
| `/brag` (on Opus 5.5 it hands off to `/brag-slim`) | Always: story, hook, real UI or terminal, music, share copy, final render | Never |
| `/iso-glow` | Something travels between parts: a token, a request, a signal, a file | Nothing moves between parts |
| `/anatomy` | Pick the physical object whose working *is* the idea (its "object is the explanation" table) | The real UI already explains it in one shot |
| `/anatomy-reveal` | The object has parts worth naming: explode, show each check, snap back | Only one part matters |

Size an anatomy object to its shot. An 8-10 s reveal needs 30-60 parts, not a 150-part Hero.

## Workflow

Copy this checklist and tick it off:

```text
Brag gate progress:
- [ ] 1 Inspect the project and pick the pieces
- [ ] 2 Write look.css
- [ ] 3 Write brag-plan.md
- [ ] 4 Build each scene
- [ ] 5 Check stills of every scene and cut
- [ ] 6 Render, add audio, set the poster
- [ ] 7 Deliver
```

**1. Inspect.** Follow `/brag` step 1 (Inspect): find what it is, who it is for, and the entry → key action → result flow. Then pick the pieces with the table above and pick the machine with `/anatomy`'s concept table. Done when you can state the hook, the flow and the machine in one line each.

**2. Look.** Choose the accent for the subject (references/look.md) and write `look.css`. Done when the file holds every colour, font and timing token the scenes use.

**3. Plan.** Write `brag-output/brag-plan.md` in `/brag`'s plan format. Each scene names the piece that draws it. Scene durations must add up to the target (20-30 s). Done when the plan has a hook, the flow, the reveal and an ending with the install line or link.

**4. Build.** Build each scene with its skill: invoke it with the Skill tool and follow its own steps. Scene pages live in `brag-output/work/<scene>/` and import `look.css`. Use the project's real UI, copy and commands. Invent no numbers or quotes. Done when each scene page renders on its own.

**5. Check.** Capture stills at the start, middle, end and mid-cut of every scene and look at each one. Fix overflow, low contrast, colours outside `look.css` and muddy crossfades. If any still fails, return to step 4.

**6. Render.** Capture every scene at 30 fps, join them with the `ffmpeg` commands in references/look.md, add music and effects from `/brag`'s audio guidance, and put the best settled frame in as frame 0. Done when `brag-output/brag.mp4` plays from start to end.

**7. Deliver.** Follow `/brag`'s deliver step: `brag.mp4`, `brag.jpg`, `share-copy.txt`. Tell the user the angle in one sentence and what you did not check.

## Resources

- [references/look.md](references/look.md) - the palette, fonts and timing tokens, the banned colours, the capture contract and the ffmpeg join commands. Open in steps 2, 5 and 6.
