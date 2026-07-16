// Design system for "The Pulse of Local Search".
// Every color, font and scene boundary lives here so all components stay
// in one visual language.

export const COLORS = {
  bg: "#090B0D",
  slate: "#121314",
  cyan: "#00D2FF",
  cyanSoft: "#45DFFF",
  gold: "#FFC700",
  goldWarm: "#DDAE4A",
  text: "#F4F6F7",
  textDim: "#A7AFB7",
  mutedUi: "rgba(0, 210, 255, 0.14)",
} as const;

export const FONTS = {
  headline: "Inter Tight",
  body: "Inter",
  mono: "IBM Plex Mono",
} as const;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 450;

// Nominal scene boundaries (global frames). Scenes overlap by OVERLAP frames
// through object-based transitions: each scene's sequence starts OVERLAP
// frames before its nominal start and ends OVERLAP frames after its
// nominal end.
export const SCENES = [
  { start: 0, end: 90 }, // 01 — The hook
  { start: 90, end: 162 }, // 02 — Search happens first
  { start: 162, end: 222 }, // 03 — People choose quickly
  { start: 222, end: 294 }, // 04 — Passed over
  { start: 294, end: 372 }, // 05 — What actually matters
  { start: 372, end: 450 }, // 06 — Resolution
] as const;

export const OVERLAP = 10;
