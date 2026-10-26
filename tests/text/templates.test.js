import { test } from "node:test";
import assert from "node:assert/strict";
import { createEngine } from "../../src/js/engine/index.js";
import { createTextEngine } from "../../src/js/text/templates.js";

test("templates render non-empty across units", () => {
  const engine = createEngine();
  engine.loadCharacter({ name: "M", stats: { height_cm: 340, mass_kg: 70 } }, "m");

  for (const units of ["metric", "imperial", "relative"]) {
    const text = createTextEngine({
      getCast: () => engine.state.cast,
      getFocus: () => "m",
      getReader: () => ({ units }),
      moduleRegistry: engine.modules,
      getRefs: () => engine.state.refs,
    });
    assert.ok(text.measurement("m").length > 3);
    assert.ok(text.sizeWord("m").length > 1);
    assert.ok(text.eyeRef("m").length > 3);
  }
});
