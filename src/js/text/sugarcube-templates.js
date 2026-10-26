/**
 * Register SugarCube `?` templates (requires Template API in story runtime).
 * @param {object} Template
 * @param {object} textEngine
 */
export function installTemplates(Template, textEngine) {
  if (!Template?.add) return;

  Template.add("h", () => textEngine.measurement());
  Template.add("size-word", () => textEngine.sizeWord());
  Template.add("stage", () => textEngine.stage());
  Template.add("eye-ref", () => textEngine.eyeRef());
  Template.add("hand-ref", () => textEngine.handRef());
}

/**
 * @param {object} Macro
 * @param {object} textEngine
 */
export function installSizeMacro(Macro, textEngine) {
  if (!Macro?.add) return;
  Macro.add("sz", {
    handler() {
      const charId = this.args[0];
      const kind = this.args[1] ?? "h";
      const map = {
        h: () => textEngine.measurement(charId),
        word: () => textEngine.sizeWord(charId),
        stage: () => textEngine.stage(charId),
        eye: () => textEngine.eyeRef(charId),
        hand: () => textEngine.handRef(charId),
      };
      const fn = map[kind] ?? map.h;
      $(this.output).wiki(fn());
    },
  });
}
