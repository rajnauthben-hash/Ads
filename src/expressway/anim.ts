import { interpolate, Easing } from "remotion";

// Shared easing curves (cinematic, restrained — per motion_character).
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// interp over an [inStart,inEnd] window -> [from,to], clamped, eased-out.
export function win(
  frame: number,
  inStart: number,
  inEnd: number,
  from: number,
  to: number,
  easing = EASE.out,
) {
  return interpolate(frame, [inStart, inEnd], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

// A value that eases in over [a,b] and out over [c,d] (e.g. opacity envelopes).
export function envelope(frame: number, a: number, b: number, c: number, d: number) {
  return interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.soft,
  });
}

// Phrase-group headline reveal: translateY + blur->0 + fade (no typewriter).
export function reveal(frame: number, delay: number, dur = 22) {
  const f = frame - delay;
  const opacity = win(f, 0, dur, 0, 1);
  const y = win(f, 0, dur, 16, 0);
  const blur = win(f, 0, dur, 7, 0);
  return { opacity, transform: `translateY(${y}px)`, filter: `blur(${blur}px)` };
}
