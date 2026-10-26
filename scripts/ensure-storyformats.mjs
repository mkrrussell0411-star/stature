#!/usr/bin/env node
/**
 * Install Tweego storyformats + SugarCube 2.37 (Node HTTPS only).
 * Usage: node scripts/ensure-storyformats.mjs
 */
import { createWriteStream } from "node:fs";
import { mkdir, cp, access, chmod } from "node:fs/promises";
import { execSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
  process.env.STATURE_ROOT ??
    path.join(path.dirname(fileURLToPath(import.meta.url)), ".."),
);
const TMP = process.env.TMPDIR ?? "/tmp";
const TWEEGO_FORMATS = path.join(ROOT, "vendor/tweego/storyformats");
const VENDOR_FORMATS = path.join(ROOT, "vendor/storyformats");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const go = (u) => {
      https
        .get(u, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            go(new URL(res.headers.location, u).href);
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
    go(url);
  });
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const marker = path.join(TWEEGO_FORMATS, "sugarcube-2/format.js");
  if (await exists(marker)) {
    console.log("Story formats OK:", marker);
    return;
  }

  await mkdir(TWEEGO_FORMATS, { recursive: true });
  await mkdir(VENDOR_FORMATS, { recursive: true });

  const tweegoZip = path.join(TMP, "tweego-formats.zip");
  const scZip = path.join(TMP, "sugarcube.zip");

  console.log("Downloading Tweego storyformats bundle…");
  await download(
    "https://github.com/tmedwards/tweego/releases/download/v2.1.1/tweego-2.1.1-linux-x64.zip",
    tweegoZip,
  );
  execSync(`unzip -o -q "${tweegoZip}" "storyformats/*" -d "${path.join(ROOT, "vendor/tweego")}"`, {
    stdio: "inherit",
  });

  console.log("Downloading SugarCube 2.37.3…");
  await download(
    "https://github.com/tmedwards/sugarcube-2/releases/download/v2.37.3/sugarcube-2.37.3-for-twine-2.1-local.zip",
    scZip,
  );
  execSync(`unzip -o -q "${scZip}" -d "${VENDOR_FORMATS}"`, { stdio: "inherit" });
  await mkdir(path.join(TWEEGO_FORMATS, "sugarcube-2"), { recursive: true });
  await cp(
    path.join(VENDOR_FORMATS, "sugarcube-2/format.js"),
    path.join(TWEEGO_FORMATS, "sugarcube-2/format.js"),
  );

  const tweegoBin = path.join(ROOT, "vendor/tweego/tweego");
  if (await exists(tweegoBin)) {
    await chmod(tweegoBin, 0o755);
  }

  console.log("Done.");
  console.log("Run:");
  console.log(`  export TWEEGO_PATH="${TWEEGO_FORMATS}:${VENDOR_FORMATS}"`);
  console.log(`  ${tweegoBin} --list-formats`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
