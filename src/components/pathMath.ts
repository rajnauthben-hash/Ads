export interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom spline through waypoints, converted to a smooth cubic-bezier SVG path. */
export const smoothPath = (points: Pt[]): string => {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

export const polylineLength = (points: Pt[]): number => {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return len;
};

/** Point + heading angle (degrees) at fraction t [0,1] along a polyline. */
export const pointAtFraction = (
  points: Pt[],
  t: number,
): { x: number; y: number; angle: number } => {
  const clamped = Math.max(0, Math.min(1, t));
  const total = polylineLength(points);
  const target = total * clamped;
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (acc + segLen >= target || i === points.length - 1) {
      const segT = segLen === 0 ? 0 : (target - acc) / segLen;
      const x = points[i - 1].x + (points[i].x - points[i - 1].x) * segT;
      const y = points[i - 1].y + (points[i].y - points[i - 1].y) * segT;
      const angle =
        (Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x) * 180) /
        Math.PI;
      return { x, y, angle };
    }
    acc += segLen;
  }
  const last = points[points.length - 1];
  return { x: last.x, y: last.y, angle: 0 };
};

/** Deterministic pseudo-random in [0,1) from an integer seed — no Math.random(). */
export const hash = (i: number): number => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
