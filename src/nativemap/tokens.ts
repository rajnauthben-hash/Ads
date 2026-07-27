/**
 * Design tokens for the OmniFlow native motion-design build.
 * Stylised 2.5D navigation-map aesthetic — deep matte night, electric cyan
 * signal, restrained warm gold destinations, editorial white text.
 */
export const T = {
  // background / map
  bg0: "#05070C",
  bg1: "#080C16",
  bg2: "#0B1220",
  block: "#0C1322",
  blockTop: "#111A2C",
  blockEdge: "#182338",
  street: "rgba(90,150,210,0.10)",
  streetBright: "rgba(70,190,255,0.20)",

  // signal / accents
  cyan: "#2FB4FF",
  cyanCore: "#BFEBFF",
  cyanDeep: "#0C6FB0",
  cyanGlow: "rgba(47,180,255,0.55)",
  cyanSoft: "rgba(47,180,255,0.16)",

  gold: "#E3A94E",
  goldSoft: "#C8924A",
  goldDim: "rgba(227,169,78,0.5)",
  windowWarm: "#F2B45B",

  // text
  white: "#F4F6FA",
  gray: "#9BA6B6",
  grayDim: "#6D7889",

  // surfaces
  panel: "rgba(10,16,28,0.72)",
  panelBorder: "rgba(120,180,230,0.22)",
} as const;

export const FONT = "Inter, system-ui, sans-serif";

export const EASE = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
