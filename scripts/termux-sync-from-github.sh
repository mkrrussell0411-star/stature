#!/usr/bin/env bash
# Update Stature without git (Termux when git-remote-https / libngtcp2 is broken).
set -euo pipefail

REPO="${STATURE_GITHUB_REPO:-mkrrussell0411-star/stature}"
BRANCH="${STATURE_GITHUB_BRANCH:-main}"
ROOT="${STATURE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
TMP="${TMPDIR:-/tmp}"
ARCHIVE="$TMP/stature-${BRANCH}.tar.gz"
EXTRACT="$TMP/stature-extract-$$"
NM_BACKUP="$TMP/stature-nm-$$"
VENDOR_BACKUP="$TMP/stature-vendor-$$"

cleanup() {
  rm -rf "$EXTRACT" "$ARCHIVE"
  rm -rf "$NM_BACKUP" "$VENDOR_BACKUP"
}
trap cleanup EXIT

command -v curl >/dev/null 2>&1 || { echo "pkg install -y curl" >&2; exit 1; }
command -v tar >/dev/null 2>&1 || { echo "pkg install -y tar" >&2; exit 1; }

mkdir -p "$ROOT"

echo "Downloading github.com/${REPO} (${BRANCH})…"
curl -fsSL -o "$ARCHIVE" \
  "https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz"

mkdir -p "$EXTRACT"
tar -xzf "$ARCHIVE" -C "$EXTRACT"
SRC="$EXTRACT/stature-${BRANCH}"
[[ -d "$SRC" ]] || { echo "Bad archive layout" >&2; exit 1; }

[[ -d "$ROOT/node_modules" ]] && mv "$ROOT/node_modules" "$NM_BACKUP"
[[ -d "$ROOT/vendor" ]] && mv "$ROOT/vendor" "$VENDOR_BACKUP"

echo "Merging into $ROOT …"
for entry in "$SRC"/* "$SRC"/.[!.]* "$SRC"/..?*; do
  [[ -e "$entry" ]] || continue
  base="$(basename "$entry")"
  [[ "$base" == ".git" ]] && continue
  rm -rf "$ROOT/$base"
  cp -a "$entry" "$ROOT/$base"
done

[[ -d "$NM_BACKUP" ]] && mv "$NM_BACKUP" "$ROOT/node_modules"
[[ -d "$VENDOR_BACKUP" ]] && mv "$VENDOR_BACKUP" "$ROOT/vendor"

echo "Done. Next: cd $ROOT && npm install && npm run build"
