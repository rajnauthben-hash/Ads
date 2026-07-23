/**
 * Shared design tokens for the OmniFlow "Local Demand" ad.
 * Palette + type calibrated to the approved reference frames.
 */

export const COLOR = {
  // Background / atmosphere
  black: "#05080C",
  bg2: "#091018",
  bgDeep: "#03050A",

  // Text
  white: "#F2F2F0",
  gray: "#A5A8A7",
  grayDim: "#797F83",

  // Warm restrained gold
  gold: "#D19A50",
  goldDark: "#9E6F37",

  // Electric cyan
  cyan: "#26D9FF",
  cyanCore: "#A6F4FF",
  cyanDeep: "#0F82B8",
  cyanGlow: "rgba(38, 217, 255, 0.20)",
  cyanGlowStrong: "rgba(38, 217, 255, 0.42)",

  // Warm window life
  window: "#F0A94B",
} as const;

export const FONT = {
  head: "Inter, system-ui, sans-serif",
  body: "Inter, system-ui, sans-serif",
  ui: "Inter, system-ui, sans-serif",
} as const;

// Editorial headline weight — restrained, NOT poster-bold.
export const HEAD_WEIGHT = 400;

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

// Safe zones (px)
export const SAFE = { left: 54, right: 1026, top: 120, bottom: 1780 } as const;

// Scene boundaries (global frames)
export const SCENE = {
  s1: { start: 0, end: 135 },
  s2: { start: 135, end: 300 },
  s3: { start: 300, end: 450 },
  s4: { start: 450, end: 600 },
} as const;

export const PLATE = {
  scene1: "references/scene1.png",
  scene2: "references/scene2.png",
  scene3: "references/scene3.png",
  scene4: "references/scene4.png",
} as const;
