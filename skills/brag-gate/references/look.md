# Look, capture and join

## Contents
- Palette
- Banned colours
- Fonts and timing
- Mapping the look onto each skill
- Capture contract
- Joining scenes and audio

## Palette

Warm near-black, bone-coloured ink, one accent. Warm neutrals read as made by hand; blue-black reads as a template.

```css
/* brag-output/work/look.css */
:root {
  --bg: #0e0d0b;       /* page, never pure #000 */
  --panel: #161410;    /* plates, terminal */
  --deck: #1d1a15;     /* raised faces */
  --detail: #2a261f;   /* grooves, minor lines */
  --line: #3b362e;     /* hairlines */
  --muted: #8b8273;    /* secondary text */
  --ink: #cdc4b3;      /* body text and outlines */
  --ink-hi: #efe8da;   /* headlines, never pure #fff */
  --accent: #f2a541;   /* set from the table below */
  --accent-hi: #ffd08a;
  --accent-dim: #7a5420;
  --font-sans: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --ease: cubic-bezier(.2, .7, .1, 1);
  --whip: .24s;        /* subject change, from /anatomy-reveal */
  --dip: .3s;          /* scene cut: dip through --bg */
}
```

| Accent | `--accent` / `-hi` / `-dim` | Fits |
|---|---|---|
| `sodium` (default) | `#f2a541` / `#ffd08a` / `#7a5420` | Infrastructure, security, databases: a lamp in a server room |
| `ember` | `#e5683c` / `#ffa27c` / `#6e3018` | Speed, compilers, anything "hot" |
| `verdigris` | `#5bb39b` / `#9fe0cb` / `#24584b` | Health, data, calm tools |
| `brass` | `#c8a45a` / `#ecd39a` / `#5e4c27` | Instruments, finance, craft tools |

Use the project's own brand colour instead when it has one and it passes the banned list.

## Banned colours

These make a video look generated:
- purple, violet or indigo as the accent (`#6366f1`, `#8b5cf6` and their neighbours);
- any gradient between two hues, above all purple-to-blue and pink-to-orange;
- neon cyan or electric blue on navy;
- a second accent hue, a rainbow, or green for "success" (show success with a stronger glow of the one accent);
- pure `#000` backgrounds and pure `#fff` text;
- glassmorphism cards, glossy 3D blobs, lens flares.

A scene passes when every colour in it comes from `look.css`.

## Fonts and timing

- IBM Plex Sans for headlines (600) and body (400), IBM Plex Mono for terminals, labels and code. Use the project's own fonts if it has a site. Do not default to Inter, Poppins or Space Grotesk.
- Load fonts from Google Fonts and wait for `document.fonts.ready` before the first frame.
- Text a viewer must read stays settled for 0.3 s per word.
- Cut between scenes with a dip through `--bg` (`--dip`), never a plain crossfade between two busy layouts.

## Mapping the look onto each skill

- **`/iso-glow`:** pass a custom palette `[["Sodium", accent, accent-hi, accent, accent-hi]]` and override its base tokens (`--body --deck --line --detail --ink --ink-hi --panel`) with the values above. Use the dark theme only.
- **`/anatomy` and `/anatomy-reveal`:** build with the kit's dark theme, not the paper look. Set the page background to `--bg`, and colour the one `lit` part with the accent through a scoped rule in `motion/look.css` (`.iso.mo [data-mat="name"]{...}`). Metals stay in their own dark ramps.
- **`/brag` scenes** (terminal, title cards, ending): plain HTML on `--bg` with `look.css`.

## Capture contract

Every scene page follows `/anatomy-reveal`'s film contract, so one renderer captures all of them:

- `window.SIZE = {W, H}` (1920×1080 landscape, 1080×1920 vertical, 1080×1080 square);
- `window.DURATION` in seconds;
- `window.frame(t)` draws time `t` and returns an object (`{}` is fine);
- `window.speed(t, dt)` returns how far the picture moves, for motion blur (`0` for no blur);
- `window.ready = true` after fonts and images load;
- one root element with class `mo`.

Scaffold one `/anatomy-reveal` project in `brag-output/work/reveal/` (it installs `puppeteer-core` and finds Chrome), then render any scene with its scripts:

```bash
node motion/render.mjs stills 0,1,2 out/s --page ../<scene>/index.html --dpr 1
node motion/render.mjs blur out/<scene> --page ../<scene>/index.html --dpr 1 --step 4 --most 40
node motion/encode.mjs out/<scene> out/<scene>.mp4
```

## Joining scenes and audio

Encode each scene at the same size, 30 fps, `yuv420p`. Join them in plan order (each scene already dips to `--bg` at its ends):

```bash
printf "file '%s'\n" s1.mp4 s2.mp4 s3.mp4 s4.mp4 > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy video.mp4
```

Add music from `/brag`'s music folder (`<brag skill dir>/assets/music/`), fading out over the last second:

```bash
ffmpeg -i video.mp4 -i music.mp3 -filter_complex "[1:a]afade=t=out:st=<D-1>:d=1,volume=0.8[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -shortest brag.mp4
```

Then follow `/brag`'s deliver step to put the poster in as frame 0.
