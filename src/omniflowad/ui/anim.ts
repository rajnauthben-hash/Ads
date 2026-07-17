import { Easing, interpolate } from "remotion";
import { EASE } from "../theme";

type E4 = readonly [number, number, number, number];

export const bez = (e: E4) => Easing.bezier(e[0], e[1], e[2], e[3]);

/** Clamped interpolate with bezier easing. */
export const iv = (
  frame: number,
  range: [number, number],
  out: [number, number],
  e: E4 = EASE.out,
) =>
  interpolate(frame, range, out, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez(e),
  });

/** 0→1 progress starting at `delay`, lasting `dur` frames. */
export const prog = (frame: number, delay: number, dur: number, e: E4 = EASE.out) =>
  iv(frame, [delay, delay + dur], [0, 1], e);

/** Standard entrance: rise + blur→sharp + fade. */
export const reveal = (frame: number, delay: number, dur = 24, dy = 20) => {
  const t = prog(frame, delay, dur);
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * dy}px)`,
    filter: `blur(${(1 - t) * 8}px)`,
  } as const;
};

/** Entrance sliding in on X instead of Y. */
export const revealX = (frame: number, delay: number, dur = 24, dx = 40) => {
  const t = prog(frame, delay, dur);
  return {
    opacity: t,
    transform: `translateX(${(1 - t) * dx}px)`,
    filter: `blur(${(1 - t) * 6}px)`,
  } as const;
};

/** Group exit for scene hand-offs: fade + drift + soften. */
export const fadeOut = (frame: number, start: number, dur = 18, dy = -16) => {
  const t = prog(frame, start, dur, EASE.soft);
  return {
    opacity: 1 - t,
    transform: `translateY(${t * dy}px)`,
    filter: `blur(${t * 8}px)`,
  } as const;
};

/** Pop-in with slight overshoot (markers, icons). */
export const pop = (frame: number, delay: number, dur = 14) => {
  const t = prog(frame, delay, dur, EASE.out);
  const s = t < 1 ? 0.6 + 0.48 * t - 0.08 * Math.sin(t * Math.PI) : 1;
  return { opacity: Math.min(1, t * 1.6), transform: `scale(${s})` } as const;
};
