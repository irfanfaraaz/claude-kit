#!/usr/bin/env python3
"""
Extract a video into an evenly-spaced, web-optimized frame sequence for scroll scrubbing.

Writes numbered frames plus a manifest.json that scrollkit.js consumes directly.

    python frames.py hero.mp4 ./public/frames/hero --frames 110 --width 1600

Requires ffmpeg on PATH. Pillow optional (used for WebP conversion if ffmpeg
lacks libwebp; ffmpeg handles it natively in most builds).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys


def die(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def probe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        die(f"ffprobe failed: {out.stderr.strip()}")
    return float(out.stdout.strip())


def human(nbytes):
    for unit in ("B", "KB", "MB", "GB"):
        if nbytes < 1024:
            return f"{nbytes:.1f} {unit}"
        nbytes /= 1024
    return f"{nbytes:.1f} TB"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("outdir")
    ap.add_argument("--frames", type=int, default=110,
                    help="frame count (90-120 is the sweet spot)")
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--format", choices=["webp", "jpg", "avif"], default="webp")
    ap.add_argument("--quality", type=int, default=72)
    ap.add_argument("--public-path", default=None,
                    help="URL prefix written into manifest.json "
                         "(defaults to /<basename of outdir>)")
    args = ap.parse_args()

    if not shutil.which("ffmpeg"):
        die("ffmpeg not found on PATH")
    if not os.path.isfile(args.input):
        die(f"no such file: {args.input}")
    if args.frames > 240:
        print("warning: >240 frames adds weight without perceptible smoothness",
              file=sys.stderr)

    os.makedirs(args.outdir, exist_ok=True)
    for f in os.listdir(args.outdir):
        if f.startswith("frame_") or f == "manifest.json":
            os.remove(os.path.join(args.outdir, f))

    duration = probe_duration(args.input)
    fps = args.frames / duration
    ext = args.format
    pattern = os.path.join(args.outdir, f"frame_%04d.{ext}")

    vf = f"fps={fps:.6f},scale={args.width}:-2:flags=lanczos"
    cmd = ["ffmpeg", "-loglevel", "error", "-y", "-i", args.input, "-vf", vf]

    if ext == "webp":
        cmd += ["-c:v", "libwebp", "-quality", str(args.quality), "-compression_level", "5"]
    elif ext == "jpg":
        cmd += ["-q:v", str(max(2, int((100 - args.quality) / 8)))]
    elif ext == "avif":
        cmd += ["-c:v", "libaom-av1", "-crf", str(int((100 - args.quality) / 2)), "-cpu-used", "6"]

    cmd += ["-start_number", "0", pattern]

    print(f"extracting ~{args.frames} frames from {duration:.2f}s ...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die(f"ffmpeg failed: {r.stderr.strip()[:800]}")

    files = sorted(f for f in os.listdir(args.outdir) if f.startswith("frame_"))
    if not files:
        die("no frames produced")

    # Trim or report drift from the requested count.
    if len(files) > args.frames:
        for f in files[args.frames:]:
            os.remove(os.path.join(args.outdir, f))
        files = files[:args.frames]

    total = sum(os.path.getsize(os.path.join(args.outdir, f)) for f in files)
    prefix = args.public_path or ("/" + os.path.basename(os.path.normpath(args.outdir)))
    prefix = prefix.rstrip("/")

    # Read dimensions off the first frame via ffprobe (no Pillow dependency).
    dim = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height",
         "-of", "csv=s=x:p=0", os.path.join(args.outdir, files[0])],
        capture_output=True, text=True,
    ).stdout.strip()
    try:
        w, h = (int(x) for x in dim.split("x"))
    except ValueError:
        w, h = args.width, 0

    manifest = {
        "count": len(files),
        "width": w,
        "height": h,
        "format": ext,
        "bytes": total,
        "poster": f"{prefix}/{files[0]}",
        "frames": [f"{prefix}/{f}" for f in files],
    }

    with open(os.path.join(args.outdir, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, indent=2)

    print(f"  {len(files)} frames  {w}x{h}  {ext}  {human(total)}")
    print(f"  manifest: {os.path.join(args.outdir, 'manifest.json')}")
    if total > 12 * 1024 * 1024:
        print("  NOTE: over 12MB. Cut frame count before cutting resolution.")


if __name__ == "__main__":
    main()
