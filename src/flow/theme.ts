import { Easing } from "remotion";

/**
 * OmniFlow 2.5 — "Restoring the Flow".
 * A 20s (600f) premium kinetic-typography ad. Typography IS the visual system:
 * no maps, icons, storefronts or decoration — only live text, ghost echoes and
 * motion smear. Five approved states that physically transform into each other.
 */
export const FLOW = { width: 1080, height: 1920, fps: 30, frames: 600 } as const;

export const K = {
  bg: "#03070C",
  bg2: "#071019",
  white: "#F5F5F2",
  silver: "#B8BABD",
  muted: "#9FA5AD",
  ghost: "#303842",
  gold: "#EAAA2F",
  goldBright: "#F1B63E",
} as const;

export const KF = {
  sans: "'Inter Tight', system-ui, sans-serif",
  body: "'Inter Tight', Manrope, system-ui, sans-serif",
} as const;

export const KE = {
  in: Easing.bezier(0.22, 1, 0.36, 1),
  out: Easing.bezier(0.55, 0, 1, 0.45),
  move: Easing.inOut(Easing.cubic),
} as const;

export const KSAFE = { left: 64, right: 1016, top: 100, bottom: 1720 } as const;

export const KSC = {
  s1: { start: 0, end: 119, match: 90 },
  s2: { start: 120, end: 239, match: 210 },
  s3: { start: 240, end: 359, match: 330 },
  s4: { start: 360, end: 479, match: 450 },
  s5: { start: 480, end: 599, match: 570 },
} as const;
