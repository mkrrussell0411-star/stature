import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateThresholds } from "../../src/js/storylets/thresholds.js";
import { createCharacter } from "../../src/js/engine/cast.js";
import { scaleModule } from "../../src/js/modules/scale.js";

test("threshold fires once per character and ref", () => {
  const cast = {
    mara: createCharacter(
      { stats: { height_cm: 250, mass_kg: 64 }, baseline: { height_cm: 170, mass_kg: 64 } },
      "mara",
    ),
  };
  const fired = new Set();
  const refs = scaleModule.defaultRefs;
  const first = evaluateThresholds({ cast, charId: "mara", refs, fired });
  assert.ok(first.some((e) => e.cardId === "threshold-door"));
  const second = evaluateThresholds({ cast, charId: "mara", refs, fired });
  assert.equal(second.length, 0);
});
