import { deriveBody } from "./derive.js";

/**
 * @param {Record<string, object>} cast
 * @param {string[]} onStage
 * @param {object[]} refs
 * @returns {object}
 */
export function buildScaleBrief(cast, onStage, refs = []) {
  const characters = onStage.map((id) => {
    const sheet = cast[id];
    const body = deriveBody(sheet);
    return { id, name: sheet.name, ...body };
  });

  const comparisons = [];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      comparisons.push(...pairComparisons(characters[i], characters[j]));
    }
  }

  const refHits = characters.flatMap((c) =>
    nearestRefs(c.height_cm, refs).map((r) => ({
      char: c.id,
      ref: r.id,
      phrase: r.phrase,
      delta_cm: c.height_cm - r.h * 100,
    })),
  );

  return { characters, comparisons, refHits };
}

/**
 * @param {object} a
 * @param {object} b
 */
function pairComparisons(a, b) {
  const taller = a.height_cm >= b.height_cm ? a : b;
  const shorter = taller === a ? b : a;
  const kneeOfTaller = taller.height_cm * 0.28;
  const lines = [];

  if (shorter.eye_level_cm >= kneeOfTaller) {
    lines.push({
      a: shorter.id,
      b: taller.id,
      relation: "head_reaches_knee",
      text: `${shorter.name}'s head reaches ${taller.name}'s knee`,
    });
  } else {
    lines.push({
      a: shorter.id,
      b: taller.id,
      relation: "shorter_than_knee",
      text: `${shorter.name} stands well below ${taller.name}'s knee`,
    });
  }

  if (shorter.hand_span_cm < taller.footprint_m2 * 100) {
    lines.push({
      a: shorter.id,
      b: taller.id,
      relation: "hand_vs_footprint",
      text: `${shorter.name}'s hand span is narrower than ${taller.name}'s footprint`,
    });
  }

  return lines;
}

/**
 * @param {number} heightCm
 * @param {{ id: string, h: number, phrase: string }[]} refs
 */
export function nearestRefs(heightCm, refs) {
  if (!refs.length) return [];
  const heightM = heightCm / 100;
  const sorted = [...refs].sort(
    (a, b) => Math.abs(a.h - heightM) - Math.abs(b.h - heightM),
  );
  return sorted.slice(0, 2);
}
