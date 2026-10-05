#!/usr/bin/env bash
# ElevenLabs Music/Sound Generation
# Usage: generate.sh <output_dir> <prompt> [duration_seconds] [prompt_influence]
# Generates an MP3 and prints the file path.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE_DIR="$(dirname "$(dirname "$SKILL_DIR")")"

# Load .env from workspace root if present
if [[ -f "$WORKSPACE_DIR/.env" ]]; then
  set -a; source "$WORKSPACE_DIR/.env"; set +a
fi

API_KEY="${ELEVENLABS_API_KEY:?ELEVENLABS_API_KEY not set in .env or environment}"
OUTPUT_DIR="${1:?Usage: generate.sh <output_dir> <prompt> [duration_seconds] [prompt_influence]}"
PROMPT="${2:?Prompt required}"
DURATION="${3:-}"
INFLUENCE="${4:-0.3}"

mkdir -p "$OUTPUT_DIR"

JSON=$(python3 -c "
import json, sys
text = sys.argv[1]
inf = float(sys.argv[2])
val = sys.argv[3]
obj = { 'text': text, 'prompt_influence': inf }
if val:
    obj['duration_seconds'] = float(val)
print(json.dumps(obj))
" "$PROMPT" "$INFLUENCE" "$DURATION")

SAFE_NAME=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | head -c 60)
TIMESTAMP=$(date +%s)
FILENAME="${SAFE_NAME}-${TIMESTAMP}.mp3"
FILEPATH="${OUTPUT_DIR}/${FILENAME}"

echo "Generating: $PROMPT" >&2

HTTP_CODE=$(curl -s -w "%{http_code}" \
  -X POST "https://api.elevenlabs.io/v1/sound-generation" \
  -H "xi-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  -o "$FILEPATH")

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "ERROR: API returned $HTTP_CODE" >&2
  cat "$FILEPATH" >&2 || true
  rm -f "$FILEPATH"
  exit 1
fi

FILE_SIZE=$(wc -c < "$FILEPATH" | tr -d ' ')
echo "Generated: $FILEPATH ($FILE_SIZE bytes)" >&2
echo "$FILEPATH"
