import { deriveBody } from "../engine/derive.js";

/**
 * Named predicates referenced by storylet tags (TinyQBN-style `req-*`).
 */
export const defaultRequirements = {
  eyeAboveCeiling(ctx) {
    const sheet = ctx.cast[ctx.role ?? ctx.focus];
    if (!sheet) return false;
    const eye = deriveBody(sheet).eye_level_cm / 100;
    const ceiling = ctx.refs.find((r) => r.id === "ceiling");
    return ceiling ? eye >= ceiling.h : false;
  },
  heightAboveDoor(ctx) {
    const sheet = ctx.cast[ctx.role ?? ctx.focus];
    if (!sheet) return false;
    const h = sheet.stats.height_cm / 100;
    const door = ctx.refs.find((r) => r.id === "door");
    return door ? h >= door.h : false;
  },
};

/**
 * @param {string} tag
 */
export function requirementTagToName(tag) {
  if (!tag.startsWith("req-")) return null;
  const raw = tag.slice(4);
  return raw.charAt(0).toLowerCase() + raw.slice(1);
}

/**
 * @param {object} card
 * @param {Record<string, Function>} req
 * @param {object} ctx
 */
export function cardRequirementsMet(card, req, ctx) {
  const tags = card.tags ?? [];
  for (const tag of tags) {
    const name = requirementTagToName(tag);
    if (!name) continue;
    const fn = req[name];
    if (typeof fn !== "function") return false;
    if (!fn(ctx)) return false;
  }
  return true;
}
