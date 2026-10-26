import { scaleFactor } from "../engine/derive.js";
import { createAntiRepeat } from "./anti-repeat.js";

/**
 * @param {number} s
 * @param {{ maxS: number, words: string[] }[]} bands
 */
export function pickBandForScale(s, bands) {
  const sorted = [...bands].sort((a, b) => a.maxS - b.maxS);
  for (const band of sorted) {
    if (s <= band.maxS) return band;
  }
  return sorted.at(-1);
}

/**
 * @param {object} sheet
 * @param {object} moduleRegistry
 * @param {ReturnType<typeof createAntiRepeat>} antiRepeat
 * @param {string} moduleId
 */
export function sizeWordFor(sheet, moduleRegistry, antiRepeat, moduleId = "scale") {
  const mod = moduleRegistry[moduleId];
  const bands = mod?.bands?.height ?? [];
  const s = scaleFactor(sheet);
  const band = pickBandForScale(s, bands);
  if (!band) return "ordinary";
  return antiRepeat.pick(band.words, `${moduleId}-height`);
}
