// ═══════════════════════════════════════════════════════════════════════
// THE INVISIBLE STOREFRONT v2 — 10 scenes × 120 frames, reference-lock timing
// (4s per scene: reveals stay snappy, the locked composition holds longer)
// ═══════════════════════════════════════════════════════════════════════

export const SCENE_LEN = 120;

export interface SceneRange {
  id: number;
  start: number;
  end: number;
}

export const SCENES: SceneRange[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  start: i * SCENE_LEN,
  end: i * SCENE_LEN + SCENE_LEN - 1,
}));

/** Scene-local timing contract (frames within each 120-frame scene). */
export const T = {
  inEnd: 10, // incoming object-based transition
  headStart: 8, // header + headline reveal window 8–34
  bodyStart: 24, // supporting copy reveal window 24–45
  artStart: 6, // illustration assembly window 8–52
  artEnd: 52,
  lockStart: 52, // full reference-lock composition 52–106
  lockEnd: 106,
  outStart: 106, // outgoing object-based transition 106–119
} as const;

/** Scene-local frame at which each scene is audited against its reference. */
export const LOCK_FRAME = 80;
