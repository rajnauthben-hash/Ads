import { interpolate, Easing } from "remotion";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function win(
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing = EASE.out,
) {
  return interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

export function envelope(frame: number, a: number, b: number, c: number, d: number) {
  return interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.soft,
  });
}

// Directional mask/blur reveal for a text line (phrase-group friendly).
export function reveal(frame: number, delay: number, dur = 20, travel = 18) {
  const f = frame - delay;
  return {
    opacity: win(f, 0, dur, 0, 1),
    transform: `translateY(${win(f, 0, dur, travel, 0)}px)`,
    filter: `blur(${win(f, 0, dur, 6, 0)}px)`,
  };
}
