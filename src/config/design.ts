// ═══════════════════════════════════════════════════════════════════════
// THE INVISIBLE STOREFRONT — design system single source of truth
// ═══════════════════════════════════════════════════════════════════════

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DURATION = 900;

export const COLORS = {
  bg: "#121314",
  cyan: "#00D2FF",
  gold: "#FFC700",
  textPrimary: "#F4F6F7",
  textSecondary: "#AEB5BC",
  mutedCyan: "rgba(0, 210, 255, 0.14)",
  mutedCyanBorder: "rgba(0, 210, 255, 0.28)",
  cyanGlow: "rgba(0, 210, 255, 0.45)",
  goldGlow: "rgba(255, 199, 0, 0.45)",
  dim: "rgba(174, 181, 188, 0.32)",
  dimBorder: "rgba(174, 181, 188, 0.2)",
} as const;

export const SAFE = { left: 68, right: 68, top: 58, bottom: 80 } as const;

// Base perspective transform applied to the persistent world-map plane.
export const MAP_TRANSFORM = {
  perspective: 1400,
  rotateX: 56,
  rotateZ: -6,
} as const;

export const HEADER = {
  x: 68,
  y: 58,
  fontSize: 23,
  fontWeight: 500,
  letterSpacing: "0.16em",
} as const;

export const TYPE = {
  headlineWeight: 500,
  headlineLetterSpacing: "-0.035em",
  headlineLineHeight: 1.03,
  bodyWeight: 400,
  bodyLineHeight: 1.45,
} as const;
