# Step 5: Build (Remotion Workflow)

Moved here word for word from SKILL.md, to keep SKILL.md short.

### Step 5: Build (Remotion Workflow)

Read [references/remotion-quickstart.md](references/remotion-quickstart.md) for the full technical reference based on the [official Remotion skills](https://github.com/remotion-dev/skills) (38 rule modules covering animations, transitions, text, charts, audio, 3D, captions, and more).

**0. Install Official Remotion Skills (one-time):**
```bash
npx skills add remotion-dev/skills
```
This installs 38 rule modules to `~/.claude/skills/` — giving Claude the complete Remotion knowledge base for all future sessions. The official skills cover: animations, timing, transitions, light leaks, audio, SFX, captions, voiceover, charts, 3D, fonts, Tailwind, Lottie, maps, and more.

**1. Scaffold:**
```bash
# If no Remotion project exists:
npx create-video@latest marketing-video
cd marketing-video && npm install

# Install key packages for cinematic quality:
npx remotion add @remotion/transitions
npx remotion add @remotion/light-leaks
npx remotion add @remotion/google-fonts
npx remotion add @remotion/noise
npx remotion add @remotion/captions
npx remotion add @remotion/media-utils
```

**2. Create compositions** based on the video type:

| Composition | Use Case | Dimensions | Duration |
|------------|----------|------------|----------|
| `ProductDemo.tsx` | Full product walkthrough | 1920x1080 | 30-90s |
| `SocialClip.tsx` | TikTok/Reels vertical | 1080x1920 | 15-60s |
| `TwitterClip.tsx` | Twitter/X landscape | 1920x1080 | 15-30s |
| `PitchVideo.tsx` | Pitch deck as video | 1920x1080 | 1-3min |
| `SquareClip.tsx` | Instagram feed | 1080x1080 | 15-30s |

**3. Structure each composition using Sequences:**

For a 30s product demo (900 frames @ 30fps):
```
Scene 1: Hook — metric or bold claim (0-90 frames, 3s)
Scene 2: Problem — the pain point (90-240, 5s)
Scene 3: Demo — product in action (240-660, 14s)
Scene 4: Proof — metrics/social proof (660-810, 5s)
Scene 5: CTA — try it now (810-900, 3s)
```

**4. Apply advanced techniques** from the Remotion skills reference:

- **Animations:** All animation via `useCurrentFrame()` + `interpolate()` or `spring()`. NEVER use CSS transitions or Tailwind `animate-*` classes.
- **Default spring: `{damping: 200}`** — No bounce. Bounce (`damping: 8`) is a deliberate choice, not a default.
- **Transitions:** Use `<TransitionSeries>` with `fade()`, `slide()`, `wipe()`, `clockWipe()` for scene changes
- **Light leaks:** Use `@remotion/light-leaks` as `<TransitionSeries.Overlay>` for cinematic scene transitions
- **Text animations:** Typewriter (string slicing, never per-character opacity), word-highlight for key phrases
- **Charts:** Animated bar charts with staggered spring entrance, pie charts with stroke-dashoffset, line charts with `evolvePath`
- **Sound effects:** Built-in SFX from `@remotion/sfx`: whoosh, whip, ding, switch, shutter
- **Captions:** TikTok-style captions with `createTikTokStyleCaptions()` and per-word highlighting
- **Voiceover:** ElevenLabs TTS integration with `calculateMetadata` for dynamic duration
- **Noise:** Use `@remotion/noise` for organic floating motion on resting elements (prevents "dead" static look)
- **Color grading:** Use `interpolateColors()` for dynamic background mood shifts across scenes
- **Premounting:** Always use `<Sequence premountFor={1 * fps}>` to preload content
- **Always clamp:** `extrapolateRight: "clamp"` on every `interpolate()` call

**5. Quality gate — before rendering, verify against [references/professional-quality-guide.md](references/professional-quality-guide.md):**
- [ ] Consistent animation vocabulary (max 2-3 techniques, not a different one per scene)
- [ ] Staggered element entrances (10-20 frame gaps, not everything at once)
- [ ] Dwell time on key content (enter, hold, exit — not instant in/out)
- [ ] No linear interpolation without easing (use spring or Easing.inOut)
- [ ] Light leak overlays at key scene transitions
- [ ] Audio integrated (at minimum: SFX on transitions and metric reveals)
- [ ] Mobile safe zones respected for vertical formats (150px top, 170px bottom)
- [ ] Headlines 56px+, body 36px+, nothing under 28px

**6. Render:**
```bash
npx remotion studio          # Preview in browser

# Draft (fast iteration)
npx remotion render ProductDemo out/draft.mp4 --codec h264 --crf 23

# Production quality (final delivery)
npx remotion render ProductDemo out/product-demo.mp4 --codec h264 --crf 18 --color-space bt709
npx remotion render SocialClip out/social-clip.mp4 --codec h264 --crf 18 --color-space bt709
npx remotion render TwitterClip out/twitter-clip.mp4 --codec h264 --crf 18 --color-space bt709

# Multi-core (faster render)
npx remotion render ProductDemo out/fast.mp4 --concurrency 8 --crf 18
```
