/**
 * OmniFlow Local Visibility Ad — design tokens per the art-direction spec.
 */

export const C = {
  bg: "#05080B",
  bg2: "#091016",
  white: "#F4F5F6",
  gray: "#C6CBD0",
  muted: "#8C959D",
  cyan: "#00D8F2",
  cyanGlow: "rgba(0, 216, 242, 0.26)",
  gold: "#D7A144",
  goldGlow: "rgba(215, 161, 68, 0.22)",
  red: "#FF4F43",
  warm: "#FFB65C",
  card: "rgba(11,16,22,0.92)",
  cardBorder: "rgba(255,255,255,0.08)",
  cyanOutline: "rgba(0,216,242,0.5)",
} as const;

export const F = {
  headline: "'Inter Tight', sans-serif", // ExtraBold 800
  body: "'Manrope', sans-serif", // 400–500
  ui: "'Manrope', sans-serif", // Medium 500
  label: "'IBM Plex Sans', sans-serif", // Medium 500 — scene numbers, micro labels
} as const;

// Scene boundaries (global frames): 4 × 150f = 600f @30fps = 20s.
// Entrance choreography keeps the original 120f design; the extra second
// per scene is pure hold time so the information stays readable.
export const LV = {
  s1: 0,
  s2: 150,
  s3: 300,
  s4: 450,
  end: 600,
  len: 150,
} as const;

/** Development-only: show the supplied keyframes at 30% for alignment. */
export const SHOW_REFERENCE = false;
