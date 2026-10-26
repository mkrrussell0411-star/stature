import { deriveBody } from "../engine/derive.js";

/**
 * Queue threshold event cards when a stat crosses reference dimensions.
 * @param {object} params
 * @returns {{ cardId: string, charId: string, refId: string }[]}
 */
export function evaluateThresholds({ cast, charId, refs, fired }) {
  const sheet = cast[charId];
  if (!sheet) return [];
  const body = deriveBody(sheet);
  /** @type {{ cardId: string, charId: string, refId: string }[]} */
  const queued = [];

  for (const ref of refs) {
    if (ref.thresholdCard == null) continue;
    const key = `${charId}:${ref.id}`;
    if (fired.has(key)) continue;
    const heightM = body.height_cm / 100;
    if (heightM >= ref.h) {
      fired.add(key);
      queued.push({
        cardId: ref.thresholdCard,
        charId,
        refId: ref.id,
      });
    }
  }
  return queued;
}
