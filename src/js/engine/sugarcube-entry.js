import { createEngine, castDefaults } from "./index.js";
import { scaleModule } from "../modules/scale.js";
import { createTextEngine } from "../text/templates.js";
import { installTemplates, installSizeMacro } from "../text/sugarcube-templates.js";
import { defaultRequirements } from "../storylets/requirements.js";
import { evaluateThresholds } from "../storylets/thresholds.js";
import { drawCard, eligibleCards } from "../storylets/deck.js";
import { applyPacingToSheet } from "../storylets/pacing.js";
import { mountScenePanel, renderSceneSvg, snapshotAtLedgerIndex } from "../ui/scene-panel.js";
import { registerReaderSettings } from "../ui/settings.js";

/**
 * Full SugarCube bootstrap: engine, text, storylets, UI hooks.
 * @param {object} setup
 * @param {object} [apis]
 */
export function mountEngine(setup, apis = {}) {
  setup.readerSettings = {
    intensityCapScale: 50,
    units: "metric",
    pacing: "steady",
    pov: "ask",
    modules: { scale: true },
    aiFlavor: false,
    images: "keyframes",
    ...setup.readerSettings,
  };

  setup.thresholdFired = setup.thresholdFired ?? new Set();
  setup.cardsPlayed = setup.cardsPlayed ?? new Set();
  setup.eventQueue = setup.eventQueue ?? [];
  setup.req = { ...defaultRequirements, ...(setup.req ?? {}) };
  setup.storylets = setup.storylets ?? {
    cards: [...(scaleModule.defaultCards ?? [])],
  };

  const engine = createEngine({
    cast: setup.cast ?? {},
    ledger: setup.ledger ?? [],
    reader: setup.readerSettings,
    refs: setup.refs ?? scaleModule.defaultRefs,
    onAfterApply(charId) {
      const queued = evaluateThresholds({
        cast: setup.cast,
        charId,
        refs: setup.refs,
        fired: setup.thresholdFired,
      });
      setup.eventQueue.push(...queued);
      apis.onAfterApply?.(charId);
    },
  });

  setup.cast = engine.state.cast;
  setup.ledger = engine.state.ledger;
  setup.refs = engine.state.refs;
  setup.modules = { scale: scaleModule, ...(setup.modules ?? {}) };

  const text = createTextEngine({
    getCast: () => setup.cast,
    getFocus: () => apis.getFocus?.() ?? setup.focus ?? "mara",
    getReader: () => setup.readerSettings,
    moduleRegistry: setup.modules,
    getRefs: () => setup.refs,
  });

  function storyCtx(ctxExtra = {}) {
    return {
      cast: setup.cast,
      refs: setup.refs,
      focus: apis.getFocus?.() ?? setup.focus,
      role: ctxExtra.role ?? apis.getFocus?.() ?? setup.focus,
      reader: setup.readerSettings,
      pacing: setup.readerSettings.pacing,
      ...ctxExtra,
    };
  }

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
    applyPacing(charId, mode) {
      applyPacingToSheet(setup.cast[charId], mode);
      setup.readerSettings.pacing = mode;
    },
    drainEventQueue() {
      return setup.eventQueue.splice(0);
    },
    drawStorylet(ctxExtra) {
      return drawCard(
        setup.storylets.cards,
        setup.req,
        storyCtx(ctxExtra),
        setup.cardsPlayed,
      );
    },
    eligibleStorylets(ctxExtra) {
      return eligibleCards(
        setup.storylets.cards,
        setup.req,
        storyCtx(ctxExtra),
        setup.cardsPlayed,
      );
    },
    text,
    sceneSvg(onStage, ledgerIndex = null) {
      const ledgerSnapshot =
        ledgerIndex == null
          ? null
          : snapshotAtLedgerIndex(setup.ledger, ledgerIndex, setup.cast);
      return renderSceneSvg({
        cast: setup.cast,
        onStage,
        refs: setup.refs,
        ledgerSnapshot,
      });
    },
    mountScenePanel(root, getOnStage) {
      return mountScenePanel(root, () => ({
        cast: setup.cast,
        onStage: getOnStage(),
        refs: setup.refs,
        ledgerSnapshot: null,
      }));
    },
    registerSettings(Setting, onChange) {
      registerReaderSettings(Setting, setup, onChange ?? (() => {}));
    },
    installSugarCube(Template, Macro, Setting, hooks = {}) {
      installTemplates(Template, text);
      installSizeMacro(Macro, text);
      registerReaderSettings(Setting, setup, hooks.onSettingChange ?? (() => {}));
    },
  };

  setup.bands = setup.bands ?? { scale: scaleModule.bands };

  return engine;
}

if (typeof window !== "undefined") {
  window.StatureEngine = {
    createEngine,
    mountEngine,
    scaleModule,
    castDefaults,
    renderSceneSvg,
  };
}

export { createEngine, castDefaults, renderSceneSvg };
