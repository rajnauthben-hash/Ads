/** Deterministic point sampling along an "M x y C ... C ..." path string. */

type P = { x: number; y: number };

function buildSegs(d: string): [P, P, P, P][] {
  const t = d.replace(/,/g, " ").trim().split(/\s+/);
  let i = 0;
  let cur: P = { x: 0, y: 0 };
  const segs: [P, P, P, P][] = [];
  while (i < t.length) {
    const c = t[i++];
    if (c === "M") {
      cur = { x: +t[i++], y: +t[i++] };
    } else if (c === "C") {
      const p1 = { x: +t[i++], y: +t[i++] };
      const p2 = { x: +t[i++], y: +t[i++] };
      const p3 = { x: +t[i++], y: +t[i++] };
      segs.push([cur, p1, p2, p3]);
      cur = p3;
    } else {
      i++;
    }
  }
  return segs;
}

function cubic(seg: [P, P, P, P], t: number): P {
  const [a, b, c, d] = seg;
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  };
}

type Lut = { pts: P[]; cum: number[]; total: number };
const cache = new Map<string, Lut>();

function lutFor(d: string): Lut {
  const hit = cache.get(d);
  if (hit) return hit;
  const segs = buildSegs(d);
  const pts: P[] = [];
  const N = 40;
  for (const seg of segs) for (let k = 0; k <= N; k++) pts.push(cubic(seg, k / N));
  const cum: number[] = [0];
  for (let k = 1; k < pts.length; k++) {
    cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
  }
  const lut = { pts, cum, total: cum[cum.length - 1] || 1 };
  cache.set(d, lut);
  return lut;
}

/** Point at normalized distance t (0..1) along the path. */
export function pointAtFrac(d: string, t: number): P {
  const lut = lutFor(d);
  const target = Math.max(0, Math.min(1, t)) * lut.total;
  let lo = 0;
  let hi = lut.cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (lut.cum[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const segLen = lut.cum[i] - lut.cum[i - 1] || 1;
  const f = (target - lut.cum[i - 1]) / segLen;
  const a = lut.pts[i - 1];
  const b = lut.pts[i];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}
