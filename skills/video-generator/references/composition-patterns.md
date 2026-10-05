# Remotion Composition Patterns (Video Generator)

Video-generator-specific patterns. For full Remotion API detail (durationInFrames, overlap, trimming) see remotion-best-practices `rules/compositions.md`, `rules/sequencing.md`.

## Project Structure

```
output/<project-name>/
├── src/
│   ├── index.ts
│   ├── Root.tsx
│   └── MyVideo/
│       ├── index.tsx
│       └── scenes/
├── public/
├── remotion.config.ts
└── package.json
```

## Root.tsx (Composition)

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ title: "Hello World" }}
    />
  </>
);
```

## Aspect Ratios

- **16:9 (YouTube):** 1920x1080 or 1280x720
- **9:16 (Reels/TikTok/Shorts):** 1080x1920
- **4:5 (Instagram feed):** 1080x1350
- **1:1:** 1080x1080

## Scene Duration Map + Overlapping Sequences

```tsx
const SCENE_DURATIONS: Record<string, number> = {
  intro: 90,    // 3s @ 30fps
  problem: 120,
  solution: 105,
  features: 150,
  cta: 90,
};

// Overlap: next scene starts before previous ends (e.g. 10 frames early)
<AbsoluteFill>
  <AnimatedBackground frame={frame} />
  <Sequence from={0} durationInFrames={90}><IntroScene /></Sequence>
  <Sequence from={80} durationInFrames={120}><FeatureScene /></Sequence>
  <Sequence from={200} durationInFrames={105}><SolutionScene /></Sequence>
</AbsoluteFill>
```

## Key Remotion Imports

```tsx
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
  Img,
  Audio,
  Video,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";
```

## Audio

```tsx
<Audio src={staticFile("audio/bg-music.mp3")} volume={0.35} />
```

## Dynamic Data (delayRender)

```tsx
const [data, setData] = useState(null);
const [handle] = useState(() => delayRender()));

useEffect(() => {
  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      setData(d);
      continueRender(handle);
    });
}, []);
```
