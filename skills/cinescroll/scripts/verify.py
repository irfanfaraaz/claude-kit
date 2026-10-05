#!/usr/bin/env python3
"""
Capture a built page at multiple scroll depths and viewport widths, so the
motion can be inspected visually rather than assumed to work.

    python verify.py http://localhost:3000 ./verify \
        --depths 0,10,20,30,40,50,60,70,80,90,100 \
        --widths 1440,768,390

Writes <outdir>/<width>/depth_XXX.png plus report.json (console errors,
failed requests, total bytes transferred).

Requires: pip install playwright && playwright install chromium
"""
import argparse
import json
import os
import sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("outdir")
    ap.add_argument("--depths", default="0,10,25,40,55,70,85,100")
    ap.add_argument("--widths", default="1440,768,390")
    ap.add_argument("--settle", type=int, default=500,
                    help="ms to wait after each scroll before capturing")
    ap.add_argument("--height", type=int, default=900)
    args = ap.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright not installed. run:\n"
              "  pip install playwright && playwright install chromium",
              file=sys.stderr)
        sys.exit(1)

    depths = [int(d) for d in args.depths.split(",")]
    widths = [int(w) for w in args.widths.split(",")]
    os.makedirs(args.outdir, exist_ok=True)

    report = {"url": args.url, "viewports": {}}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in widths:
            errors, failed, transferred = [], [], [0]

            ctx = browser.new_context(
                viewport={"width": width, "height": args.height},
                device_scale_factor=1,
            )
            page = ctx.new_page()
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("requestfailed",
                    lambda r: failed.append({"url": r.url, "reason": r.failure}))

            def on_response(resp):
                try:
                    cl = resp.headers.get("content-length")
                    if cl:
                        transferred[0] += int(cl)
                except Exception:
                    pass

            page.on("response", on_response)

            page.goto(args.url, wait_until="networkidle", timeout=60000)
            page.wait_for_timeout(1200)  # let fonts and first frames settle

            wdir = os.path.join(args.outdir, str(width))
            os.makedirs(wdir, exist_ok=True)

            total = page.evaluate(
                "() => document.documentElement.scrollHeight - window.innerHeight"
            )

            for d in depths:
                page.evaluate(
                    "y => window.scrollTo({top: y, behavior: 'instant'})",
                    int(total * d / 100),
                )
                page.wait_for_timeout(args.settle)
                page.screenshot(path=os.path.join(wdir, f"depth_{d:03d}.png"))

            # Horizontal overflow check
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > window.innerWidth + 1"
            )

            report["viewports"][str(width)] = {
                "scroll_height": total + args.height,
                "horizontal_overflow": overflow,
                "console_errors": errors[:25],
                "failed_requests": failed[:25],
                "approx_bytes": transferred[0],
                "screenshots": [f"{width}/depth_{d:03d}.png" for d in depths],
            }
            print(f"{width}px  {len(depths)} shots  "
                  f"{transferred[0]/1024/1024:.1f}MB  "
                  f"errors={len(errors)}  overflow={overflow}")
            ctx.close()
        browser.close()

    with open(os.path.join(args.outdir, "report.json"), "w") as fh:
        json.dump(report, fh, indent=2)
    print(f"\nreport: {os.path.join(args.outdir, 'report.json')}")
    print("Now OPEN the screenshots and look at them. "
          "Consecutive depths in a scrubbed section must differ.")


if __name__ == "__main__":
    main()
