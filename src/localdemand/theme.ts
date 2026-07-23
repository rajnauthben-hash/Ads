/**
 * Shared design tokens for the OmniFlow "Local Demand" ad.
 * Deep matte-black nighttime city, electric cyan route, restrained warm gold.
 */

export const COLOR = {
  // Background / atmosphere
  black: "#04060A",
  bgTop: "#070B12",
  bgDeep: "#02040A",
  asphalt: "#0B1017",
  asphaltEdge: "#141B26",
  block: "#0A0F17",
  blockTop: "#111823",
  blockSide: "#070B11",

  // Warm city life
  window: "#F0A94B",
  windowDim: "rgba(240, 169, 75, 0.55)",
  cityGlow: "rgba(244, 165, 53, 0.16)",

  // Primary accent — electric cyan
  cyan: "#39C6FF",
  cyanCore: "#BEEBFF",
  cyanDeep: "#0A84C7",
  cyanGlow: "rgba(57, 198, 255, 0.55)",
  cyanGlowSoft: "rgba(57, 198, 255, 0.16)",

  // Secondary accent — restrained warm gold
  gold: "#E7A84E",
  goldSoft: "#C79A5B",

  // Text
  white: "#F4F6FA",
  gray: "#9AA6B6",
  grayDim: "#6E7A8A",

  // UI surfaces
  cardBg: "rgba(10, 15, 24, 0.72)",
  cardBorder: "rgba(255,255,255,0.10)",
} as const;

export const FONT = {
  // Local Inter emulates the reference's Inter Tight / geometric sans.
  head: "Inter, system-ui, sans-serif",
  body: "Inter, system-ui, sans-serif",
  ui: "Inter, system-ui, sans-serif",
} as const;

export const EASE = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  soft: [0.33, 0, 0.2, 1] as [number, number, number, number],
} as const;

// Composition
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION = 600;

// Scene boundaries (global frames)
export const SCENE = {
  s1: { start: 0, end: 135 },
  s2: { start: 135, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
} as const;
