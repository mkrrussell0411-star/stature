import { deriveBody } from "../engine/derive.js";

const GROUND_Y = 180;
const BASE_VIEW_HEIGHT = 200;

/**
 * Render true-scale lineup SVG (inline, no library).
 * @param {object} opts
 * @returns {string}
 */
export function renderSceneSvg(opts) {
  const { cast, onStage, refs = [], viewWidth = 420, ledgerSnapshot = null } = opts;

  const chars = onStage
    .map((id) => {
      const sheet = cast[id];
      if (!sheet) return null;
      const height_cm =
        ledgerSnapshot?.stats?.[id]?.height_cm ?? sheet.stats.height_cm;
      const patched = {
        ...sheet,
        stats: { ...sheet.stats, height_cm },
      };
      const body = deriveBody(patched);
      return { id, name: sheet.name, height_cm: body.height_cm };
    })
    .filter(Boolean);

  if (!chars.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewWidth}" height="120" class="stature-scene"><text x="8" y="20">No characters on stage</text></svg>`;
  }

  const maxCm = Math.max(...chars.map((c) => c.height_cm), 170);
  const pxPerCm = (BASE_VIEW_HEIGHT * 0.8) / maxCm;

  const props = pickProps(maxCm / 100, refs);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} 220" class="stature-scene" role="img" aria-label="Scale lineup">`;
  svg += `<line x1="20" y1="${GROUND_Y}" x2="${viewWidth - 20}" y2="${GROUND_Y}" stroke="#444" stroke-width="2"/>`;

  for (const prop of props) {
    const hPx = prop.h * 100 * pxPerCm;
    const x = prop.x;
    svg += `<rect x="${x}" y="${GROUND_Y - hPx}" width="18" height="${hPx}" fill="#ddd" stroke="#999"/>`;
    svg += `<text x="${x}" y="${GROUND_Y + 14}" font-size="10">${prop.label}</text>`;
  }

  chars.forEach((c, i) => {
    const hPx = c.height_cm * pxPerCm;
    const x = 40 + i * 90;
    svg += `<rect x="${x}" y="${GROUND_Y - hPx}" width="36" height="${hPx}" fill="#6b8cff" opacity="0.85"/>`;
    svg += `<text x="${x}" y="${GROUND_Y - hPx - 6}" font-size="11">${c.name}</text>`;
    svg += `<text x="${x}" y="${GROUND_Y + 28}" font-size="10">${Math.round(c.height_cm)} cm</text>`;
  });

  svg += `<text x="20" y="16" font-size="11">Ruler: ${(maxCm / 100).toFixed(1)} m max · ${Math.round(pxPerCm * 100) / 100} px/cm</text>`;
  svg += `</svg>`;
  return svg;
}

/**
 * @param {number} maxHeightM
 * @param {object[]} refs
 */
function pickProps(maxHeightM, refs) {
  const tier =
    maxHeightM > 25 ? "city" : maxHeightM > 6 ? "building" : "room";
  const pool = refs.filter((r) => {
    if (tier === "room") return r.h <= 3;
    if (tier === "building") return r.h <= 12;
    return r.h > 6;
  });
  return pool.slice(0, 3).map((r, i) => ({
    ...r,
    label: r.id,
    x: 280 + i * 40,
  }));
}

/**
 * @param {object[]} ledger
 * @param {number} index
 * @param {Record<string, object>} cast
 */
export function snapshotAtLedgerIndex(ledger, index, cast) {
  /** @type {Record<string, { height_cm: number }>} */
  const stats = {};
  for (const id of Object.keys(cast)) {
    stats[id] = { height_cm: cast[id].stats.height_cm };
  }
  for (let i = 0; i <= index && i < ledger.length; i++) {
    const e = ledger[i];
    if (!stats[e.char]) stats[e.char] = {};
    stats[e.char][e.stat] = e.to;
  }
  return { stats };
}

/**
 * Mount live panel into a DOM node (browser).
 * @param {HTMLElement} root
 * @param {() => object} getState
 */
export function mountScenePanel(root, getState) {
  function redraw() {
    const st = getState();
    root.innerHTML = renderSceneSvg({
      cast: st.cast,
      onStage: st.onStage,
      refs: st.refs,
      ledgerSnapshot: st.ledgerSnapshot ?? null,
    });
  }
  redraw();
  return { redraw };
}

/**
 * Export current SVG to PNG (browser).
 * @param {SVGElement} svg
 */
export function exportSvgToPng(svg) {
  return new Promise((resolve, reject) => {
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svg.viewBox.baseVal.width || 420;
      canvas.height = svg.viewBox.baseVal.height || 220;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("PNG export failed"));
        else resolve(blob);
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}
