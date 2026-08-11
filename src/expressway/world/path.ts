// Minimal cubic-Bézier polyline model.
// Each route is a chain of cubic segments sharing endpoints. We can render it
// as an SVG path AND evaluate position/tangent at any parameter t (0..1) so
// travelling pulses and directional arrows stay perfectly frame-deterministic.

export type Pt = { x: number; y: number };
export type Seg = [Pt, Pt, Pt, Pt]; // P0, C1, C2, P3

export function toD(segs: Seg[]): string {
  if (!segs.length) return "";
  const [p0] = segs[0];
  let d = `M ${p0.x} ${p0.y}`;
  for (const s of segs) d += ` C ${s[1].x} ${s[1].y} ${s[2].x} ${s[2].y} ${s[3].x} ${s[3].y}`;
  return d;
}

function cubic(s: Seg, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u,
    b = 3 * u * u * t,
    c = 3 * u * t * t,
    d = t * t * t;
  return {
    x: a * s[0].x + b * s[1].x + c * s[2].x + d * s[3].x,
    y: a * s[0].y + b * s[1].y + c * s[2].y + d * s[3].y,
  };
}

function cubicDeriv(s: Seg, t: number): Pt {
  const u = 1 - t;
  const a = 3 * u * u,
    b = 6 * u * t,
    c = 3 * t * t;
  return {
    x: a * (s[1].x - s[0].x) + b * (s[2].x - s[1].x) + c * (s[3].x - s[2].x),
    y: a * (s[1].y - s[0].y) + b * (s[2].y - s[1].y) + c * (s[3].y - s[2].y),
  };
}

// Sample a whole route (segments treated as equal parameter slices) at
// global t in [0,1], returning point + heading angle in degrees.
export function sampleRoute(segs: Seg[], t: number): { x: number; y: number; angle: number } {
  const tt = Math.max(0, Math.min(1, t));
  const n = segs.length;
  const scaled = tt * n;
  let i = Math.floor(scaled);
  if (i >= n) i = n - 1;
  const local = scaled - i;
  const p = cubic(segs[i], local);
  const dv = cubicDeriv(segs[i], local);
  return { x: p.x, y: p.y, angle: (Math.atan2(dv.y, dv.x) * 180) / Math.PI };
}
