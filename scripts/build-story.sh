#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO="$ROOT/vendor/tweego/tweego"
FORMATS="$ROOT/vendor/storyformats"
TWEEGO_FORMATS="$ROOT/vendor/tweego/storyformats"

mkdir -p "$ROOT/dist"

if [[ ! -x "$TWEEGO" ]]; then
  echo "Tweego missing. Run: npm install" >&2
  exit 1
fi

if [[ ! -d "$TWEEGO_FORMATS" && ! -d "$FORMATS" ]]; then
  echo "Story formats missing. Run: npm install  (or bash scripts/bootstrap-tools.sh)" >&2
  exit 1
fi

# Tell tweego where formats live (required for go-built binary and pkg symlinks).
export TWEEGO_PATH="${TWEEGO_FORMATS}:${FORMATS}"

if ! "$TWEEGO" --list-formats 2>/dev/null | grep -q sugarcube-2; then
  echo "sugarcube-2 not found. Run: npm install" >&2
  "$TWEEGO" --list-formats 2>&1 || true
  exit 1
fi

"$TWEEGO" \
  --format=sugarcube-2 \
  --module="$ROOT/src/js/dist/engine.js" \
  -o "$ROOT/dist/index.html" \
  "$ROOT/src/twee"
