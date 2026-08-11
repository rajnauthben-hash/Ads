import { interpolate, Easing } from "remotion";

// Multi-stop keyframe interpolation with a shared easing.
export function kf(
  frame: number,
  points: number[],
  values: number[],
  easing: (n: number) => number = Easing.bezier(0.5, 0, 0.2, 1),
): number {
  return interpolate(frame, points, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

// Blur-to-sharp / translate / fade entrance used by all readable copy.
// Returns inline style props for a text element given a local frame.
export function enter(
  local: number,
  delay: number,
  {
    dist = 18,
    dur = 26,
    blur = 8,
    axis = "y",
  }: { dist?: number; dur?: number; blur?: number; axis?: "x" | "y" } = {},
) {
  const f = local - delay;
  const p = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const off = (1 - p) * dist;
  const b = (1 - p) * blur;
  return {
    opacity: p,
    filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none",
    transform: axis === "y" ? `translateY(${off.toFixed(2)}px)` : `translateX(${off.toFixed(2)}px)`,
  };
}

// Mask/slice exit — copy is pulled toward the cyan route (up + right) and
// wiped with a clip-path rather than dissolving the whole screen.
export function exitClip(
  local: number,
  start: number,
  { dur = 20 }: { dur?: number } = {},
) {
  const f = local - start;
  if (f <= 0) return { opacity: 1, transform: "none", clipPath: "none" as string, filter: "none" };
  const p = interpolate(f, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const tx = p * 40;
  const ty = p * -22;
  const b = p * 6;
  // Wipe from bottom-up.
  const inset = (p * 100).toFixed(1);
  return {
    opacity: 1 - p,
    transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`,
    clipPath: `inset(0 0 ${inset}% 0)`,
    filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none",
  };
}

// Deterministic PRNG so the generated city is stable across renders.
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
