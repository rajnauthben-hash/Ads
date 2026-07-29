// Shared geometry, easing and business-data constants.
import { Easing, interpolate } from "remotion";

// --- Named easings (locked list) ---
export const premiumEase = Easing.bezier(0.22, 1, 0.36, 1);
export const settleEase = Easing.bezier(0.16, 1, 0.3, 1);
export const linearEase = Easing.linear;
export const softInOut = Easing.bezier(0.45, 0, 0.55, 1);

// Interpolate helper that clamps and applies a named easing.
export const ease = (
  frame: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing = premiumEase,
) =>
  interpolate(frame, [a, b], [from, to], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Reveal progress 0..1 for an interval [a,b].
export const prog = (frame: number, a: number, b: number, easing = premiumEase) =>
  ease(frame, a, b, 0, 1, easing);

// --- Shared business data (locked) ---
export const CROWN = {
  name: "Crown Hardware",
  meta: "0.9 mi · ★ 3.7 (28)",
  category: "Hardware store",
  hours: "Open · Closes 7PM",
  shopping: "In-store shopping",
} as const;

export const SEARCH_QUERY = "hardware store near me";

export const NEIGHBORHOODS = ["RIVER OAKS", "PINE HILL"] as const;

export const COMPETITORS = {
  homeMart: { name: "HomeMart", meta: "1.3 mi · ★ 4.3" },
  buildWell: { name: "BuildWell", meta: "0.8 mi · ★ 4.5" },
  proTools: { name: "Pro Tools", meta: "1.6 mi · ★ 4.2" },
  fixitSupply: { name: "FixIt Supply", meta: "1.1 mi · ★ 4.1" },
} as const;
