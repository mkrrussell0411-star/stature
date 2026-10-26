#!/usr/bin/env bash
# Termux install: tries curl/wget, then Node HTTPS (when curl is broken).
set -euo pipefail

ROOT="${STATURE_ROOT:-$HOME/stature}"
URL="https://raw.githubusercontent.com/mkrrussell0411-star/stature/main/scripts/termux-node-sync.mjs"
LOCAL="$ROOT/scripts/termux-node-sync.mjs"

mkdir -p "$ROOT/scripts"

download_script() {
  if command -v curl >/dev/null 2>&1 && curl -fsSL -o "$LOCAL" "$URL" 2>/dev/null; then
    return 0
  fi
  if command -v wget >/dev/null 2>&1 && wget -q -O "$LOCAL" "$URL" 2>/dev/null; then
    return 0
  fi
  return 1
}

if [[ -f "$LOCAL" ]]; then
  :
elif download_script; then
  :
else
  echo "curl/wget failed. Paste the Node bootstrap from docs/TERMUX.md (Node-only block)." >&2
  exit 1
fi

node "$LOCAL"
cd "$ROOT"
npm install
npm run build
echo "Done: $ROOT/dist/index.html"
