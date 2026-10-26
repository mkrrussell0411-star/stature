#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO="$ROOT/vendor/tweego/tweego"

if [[ -x "$TWEEGO" ]]; then
  exit 0
fi

mkdir -p "$ROOT/vendor/tweego" "$ROOT/vendor/storyformats"
curl -fsSL -o /tmp/tweego.zip \
  "https://github.com/tmedwards/tweego/releases/download/v2.1.1/tweego-2.1.1-linux-x64.zip"
unzip -o /tmp/tweego.zip -d "$ROOT/vendor/tweego"
chmod +x "$ROOT/vendor/tweego/tweego"

curl -fsSL -o /tmp/sc.zip \
  "https://github.com/tmedwards/sugarcube-2/releases/download/v2.37.3/sugarcube-2.37.3-for-twine-2.1-local.zip"
unzip -o /tmp/sc.zip -d "$ROOT/vendor/storyformats"
cp "$ROOT/vendor/storyformats/sugarcube-2/format.js" \
  "$ROOT/vendor/tweego/storyformats/sugarcube-2/format.js"
