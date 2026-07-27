/**
 * Global design tokens — OmniFlow native motion-design build (spec §9).
 * No additional semantic colours beyond these.
 */
export const T = {
  bg: "#05080C",
  bg2: "#09111A",
  mapSurface: "#0C141D",
  raised: "#111B25",
  mapLine: "#18303E",
  mapLineBright: "#244858",

  white: "#F4F6F8",
  gray: "#A0A8B0",
  grayMuted: "#747E88",

  gold: "#D7A04D",
  goldDark: "#8F6631",

  cyan: "#22D3EE",
  cyanCore: "#9AF5FF",
  cyanGlowLow: "rgba(34, 211, 238, 0.18)",
  cyanGlowMed: "rgba(34, 211, 238, 0.34)",
  cyanGlowHigh: "rgba(34, 211, 238, 0.48)",

  failed: "#78838C",

  phoneSurface: "#0E151D",
  phoneCard: "#17212B",
  phoneBorder: "#354653",

  windowWarm: "#E6A44E",
} as const;

// Fonts — Inter Tight (headline/brand) + Geist (body/ui) requested; local
// Inter is the available stand-in. Weights kept ≤ 500 (spec §10).
export const FONT_HEAD = "Inter, system-ui, sans-serif";
export const FONT_BODY = "Inter, system-ui, sans-serif";
export const HEAD_W = 500;
export const BODY_W = 400;

// Easing (spec §7)
export const PREMIUM_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const PREMIUM_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
export const SOFT_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
