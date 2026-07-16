// Frame-driven, deterministic helpers. No Math.random anywhere — every
// "organic" value is derived from a seed or the current frame.

export type Pt = { x: number; y: number };

// Park–Miller PRNG; call the returned function repeatedly for a stable
// deterministic stream for a given seed.
export const seeded = (seed: number): (() => number) => {
  let s = Math.floor(seed) % 2147483647;
  if (s <= 0) {
    s += 2147483646;
  }
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// Stable hash-noise in [0,1] for (seed, i) pairs — cheap per-frame lookups.
export const noise = (seed: number, i: number): number => {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

// Point on a cubic bezier.
export const cubicPoint = (
  p0: Pt,
  p1: Pt,
  p2: Pt,
  p3: Pt,
  t: number,
): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

// Catmull-Rom spline through waypoints, evaluated at t in [0,1].
export const splinePoint = (pts: Pt[], t: number): Pt => {
  const n = pts.length - 1;
  const tt = clamp01(t) * n;
  const i = Math.min(Math.floor(tt), n - 1);
  const local = tt - i;
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)];
  const t2 = local * local;
  const t3 = t2 * local;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * local +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * local +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
};

// Build an SVG path string through waypoints with smooth quadratic joins.
export const smoothPath = (pts: Pt[]): string => {
  if (pts.length < 2) {
    return "";
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i].x + pts[i + 1].x) / 2;
    const midY = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${midX} ${midY}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
};
