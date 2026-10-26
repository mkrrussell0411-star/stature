#!/usr/bin/env bash
# Install or refresh Stature using only curl+tar (no git). Safe to pipe from GitHub:
#   curl -fsSL https://raw.githubusercontent.com/mkrrussell0411-star/stature/main/scripts/termux-curl-install.sh | bash
set -euo pipefail

ROOT="${STATURE_ROOT:-$HOME/stature}"
export STATURE_ROOT="$ROOT"
SCRIPT_DIR="$ROOT/scripts"

if [[ -f "$SCRIPT_DIR/termux-sync-from-github.sh" ]]; then
  bash "$SCRIPT_DIR/termux-sync-from-github.sh"
else
  mkdir -p "$ROOT"
  curl -fsSL -o "$ROOT/termux-sync-from-github.sh" \
    "https://raw.githubusercontent.com/mkrrussell0411-star/stature/main/scripts/termux-sync-from-github.sh"
  bash "$ROOT/termux-sync-from-github.sh"
  rm -f "$ROOT/termux-sync-from-github.sh"
fi

cd "$ROOT"
npm install
npm run build
echo "Built: $ROOT/dist/index.html"
