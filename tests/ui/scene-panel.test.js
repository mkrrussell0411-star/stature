import { test } from "node:test";
import assert from "node:assert/strict";
import { renderSceneSvg, snapshotAtLedgerIndex } from "../../src/js/ui/scene-panel.js";
import { createCharacter } from "../../src/js/engine/cast.js";

test("scene svg includes character heights", () => {
  const cast = {
    a: createCharacter({ name: "A", stats: { height_cm: 340, mass_kg: 60 } }, "a"),
    b: createCharacter({ name: "B", stats: { height_cm: 180, mass_kg: 60 } }, "b"),
  };
  const svg = renderSceneSvg({ cast, onStage: ["a", "b"], refs: [] });
  assert.match(svg, /340 cm/);
  assert.match(svg, /<svg/);
});

test("ledger scrub snapshot restores past height", () => {
  const cast = {
    a: createCharacter({ name: "A", stats: { height_cm: 200, mass_kg: 60 } }, "a"),
  };
  const ledger = [
    { turn: 0, char: "a", stat: "height_cm", from: 170, to: 200, cause: "test" },
  ];
  const snap = snapshotAtLedgerIndex(ledger, 0, cast);
  assert.equal(snap.stats.a.height_cm, 200);
});
