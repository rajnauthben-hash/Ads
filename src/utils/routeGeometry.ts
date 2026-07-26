/**
 * Route + isometric geometry helpers.
 *
 * The city is drawn on a 2:1 isometric grid. `iso()` projects a grid cell
 * (gx, gy) plus a height (gz) into 2D screen space relative to a world origin.
 * Routes are built as SVG polylines that follow road centres and turn only at
 * intersections, then rendered with pathLength / strokeDasharray so they can be
 * "drawn" deterministically from a frame-derived progress value.
 */

export interface Pt {
  x: number;
  y: number;
}

// Isometric tile half-dimensions (2:1).
export const TILE_W = 92; // half-width in px
export const TILE_H = 46; // half-height in px
export const LEVEL_H = 58; // vertical px per height unit

/** Project isometric grid coords to screen space around an origin. */
export function iso(origin: Pt, gx: number, gy: number, gz = 0): Pt {
  return {
    x: origin.x + (gx - gy) * TILE_W,
    y: origin.y + (gx + gy) * TILE_H - gz * LEVEL_H,
  };
}

/** Build an SVG path string from a list of points (M/L). */
export function polyPath(pts: Pt[]): string {
  if (pts.length === 0) return "";
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${round(p.x)} ${round(p.y)}`)
    .join(" ");
}

/**
 * Build a smoothed path through points using quadratic corner rounding, so a
 * route turns cleanly at intersections rather than with hard mitres.
 */
export function smoothPath(pts: Pt[], radius = 16): string {
  if (pts.length < 3) return polyPath(pts);
  let d = `M ${round(pts[0].x)} ${round(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const a = shorten(p1, p0, radius);
    const b = shorten(p1, p2, radius);
    d += ` L ${round(a.x)} ${round(a.y)} Q ${round(p1.x)} ${round(p1.y)} ${round(b.x)} ${round(b.y)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${round(last.x)} ${round(last.y)}`;
  return d;
}

function shorten(from: Pt, toward: Pt, r: number): Pt {
  const dx = toward.x - from.x;
  const dy = toward.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = Math.min(r, len / 2) / len;
  return { x: from.x + dx * k, y: from.y + dy * k };
}

/** Total straight-line length of a polyline (approx path length). */
export function polyLength(pts: Pt[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return total;
}

/** Point at fractional length t (0..1) along a polyline. */
export function pointAtLength(pts: Pt[], t: number): Pt {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1) return pts[0];
  const total = polyLength(pts);
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (target <= seg) {
      const k = seg === 0 ? 0 : target / seg;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k,
      };
    }
    target -= seg;
  }
  return pts[pts.length - 1];
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
