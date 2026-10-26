#!/usr/bin/env bash
# Portable bootstrap for Cloud Agent, Linux, and Termux (Android arm64).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TWEEGO_BIN="$ROOT/vendor/tweego/tweego"
STORY_FORMATS="$ROOT/vendor/storyformats"
TMP="${TMPDIR:-/tmp}"
TWEEGO_VERSION="2.1.1"
TWEEGO_TAG="v${TWEEGO_VERSION}"

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

ensure_tar() {
  command -v tar >/dev/null 2>&1 || {
    if is_termux; then
      pkg install -y tar
    else
      echo "tar is required" >&2
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

try_termux_pkg_tweego() {
  if ! is_termux; then
    return 1
  fi
  if command -v tweego >/dev/null 2>&1; then
    return 0
  fi
  if ! command -v pkg >/dev/null 2>&1; then
    return 1
  fi
  pkg install -y tweego 2>/dev/null || return 1
  command -v tweego >/dev/null 2>&1
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
    "https://github.com/tmedwards/tweego/releases/download/${TWEEGO_TAG}/${zip_name}"
  unzip -o -q "$TMP/tweego.zip" -d "$ROOT/vendor/tweego"
  chmod +x "$ROOT/vendor/tweego/tweego" 2>/dev/null || true
  if [[ ! -x "$TWEEGO_BIN" ]]; then
    chmod +x "$ROOT/vendor/tweego/tweego"
  fi
}

# Download source with curl only (avoids broken git-remote-https on some Termux installs).
fetch_tweego_source_dir() {
  local out_dir="$TMP/tweego-${TWEEGO_VERSION}"
  rm -rf "$out_dir"
  ensure_curl
  ensure_tar
  local archive="$TMP/tweego-${TWEEGO_VERSION}.tar.gz"
  if [[ -n "${STATURE_TWEEGO_SOURCE_URL:-}" ]]; then
    curl -fsSL -o "$archive" "$STATURE_TWEEGO_SOURCE_URL"
  else
    curl -fsSL -o "$archive" \
      "https://github.com/tmedwards/tweego/archive/refs/tags/${TWEEGO_TAG}.tar.gz"
  fi
  tar -xzf "$archive" -C "$TMP"
  # GitHub archive top-level folder: tweego-2.1.1
  if [[ ! -d "$out_dir" ]]; then
    echo "Expected source dir $out_dir after extract" >&2
    exit 1
  fi
  printf '%s' "$out_dir"
}

install_tweego_from_go() {
  if ! command -v go >/dev/null 2>&1; then
    echo "On arm64, install Go then re-run: pkg install -y golang" >&2
    exit 1
  fi
  local src
  src="$(fetch_tweego_source_dir)"
  mkdir -p "$(dirname "$TWEEGO_BIN")"
  echo "Compiling Tweego ${TWEEGO_VERSION} from $src …"
  (cd "$src" && CGO_ENABLED=0 go build -o "$TWEEGO_BIN")
  chmod +x "$TWEEGO_BIN"
}

install_tweego_from_custom_binary() {
  if [[ -z "${STATURE_TWEEGO_BIN_URL:-}" ]]; then
    return 1
  fi
  ensure_curl
  mkdir -p "$(dirname "$TWEEGO_BIN")"
  curl -fsSL -o "$TWEEGO_BIN" "$STATURE_TWEEGO_BIN_URL"
  chmod +x "$TWEEGO_BIN"
}

install_tweego() {
  if [[ -x "$TWEEGO_BIN" ]]; then
    return 0
  fi

  if try_termux_pkg_tweego; then
    mkdir -p "$(dirname "$TWEEGO_BIN")"
    ln -sf "$(command -v tweego)" "$TWEEGO_BIN"
    return 0
  fi

  if install_tweego_from_custom_binary; then
    return 0
  fi

  case "$(arch)" in
    x86_64|amd64)
      install_tweego_from_zip "tweego-${TWEEGO_VERSION}-linux-x64.zip"
      ;;
    i686|i386)
      install_tweego_from_zip "tweego-${TWEEGO_VERSION}-linux-x86.zip"
      ;;
    aarch64|arm64)
      echo "Building Tweego from source for $(arch) (curl + tar, no git clone)…"
      install_tweego_from_go
      ;;
    *)
      echo "Unsupported CPU $(arch); set STATURE_TWEEGO_BIN_URL or install tweego and link to $TWEEGO_BIN" >&2
      exit 1
      ;;
  esac
}

install_tweego
install_sugarcube

echo "Tweego: $($TWEEGO_BIN -v 2>&1 | head -1)"
