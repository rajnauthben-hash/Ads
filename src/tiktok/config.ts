// ═══════════════════════════════════════════════════════════════════════
// OmniFlow TikTok Ad — single source of truth for all timing and style
// ═══════════════════════════════════════════════════════════════════════

export const W   = 1080;
export const H   = 1920;
export const FPS = 30;

export const COLORS = {
  void:       "#050B14",
  energy:     "#00E5FF",
  secondary:  "#0891B2",
  white:      "#FFFFFF",
  glitchRed:  "#FF2060",
  glitchBlue: "#0055FF",
  red:        "#FF3B30",
  gold:       "#F59E0B",
} as const;

// Spring presets — all elastic, nothing flat
export const SPRING = {
  snappy:  { damping: 14, mass: 0.7, stiffness: 200 },
  bouncy:  { damping: 8,  mass: 0.5, stiffness: 180 },
  elastic: { damping: 10, mass: 0.6, stiffness: 220 },
  punchy:  { damping: 6,  mass: 0.3, stiffness: 380 },
  calm:    { damping: 22, mass: 1.0, stiffness: 120 },
} as const;

// ── Frame boundaries (tune here to re-pace) ──────────────────────────
export const F = {
  HOOK_START:    0,
  HOOK_END:      90,
  BUILDUP_START: 90,
  BUILDUP_END:   180,
  FLASH_START:   180,
  FLASH_END:     195,
  REVEAL_START:  195,
  REVEAL_END:    330,
  PROOF_START:   330,
  PROOF_END:     405,
  LOCKUP_START:  405,
  LOCKUP_END:    450,
} as const;

// Hook sub-timing (relative to sequence-local frame 0)
export const HOOK = {
  BAR_IN_DONE:  14,   // search bar fully faded in
  TYPE_START:   14,   // typewriter begins
  TYPE_RATE:    0.65, // characters per frame — slower, more deliberate
  GLITCH_START: 64,   // bar starts glitching
  RESULTS_CUT:  76,   // hard cut to 0 RESULTS
} as const;

// ── Copy — swap here to retune messaging ─────────────────────────────
export const COPY = {
  searchQuery: "best restaurant near me...",
  headline1:   "GET FOUND.",
  headline2:   "GET NOTICED.",
  tagline:     "OmniFlow Digital",
  handle:      "@omniflowdigital",
  cta:         "Build your brand. Own your market.",
} as const;

export const FONT = "Space Grotesk";
