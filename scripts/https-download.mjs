#!/usr/bin/env node
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import https from "node:https";

const [url, dest] = process.argv.slice(2);
if (!url || !dest) {
  console.error("Usage: node https-download.mjs <url> <dest>");
  process.exit(1);
}

function get(u) {
  return new Promise((resolve, reject) => {
    https
      .get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, u).href).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        pipeline(res, createWriteStream(dest)).then(resolve, reject);
      })
      .on("error", reject);
  });
}

await get(url);
console.error("Wrote", dest);
