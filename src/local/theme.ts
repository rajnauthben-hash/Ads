// Design system for "The Pulse of Local Search" — OmniFlow Digital.
// Every color, font family and global constant lives here so the whole
// composition speaks one visual language.

export const COLORS = {
  bg: "#05080C",
  panel: "#091019",
  panelRaised: "#0C141E",
  panelBorder: "rgba(85, 188, 235, 0.42)",
  cyan: "#1FC7FF",
  cyanDeep: "#087AC1",
  gold: "#F3BC42",
  goldDeep: "#C98D24",
  white: "#F4F6F8",
  gray: "#A7AFB9",
  grayMuted: "#626C77",
  green: "#53DA69",
} as const;

export const FONTS = {
  head: "Inter Tight",
  body: "IBM Plex Sans",
} as const;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL = 450;

// Dominant windows per scene. Scenes overlap by ~16 frames through
// object-based transitions (each sequence starts before / ends after its
// nominal window).
export const SCENES = {
  s1: { start: 0, end: 75 },
  s2: { start: 75, end: 145 },
  s3: { start: 145, end: 215 },
  s4: { start: 215, end: 285 },
  s5: { start: 285, end: 370 },
  s6: { start: 370, end: 450 },
} as const;

export const OVERLAP = 16;

// Shared map perspective (kept identical across scenes for continuity).
export const MAP_TRANSFORM = "perspective(1500px) rotateX(54deg) rotateZ(-2deg)";
