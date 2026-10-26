/**
 * Validates AI JSON output against engine scale brief (no network).
 * @param {object} payload `{ prose, mentions }`
 * @param {object} brief from setup.engine.compare()
 */
export function validateAiPassage(payload, brief) {
  /** @type {string[]} */
  const errors = [];
  if (!payload?.prose?.trim()) errors.push("empty prose");

  const slopPatterns = [
    /\bnot .+, but .+\b/i,
    /\btestament to\b/i,
    /\btapestry\b/i,
    /\b delve\b/i,
  ];
  for (const re of slopPatterns) {
    if (re.test(payload.prose)) errors.push(`slop pattern: ${re}`);
  }

  for (const m of payload.mentions ?? []) {
    const ok = brief.comparisons.some(
      (c) =>
        c.relation === m.relation &&
        (c.a === m.a || c.b === m.b),
    );
    if (!ok) errors.push(`unverified comparison: ${JSON.stringify(m)}`);
  }

  return { ok: errors.length === 0, errors };
}
