// OmniFlow Cinematic — one continuous camera journey, 720 frames (24s @ 30fps).

export const T = {
  bg: "#04060C",
  bgDeep: "#020409",
  navy: "#07101E",
  panel: "rgba(8,15,32,0.86)",
  cyan: "#22D3EE",
  teal: "#14B8A6",
  blue: "#3B82F6",
  violet: "#8B5CF6",
  white: "#F8FAFC",
  muted: "#8FA3BD",
  line: "rgba(148,197,255,0.16)",
  holo: "rgba(120,210,255,0.55)",
} as const;

export const FONT = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

// Signature ease — fast out, long settle
export const EO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const FPS = 30;
export const DUR = 1008; // 33.6s — carries all ten text beats of the original

// Scene sequencing — 22-frame fly-through overlaps keep the camera moving.
// Order mirrors the original omniflowv3 text beats exactly.
export const SCN = {
  invisible: { from: 0,   dur: 142 }, // beat 1  — exists online / can't find it
  problems:  { from: 120, dur: 160 }, // beats 2+3 — problem cards / costs customers
  shift:     { from: 258, dur: 142 }, // beat 4  — we change that
  website:   { from: 378, dur: 172 }, // beat 5  — premium websites
  visibility:{ from: 528, dur: 124 }, // beat 6  — google maps optimization
  actions:   { from: 630, dur: 120 }, // beat 7  — more actions / more customers
  growth:    { from: 728, dur: 110 }, // beat 8  — real growth / real impact
  partner:   { from: 816, dur: 120 }, // beat 9  — one partner / everything you need
  cta:       { from: 914, dur: 94  }, // beat 10 — get found / DM 'FLOW'
} as const;

// Music sync markers (frames @ 30fps) — biggest visual hits.
export const BEATS = [
  { frame: 0,   hit: "hook reveal — ghost site fades up from void" },
  { frame: 72,  hit: "'but customers can't find it.' (cyan emphasis)" },
  { frame: 130, hit: "problem cards begin emerging in depth" },
  { frame: 266, hit: "energy line reset sweeps — biggest mid hit" },
  { frame: 346, hit: "'We change that.'" },
  { frame: 390, hit: "premium website assembles" },
  { frame: 500, hit: "'Built to convert.'" },
  { frame: 542, hit: "map pin drop + ripple" },
  { frame: 646, hit: "'More actions. More customers.' tiles" },
  { frame: 742, hit: "growth chart draws, +127% counts up" },
  { frame: 824, hit: "'One partner.' service stack" },
  { frame: 936, hit: "final lockup + 'DM FLOW' — strongest hit, clean tail" },
] as const;
