#!/usr/bin/env bash
set -euo pipefail

echo "Cloud Agent install (Node $(node --version), npm $(npm --version))"

if [[ -f package.json ]]; then
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
else
  echo "No package.json yet — dependency install skipped."
fi
