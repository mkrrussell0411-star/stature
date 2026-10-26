import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const outfile = "src/js/dist/engine.js";
mkdirSync(dirname(outfile), { recursive: true });

await esbuild.build({
  entryPoints: ["src/js/engine/sugarcube-entry.js"],
  bundle: true,
  format: "iife",
  globalName: "StatureEngine",
  outfile,
  platform: "browser",
  target: ["es2020"],
});

console.log(`Wrote ${outfile}`);
