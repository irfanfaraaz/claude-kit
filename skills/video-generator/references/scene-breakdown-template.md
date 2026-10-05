# Scene Breakdown Template

Complete this **before** building scene components. Use it as the single source of truth for the video structure.

## Project Info

- **Working title:**
- **Aspect ratio:** (e.g. 16:9, 9:16)
- **Total duration (seconds):**
- **FPS:** (e.g. 30)
- **Brand/product URL (if any):** (Firecrawl scrape first)

## Director's Treatment

- **Vibe / tone:**
- **Visual style:** (e.g. dark gradient, minimal, bold type)
- **Emotional arc:** (e.g. hook → problem → solution → CTA)

## Scene List

Fill one block per scene. Duration in frames = seconds × fps.

### Scene 1: [Name]

- **Duration (frames):**
- **Description:**
- **On-screen text/copy:**
- **Main visual:**
- **Transition in:** (e.g. scale from center, wipe left)
- **Transition out:**
- **Assets:** (e.g. logo, screenshot, B-roll)

### Scene 2: [Name]

- **Duration (frames):**
- **Description:**
- **On-screen text/copy:**
- **Main visual:**
- **Transition in:**
- **Transition out:**
- **Assets:**

### Scene 3: [Name]

- (repeat as needed)

## Assets Checklist

- [ ] Brand assets from Firecrawl (logo, colors, screenshot)
- [ ] Background music: `public/audio/...`
- [ ] User-provided images/videos (list paths)
- [ ] Any generated assets (describe)

## Duration Summary

| Scene   | Start (frame) | Duration (frames) | End (frame) |
|---------|----------------|-------------------|-------------|
| Scene 1 | 0              | ...               | ...         |
| Scene 2 | (with overlap) | ...               | ...         |

Use this table to set `<Sequence from={...} durationInFrames={...}>` in the main composition.
