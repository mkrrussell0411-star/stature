import {
  EYE_HEIGHT_RATIO,
  HAND_HEIGHT_RATIO,
  STRIDE_HEIGHT_RATIO,
} from "./constants.js";

/**
 * @param {object} sheet
 * @returns {number}
 */
export function scaleFactor(sheet) {
  return sheet.stats.height_cm / sheet.baseline.height_cm;
}

/**
 * @param {object} sheet
 * @returns {object}
 */
export function deriveBody(sheet) {
  const s = scaleFactor(sheet);
  const height_m = sheet.stats.height_cm / 100;
  return {
    scale: s,
    height_m,
    height_cm: sheet.stats.height_cm,
    mass_kg: sheet.stats.mass_kg,
    hand_span_cm: sheet.stats.height_cm * HAND_HEIGHT_RATIO,
    eye_level_cm: sheet.stats.height_cm * EYE_HEIGHT_RATIO,
    stride_cm: sheet.stats.height_cm * STRIDE_HEIGHT_RATIO,
    footprint_m2: 0.05 * s * s,
  };
}

/**
 * @param {object} sheet
 * @param {object} moduleRegistry
 * @returns {Record<string, string>}
 */
export function deriveStages(sheet, moduleRegistry) {
  /** @type {Record<string, string>} */
  const stages = {};
  const s = scaleFactor(sheet);
  for (const modId of sheet.modules ?? []) {
    const mod = moduleRegistry[modId];
    if (!mod?.stages) continue;
    stages[modId] = pickStage(s, mod.stages);
  }
  return stages;
}

/**
 * @param {number} s
 * @param {{ maxS: number, name: string }[]} stages
 */
export function pickStage(s, stages) {
  const sorted = [...stages].sort((a, b) => a.maxS - b.maxS);
  for (const band of sorted) {
    if (s <= band.maxS) return band.name;
  }
  return sorted.at(-1)?.name ?? "Unknown";
}
