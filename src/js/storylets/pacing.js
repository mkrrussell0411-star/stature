/** @typedef {"gentle"|"steady"|"surge"} PacingMode */

/** @type {Record<PacingMode, number>} */
export const pacingRates = {
  gentle: 3,
  steady: 10,
  surge: 35,
};

/**
 * @param {object} sheet
 * @param {PacingMode} mode
 * @param {number} [direction=1]
 */
export function applyPacingToSheet(sheet, mode, direction = 1) {
  sheet.rate = sheet.rate ?? {};
  sheet.rate.height_cm = pacingRates[mode] * Math.sign(direction || 1);
  sheet.pacingMode = mode;
  return sheet;
}
