import { clampDelta, assertWithinReaderCap } from "./clamp.js";
import { recordStatChanges } from "./ledger.js";
import { validateSheet } from "./cast.js";

/**
 * @param {object} deps
 * @param {Record<string, object>} deps.cast
 * @param {object[]} deps.ledger
 * @param {{ intensityCapScale?: number }} deps.reader
 * @param {Record<string, object>} deps.modules
 * @param {() => number} deps.getTurn
 * @param {(charId: string) => void} [deps.onAfterApply]
 */
export function createApply(deps) {
  const { cast, ledger, reader, modules, getTurn, onAfterApply } = deps;

  /**
   * @param {string} charId
   * @param {Record<string, number>} delta
   * @param {string} cause
   */
  function apply(charId, delta, cause) {
    const sheet = cast[charId];
    if (!sheet) throw new Error(`Unknown character: ${charId}`);

    const clamped = clampDelta(sheet, delta, reader, modules);
    if (Object.keys(clamped).length === 0) {
      return { changed: false, delta: {} };
    }

    const before = { ...sheet.stats };
    for (const [stat, change] of Object.entries(clamped)) {
      sheet.stats[stat] += change;
    }
    validateSheet(sheet);
    assertWithinReaderCap(sheet, reader);

    recordStatChanges(ledger, getTurn(), charId, before, sheet.stats, cause);
    onAfterApply?.(charId);

    return { changed: true, delta: clamped };
  }

  return { apply };
}
