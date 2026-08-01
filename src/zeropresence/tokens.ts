// ============================================================================
// OmniFlow "Zero Presence" Ad — Shared design tokens
// Single source of truth for colors, typography and layout constants.
// ============================================================================

export const COLORS = {
  // Backgrounds
  canvasBlack: "#02060A",
  matteBlack: "#05080C",
  panelBlack: "#09111A",
  raisedDark: "#0C151E",
  interfaceDark: "#111A24",
  secondaryDark: "#16212C",

  // Text
  editorialWhite: "#F4F6F8",
  softWhite: "#E8EDF1",
  supportGrey: "#A4ACB5",
  mutedGrey: "#717B85",
  disabledGrey: "#59636D",

  // Cyan (digital)
  cyan: "#22D3EE",
  cyanBright: "#A6F7FF",
  cyanDark: "#047EA0",
  cyanGlow: "rgba(34,211,238,0.26)",
  cyanGlowStrong: "rgba(34,211,238,0.46)",

  // Warm (physical / storefront)
  warmGold: "#D7A04D",
  warmGoldBright: "#E6B665",
  warmAmber: "#BF7D32",

  // Status
  successGreen: "#43D17A",
  warningRed: "#F2645A",
} as const;

// Fonts. Spec requests Inter Tight (headline) + Geist (body/ui). Those exact
// files are not bundled in this repo; Inter (bundled, weights 400-800) is the
// closest metrics-compatible substitute for both and is used throughout.
export const FONTS = {
  headline: "Inter, Manrope, sans-serif",
  body: "Inter, Manrope, sans-serif",
  ui: "Inter, Manrope, sans-serif",
  label: "Inter, Manrope, sans-serif",
} as const;

// Canvas
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_FRAMES = 720;

// Safe zones
export const SAFE = {
  left: 80,
  right: 825,
  top: 190,
  bottom: 1460,
} as const;

export const RESERVED = {
  top: 170, // y 0-170
  rightX: 850, // x 850-1080
  bottom: 1500, // y 1500-1920
} as const;

// Signature easing from the brief
export const EASE_BEZIER = [0.22, 1, 0.36, 1] as const;
