---
name: video-generator
description: AI video production workflow using Remotion. Use when creating promotional videos, product demos, social media videos, animated explainers, or programmatic motion graphics. Triggers on requests for promo videos, app demos, landing page videos, YouTube intros, or short films. Produces polished motion graphics, not slideshows. Works with remotion-best-practices for Remotion API details.
metadata:
  tags: remotion, video, motion-graphics, firecrawl, cloudflare-tunnel
  related-skills: remotion-best-practices
---

# Video Generator (Remotion)

Create professional motion graphics videos programmatically with React and Remotion. **When implementing Remotion code, read the remotion-best-practices skill and relevant rule files** (e.g. `rules/transitions.md`, `rules/timing.md`, `rules/sequencing.md`, `rules/animations.md`) for API details and patterns.

## Default Workflow (ALWAYS follow)

1. **Scrape brand data** (if featuring a product) using Firecrawl — see [references/brand-to-remotion.md](references/brand-to-remotion.md).
2. **Create the project** in `output/<project-name>/`.
3. **Build all scenes** with proper motion graphics (use [references/scene-breakdown-template.md](references/scene-breakdown-template.md) before coding).
4. **Install dependencies**: `npm install`.
5. **Fix package.json scripts** to use `npx remotion` (not `bun`):
   ```json
   "scripts": {
     "dev": "npx remotion studio",
     "build": "npx remotion bundle"
   }
   ```
6. **Start Remotion Studio** in background: `cd output/<project-name> && npm run dev`. Wait for "Server ready" on port 3000.
7. **Expose via Cloudflare tunnel**: `bash skills/cloudflare-tunnel/scripts/tunnel.sh start 3000` (or `scripts/remotion.sh tunnel 3000` if available).
8. **Send the user the public URL**. They preview, request changes; you edit source files (Remotion hot-reloads).
9. **Before delivering**, run [references/quality-checklist.md](references/quality-checklist.md).
10. **Render** only when user explicitly asks to export: `npx remotion render CompositionName out/video.mp4`.

## Quick Start

```bash
cd output && npx --yes create-video@latest my-video --template blank
cd my-video && npm install
npm install lucide-react
# Fix package.json scripts: use npx remotion, not bun
npm run dev
# In another terminal: bash skills/cloudflare-tunnel/scripts/tunnel.sh start 3000
```

## Remotion Implementation

- **API usage**: Use remotion-best-practices for `interpolate`, `spring`, `Sequence`, `AbsoluteFill`, trimming, transitions. Read `rules/timing.md`, `rules/transitions.md`, `rules/sequencing.md`, `rules/compositions.md` as needed.
- **Reusable components**: See [references/components.md](references/components.md).
- **Composition patterns**: See [references/composition-patterns.md](references/composition-patterns.md).

## Motion Graphics Principles

### AVOID (slideshow patterns)

- Fading to black between scenes
- Centered text on solid backgrounds only
- Same transition for every scene
- Linear/robotic animations
- Static screens
- Presets like `slideLeft`, `slideRight`, `crossDissolve`, `fadeBlur` for everything
- **Never use emoji for icons** — use Lucide React (`npm install lucide-react`)

### PURSUE (motion graphics)

- Overlapping transitions (next scene starts before current ends)
- Layered compositions (background / midground / foreground)
- Spring physics for organic motion — see remotion-best-practices `rules/timing.md`
- Varied timing (2–5s scenes, mixed rhythms)
- Continuous visual elements across scenes
- Custom transitions: clipPath, 3D transforms, morphs — see remotion-best-practices `rules/transitions.md`
- Lucide React for all icons

## Transition Techniques

1. **Morph/Scale** — Element scales up to fill screen, becomes next scene's background.
2. **Wipe** — Colored shape sweeps across, revealing next scene.
3. **Zoom-through** — Camera pushes into element, emerges into new scene.
4. **Clip-path reveal** — Circle/polygon grows from point to reveal.
5. **Persistent anchor** — One element stays while surroundings change (implement with `useCurrentFrame` + `interpolate` per scene ranges).
6. **Directional flow** — Scene 1 exits right, Scene 2 enters from right.
7. **Split/unfold** — Screen divides, panels slide apart.
8. **Perspective flip** — Scene rotates on Y-axis in 3D.

## Animation Timing Reference

```tsx
// Seconds
const timing = {
  micro: 0.1 - 0.2,
  snappy: 0.2 - 0.4,
  standard: 0.5 - 0.8,
  dramatic: 1.0 - 1.5,
};
// Spring configs (use with remotion's spring())
const springs = {
  snappy: { stiffness: 400, damping: 30 },
  bouncy: { stiffness: 300, damping: 15 },
  smooth: { stiffness: 120, damping: 25 },
};
```

## Visual Style

- **Typography**: One display font + one body font max; massive headlines, tight tracking; keep text SHORT.
- **Colors**: Use brand colors from Firecrawl scrape as primary palette. Avoid purple/indigo gradients unless brand or user requests. Prefer simple backgrounds (single dark tone or subtle gradient).
- **Layout**: Asymmetric layouts, off-center type, edge-aligned elements, generous whitespace. Depth sparingly (e.g. one backdrop blur or gradient).

## Scene Management Pattern

```tsx
const SCENE_DURATIONS: Record<string, number> = {
  intro: 3000,
  problem: 4000,
  solution: 3500,
  features: 5000,
  cta: 3000,
};
// Sequences with overlap (see remotion-best-practices rules/sequencing.md)
<Sequence from={0} durationInFrames={90}><IntroScene /></Sequence>
<Sequence from={80} durationInFrames={120}><FeatureScene /></Sequence>
```

## File Structure

```
output/<project-name>/
├── src/
│   ├── Root.tsx
│   ├── index.ts
│   ├── index.css
│   ├── MyVideo.tsx
│   └── scenes/
├── public/
│   ├── images/brand/   # Firecrawl assets
│   └── audio/
├── remotion.config.ts
└── package.json
```

## Scripts

- **Firecrawl**: `bash scripts/firecrawl.sh "https://example.com"` — requires `FIRECRAWL_API_KEY` in `.env`. Returns brandName, tagline, colors, logoUrl, etc. Map to Remotion per [references/brand-to-remotion.md](references/brand-to-remotion.md).
- **Remotion**: `scripts/remotion.sh init <name>` | `render <dir> [comp] [out]` | `still` | `preview` | `list` | `upgrade`.
- **Tunnel**: `bash skills/cloudflare-tunnel/scripts/tunnel.sh start 3000` (status, list, stop).

## Implementation Steps (checklist)

1. Firecrawl brand scrape (if product).
2. Complete scene breakdown using [references/scene-breakdown-template.md](references/scene-breakdown-template.md).
3. Director's treatment + visual direction (colors, fonts, style).
4. Plan assets (user + generated + brand scrape).
5. Define durations; build persistent background layer; build each scene with enter/exit.
6. Open with hook; develop narrative; strong ending.
7. Start Remotion Studio; expose via tunnel; send URL.
8. Run [references/quality-checklist.md](references/quality-checklist.md); iterate; render only when user asks to export.

## Error Recovery

- Studio won't start: run `npm install`, ensure scripts use `npx remotion`.
- Tunnel fails: check port 3000 is free; run `tunnel.sh status 3000`.
