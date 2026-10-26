/**
 * @param {object[]} ledger
 * @param {{ turn: number, char: string, stat: string, from: number, to: number, cause: string }} entry
 */
export function appendLedger(ledger, entry) {
  ledger.push(Object.freeze({ ...entry }));
  return ledger;
}

/**
 * @param {object[]} ledger
 * @param {number} turn
 * @param {string} charId
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @param {string} cause
 */
export function recordStatChanges(ledger, turn, charId, before, after, cause) {
  for (const stat of Object.keys(after)) {
    if (before[stat] === after[stat]) continue;
    appendLedger(ledger, {
      turn,
      char: charId,
      stat,
      from: before[stat],
      to: after[stat],
      cause,
    });
  }
}
