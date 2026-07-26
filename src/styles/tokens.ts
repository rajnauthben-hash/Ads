/**
 * Shared visual tokens for the OmniFlow "Invisible Shortlist" advertisement.
 * These are the single source of truth for the palette, canvas metrics and
 * safe-zone boundaries. Nothing in the composition should hard-code a colour.
 */

export const COLORS = {
  background: "#05080C",
  secondaryDark: "#0D0F12",
  elevatedSurface: "#111820",
  cyan: "#12D3EE",
  cyanSecondary: "#22D3EE",
  gold: "#E4B363",
  white: "#F5F7FA",
  grey: "#8B949E",
  red: "#FF5246",
  green: "#37D67A",
} as const;

// Canvas
export const CANVAS = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 780,
} as const;

// Safe zone for all critical elements.
export const SAFE = {
  x1: 80,
  x2: 825,
  y1: 190,
  y2: 1460,
} as const;

// Reserved platform areas (only atmosphere may enter these).
export const RESERVE = {
  topY: 170, // y = 0..170
  rightX: 850, // x = 850..1080
  bottomY: 1500, // y = 1500..1920
} as const;

// z-index layer bands (see spec §6).
export const LAYER = {
  atmosphere: 5,
  distantBuildings: 15,
  roads: 25,
  storefronts: 35,
  routes: 45,
  ui: 55,
  text: 65,
  transitionMask: 75,
  devGuides: 80,
} as const;

export const SHADOW = {
  // Restrained cyan signal glow — never excessive.
  cyanGlow: `0 0 10px rgba(18,211,238,0.35)`,
  goldGlow: `0 0 14px rgba(228,179,99,0.30)`,
} as const;
