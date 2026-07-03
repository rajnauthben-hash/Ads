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
export const DUR = 720; // 24s

// Scene sequencing — 22-frame fly-through overlaps keep the camera moving.
export const SCN = {
  invisible: { from: 0,   dur: 142 }, // 0.0–4.7s  the invisible business
  problems:  { from: 120, dur: 160 }, // 4.0–9.3s  floating problem field
  shift:     { from: 258, dur: 142 }, // 8.6–13.3s energy reset / repair
  website:   { from: 378, dur: 172 }, // 12.6–18.3s premium website orbit
  visibility:{ from: 528, dur: 124 }, // 17.6–21.7s holographic map
  cta:       { from: 630, dur: 90  }, // 21.0–24.0s brand lockup
} as const;

// Music sync markers (frames @ 30fps) — biggest visual hits.
export const BEATS = [
  { frame: 0,   hit: "hook reveal — ghost site fades up from void" },
  { frame: 70,  hit: "'can't find it' lands (cyan emphasis)" },
  { frame: 128, hit: "problem cards begin emerging in depth" },
  { frame: 266, hit: "energy line reset sweeps — biggest mid hit" },
  { frame: 346, hit: "'We change that.'" },
  { frame: 390, hit: "premium website assembles" },
  { frame: 486, hit: "'Built to convert.'" },
  { frame: 542, hit: "map pin drop + ripple" },
  { frame: 652, hit: "final lockup — strongest hit, then clean tail" },
] as const;
