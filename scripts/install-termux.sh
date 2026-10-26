#!/usr/bin/env bash
# One-shot Termux setup for Stature development on Android.
set -euo pipefail

if ! command -v pkg >/dev/null 2>&1; then
  echo "Run this script inside Termux." >&2
  exit 1
fi

pkg update -y
pkg install -y nodejs-lts curl unzip tar golang which

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm install
npm test
npm run build

echo ""
echo "Done. Preview: npm run dev  then open http://127.0.0.1:4321 in a browser."
