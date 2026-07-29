// Centralised design tokens for the OmniFlow "Clogged Arteries" ad.
// Every colour, surface, border, glow and shadow used across the build
// resolves to a value here. Do not hard-code colours inside scene files.

export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 900,
} as const;

// --- Backgrounds & surfaces ---
export const COLORS = {
  canvas: "#030608",
  mapEnvironment: "#05090C",
  panelRaised: "#091015",
  panelInset: "#070C10",
  panelActive: "#0A1218",

  // Palette
  cyan: "#18D8FF",
  cyanSecondary: "#08AFCF",
  cyanDeep: "#067F99",
  gold: "#E5A447",
  goldMuted: "#A96F31",
  headline: "#F4F6F8",
  bodyGray: "#A4ABB3",
  mutedGray: "#68727C",
  inactiveGray: "#3E4851",
  amber: "#F2A33D",
  uiText: "#C8CDD2",

  // Borders
  darkBorder: "rgba(255,255,255,0.07)",
  goldBorder: "rgba(229,164,71,0.34)",
  cyanActiveBorder: "rgba(24,216,255,0.72)",
} as const;

export const SHADOWS = {
  panel: "0 24px 70px rgba(0,0,0,0.38)",
} as const;

export const RADII = {
  panel: 22,
  panelSmall: 16,
  phone: 62,
  card: 16,
} as const;

// Restrained glow helpers (max 30px blur, low opacity)
export const cyanGlow = (opacity = 0.35, blur = 24) =>
  `0 0 ${blur}px rgba(24,216,255,${opacity})`;
export const goldGlow = (opacity = 0.28, blur = 22) =>
  `0 0 ${blur}px rgba(229,164,71,${opacity})`;

export const GRAIN_OPACITY = 0.035;
