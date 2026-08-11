// Design tokens for the "Local Search Expressway" ad (OmniFlow 3.2).
// Values taken verbatim from the v3.0 spec design_system.

export const T = {
  bg: "#071016",
  bg2: "#0B141B",
  headline: "#F7F8FA",
  support: "#AAB0B7",
  cyan: "#22D8FF",
  cyanHi: "#7AEAFF",
  gold: "#E6AA49",
  grayRoute: "#737A80",
  warning: "#EF5B45",
  storefront: "#E9A451",
} as const;

// Inter is the available local font; the spec asks for "Inter Tight" with
// Inter-family fallbacks, so Inter is the closest faithful substitute.
export const FONT = "Inter, 'Inter Tight', system-ui, sans-serif";

// Format
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const TOTAL = 600;

// Safe zone (spec)
export const SAFE = { left: 60, right: 960, top: 120, bottom: 1710 } as const;

// Scene frame boundaries (spec scene_timeline)
export const SCN = {
  s1: [0, 119],
  s2: [120, 239],
  s3: [240, 359],
  s4: [360, 479],
  s5: [480, 599],
} as const;
