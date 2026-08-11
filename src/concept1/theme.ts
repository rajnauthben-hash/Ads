// Design tokens for OmniFlow "Concept 1" — premium editorial dark, condensed
// headline type, restrained gold + sparing electric cyan.

export const C = {
  bg: "#0B0A09",
  bgLift: "#141210",
  headline: "#F1EBDD", // warm off-white
  support: "#ADA9A0", // muted light gray
  supportDim: "#7E7B74",
  gold: "#D89B34",
  goldBright: "#EAC773",
  cyan: "#2AA8FF",
  cyanBright: "#7AD0FF",
  line: "rgba(241,235,221,0.12)",
  lineSoft: "rgba(241,235,221,0.07)",
  boxGold: "#C6902F",
} as const;

export const HEAD_FONT = "Anton, 'Inter Tight', system-ui, sans-serif";
export const BODY_FONT = "Inter, system-ui, sans-serif";

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const TOTAL = 600;

// Safe margins
export const M = { left: 96, right: 96, top: 96, bottom: 96 } as const;

// Scene frame boundaries (spec scene_timing)
export const SCN = {
  s1: [0, 94],
  s2: [95, 189],
  s3: [190, 289],
  s4: [290, 389],
  s5: [390, 489],
  s6: [490, 599],
} as const;
