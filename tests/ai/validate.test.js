import { test } from "node:test";
import assert from "node:assert/strict";
import { validateAiPassage } from "../../src/js/ai/validate.js";

test("flags slop and bad mentions", () => {
  const brief = {
    comparisons: [{ a: "m", b: "j", relation: "head_reaches_knee" }],
  };
  const bad = validateAiPassage(
    {
      prose: "It was not small, but vast.",
      mentions: [{ a: "x", b: "y", relation: "nope" }],
    },
    brief,
  );
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.length >= 2);
});
