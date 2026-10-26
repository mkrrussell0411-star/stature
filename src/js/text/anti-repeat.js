/**
 * Rotate word choices so none repeat within a sliding window.
 */
export function createAntiRepeat(windowSize = 5) {
  /** @type {string[]} */
  const history = [];

  /**
   * @param {string[]} words
   * @param {string} [bucket]
   */
  function pick(words, bucket = "default") {
    if (!words?.length) return "";
    const tagged = words.map((w) => `${bucket}:${w}`);
    const blocked = new Set(history);
    for (const w of words) {
      const key = `${bucket}:${w}`;
      if (!blocked.has(key)) {
        remember(key);
        return w;
      }
    }
    const fallback = words[0];
    remember(`${bucket}:${fallback}`);
    return fallback;
  }

  /**
   * @param {string} key
   */
  function remember(key) {
    history.push(key);
    while (history.length > windowSize) history.shift();
  }

  function reset() {
    history.length = 0;
  }

  return { pick, remember, reset, history };
}
