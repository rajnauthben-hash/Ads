import { Easing } from "remotion";

/**
 * OmniFlow Digital — "Open Doors, Empty Aisles"
 * Design system extracted verbatim from the approved creative brief.
 * One continuous 24s / 720-frame vertical (1080x1920 @ 30fps) motion-graphics ad.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_FRAMES = 720;

/** Absolute frame ranges per scene (inclusive of start). */
export const SCENES = {
  scene_01: { start: 0, end: 179 },
  scene_02: { start: 180, end: 359 },
  scene_03: { start: 360, end: 539 },
  scene_04: { start: 540, end: 719 },
} as const;

/** Critical-content safe zone (platform overlay + inset rule). */
export const SAFE = {
  left: 52,
  right: 100,
  top: 110,
  bottom: 180,
} as const;

export const COLORS = {
  bgBase: "#06090D",
  bgSecondary: "#0B1016",
  white: "#F4F3EF",
  mutedText: "#C7CBD0",
  dimText: "#8E949C",
  warmGold: "#D6A34A",
  goldDark: "#8C6429",
  electricCyan: "#0AB8FF",
  cyanGlow: "rgba(10,184,255,0.28)",
  inactiveRouteGray: "#858A91",
  cardFill: "rgba(10,14,19,0.94)",
  cardBorder: "rgba(255,255,255,0.18)",
  successGreen: "#34C978",
} as const;

/** Font families — bundled project fonts (deterministic, no browser fallbacks). */
export const FONTS = {
  headline: "InterTight, Inter, sans-serif",
  support: "Geist, Inter, sans-serif",
  interface: "IBMPlexSans, Inter, sans-serif",
} as const;

export const TYPO = {
  headlineWeight: 800,
  supportWeight: 400,
  lineHeightHeadline: 0.96,
  lineHeightSupport: 1.36,
  trackingHeadline: "-0.035em",
  trackingSupport: "-0.01em",
} as const;

/** Global easing curves from the brief. */
export const EASE_PRIMARY = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_SECONDARY = Easing.bezier(0.4, 0, 0.2, 1);

/** Route geometry. */
export const ROUTE = {
  solidWidth: 8,
  solidGlowWidth: 24,
  dottedWidth: 7,
  dottedPattern: "16 15",
} as const;

/** Text-in reveal defaults (phrase-group directional mask reveal). */
export const TEXT_IN = {
  startOffsetY: 16,
  blurStart: 8,
  durationFrames: 20,
} as const;
