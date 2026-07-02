// OmniFlowV3 — image-driven 20s ad @ 30fps = 600 frames
// Scene boundaries follow the brief's premium rhythm (seconds → frames).
// Each scene overlaps the next by OVERLAP frames for crossfades.

export const FPS = 30;
export const TOTAL = 600;
export const OVERLAP = 14;

// [start, end] in frames (end = start of next scene)
export const V3SEQ = {
  s1:  { from: 0,   until: 60  }, // 0.0–2.0s  invisible online
  s2:  { from: 60,  until: 114 }, // 2.0–3.8s  weak digital presence
  s3:  { from: 114, until: 168 }, // 3.8–5.6s  costs real customers
  s4:  { from: 168, until: 216 }, // 5.6–7.2s  we change that
  s5:  { from: 216, until: 282 }, // 7.2–9.4s  premium websites
  s6:  { from: 282, until: 354 }, // 9.4–11.8s google maps optimization
  s7:  { from: 354, until: 414 }, // 11.8–13.8s more actions / customers
  s8:  { from: 414, until: 474 }, // 13.8–15.8s real growth / impact
  s9:  { from: 474, until: 528 }, // 15.8–17.6s one partner
  s10: { from: 528, until: 600 }, // 17.6–20.0s final CTA (longest hold)
} as const;

// Duration of a scene's Sequence including the outgoing crossfade tail.
export function seqDur(key: keyof typeof V3SEQ): number {
  const s = V3SEQ[key];
  const isLast = key === "s10";
  return s.until - s.from + (isLast ? 0 : OVERLAP);
}

// Sound design cue sheet (frames @ 30fps) — for the audio pass.
// Deep ambient bed runs 0–600 under everything.
export const SOUND_CUES = [
  { frame: 0,   cue: "ambient bed in — deep, dark, premium" },
  { frame: 0,   cue: "low sub swell under opening line" },
  { frame: 60,  cue: "soft pulse — problem cards" },
  { frame: 114, cue: "descending tone — traffic falls, customers lost" },
  { frame: 168, cue: "impact hit + riser — 'We change that.'" },
  { frame: 176, cue: "scan-line digital sweep accent" },
  { frame: 216, cue: "warm chord opens — premium websites" },
  { frame: 282, cue: "UI whoosh — map pin locks in" },
  { frame: 354, cue: "ticking pulses — actions counting up" },
  { frame: 414, cue: "riser building under growth chart" },
  { frame: 474, cue: "soft hit — one partner stack" },
  { frame: 528, cue: "final CTA impact — biggest hit, then clean tail-out" },
  { frame: 585, cue: "music resolves, ambience fades by 600" },
] as const;
