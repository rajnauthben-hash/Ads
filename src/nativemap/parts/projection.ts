/**
 * Gentle one-point perspective for the stylised navigation map. Every map
 * element (streets, blocks, POI, storefronts, routes) shares this projection
 * so the world reads as one coherent 2.5D plane across the full 1080x1920.
 *   gx    horizontal lane, roughly [-1.3, 1.3]
 *   depth 0 (near / bottom) .. 1 (far / horizon)
 *   h     world-up height for extrusions
 */
const HORIZON = 283;
const A = 338.2;
const B = 0.22;
const CX = 540;
const HALF = 760;
const HSCALE = 520;

export type Pt = { x: number; y: number };

export const persp = (d: number) => B / (d + B);

export function project(gx: number, depth: number, h = 0): Pt {
  const p = persp(depth);
  const groundY = HORIZON + A / (depth + B);
  return { x: CX + gx * p * HALF, y: groundY - h * p * HSCALE };
}

export const poly = (pts: Pt[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/** Rounded polyline through points (restrained corner radius). */
export function roundedPath(pts: Pt[], radius = 26): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const d1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const r = Math.min(radius, d1 / 2, d2 / 2);
    const a = { x: p1.x + ((p0.x - p1.x) / d1) * r, y: p1.y + ((p0.y - p1.y) / d1) * r };
    const b = { x: p1.x + ((p2.x - p1.x) / d2) * r, y: p1.y + ((p2.y - p1.y) / d2) * r };
    d += ` L ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

// --- General path sampler (handles M / L / Q / C) for route pulse heads ---
const _lut = new Map<string, { pts: Pt[]; cum: number[]; total: number }>();

function samplePts(d: string): Pt[] {
  const tk = d.replace(/,/g, " ").trim().split(/\s+/);
  let i = 0;
  let cur: Pt = { x: 0, y: 0 };
  const out: Pt[] = [];
  const q = (a: Pt, b: Pt, c: Pt, t: number): Pt => {
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * b.x + t * t * c.x, y: u * u * a.y + 2 * u * t * b.y + t * t * c.y };
  };
  const cub = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
    const u = 1 - t;
    return {
      x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * e.x,
      y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * e.y,
    };
  };
  while (i < tk.length) {
    const c = tk[i++];
    if (c === "M") { cur = { x: +tk[i++], y: +tk[i++] }; out.push(cur); }
    else if (c === "L") { cur = { x: +tk[i++], y: +tk[i++] }; out.push(cur); }
    else if (c === "Q") {
      const b = { x: +tk[i++], y: +tk[i++] };
      const e = { x: +tk[i++], y: +tk[i++] };
      for (let k = 1; k <= 12; k++) out.push(q(cur, b, e, k / 12));
      cur = e;
    } else if (c === "C") {
      const b = { x: +tk[i++], y: +tk[i++] };
      const cc = { x: +tk[i++], y: +tk[i++] };
      const e = { x: +tk[i++], y: +tk[i++] };
      for (let k = 1; k <= 16; k++) out.push(cub(cur, b, cc, e, k / 16));
      cur = e;
    } else { i++; }
  }
  return out;
}

export function pathPointAt(d: string, t: number): Pt {
  let lut = _lut.get(d);
  if (!lut) {
    const pts = samplePts(d);
    const cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
    lut = { pts, cum, total: cum[cum.length - 1] || 1 };
    _lut.set(d, lut);
  }
  if (lut.pts.length === 0) return { x: 0, y: 0 };
  if (lut.pts.length === 1) return lut.pts[0];
  const target = Math.max(0, Math.min(1, t)) * lut.total;
  let lo = 0, hi = lut.cum.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (lut.cum[m] < target) lo = m + 1; else hi = m; }
  const idx = Math.max(1, lo);
  const seg = lut.cum[idx] - lut.cum[idx - 1] || 1;
  const f = (target - lut.cum[idx - 1]) / seg;
  const a = lut.pts[idx - 1], b = lut.pts[idx];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

/** Deterministic pseudo-random. */
export function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
