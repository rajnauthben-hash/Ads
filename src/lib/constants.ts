export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 540;

export const COL = {
  bgBlack:  "#05070D",
  bgNavy:   "#07111F",
  card:     "#0B1220",
  cardHi:   "#101B2E",
  cyan:     "#22D3EE",
  teal:     "#14B8A6",
  blue:     "#3B82F6",
  violet:   "#8B5CF6",
  white:    "#F8FAFC",
  muted:    "#94A3B8",
  border:   "rgba(255,255,255,0.12)",
  glass:    "rgba(255,255,255,0.06)",
  cyanGlow: "rgba(34,211,238,0.35)",
  cyanDim:  "rgba(34,211,238,0.12)",
  blueGlow: "rgba(59,130,246,0.15)",
} as const;

export const FONT = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

// Mobile safe zones (px)
export const SAFE = { h: 80, top: 140, bottom: 180 } as const;

// Shared easings
export const EO: [number, number, number, number] = [0.16, 1, 0.3, 1];   // smooth ease-out
export const ES: [number, number, number, number] = [0.34, 1.2, 0.64, 1]; // slight spring
