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

// Scene boundaries (global frames).
// 150f per scene: entrance choreography matches the original 120f design,
// the extra second is pure hold time so copy stays readable.
export const SCENE = {
  s1: 0,
  s2: 150,
  s3: 300,
  s4: 450,
  s5: 600,
  s6: 750,
  s7: 900,
  s8: 1050,
  end: 1200,
  len: 150,
} as const;

// Frame (scene-local) where a scene starts handing off to the next one.
export const EXIT = SCENE.len - 10;
