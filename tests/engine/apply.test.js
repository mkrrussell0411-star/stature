import { test } from "node:test";
import assert from "node:assert/strict";
import { createEngine } from "../../src/js/engine/index.js";
import { MIN_AGE } from "../../src/js/engine/constants.js";

test("rejects characters under minimum age", () => {
  const engine = createEngine();
  assert.throws(
    () => engine.loadCharacter({ age: MIN_AGE - 1, name: "Teen" }, "x"),
    /must be age 18\+/,
  );
});

test("apply is the only path for stat changes and writes ledger", () => {
  const engine = createEngine({ reader: { intensityCapScale: 50 } });
  engine.loadCharacter({ name: "Mara", stats: { height_cm: 170, mass_kg: 64 } }, "mara");

  const result = engine.apply("mara", { height_cm: 30 }, "storylet-test");
  assert.equal(result.changed, true);
  assert.equal(engine.state.cast.mara.stats.height_cm, 200);
  assert.equal(engine.state.ledger.length, 1);
  assert.equal(engine.state.ledger[0].cause, "storylet-test");
});

test("reader intensity cap clamps height", () => {
  const engine = createEngine({ reader: { intensityCapScale: 2 } });
  engine.loadCharacter(
    { baseline: { height_cm: 100, mass_kg: 50 }, stats: { height_cm: 100, mass_kg: 50 } },
    "a",
  );

  engine.apply("a", { height_cm: 500 }, "surge");
  assert.equal(engine.state.cast.a.stats.height_cm, 200);
});

test("derive scale factor and stages", () => {
  const engine = createEngine();
  engine.loadCharacter(
    {
      name: "Mara",
      stats: { height_cm: 340, mass_kg: 64 },
      baseline: { height_cm: 170, mass_kg: 64 },
    },
    "mara",
  );
  const d = engine.derive("mara");
  assert.equal(d.scale, 2);
  assert.equal(d.stages.scale, "Towering");
});

test("growth curves integrate rate", () => {
  const engine = createEngine({ reader: { intensityCapScale: 50 } });
  engine.loadCharacter({ stats: { height_cm: 170, mass_kg: 64 } }, "mara");
  engine.state.cast.mara.rate = { height_cm: 10 };

  engine.tickGrowth("mara", 3, "linear");
  assert.equal(engine.state.cast.mara.stats.height_cm, 200);
});

test("compare builds pairwise lines", () => {
  const engine = createEngine();
  engine.loadCharacter({ name: "Mara", stats: { height_cm: 340, mass_kg: 64 } }, "mara");
  engine.loadCharacter({ name: "Jules", stats: { height_cm: 170, mass_kg: 60 } }, "jules");

  const brief = engine.compare(["mara", "jules"]);
  assert.ok(brief.comparisons.length >= 1);
  assert.ok(brief.characters.every((c) => c.hand_span_cm > 0));
});
