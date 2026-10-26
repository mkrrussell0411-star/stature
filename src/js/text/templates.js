import { deriveBody, scaleFactor } from "../engine/derive.js";
import { nearestRefs } from "../engine/compare.js";
import { formatHeight } from "./units.js";
import { sizeWordFor } from "./bands.js";
import { createAntiRepeat } from "./anti-repeat.js";

/**
 * @param {object} deps
 */
export function createTextEngine(deps) {
  const {
    getCast,
    getFocus,
    getReader,
    moduleRegistry,
    getRefs,
    antiRepeat = createAntiRepeat(5),
  } = deps;

  function focusSheet() {
    const id = getFocus();
    const cast = getCast();
    if (!cast[id]) throw new Error(`No focus character: ${id}`);
    return cast[id];
  }

  function measurement(charId = getFocus(), stat = "height_cm") {
    const sheet = getCast()[charId];
    const units = getReader().units ?? "metric";
    if (stat === "height_cm") {
      return formatHeight(sheet.stats.height_cm, units, { refs: getRefs() });
    }
    if (stat === "mass_kg") {
      return `${Math.round(sheet.stats.mass_kg)} kg`;
    }
    return String(sheet.stats[stat] ?? "");
  }

  function sizeWord(charId = getFocus()) {
    const sheet = getCast()[charId];
    return sizeWordFor(sheet, moduleRegistry, antiRepeat, "scale");
  }

  function stage(charId = getFocus()) {
    const s = scaleFactor(getCast()[charId]);
    const mod = moduleRegistry.scale;
    const sorted = [...(mod?.stages ?? [])].sort((a, b) => a.maxS - b.maxS);
    for (const st of sorted) {
      if (s <= st.maxS) return st.name;
    }
    return sorted.at(-1)?.name ?? "Unknown";
  }

  function eyeRef(charId = getFocus()) {
    const body = deriveBody(getCast()[charId]);
    const refs = getRefs();
    const hit = nearestRefs(body.eye_level_cm, refs)[0];
    if (!hit) return formatHeight(body.eye_level_cm, getReader().units ?? "metric");
    const delta = body.eye_level_cm / 100 - hit.h;
    if (Math.abs(delta) < 0.05) return `level with ${hit.phrase}`;
    if (delta > 0) return `above ${hit.phrase}`;
    return `below ${hit.phrase}`;
  }

  function handRef(charId = getFocus()) {
    const body = deriveBody(getCast()[charId]);
    return `a hand span of ${Math.round(body.hand_span_cm)} cm`;
  }

  return {
    antiRepeat,
    measurement,
    sizeWord,
    stage,
    eyeRef,
    handRef,
    renderFocusLine() {
      const sheet = focusSheet();
      return `${sheet.name} — ${measurement(sheet.id)} (${sizeWord(sheet.id)}, ${stage(sheet.id)})`;
    },
  };
}
