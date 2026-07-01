import { interpolate, Easing } from "remotion";
import { EO } from "./constants";

/** Opacity 0→1 starting at `start`, over `dur` frames. */
export function fadeIn(frame: number, start: number, dur = 18): number {
  return interpolate(Math.max(0, frame - start), [0, dur], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
}

/** Y translation: slides up from +dist to 0 starting at `start`. */
export function slideUp(frame: number, start: number, dur = 24, dist = 36): number {
  return interpolate(Math.max(0, frame - start), [0, dur], [dist, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
}

/** Scale from `from` to 1. */
export function scaleIn(frame: number, start: number, dur = 28, from = 0.92): number {
  return interpolate(Math.max(0, frame - start), [0, dur], [from, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
}

/** Linear 0→1 progress between two composition frames. */
export function progress(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Scene-level opacity with fade in and fade out. */
export function sceneOpacity(
  frame: number,
  totalFrames: number,
  fadeInDur = 12,
  fadeOutDur = 12,
): number {
  return interpolate(
    frame,
    [0, fadeInDur, totalFrames - fadeOutDur, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}
