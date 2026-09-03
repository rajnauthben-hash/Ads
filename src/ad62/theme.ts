import { Easing } from "remotion";

/**
 * OmniFlow Digital Ad 6.2 — "Locked Outside the Apex".
 * 22s (660f) premium text-driven editorial motion graphic on a dark blueprint
 * field. One persistent cyan "signal rope" is the continuous device: a barrier,
 * a divider, split signal threads, a diagnostic wrap, a taut five-lock gate,
 * then an open path to the warm-gold top-three apex.
 */
export const AD = { width: 1080, height: 1920, fps: 30, frames: 660 } as const;

export const C = {
  bg: "#071016",
  panel: "#0C1820",
  panel2: "#10232B",
  white: "#F4F7F8",
  muted: "#8FA2AA",
  dim: "#54646E",
  cyan: "#22D9F2",
  cyanDim: "rgba(34,217,242,0.4)",
  gold: "#D6A84A",
  goldHi: "#F0C766",
  coral: "#FF6A5F",
  line: "rgba(120,170,190,0.14)",
  goldLine: "rgba(214,168,74,0.5)",
} as const;

export const FONT = {
  head: "'Inter Tight', 'Arial Narrow', Inter, system-ui, sans-serif",
  body: "Manrope, Inter, system-ui, sans-serif",
  ui: "'IBM Plex Sans', Inter, system-ui, sans-serif",
} as const;

export const EASE = {
  in: Easing.bezier(0.22, 1, 0.36, 1),
  out: Easing.bezier(0.55, 0, 1, 0.45),
  cam: Easing.inOut(Easing.cubic),
  snap: Easing.bezier(0.7, 0, 0.3, 1),
} as const;

// 90px left/right, 150px top, 180px bottom safe area.
export const SAFE = { left: 90, right: 990, top: 150, bottom: 1740 } as const;

// Scene ranges (spec timeline).
export const SCN = {
  s1: { start: 0, end: 94, match: 60 },
  s2: { start: 95, end: 199, match: 150 },
  s3: { start: 200, end: 314, match: 260 },
  s4: { start: 315, end: 429, match: 380 },
  s5: { start: 430, end: 549, match: 480 },
  s6: { start: 550, end: 659, match: 620 },
} as const;
