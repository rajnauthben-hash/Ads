import { Easing, interpolate } from "remotion";

// The film's motion vocabulary. Every subsystem picks its curve from here —
// nothing animates on a default ease.

// Text construction — fast arrival, long confident settle.
export const EASE_TEXT = Easing.bezier(0.22, 1, 0.36, 1);
// Interface assembly — slightly softer arrival.
export const EASE_UI = Easing.bezier(0.16, 1, 0.3, 1);
// Route acceleration — loads energy, then releases.
export const EASE_ROUTE = Easing.bezier(0.45, 0, 0.2, 1);
// Camera drift — symmetric, unhurried.
export const EASE_CAMERA = Easing.inOut(Easing.quad);
// Exits — commit early, leave fast.
export const EASE_EXIT = Easing.bezier(0.55, 0, 0.85, 0.4);

// Clamped interpolate with a chosen curve — the standard ramp helper.
export const ramp = (
  frame: number,
  from: number,
  to: number,
  easing: (t: number) => number = EASE_UI,
): number =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Critically damped spring evaluated analytically — settles with no visible
// overshoot and no wobble. t is in frames since activation.
export const dampedSpring = (t: number, stiffness = 120, mass = 0.9): number => {
  if (t <= 0) {
    return 0;
  }
  // Critical damping: c = 2 * sqrt(k * m); x(t) = 1 - (1 + w t) e^(-w t)
  const w = Math.sqrt(stiffness / mass) / 10; // scaled for frame units
  return 1 - (1 + w * t) * Math.exp(-w * t);
};

// Packet motion along a route: accelerates through the middle of its run and
// decelerates into the destination — never constant linear speed.
export const packetEase = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c); // smoothstep: slow in, fast middle, slow out
};
