import { Easing } from "remotion";

/**
 * Approved easing functions (spec §2). No overshoot, no elastic.
 */
export const EASING = {
  TEXT_IN: Easing.bezier(0.22, 1, 0.36, 1),
  TEXT_OUT: Easing.bezier(0.55, 0, 1, 0.45),
  CAMERA: Easing.inOut(Easing.cubic),
  ROUTE: Easing.inOut(Easing.quad),
  CARD_REVEAL: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

export type EasingName = keyof typeof EASING;
