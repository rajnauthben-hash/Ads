import { Easing, interpolate } from "remotion";
import { EASE, SPRING } from "./styles";

type E4 = readonly [number, number, number, number];

export const bez = (e: E4) => Easing.bezier(e[0], e[1], e[2], e[3]);

/** Clamped bezier interpolate. */
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

/** 0→1 progress starting at `delay`, over `dur` frames. */
export const prog = (frame: number, delay: number, dur: number, e: E4 = EASE.out) =>
  iv(frame, [delay, delay + dur], [0, 1], e);

/** Multi-key interpolation over a shared frame axis. */
export const track = (
  frame: number,
  keys: readonly { f: number; v: number }[],
  e: E4 = EASE.inOut,
) => {
  const fs = keys.map((k) => k.f);
  const vs = keys.map((k) => k.v);
  return interpolate(frame, fs, vs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez(e),
  });
};

export { SPRING };
