// Frame-driven, deterministic helpers. No Math.random anywhere — every
// "organic" value derives from a seed or the current frame.

export type Pt = { x: number; y: number };

// Stable hash-noise in [0,1] for (seed, i) pairs.
export const noise = (seed: number, i: number): number => {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

// Catmull-Rom spline point through waypoints, evaluated at t in [0,1].
export const splinePoint = (pts: Pt[], t: number): Pt => {
  if (pts.length < 2) {
    return pts[0] ?? { x: 0, y: 0 };
  }
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

// Smooth SVG path through waypoints with quadratic joins.
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

// Build an ECG-style heartbeat polyline across [x0,x1] at baseline y, with a
// single sharp spike centered at `spikeAt` (0..1). Deterministic.
export const heartbeatPath = (
  x0: number,
  x1: number,
  y: number,
  amp: number,
  spikeAt = 0.5,
): string => {
  const w = x1 - x0;
  const sx = x0 + w * spikeAt;
  const u = w * 0.05;
  return [
    `M ${x0} ${y}`,
    `L ${sx - u * 3} ${y}`,
    `L ${sx - u * 1.6} ${y + amp * 0.28}`,
    `L ${sx - u * 0.7} ${y - amp}`,
    `L ${sx} ${y + amp * 0.55}`,
    `L ${sx + u * 0.9} ${y - amp * 0.18}`,
    `L ${sx + u * 2.2} ${y}`,
    `L ${x1} ${y}`,
  ].join(" ");
};
