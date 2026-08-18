import { Easing } from "remotion";

/**
 * OmniFlow — "Route the Traffic to Your Door".
 * 20s (600f) premium motion-graphics ad. One persistent cyan customer route on
 * a dark textured isometric map reroutes across five scenes: it bypasses the
 * business, becomes a decision path, leads to a competitor, then reroutes and
 * finally connects to the business.
 */
export const RT = { width: 1080, height: 1920, fps: 30, frames: 600 } as const;

export const RC = {
  black: "#05070B",
  char: "#0C1016",
  char2: "#11161E",
  line: "#1B2531",
  white: "#F3F1EC",
  cream: "#E9E5DC",
  muted: "#9AA1AB",
  gray: "#5C646E",
  grayDim: "#39404A",
  cyan: "#28ABF2",
  cyanHi: "#7FD2FF",
  gold: "#E7A93A",
  goldHi: "#F4C462",
} as const;

export const RF = {
  head: "'Inter Tight', system-ui, sans-serif",
  body: "Manrope, system-ui, sans-serif",
  ui: "'IBM Plex Sans', system-ui, sans-serif",
} as const;

export const RE = {
  in: Easing.bezier(0.22, 1, 0.36, 1),
  out: Easing.bezier(0.55, 0, 1, 0.45),
  move: Easing.inOut(Easing.cubic),
  route: Easing.inOut(Easing.quad),
} as const;

export const RSAFE = { left: 64, right: 1016, top: 96, bottom: 1740 } as const;

export const RSC = {
  s1: { start: 0, end: 119, match: 90 },
  s2: { start: 120, end: 239, match: 210 },
  s3: { start: 240, end: 359, match: 330 },
  s4: { start: 360, end: 479, match: 450 },
  s5: { start: 480, end: 599, match: 570 },
} as const;
