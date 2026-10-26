import { createApply } from "./apply.js";
import { buildScaleBrief } from "./compare.js";
import { createCharacter, castDefaults, validateSheet } from "./cast.js";
import { deriveBody, deriveStages, scaleFactor } from "./derive.js";
import { integrateRate } from "./curves.js";
import { scaleModule } from "../modules/scale.js";

const defaultModules = {
  scale: scaleModule,
};

/**
 * @param {object} [options]
 */
export function createEngine(options = {}) {
  const modules = { ...defaultModules, ...options.modules };
  let turn = options.turn ?? 0;

  const state = {
    cast: options.cast ?? {},
    ledger: options.ledger ?? [],
    reader: options.reader ?? { intensityCapScale: 50 },
    refs: options.refs ?? scaleModule.defaultRefs,
  };

  const { apply } = createApply({
    cast: state.cast,
    ledger: state.ledger,
    reader: state.reader,
    modules,
    getTurn: () => turn,
    onAfterApply: options.onAfterApply,
  });

  return {
    state,
    modules,
    apply,
    setTurn(n) {
      turn = n;
    },
    getTurn() {
      return turn;
    },
    loadCharacter(partial, id) {
      state.cast[id] = createCharacter(partial, id);
      return state.cast[id];
    },
    derive(charId) {
      const sheet = state.cast[charId];
      return {
        body: deriveBody(sheet),
        stages: deriveStages(sheet, modules),
        scale: scaleFactor(sheet),
      };
    },
    compare(onStage) {
      return buildScaleBrief(state.cast, onStage, state.refs);
    },
    tickGrowth(charId, ticks = 1, curve = "linear") {
      const sheet = state.cast[charId];
      const delta = {};
      for (const [stat, rate] of Object.entries(sheet.rate ?? {})) {
        if (!rate) continue;
        delta[stat] = integrateRate(rate, ticks, curve);
      }
      return apply(charId, delta, "pacing-tick");
    },
    validateSheet,
    castDefaults,
  };
}

export {
  createCharacter,
  castDefaults,
  validateSheet,
  deriveBody,
  scaleFactor,
  buildScaleBrief,
  integrateRate,
};
