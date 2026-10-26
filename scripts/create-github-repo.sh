#!/usr/bin/env bash
# Create github.com/mkrrussell0411-star/stature and push main.
set -euo pipefail

OWNER="${GITHUB_OWNER:-mkrrussell0411-star}"
REPO="${GITHUB_REPO:-stature}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "Set GH_TOKEN to a GitHub personal access token (repo scope)." >&2
  exit 1
fi

export GH_TOKEN
gh auth setup-git 2>/dev/null || true

if ! gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then
  gh repo create "${OWNER}/${REPO}" --public --description "State-driven branching size fiction (SugarCube + Tweego)" --source "$ROOT" --remote github
else
  git -C "$ROOT" remote remove github 2>/dev/null || true
  git -C "$ROOT" remote add github "https://github.com/${OWNER}/${REPO}.git"
fi

git -C "$ROOT" push -u github main

echo "Pushed to https://github.com/${OWNER}/${REPO}"
