import { Easing } from "remotion";

export interface Pt {
  x: number;
  y: number;
}

export interface RoutePoint extends Pt {
  angle: number; // degrees, direction of travel
}

export interface Route {
  d: string;
  length: number;
  pointAt: (t: number) => RoutePoint;
}

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

// Deterministic pseudo-random in [0, 1). Pure function of the seed — no
// Math.random anywhere in this composition.
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const ezOut = Easing.out(Easing.cubic);
export const ezIn = Easing.in(Easing.cubic);
export const ezInOut = Easing.inOut(Easing.cubic);

// Eased progress of `frame` through the window [start, start + dur].
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = ezOut,
): number => easing(clamp01((frame - start) / dur));

/**
 * Builds a rounded-corner route from a polyline. The path is densely
 * sampled so the reported length is exact for the emitted `d` string —
 * which makes strokeDasharray draw-ons and pointAt() lookups line up
 * perfectly with what is rendered.
 */
export const buildRoute = (pts: Pt[], radius = 30): Route => {
  const samples: Pt[] = [];
  const push = (p: Pt) => {
    const last = samples[samples.length - 1];
    if (!last || Math.abs(last.x - p.x) > 0.01 || Math.abs(last.y - p.y) > 0.01) {
      samples.push(p);
    }
  };
  push(pts[0]);
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const d0 = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const d1 = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    const r = Math.min(radius, d0 / 2.2, d1 / 2.2);
    const a = { x: p1.x - ((p1.x - p0.x) / d0) * r, y: p1.y - ((p1.y - p0.y) / d0) * r };
    const b = { x: p1.x + ((p2.x - p1.x) / d1) * r, y: p1.y + ((p2.y - p1.y) / d1) * r };
    push(a);
    for (let s = 1; s <= 8; s++) {
      const t = s / 8;
      push({
        x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * p1.x + t * t * b.x,
        y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * p1.y + t * t * b.y,
      });
    }
  }
  push(pts[pts.length - 1]);

  const cum: number[] = [0];
  for (let i = 1; i < samples.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y));
  }
  const length = cum[cum.length - 1];
  const d = samples
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const pointAt = (t: number): RoutePoint => {
    const target = clamp01(t) * length;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const f = (target - cum[i - 1]) / seg;
    return {
      x: samples[i - 1].x + (samples[i].x - samples[i - 1].x) * f,
      y: samples[i - 1].y + (samples[i].y - samples[i - 1].y) * f,
      angle: (Math.atan2(samples[i].y - samples[i - 1].y, samples[i].x - samples[i - 1].x) * 180) / Math.PI,
    };
  };

  return { d, length, pointAt };
};

// Camera rig: returns a per-plane style factory. Depth 0 = locked,
// 1 = main plane, >1 = foreground (moves slightly more). Motion is a slow
// continuous drift — never a whip or a zoom snap.
export interface CamCfg {
  zoom?: number;
  dx?: number;
  dy?: number;
  rot?: number;
  originX?: number;
  originY?: number;
}

export const makeCamera = (frame: number, dur: number, cfg: CamCfg = {}) => {
  const { zoom = 0.03, dx = -12, dy = 8, rot = 0.7, originX = 54, originY = 46 } = cfg;
  const p = clamp01(frame / dur);
  return (depth: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    transform: `translate3d(${(dx * p * depth).toFixed(2)}px, ${(dy * p * depth).toFixed(2)}px, 0) scale(${(
      1 + zoom * p * depth
    ).toFixed(5)}) rotate(${(rot * p * depth).toFixed(3)}deg)`,
    transformOrigin: `${originX}% ${originY}%`,
  });
};
