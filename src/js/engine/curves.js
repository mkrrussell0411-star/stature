/**
 * @typedef {"linear"|"exponential"|"stepped"|"eased"} CurveKind
 */

/**
 * @param {number} rate per-tick change in stat units
 * @param {number} ticks
 * @param {CurveKind} kind
 * @returns {number} total delta
 */
export function integrateRate(rate, ticks, kind = "linear") {
  if (ticks <= 0 || rate === 0) return 0;
  switch (kind) {
    case "linear":
      return rate * ticks;
    case "exponential": {
      const base = 1 + Math.abs(rate) / 100;
      const sign = Math.sign(rate) || 1;
      return sign * (Math.pow(base, ticks) - 1) * 100;
    }
    case "stepped":
      return rate * Math.floor(ticks);
    case "eased": {
      const t = ticks;
      const ease = t * t * (3 - 2 * t);
      return rate * ease;
    }
    default:
      return rate * ticks;
  }
}
