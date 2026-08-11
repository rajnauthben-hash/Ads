import { Easing } from "remotion";

/**
 * OmniFlow 3.2 — The Local Search Expressway.
 * A 20s (600f) text-led / vector-led motion-graphics ad. Photorealism is
 * forbidden: everything here is live React text + editable SVG. This file is the
 * single source of palette, type and easing for the whole build.
 */

export const EXP = {
  width: 1080,
  height: 1920,
  fps: 30,
  frames: 600,
} as const;

export const C = {
  black: "#03070C",
  navy: "#07121E",
  navy2: "#050C15",
  map: "#13283A",
  mapFaint: "#0E1C29",
  white: "#F5F5F2",
  muted: "#A7ADB4",
  cyan: "#11CFFF",
  cyanHi: "#7CEAFF",
  gold: "#E9B24C",
  goldSoft: "#C9974A",
  gray: "#707881",
  grayDark: "#454C54",
  red: "#F25A47",
} as const;

// Type roles. Bold condensed sans (Inter Tight) for punchy scenes; editorial
// serif (Georgia) for scenes 2/4/5; clean sans for support copy + UI.
export const F = {
  sans: "'Inter Tight', system-ui, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  body: "Manrope, system-ui, sans-serif",
  ui: "'IBM Plex Sans', system-ui, sans-serif",
} as const;

export const E = {
  textIn: Easing.bezier(0.22, 1, 0.36, 1),
  textOut: Easing.bezier(0.55, 0, 1, 0.45),
  camera: Easing.inOut(Easing.cubic),
  route: Easing.inOut(Easing.quad),
  card: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

export const SAFE = { left: 54, right: 1026, top: 110, bottom: 1740 } as const;

// Scene ranges (frames). Transitions live inside the tail of each range.
export const SC = {
  s1: { start: 0, end: 119, match: 90 },
  s2: { start: 120, end: 239, match: 210 },
  s3: { start: 240, end: 359, match: 330 },
  s4: { start: 360, end: 479, match: 450 },
  s5: { start: 480, end: 599, match: 570 },
} as const;
