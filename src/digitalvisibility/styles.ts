/**
 * OmniFlow Digital Visibility Ad — design tokens.
 * Palette + typography + easings, verbatim from the art-direction spec.
 */

export const C = {
  bg: "#05090D",
  surface: "#091118",
  grid: "#182631",

  cyan: "#00D9FF",
  cyan2: "#55DDF5",
  cyanSoft: "#A5EEFA",

  gold: "#E2A746",
  goldLight: "#F1C36A",

  white: "#F4F6F7",
  gray: "#9BA5AB",
  grayMute: "#66727A",

  red: "#FF574D",
  red2: "#FF6A55",
  green: "#45D982",

  panel: "rgba(5, 12, 18, 0.88)",
  panelOutline: "rgba(0, 217, 255, 0.55)",
  goldOutline: "rgba(226, 167, 70, 0.70)",

  warm: "#FFB65C",
} as const;

export const F = {
  head: "'Inter Tight', sans-serif", // 700–800 headlines
  body: "'Manrope', sans-serif", // 400–500 editorial
  ui: "'IBM Plex Sans', sans-serif", // 400–600 UI labels / diagnostics
} as const;

// Easing bezier args
export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.25, 1] as const,
  soft: [0.33, 1, 0.68, 1] as const,
};

// Low-bounce spring config per spec
export const SPRING = {
  text: { damping: 21, stiffness: 110, mass: 0.95 },
  object: { damping: 20, stiffness: 95, mass: 1.0 },
} as const;
