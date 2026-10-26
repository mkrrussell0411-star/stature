import { cardRequirementsMet } from "./requirements.js";

/**
 * @param {object[]} cards
 * @param {Record<string, Function>} req
 * @param {object} ctx
 * @param {Set<string>} playedOnce
 */
export function eligibleCards(cards, req, ctx, playedOnce) {
  return cards.filter((card) => {
    const tags = card.tags ?? [];
    if (tags.includes("once") && playedOnce.has(card.id)) return false;
    if (tags.includes("surge") && ctx.pacing !== "surge") return false;
    if (tags.includes("settle") && ctx.pacing !== "gentle") return false;
    const modules = ctx.reader?.modules ?? { scale: true };
    for (const mod of card.modules ?? ["scale"]) {
      if (!modules[mod]) return false;
    }
    return cardRequirementsMet(card, req, ctx);
  });
}

/**
 * @param {object[]} cards
 * @param {Record<string, Function>} req
 * @param {object} ctx
 * @param {Set<string>} playedOnce
 */
export function drawCard(cards, req, ctx, playedOnce) {
  const pool = eligibleCards(cards, req, ctx, playedOnce);
  if (!pool.length) return null;
  const idx = Math.floor((ctx.rng?.() ?? Math.random()) * pool.length);
  return pool[Math.min(idx, pool.length - 1)];
}
