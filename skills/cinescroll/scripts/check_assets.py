#!/usr/bin/env python3
"""
Validate a dropped asset folder against the shotlist in ASSETS.md.

    python check_assets.py ./assets/raw --brief ./ASSETS.md

Reports, per file: resolution, duration, fps, size.
For video, detects scene cuts — a clip with a cut is UNUSABLE for scroll
scrubbing, because the frame sequence will appear to jump/break mid-scrub.
Catching that here saves rebuilding the whole section later.

Requires ffmpeg/ffprobe on PATH. Works with no brief (just audits a folder).
"""
import argparse
import json
import os
import re
import subprocess
import sys

VIDEO_EXT = {".mp4", ".mov", ".webm", ".m4v", ".mkv"}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".svg", ".gif"}


def have(binary):
    from shutil import which
    return which(binary) is not None


def human(n):
    for u in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f}{u}"
        n /= 1024
    return f"{n:.1f}TB"


def probe(path):
    """Return dict with width, height, duration, fps, or {} on failure."""
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,avg_frame_rate:format=duration",
         "-of", "json", path],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        return {}
    try:
        data = json.loads(r.stdout)
        st = (data.get("streams") or [{}])[0]
        num, _, den = (st.get("avg_frame_rate") or "0/1").partition("/")
        fps = float(num) / float(den) if den and float(den) else 0.0
        return {
            "width": st.get("width"),
            "height": st.get("height"),
            "fps": round(fps, 2),
            "duration": float(data.get("format", {}).get("duration") or 0),
        }
    except Exception:
        return {}


def detect_cuts(path, threshold=0.25):
    """Return list of timestamps (s) where a scene change was detected."""
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path,
         "-filter:v", f"select='gt(scene,{threshold})',showinfo",
         "-f", "null", "-"],
        capture_output=True, text=True,
    )
    return [round(float(t), 2)
            for t in re.findall(r"pts_time:([0-9.]+)", r.stderr)]


def parse_brief(path):
    """Pull 'Save as: `path`' entries out of ASSETS.md."""
    if not path or not os.path.isfile(path):
        return []
    text = open(path, encoding="utf-8").read()
    wanted = re.findall(r"\*\*Save as:\*\*\s*`([^`]+)`", text)
    if not wanted:
        wanted = re.findall(r"Save as:\s*`([^`]+)`", text)
    return [os.path.basename(w.strip()) for w in wanted]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--brief", default=None, help="path to ASSETS.md")
    ap.add_argument("--cut-threshold", type=float, default=0.25,
                    help="scene-change sensitivity, 0.2-0.4 (lower = stricter)")
    ap.add_argument("--min-width", type=int, default=1200)
    args = ap.parse_args()

    if not have("ffprobe") or not have("ffmpeg"):
        print("error: ffmpeg/ffprobe not found on PATH", file=sys.stderr)
        sys.exit(1)
    if not os.path.isdir(args.folder):
        print(f"error: no such folder: {args.folder}", file=sys.stderr)
        sys.exit(1)

    present = sorted(f for f in os.listdir(args.folder)
                     if not f.startswith("."))
    wanted = parse_brief(args.brief)

    problems, warnings = [], []
    total = 0

    print(f"\nauditing {args.folder}\n" + "-" * 60)

    for name in present:
        full = os.path.join(args.folder, name)
        if os.path.isdir(full):
            continue
        ext = os.path.splitext(name)[1].lower()
        size = os.path.getsize(full)
        total += size

        if ext in VIDEO_EXT:
            m = probe(full)
            if not m:
                problems.append(f"{name}: unreadable")
                continue
            print(f"{name}\n    {m['width']}x{m['height']}  "
                  f"{m['duration']:.2f}s  {m['fps']}fps  {human(size)}")

            cuts = detect_cuts(full, args.cut_threshold)
            if cuts:
                print(f"    CUTS DETECTED at {cuts}s  -> NOT SCRUBBABLE")
                problems.append(
                    f"{name}: {len(cuts)} scene change(s) at {cuts}s. "
                    "Regenerate with 'single continuous take, camera never cuts'."
                )
            else:
                print("    no cuts — scrubbable")

            if m["width"] and m["width"] < args.min_width:
                warnings.append(f"{name}: {m['width']}px wide, "
                                f"under {args.min_width}px target")
            if m["duration"] > 8:
                warnings.append(f"{name}: {m['duration']:.1f}s is long; "
                                "3-5s gives a tighter frame sequence")
            if m["fps"] and m["fps"] < 24:
                warnings.append(f"{name}: {m['fps']}fps — "
                                "may not have enough source frames")

        elif ext in IMAGE_EXT:
            m = probe(full) if ext != ".svg" else {}
            dims = (f"{m['width']}x{m['height']}"
                    if m.get("width") else "vector")
            print(f"{name}\n    {dims}  {human(size)}")
            if m.get("width") and m["width"] < args.min_width:
                warnings.append(f"{name}: {m['width']}px wide, "
                                f"under {args.min_width}px target")
        else:
            print(f"{name}\n    {human(size)}  (not audited)")

    print("-" * 60)
    print(f"{len(present)} files, {human(total)} total")

    if wanted:
        missing = [w for w in wanted if w not in present]
        extra = [p for p in present if p not in wanted]
        print(f"\nshotlist: {len(wanted) - len(missing)}/{len(wanted)} present")
        if missing:
            problems.append("missing from drop: " + ", ".join(missing))
        if extra:
            print("  not in shotlist (ignored): " + ", ".join(extra))

    if warnings:
        print("\nWARNINGS")
        for w in warnings:
            print(f"  - {w}")

    if problems:
        print("\nBLOCKERS")
        for p in problems:
            print(f"  - {p}")
        print("\nFix these before running frames.py.")
        sys.exit(2)

    print("\nAll clear. Next: scripts/frames.py on each video asset.")


if __name__ == "__main__":
    main()
