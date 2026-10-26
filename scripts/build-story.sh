#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO="$ROOT/vendor/tweego/tweego"
FORMATS="$ROOT/vendor/storyformats"

mkdir -p "$ROOT/dist"

"$TWEEGO" \
  --format=sugarcube-2 \
  --module="$ROOT/src/js/dist/engine.js" \
  -o "$ROOT/dist/index.html" \
  "$ROOT/src/twee"
