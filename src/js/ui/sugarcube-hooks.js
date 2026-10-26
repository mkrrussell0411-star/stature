/**
 * SugarCube lifecycle helpers (passage DOM, scene panel, scrub SVG).
 * @param {object} setup
 */
export function installSugarCubeHooks(setup) {
  setup.engine.refreshScenePanel = function refreshScenePanel() {
    if (typeof document === "undefined") return;
    requestAnimationFrame(function () {
      var el = document.getElementById("stature-scene-panel");
      if (!el || !setup.engine?.mountScenePanel) return;
      if (!setup._scenePanelMount) {
        setup._scenePanelMount = setup.engine.mountScenePanel(el, function () {
          if (typeof setup.getOnStage === "function") {
            return setup.getOnStage();
          }
          return ["mara", "jules"];
        });
      } else {
        setup._scenePanelMount.redraw();
      }
    });
  };

  setup.engine.sceneSvgForScrub = function sceneSvgForScrub(onStage, scrubIndex) {
    var idx = typeof scrubIndex === "number" && scrubIndex >= 0 ? scrubIndex : null;
    return setup.engine.sceneSvg(onStage, idx);
  };

  if (typeof $ !== "undefined") {
    $(document).on(":passagedisplay.stature", function () {
      setup.engine.refreshScenePanel();
    });
  }
}

/**
 * @param {object} Macro
 * @param {object} setup
 */
export function installUtilityMacros(Macro, setup) {
  if (!Macro?.add) return;

  Macro.add("refreshScene", {
    handler() {
      setup.engine.refreshScenePanel();
    },
  });
}
