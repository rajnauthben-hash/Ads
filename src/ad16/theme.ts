import { Easing } from "remotion";

/**
 * OmniFlow Digital Ad 1.6 — "The Most Valuable Real Estate on Earth".
 * 20s (600f) premium editorial motion-graphics ad across six scenes on one
 * continuous slate-black isometric city. The electric-cyan search route is the
 * persistent motion spine: road -> divider -> phone search -> result cards ->
 * missed fourth slot -> golden triangle -> the YOUR BUSINESS storefront.
 */
export const AD = { width: 1080, height: 1920, fps: 30, frames: 600 } as const;

export const C = {
  black: "#07090B",
  slate: "#0D1116",
  raised: "#151A20",
  raised2: "#1B222A",
  white: "#F4F3EF",
  muted: "#A8ADB3",
  dim: "#6A7079",
  gold: "#D99B25",
  goldLight: "#F1BA4B",
  cyan: "#00D7E6",
  cyanSoft: "rgba(0,215,230,0.34)",
  line: "rgba(255,255,255,0.10)",
  goldLine: "rgba(217,155,37,0.55)",
} as const;

export const FONT = {
  head: "'Inter Tight', Inter, system-ui, sans-serif",
  body: "Manrope, system-ui, sans-serif",
  ui: "'IBM Plex Sans', system-ui, sans-serif",
} as const;

export const EASE = {
  in: Easing.bezier(0.22, 1, 0.36, 1),
  out: Easing.bezier(0.55, 0, 1, 0.45),
  cam: Easing.inOut(Easing.cubic),
  route: Easing.inOut(Easing.quad),
} as const;

export const SAFE = { left: 70, right: 1010, top: 120, bottom: 1760 } as const;

// Scene ranges (spec §"Scene timing").
export const SCN = {
  s1: { start: 0, end: 104, match: 48 },
  s2: { start: 105, end: 204, match: 154 },
  s3: { start: 205, end: 309, match: 259 },
  s4: { start: 310, end: 409, match: 359 },
  s5: { start: 410, end: 509, match: 459 },
  s6: { start: 510, end: 599, match: 570 },
} as const;
