#!/usr/bin/env bash
# Build an HTML player page from categorized audio directories
# Usage: player.sh <base_dir> <output_html>
# Expected structure: <base_dir>/music/*.mp3, <base_dir>/sfx/*.mp3, <base_dir>/voice/*.mp3

set -euo pipefail

BASE_DIR="${1:?Usage: player.sh <base_dir> <output_html>}"
OUTPUT_HTML="${2:?Output HTML path required}"

TRACKS_JSON="{";
FIRST_CAT=true

for CATEGORY in music sfx voice; do
  DIR="$BASE_DIR/$CATEGORY"
  [[ -d "$DIR" ]] || continue

  mapfile -d '' MP3_FILES < <(find "$DIR" -maxdepth 1 -name "*.mp3" -print0 | sort -z)
  [[ ${#MP3_FILES[@]} -eq 0 ]] && continue

  $FIRST_CAT || TRACKS_JSON+=","; FIRST_CAT=false
  TRACKS_JSON+="\"$CATEGORY\":["

  FIRST=true
  for f in "${MP3_FILES[@]}"; do
    BASENAME=$(basename "$f")
    DISPLAY=$(echo "$BASENAME" | sed 's/-[0-9]*\.mp3$//' | sed 's/-/ /g' | sed 's/\b\(\w\)/\u\1/g')
    REL_PATH=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], os.path.dirname(sys.argv[2])))" "$f" "$OUTPUT_HTML")
    $FIRST || TRACKS_JSON+=","; FIRST=false
    TRACKS_JSON+="{\"name\":\"$DISPLAY\",\"file\":\"$REL_PATH\"}"
  done
  TRACKS_JSON+="]"
done

TRACKS_JSON+="}"

cat > "$OUTPUT_HTML" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Audio Preview</title>
<style>
  body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; background:#050816; color:#e5e7eb; margin:0; padding:24px; }
  .container { max-width:960px; margin:0 auto; }
  h1 { font-size:28px; margin-bottom:8px; }
  p { margin-top:0; margin-bottom:16px; color:#9ca3af; }
  .category { margin-top:24px; padding:16px; border-radius:12px; background:#020617; border:1px solid #111827; }
  .category h2 { margin-top:0; margin-bottom:8px; font-size:20px; }
  .pill { display:inline-block; padding:2px 10px; border-radius:9999px; font-size:12px; margin-left:8px; }
  .pill-music { background:#065f46; color:#bbf7d0; }
  .pill-sfx { background:#854d0e; color:#facc15; }
  .pill-voice { background:#1d4ed8; color:#bfdbfe; }
  .track { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-top:1px solid #111827; }
  .track:first-child { border-top:none; }
  .track-info { flex:1; margin-right:12px; }
  .track-name { font-size:14px; }
  .controls { display:flex; align-items:center; gap:8px; }
  button { background:#111827; color:#e5e7eb; border:1px solid #1f2937; border-radius:9999px; padding:4px 10px; font-size:12px; cursor:pointer; }
  button:hover { background:#1f2937; }
  .progress { width:160px; height:4px; border-radius:9999px; background:#020617; overflow:hidden; }
  .progress-bar { height:100%; width:0; background:#22c55e; transition:width 0.1s linear; }
</style>
</head>
<body>
<div class="container">
  <h1>Audio Preview</h1>
  <p>Click play to preview tracks. Only one track plays at a time.</p>
  <div id="categories"></div>
</div>
<script>
HTMLEOF

echo "const trackData = $TRACKS_JSON;" >> "$OUTPUT_HTML"

cat >> "$OUTPUT_HTML" << 'HTMLEOF2'
(function() {
  const categoriesEl = document.getElementById('categories');
  const accent = { music: 'pill-music', sfx: 'pill-sfx', voice: 'pill-voice' };
  let currentAudio = null;
  let currentBar = null;

  function stopCurrent() {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if (currentBar) { currentBar.style.width = '0%'; }
    currentAudio = null;
    currentBar = null;
  }

  function render() {
    Object.keys(trackData).forEach(cat => {
      const tracks = trackData[cat];
      if (!tracks || !tracks.length) return;
      const catDiv = document.createElement('div');
      catDiv.className = 'category';
      const h2 = document.createElement('h2');
      h2.textContent = cat === 'sfx' ? 'Sound Effects' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const pill = document.createElement('span');
      pill.className = 'pill ' + (accent[cat] || '');
      pill.textContent = cat.toUpperCase();
      h2.appendChild(pill);
      catDiv.appendChild(h2);

      tracks.forEach(t => {
        const row = document.createElement('div');
        row.className = 'track';
        const info = document.createElement('div');
        info.className = 'track-info';
        const name = document.createElement('div');
        name.className = 'track-name';
        name.textContent = t.name;
        info.appendChild(name);

        const controls = document.createElement('div');
        controls.className = 'controls';

        const btn = document.createElement('button');
        btn.textContent = 'Play';

        const progress = document.createElement('div');
        progress.className = 'progress';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        progress.appendChild(bar);

        const audio = new Audio(t.file);

        btn.addEventListener('click', () => {
          if (audio === currentAudio && !audio.paused) {
            audio.pause();
            btn.textContent = 'Play';
            return;
          }
          stopCurrent();
          currentAudio = audio;
          currentBar = bar;
          audio.play();
          btn.textContent = 'Pause';
        });

        audio.addEventListener('timeupdate', () => {
          if (!audio.duration) return;
          const pct = (audio.currentTime / audio.duration) * 100;
          bar.style.width = pct + '%';
        });

        audio.addEventListener('ended', () => {
          if (btn) btn.textContent = 'Play';
          if (bar) bar.style.width = '0%';
          if (audio === currentAudio) { currentAudio = null; currentBar = null; }
        });

        controls.appendChild(btn);
        controls.appendChild(progress);
        row.appendChild(info);
        row.appendChild(controls);
        catDiv.appendChild(row);
      });

      categoriesEl.appendChild(catDiv);
    });
  }

  render();
})();
</script>
</body>
</html>
HTMLEOF2

TOTAL=0
for cat in music sfx voice; do
  d="$BASE_DIR/$cat"
  [[ -d "$d" ]] && TOTAL=$((TOTAL + $(find "$d" -maxdepth 1 -name "*.mp3" | wc -l)))
done

echo "Player built: $OUTPUT_HTML ($TOTAL tracks)" >&2
echo "$OUTPUT_HTML"
