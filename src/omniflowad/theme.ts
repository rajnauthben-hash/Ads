/**
 * OmniFlow Motion Ad — global visual system.
 * Palette + easings + type scale, exactly per the art-direction spec.
 */

export const PAL = {
  // Backgrounds
  bg: "#05070A",
  bgHi: "#0A0E12",

  // Text
  white: "#F4F6F8",
  gray: "#C9D0D6",
  grayDim: "#8E979F",

  // Accents
  cyan: "#11D9F7",
  gold: "#D8A24A",
  red: "#FF5A4F",

  // Strokes / glows
  cyanOutline: "rgba(17,217,247,0.45)",
  cyanGlow: "rgba(17,217,247,0.18)",
  goldGlow: "rgba(216,162,74,0.16)",

  // Surfaces
  card: "rgba(13,18,24,0.92)",
  cardBorder: "rgba(255,255,255,0.08)",

  // Storefront warm light range
  warm: "#F5C97B",
  warmDeep: "#B4762A",
  green: "#34C759",
} as const;

// Easing bezier args
export const EASE = {
  out: [0.16, 1, 0.3, 1] as const, // premium settle
  inOut: [0.65, 0, 0.25, 1] as const, // camera / travel
  soft: [0.33, 1, 0.68, 1] as const, // gentle fades
};

export const FONT = "Inter, sans-serif";

// Scene boundaries (global frames)
export const SCENE = {
  s1: 0,
  s2: 120,
  s3: 240,
  s4: 360,
  s5: 480,
  s6: 600,
  s7: 720,
  s8: 840,
  end: 960,
  len: 120,
} as const;
