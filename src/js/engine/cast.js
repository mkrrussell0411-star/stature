import { MIN_AGE } from "./constants.js";

export const castDefaults = {
  age: 27,
  baseline: { height_cm: 170, mass_kg: 64 },
  stats: { height_cm: 170, mass_kg: 64 },
  modules: ["scale"],
  rate: { height_cm: 0 },
  caps: { height_cm: 50_000 },
  wardrobe: [],
};

/**
 * @param {object} partial
 * @param {string} id
 * @returns {object}
 */
export function createCharacter(partial, id) {
  const sheet = {
    id,
    name: partial.name ?? id,
    ...structuredClone(castDefaults),
    ...partial,
    baseline: { ...castDefaults.baseline, ...partial.baseline },
    stats: { ...castDefaults.stats, ...partial.stats },
    rate: { ...castDefaults.rate, ...partial.rate },
    caps: { ...castDefaults.caps, ...partial.caps },
    modules: [...(partial.modules ?? castDefaults.modules)],
    wardrobe: [...(partial.wardrobe ?? castDefaults.wardrobe)],
  };
  validateSheet(sheet);
  return sheet;
}

/**
 * @param {object} sheet
 */
export function validateSheet(sheet) {
  if (typeof sheet.age !== "number" || sheet.age < MIN_AGE) {
    throw new Error(
      `Character ${sheet.id ?? "?"} must be age ${MIN_AGE}+ (got ${sheet.age})`,
    );
  }
  if (!sheet.baseline?.height_cm || sheet.baseline.height_cm <= 0) {
    throw new Error(`Character ${sheet.id} needs positive baseline height_cm`);
  }
  if (!sheet.stats?.height_cm || sheet.stats.height_cm <= 0) {
    throw new Error(`Character ${sheet.id} needs positive stats.height_cm`);
  }
}
