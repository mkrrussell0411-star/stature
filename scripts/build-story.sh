#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO="$ROOT/vendor/tweego/tweego"
FORMATS="$ROOT/vendor/storyformats"
TWEEGO_FORMATS="$ROOT/vendor/tweego/storyformats"
SC_FORMAT="$TWEEGO_FORMATS/sugarcube-2/format.js"

mkdir -p "$ROOT/dist"

if [[ ! -x "$TWEEGO" ]]; then
  echo "Tweego missing. Run: npm install" >&2
  exit 1
fi

if [[ ! -f "$SC_FORMAT" && ! -f "$FORMATS/sugarcube-2/format.js" ]]; then
  echo "SugarCube format missing. Run: npm run setup:formats" >&2
  exit 1
fi

export TWEEGO_PATH="${TWEEGO_FORMATS}:${FORMATS}"

"$TWEEGO" \
  --format=sugarcube-2 \
  --module="$ROOT/src/js/dist/engine.js" \
  -o "$ROOT/dist/index.html" \
  "$ROOT/src/twee"

echo "Wrote $ROOT/dist/index.html"
