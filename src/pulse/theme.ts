// THE PULSE OF LOCAL SEARCH — design tokens

export const C = {
  bg: "#090B0D",
  slate: "#121314",
  cyan: "#00D2FF",
  cyan2: "#45DFFF",
  gold: "#FFC700",
  goldWarm: "#DDAE4A",
  text: "#F4F6F7",
  text2: "#A7AFB7",
  mutedUi: "rgba(0, 210, 255, 0.14)",
} as const;

export const FONT_HEAD = "Inter Tight";
export const FONT_BODY = "Inter";
export const FONT_MONO = "IBM Plex Mono";

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DURATION = 450;

// Scene boundaries (global frames). Sequences overlap by ~10 frames so
// object-based transitions can hand off between scenes.
export const SCENES = {
  s1: { from: 0, dur: 100 }, // nominal 0–89
  s2: { from: 90, dur: 82 }, // nominal 90–161
  s3: { from: 162, dur: 70 }, // nominal 162–221
  s4: { from: 222, dur: 82 }, // nominal 222–293
  s5: { from: 294, dur: 88 }, // nominal 294–371
  s6: { from: 372, dur: 78 }, // nominal 372–449
} as const;
