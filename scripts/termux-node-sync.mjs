#!/usr/bin/env node
/**
 * Sync Stature from GitHub using Node HTTPS only (no curl/git).
 * Usage: node scripts/termux-node-sync.mjs
 */
import { createWriteStream } from "node:fs";
import { mkdir, rm, cp, readdir, stat } from "node:fs/promises";
import { execSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import https from "node:https";
import path from "node:path";
import os from "node:os";

const REPO = process.env.STATURE_GITHUB_REPO ?? "mkrrussell0411-star/stature";
const BRANCH = process.env.STATURE_GITHUB_BRANCH ?? "main";
const ROOT = path.resolve(
  process.env.STATURE_ROOT ?? path.join(os.homedir(), "stature"),
);
const URL = `https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz`;
const TMP = process.env.TMPDIR ?? os.tmpdir();
const ARCHIVE = path.join(TMP, `stature-${BRANCH}.tar.gz`);
const EXTRACT = path.join(TMP, `stature-extract-${process.pid}`);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const follow = (u) => {
      https
        .get(u, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            follow(new URL(res.headers.location, u).href);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} for ${u}`));
            return;
          }
          pipeline(res, createWriteStream(dest)).then(resolve, reject);
        })
        .on("error", reject);
    };
    follow(url);
  });
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function mergeInto(src, dest) {
  await mkdir(dest, { recursive: true });
  const skip = new Set(["node_modules", "vendor", ".git"]);
  for (const name of await readdir(src)) {
    if (skip.has(name)) continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    await rm(to, { recursive: true, force: true });
    await cp(from, to, { recursive: true });
  }
}

async function main() {
  console.log("Downloading (Node https):", URL);
  await download(URL, ARCHIVE);
  await rm(EXTRACT, { recursive: true, force: true });
  await mkdir(EXTRACT, { recursive: true });
  execSync(`tar -xzf "${ARCHIVE}" -C "${EXTRACT}"`, { stdio: "inherit" });
  const src = path.join(EXTRACT, `stature-${BRANCH}`);
  if (!(await exists(src))) {
    throw new Error(`Missing ${src} after extract`);
  }
  console.log("Merging into", ROOT);
  await mergeInto(src, ROOT);
  console.log("OK. Run: cd", ROOT, "&& npm install && npm run build");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
