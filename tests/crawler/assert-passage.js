/**
 * Pure helper: verify numeric size claims in passage text against engine height (cm).
 * Used by future headless crawler; safe to run in Node without SugarCube.
 */

const SIZE_CLAIM = /(\d+(?:\.\d+)?)\s*(m|meters|cm|centimeters|feet|ft)/gi;

/**
 * @param {string} passageText
 * @param {number} expectedHeightCm
 * @param {number} [toleranceRatio=0.15]
 */
export function findContradictorySizeClaims(
  passageText,
  expectedHeightCm,
  toleranceRatio = 0.15,
) {
  /** @type {string[]} */
  const issues = [];
  let match;
  while ((match = SIZE_CLAIM.exec(passageText)) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    let cm = value;
    if (unit.startsWith("m")) cm = value * 100;
    if (unit.startsWith("f")) cm = value * 30.48;
    const diff = Math.abs(cm - expectedHeightCm) / expectedHeightCm;
    if (diff > toleranceRatio) {
      issues.push(`claim ${match[0]} vs sheet ${expectedHeightCm} cm`);
    }
  }
  return issues;
}
