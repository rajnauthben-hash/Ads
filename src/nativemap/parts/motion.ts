import { interpolate, Easing } from "remotion";
import { PREMIUM_OUT, SOFT_OUT } from "../tokens";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));

const bez = (c: [number, number, number, number]) => Easing.bezier(c[0], c[1], c[2], c[3]);
export const easeOut = (p: number) => bez(PREMIUM_OUT)(clamp01(p));
export const easeSoft = (p: number) => bez(SOFT_OUT)(clamp01(p));

/** Interpolate a value across [a,b] with premium-out easing. */
export function ramp(f: number, a: number, b: number, from: number, to: number, ease = SOFT_OUT): number {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: bez(ease) });
}

/**
 * Headline entrance (spec §10): 14–20px rise, blur 6→0, opacity 0→1, slight
 * tracking tightening, left-to-right clipping mask. No bounce.
 */
export function headIn(p: number, move = 18): React.CSSProperties {
  const t = easeOut(p);
  const inv = 1 - t;
  return {
    clipPath: `inset(-0.2em ${inv * 100}% -0.2em -0.03em)`,
    WebkitClipPath: `inset(-0.2em ${inv * 100}% -0.2em -0.03em)`,
    transform: `translateY(${inv * move}px)`,
    filter: `blur(${inv * 6}px)`,
    opacity: clamp01(t * 1.4),
    letterSpacing: `${inv * 0.6 - 0.2}px`,
  };
}

/** Body entrance: 10–12px rise, blur 4→0, opacity 0→1. */
export function bodyIn(p: number, move = 11): React.CSSProperties {
  const t = easeOut(p);
  const inv = 1 - t;
  return {
    transform: `translateY(${inv * move}px)`,
    filter: `blur(${inv * 4}px)`,
    opacity: clamp01(t * 1.4),
  };
}
