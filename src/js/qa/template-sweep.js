import { createEngine } from "../engine/index.js";
import { createTextEngine } from "../text/templates.js";

/**
 * Sample scale factors and ensure templates never return empty strings.
 */
export function runTemplateSweep(samples = defaultSamples()) {
  const engine = createEngine();
  engine.loadCharacter({ name: "Sweep", stats: { height_cm: 170, mass_kg: 64 } }, "sweep");

  const text = createTextEngine({
    getCast: () => engine.state.cast,
    getFocus: () => "sweep",
    getReader: () => ({ units: "metric" }),
    moduleRegistry: engine.modules,
    getRefs: () => engine.state.refs,
  });

  /** @type {string[]} */
  const failures = [];

  for (const height of samples) {
    engine.state.cast.sweep.stats.height_cm = height;
    for (const fn of [
      () => text.measurement("sweep"),
      () => text.sizeWord("sweep"),
      () => text.stage("sweep"),
      () => text.eyeRef("sweep"),
      () => text.handRef("sweep"),
    ]) {
      const out = fn();
      if (!out || !String(out).trim()) {
        failures.push(`empty at height ${height}`);
      }
    }
  }

  return { ok: failures.length === 0, failures };
}

function defaultSamples() {
  const vals = [];
  for (let s = 1; s <= 45; s *= 1.35) {
    vals.push(Math.round(170 * s));
  }
  return vals;
}
