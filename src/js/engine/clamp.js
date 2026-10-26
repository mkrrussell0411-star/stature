import { scaleFactor } from "./derive.js";

/**
 * @param {object} sheet
 * @param {Record<string, number>} delta
 * @param {{ intensityCapScale?: number }} reader
 * @param {Record<string, object>} moduleRegistry
 * @returns {Record<string, number>}
 */
export function clampDelta(sheet, delta, reader, moduleRegistry) {
  /** @type {Record<string, number>} */
  const out = {};
  const intensityCap = reader.intensityCapScale ?? 50;
  const maxHeight =
    sheet.baseline.height_cm * intensityCap;
  const authorMax = sheet.caps?.height_cm ?? maxHeight;

  for (const [stat, change] of Object.entries(delta)) {
    if (change === 0) continue;
    let next = sheet.stats[stat] + change;
    if (stat === "height_cm") {
      const floor = moduleMin(moduleRegistry, sheet, stat);
      next = Math.max(floor, next);
      next = Math.min(next, authorMax, maxHeight);
    }
    const applied = next - sheet.stats[stat];
    if (applied !== 0) out[stat] = applied;
  }
  return out;
}

/**
 * @param {Record<string, object>} moduleRegistry
 * @param {object} sheet
 * @param {string} stat
 */
function moduleMin(moduleRegistry, sheet, stat) {
  let min = 1;
  for (const modId of sheet.modules ?? []) {
    const mod = moduleRegistry[modId];
    if (mod?.mins?.[stat] != null) {
      min = Math.max(min, mod.mins[stat]);
    }
  }
  return min;
}

/**
 * After apply, verify scale factor within reader cap.
 * @param {object} sheet
 * @param {{ intensityCapScale?: number }} reader
 */
export function assertWithinReaderCap(sheet, reader) {
  const cap = reader.intensityCapScale ?? 50;
  const s = scaleFactor(sheet);
  if (s > cap + 1e-9) {
    throw new Error(`Scale ${s} exceeds reader cap ${cap}`);
  }
}
