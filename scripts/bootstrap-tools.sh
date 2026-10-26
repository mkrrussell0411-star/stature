#!/usr/bin/env bash
# Portable bootstrap for Cloud Agent, Linux, and Termux (Android arm64).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO_BIN="$ROOT/vendor/tweego/tweego"
STORY_FORMATS="$ROOT/vendor/storyformats"
TMP="${TMPDIR:-/tmp}"

is_termux() {
  [[ -n "${TERMUX_VERSION:-}" ]] || [[ -d /data/data/com.termux/files/usr ]]
}

arch() {
  uname -m
}

ensure_unzip() {
  command -v unzip >/dev/null 2>&1 || {
    if is_termux; then
      pkg install -y unzip
    else
      echo "unzip is required" >&2
      exit 1
    fi
  }
}

ensure_curl() {
  command -v curl >/dev/null 2>&1 || {
    if is_termux; then
      pkg install -y curl
    else
      echo "curl is required" >&2
      exit 1
    fi
  }
}

install_sugarcube() {
  mkdir -p "$STORY_FORMATS"
  ensure_curl
  ensure_unzip
  curl -fsSL -o "$TMP/sc.zip" \
    "https://github.com/tmedwards/sugarcube-2/releases/download/v2.37.3/sugarcube-2.37.3-for-twine-2.1-local.zip"
  unzip -o -q "$TMP/sc.zip" -d "$STORY_FORMATS"
  mkdir -p "$ROOT/vendor/tweego/storyformats/sugarcube-2"
  cp "$STORY_FORMATS/sugarcube-2/format.js" \
    "$ROOT/vendor/tweego/storyformats/sugarcube-2/format.js"
}

install_tweego_from_zip() {
  local zip_name="$1"
  ensure_curl
  ensure_unzip
  mkdir -p "$ROOT/vendor/tweego"
  curl -fsSL -o "$TMP/tweego.zip" \
    "https://github.com/tmedwards/tweego/releases/download/v2.1.1/${zip_name}"
  unzip -o -q "$TMP/tweego.zip" -d "$ROOT/vendor/tweego"
  chmod +x "$ROOT/vendor/tweego/tweego" 2>/dev/null || true
  if [[ ! -x "$TWEEGO_BIN" ]]; then
    chmod +x "$ROOT/vendor/tweego/tweego"
  fi
}

install_tweego_from_go() {
  if ! command -v go >/dev/null 2>&1; then
    echo "On Termux arm64, install Go then re-run: pkg install -y golang git" >&2
    exit 1
  fi
  local src="$TMP/tweego-src-2.1.1"
  rm -rf "$src"
  git clone --depth 1 --branch v2.1.1 https://github.com/tmedwards/tweego.git "$src"
  mkdir -p "$(dirname "$TWEEGO_BIN")"
  (cd "$src" && go build -o "$TWEEGO_BIN")
  chmod +x "$TWEEGO_BIN"
}

install_tweego() {
  if [[ -x "$TWEEGO_BIN" ]]; then
    return 0
  fi

  if is_termux && command -v tweego >/dev/null 2>&1; then
    mkdir -p "$(dirname "$TWEEGO_BIN")"
    ln -sf "$(command -v tweego)" "$TWEEGO_BIN"
    return 0
  fi

  case "$(arch)" in
    x86_64|amd64)
      install_tweego_from_zip "tweego-2.1.1-linux-x64.zip"
      ;;
    i686|i386)
      install_tweego_from_zip "tweego-2.1.1-linux-x86.zip"
      ;;
    aarch64|arm64)
      echo "Building Tweego from source for $(arch) (Termux / ARM Linux)…"
      install_tweego_from_go
      ;;
    *)
      echo "Unsupported CPU $(arch); install tweego manually and link to $TWEEGO_BIN" >&2
      exit 1
      ;;
  esac
}

install_tweego
install_sugarcube

echo "Tweego: $($TWEEGO_BIN -v 2>&1 | head -1)"
