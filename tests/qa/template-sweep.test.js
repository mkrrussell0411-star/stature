import { test } from "node:test";
import assert from "node:assert/strict";
import { runTemplateSweep } from "../../src/js/qa/template-sweep.js";

test("template sweep passes sampled scale factors", () => {
  const result = runTemplateSweep([170, 200, 300, 600, 2000]);
  assert.equal(result.ok, true, result.failures.join("; "));
});
