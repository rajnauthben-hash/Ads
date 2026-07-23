/**
 * A single hand-authored 2.5D perspective for the whole ad.
 *
 * World is addressed in "plan" coordinates:
 *   gx    horizontal lane, -1 (left) .. +1 (right)
 *   depth 0 (near / bottom of frame) .. 1 (far / horizon)
 *   h     world-up height (for extruded buildings), 0 = ground
 *
 * Everything — roads, building footprints, routes, store anchors — is
 * projected through the SAME function, so a route drawn along the grid
 * lands exactly on the roads and meets a store placed on the grid.
 * The map lives in one 1080x1920 SVG coordinate space (world == pixels at
 * camera identity); scene "camera" moves are applied as a group transform.
 */

const HORIZON = 333;
const A = 263.6;
const B = 0.16;
const CX = 540;
const HALF_SPREAD = 980;
const HEIGHT_SCALE = 520;

export type Pt = { x: number; y: number };

/** Horizontal foreshorten factor at a given depth (1 near .. ~0.14 far). */
export function persp(depth: number): number {
  return B / (depth + B);
}

/** Project plan coordinates to SVG pixels. */
export function project(gx: number, depth: number, h = 0): Pt {
  const p = persp(depth);
  const groundY = HORIZON + A / (depth + B);
  return {
    x: CX + gx * p * HALF_SPREAD,
    y: groundY - h * p * HEIGHT_SCALE,
  };
}

// ---------------------------------------------------------------------------
// Road network — avenues (constant gx) and streets (constant depth).
// ---------------------------------------------------------------------------

export const AVENUES = [-1, -0.62, -0.28, 0.06, 0.4, 0.74, 1.08];
export const STREETS = [0.0, 0.12, 0.26, 0.42, 0.6, 0.8, 1.0];

/** A rounded polyline through projected points (restrained corner radius). */
export function roundedPath(pts: Pt[], radius = 26): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const r = Math.min(
      radius,
      dist(p0, p1) / 2,
      dist(p1, p2) / 2,
    );
    const a = lerpPt(p1, p0, r / Math.max(dist(p1, p0), 0.001));
    const b = lerpPt(p1, p2, r / Math.max(dist(p1, p2), 0.001));
    d += ` L ${a.x} ${a.y} Q ${p1.x} ${p1.y} ${b.x} ${b.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/** Build a route path from plan-coordinate waypoints. */
export function routePath(nodes: Array<[number, number]>, radius = 30): string {
  return roundedPath(
    nodes.map(([gx, d]) => project(gx, d)),
    radius,
  );
}

/** Point + tangent at normalized position t (0..1) along a projected polyline. */
export function polyPointAt(pts: Pt[], t: number): { p: Pt; angle: number } {
  if (pts.length === 0) return { p: { x: 0, y: 0 }, angle: 0 };
  if (pts.length === 1) return { p: pts[0], angle: 0 };
  const segLen: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = dist(pts[i], pts[i + 1]);
    segLen.push(l);
    total += l;
  }
  const target = Math.max(0, Math.min(1, t)) * total;
  let acc = 0;
  for (let i = 0; i < segLen.length; i++) {
    if (acc + segLen[i] >= target || i === segLen.length - 1) {
      const local = segLen[i] > 0 ? (target - acc) / segLen[i] : 0;
      const a = pts[i];
      const b = pts[i + 1];
      return {
        p: lerpPt(a, b, local),
        angle: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    acc += segLen[i];
  }
  return { p: pts[pts.length - 1], angle: 0 };
}

/** Project a list of plan waypoints. */
export function projectNodes(nodes: Array<[number, number]>): Pt[] {
  return nodes.map(([gx, d]) => project(gx, d));
}

export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Deterministic pseudo-random for stable procedural city fill. */
export function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
