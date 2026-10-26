#!/usr/bin/env bash
# Update a Stature checkout without git (for Termux when git-remote-https is broken).
set -euo pipefail

REPO="${STATURE_GITHUB_REPO:-mkrrussell0411-star/stature}"
BRANCH="${STATURE_GITHUB_BRANCH:-main}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMPDIR:-/tmp}"
ARCHIVE="$TMP/stature-${BRANCH}.tar.gz"
EXTRACT="$TMP/stature-sync-${BRANCH}-$$"

cleanup() {
  rm -rf "$EXTRACT"
}
trap cleanup EXIT

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required (pkg install curl)" >&2
  exit 1
fi
if ! command -v tar >/dev/null 2>&1; then
  echo "tar is required (pkg install tar)" >&2
  exit 1
fi

echo "Downloading https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz"
curl -fsSL -o "$ARCHIVE" \
  "https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz"

mkdir -p "$EXTRACT"
tar -xzf "$ARCHIVE" -C "$EXTRACT"
SRC="$EXTRACT/stature-${BRANCH}"
if [[ ! -d "$SRC" ]]; then
  echo "Unexpected archive layout (missing stature-${BRANCH}/)" >&2
  exit 1
fi

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude node_modules/ \
    --exclude vendor/ \
    --exclude .git/ \
    "$SRC/" "$ROOT/"
else
  echo "rsync not found; using cp (install rsync for cleaner sync: pkg install rsync)" >&2
  find "$ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name vendor ! -name .git -exec rm -rf {} +
  cp -a "$SRC"/. "$ROOT/"
fi

echo "Synced into $ROOT"
echo "Run: npm install && npm test && npm run build"
