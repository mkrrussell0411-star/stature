import { createEngine, castDefaults } from "./index.js";
import { scaleModule } from "../modules/scale.js";

/**
 * Attach engine API to SugarCube `setup` after StoryInit runs.
 * @param {object} setup
 */
export function mountEngine(setup) {
  const engine = createEngine({
    cast: setup.cast ?? {},
    ledger: setup.ledger ?? [],
    reader: setup.readerSettings ?? { intensityCapScale: 50 },
    refs: setup.refs ?? scaleModule.defaultRefs,
  });

  setup.cast = engine.state.cast;
  setup.ledger = engine.state.ledger;
  setup.refs = engine.state.refs;
  setup.modules = { scale: scaleModule, ...(setup.modules ?? {}) };
  setup.engine = {
    apply(charId, delta, cause) {
      return engine.apply(charId, delta, cause);
    },
    derive(charId) {
      return engine.derive(charId);
    },
    compare(onStage) {
      return engine.compare(onStage);
    },
    tickGrowth(charId, ticks, curve) {
      return engine.tickGrowth(charId, ticks, curve);
    },
    loadCharacter(partial, id) {
      return engine.loadCharacter(partial, id);
    },
  };

  return engine;
}

if (typeof window !== "undefined") {
  window.StatureEngine = { createEngine, mountEngine, scaleModule, castDefaults };
}
