import { interpolate } from "remotion";
import { EASE_PRIMARY, EASE_SECONDARY, TEXT_IN } from "./constants";

/** Clamped interpolate with the brief's primary (expensive) easing. */
export const ease = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing = EASE_PRIMARY,
) =>
  interpolate(frame, inputRange, outputRange, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const easeSec = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) => ease(frame, inputRange, outputRange, EASE_SECONDARY);

/**
 * Phrase-group directional mask reveal. Returns style for a text/phrase group
 * that rises from below with blur-to-sharp and a clip mask, per the brief's
 * `text_in` spec. `start` is the local frame the reveal begins.
 */
export function revealIn(frame: number, start: number, dur = TEXT_IN.durationFrames) {
  const p = ease(frame, [start, start + dur], [0, 1]);
  const y = ease(frame, [start, start + dur], [TEXT_IN.startOffsetY, 0]);
  const blur = ease(frame, [start, start + dur], [TEXT_IN.blurStart, 0]);
  return {
    opacity: p,
    transform: `translateY(${y}px)`,
    filter: `blur(${blur}px)`,
    // Directional mask reveal that grows downward. Horizontal insets are pushed
    // far negative so the clip never trims wide text — only the vertical wipe.
    clipPath: `inset(-4px -900px ${(1 - p) * 100}% -900px)`,
  } as const;
}

/**
 * Controlled horizontal-slice / masked-condensation exit. Text condenses and
 * slides a short distance rather than crossfading.
 */
export function revealOut(frame: number, start: number, dur = 16) {
  const p = ease(frame, [start, start + dur], [0, 1], EASE_SECONDARY);
  return {
    opacity: 1 - p,
    transform: `translateX(${-18 * p}px)`,
    clipPath: `inset(0 ${p * 100}% 0 0)`,
  } as const;
}

/** Subtle continuous camera breathing (scale + lateral drift) for a scene. */
export function cameraDrift(frame: number, span: number) {
  const t = frame / span;
  return {
    scale: 1 + 0.035 * (0.5 - Math.cos(t * Math.PI * 2) / 2),
    x: Math.sin(t * Math.PI * 2) * 11,
  };
}
