import { interpolate } from "remotion";
import { EASING, EasingName } from "../utils/easing";

/**
 * framePlan.ts — the single source of truth for all timing in the
 * InvisibleShortlist composition. Every animated property in the ad is
 * ultimately derived from useCurrentFrame() through the helpers below.
 *
 * Total: 780 frames @ 30fps = 26s. Valid frames 0..779.
 */

export const FPS = 30;
export const TOTAL_FRAMES = 780;

// ---------------------------------------------------------------------------
// Scene ranges (spec §9). Transitions happen *inside* these ranges — there are
// no separate transition scenes.
// ---------------------------------------------------------------------------
export const SCENES = {
  s1: { start: 0, end: 119 },
  s2: { start: 120, end: 245 },
  s3: { start: 246, end: 371 },
  s4: { start: 372, end: 503 },
  s5: { start: 504, end: 644 },
  s6: { start: 645, end: 779 },
} as const;

export type SceneKey = keyof typeof SCENES;

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/** Linear 0..1 progress across [start,end], clamped. */
export function linearProgress(frame: number, start: number, end: number): number {
  if (end === start) return frame >= end ? 1 : 0;
  return clamp01((frame - start) / (end - start));
}

/** Eased 0..1 progress across [start,end] using an approved easing curve. */
export function easedProgress(
  frame: number,
  start: number,
  end: number,
  easing: EasingName = "TEXT_IN",
): number {
  return interpolate(frame, [start, end], [0, 1], {
    easing: EASING[easing],
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Entrance reveal (TEXT_IN). */
export function revealProgress(frame: number, start: number, end: number): number {
  return easedProgress(frame, start, end, "TEXT_IN");
}

/**
 * Hold progress: 1 while inside the hold window, otherwise 0. Used to gate
 * "readability hold" behaviour where nothing should move.
 */
export function holdProgress(frame: number, start: number, end: number): number {
  return frame >= start && frame <= end ? 1 : 0;
}

/** Exit progress (TEXT_OUT). */
export function exitProgress(frame: number, start: number, end: number): number {
  return easedProgress(frame, start, end, "TEXT_OUT");
}

/** Generic mapped interpolation from [start,end] frames to [from,to], clamped. */
export function mapRange(
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
  easing?: EasingName,
): number {
  return interpolate(frame, [start, end], [from, to], {
    easing: easing ? EASING[easing] : undefined,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Blur value in px, interpolated over a frame range (clamped). */
export function blurValue(
  frame: number,
  start: number,
  end: number,
  from: number,
  to: number,
): number {
  return interpolate(frame, [start, end], [from, to], {
    easing: EASING.TEXT_IN,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Route stroke draw progress (0..1) using the ROUTE easing. */
export function routeDrawProgress(frame: number, start: number, end: number): number {
  return easedProgress(frame, start, end, "ROUTE");
}

/**
 * Position 0..1 of a travelling pulse along a route between start/end frames.
 * Loops so a pulse keeps travelling for the whole active window.
 */
export function pulsePosition(
  frame: number,
  start: number,
  periodFrames: number,
): number {
  const t = (frame - start) / periodFrames;
  return t - Math.floor(t);
}

// ---------------------------------------------------------------------------
// Text animation primitive (spec §8) — one shared entrance/exit description
// used by every phrase group.
// ---------------------------------------------------------------------------
export interface PhraseAnim {
  opacity: number;
  translateY: number;
  translateX: number;
  blur: number;
  /** letter-spacing in em */
  tracking: number;
  /** inset clip reveal 0..100 (%) */
  clip: number;
  /** horizontal slice displacement during exit (px) */
  slice: number;
}

/**
 * Compute the shared phrase animation for a group. `inStart..inEnd` is the
 * entrance; `outStart..outEnd` (optional) is the masked exit.
 */
export function phraseAnim(
  frame: number,
  inStart: number,
  inEnd: number,
  opts?: { outStart?: number; outEnd?: number; sliceDir?: 1 | -1; sliceAmt?: number },
): PhraseAnim {
  const inP = easedProgress(frame, inStart, inEnd, "TEXT_IN");
  const opacityIn = interpolate(inP, [0, 1], [0, 1]);
  const ty = interpolate(inP, [0, 1], [18, 0]);
  const blurIn = interpolate(inP, [0, 1], [8, 0]);
  const trackingIn = interpolate(inP, [0, 1], [0.015, -0.015]);
  const clip = interpolate(inP, [0, 1], [0, 100]);

  let opacity = opacityIn;
  let translateX = 0;
  let blur = blurIn;
  let slice = 0;

  if (opts?.outStart !== undefined && opts?.outEnd !== undefined) {
    const outP = easedProgress(frame, opts.outStart, opts.outEnd, "TEXT_OUT");
    if (outP > 0) {
      const dir = opts.sliceDir ?? -1;
      const amt = opts.sliceAmt ?? 12;
      opacity = interpolate(outP, [0, 1], [opacityIn, 0.15]);
      translateX = interpolate(outP, [0, 1], [0, dir * amt]);
      blur = Math.max(blur, interpolate(outP, [0, 1], [0, 6]));
      slice = interpolate(outP, [0, 1], [0, dir * (amt - 2)]);
    }
  }

  return {
    opacity,
    translateY: ty,
    translateX,
    blur,
    tracking: trackingIn,
    clip,
    slice,
  };
}

// ---------------------------------------------------------------------------
// Camera (spec §7) — one continuous rig, never resets between scenes.
// Values are kept strictly inside the specified limits:
//   scale 1.00..1.065 | X ±28 | Y ±34 | rotZ ±1.5 | rotX ±1
// ---------------------------------------------------------------------------
export interface CameraState {
  cameraX: number;
  cameraY: number;
  cameraScale: number;
  cameraRotateX: number;
  cameraRotateZ: number;
}

// Keyframes are monotone-ish and continuous across the full timeline.
const CAM_FRAMES = [0, 39, 87, 119, 160, 245, 291, 371, 411, 483, 503, 541, 616, 644, 685, 766, 779];
const CAM_SCALE = [
  1.0, 1.015, 1.019, 1.019, 1.024, 1.03, 1.033, 1.035, 1.036, 1.038, 1.038, 1.043, 1.046, 1.046,
  1.049, 1.054, 1.055,
];
const CAM_X = [0, -4, -7, -7, -5, 2, 6, 8, 6, 3, 3, -2, -6, -6, -3, 4, 5];
const CAM_Y = [0, 4, 7, 7, 9, 6, 3, 2, 4, 7, 7, 10, 6, 6, 3, -2, -3];
const CAM_RZ = [0, -0.3, -0.6, -0.6, -0.4, 0.2, 0.5, 0.6, 0.5, 0.2, 0.2, -0.2, -0.5, -0.5, -0.2, 0.4, 0.5];
const CAM_RX = [0, 0.2, 0.35, 0.35, 0.3, 0.15, 0.1, 0.1, 0.15, 0.25, 0.25, 0.35, 0.28, 0.28, 0.2, 0.1, 0.1];

export function cameraStateAtFrame(frame: number): CameraState {
  const scale = interpolate(frame, CAM_FRAMES, CAM_SCALE, {
    easing: EASING.CAMERA,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraX = interpolate(frame, CAM_FRAMES, CAM_X, {
    easing: EASING.CAMERA,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, CAM_FRAMES, CAM_Y, {
    easing: EASING.CAMERA,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraRotateZ = interpolate(frame, CAM_FRAMES, CAM_RZ, {
    easing: EASING.CAMERA,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraRotateX = interpolate(frame, CAM_FRAMES, CAM_RX, {
    easing: EASING.CAMERA,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { cameraX, cameraY, cameraScale: scale, cameraRotateX, cameraRotateZ };
}

// ---------------------------------------------------------------------------
// Persistent storefront (YOUR BUSINESS). ONE instance for the whole ad — its
// world position, scale and lighting are a continuous function of frame so it
// never jumps at a scene seam. It moves only during transition windows.
// ---------------------------------------------------------------------------
export interface StorefrontState {
  x: number;
  y: number;
  scale: number;
  interior: number;
  gold: number;
}

const SF_FRAMES = [
  0, 100, 130, // s1 settle -> move
  235, 252, // s2 settle -> move
  290, 356, 380, // s3
  440, 490, 512, // s4 -> move -> s5 arrive
  536, 565, 579, 596, 606, 630, 650, // s5 lighting steps -> move
  700, 743, 766, 779, // s6
];
const SF_X = [
  600, 600, 640, // s1->s2
  640, 470, // s2->s3
  180, 180, 470, // s3->s4
  560, 470, 430, // s4->s5
  430, 430, 430, 430, 430, 430, 560, // s5->s6
  560, 560, 560, 560, // s6
];
const SF_Y = [
  912, 912, 720, // s1->s2
  720, 792, // s2->s3
  792, 792, 940, // s3->s4
  1120, 980, 792, // s4->s5
  792, 792, 792, 792, 792, 792, 748, // s5->s6
  748, 748, 748, 748, // s6
];
const SF_SCALE = [
  1.0, 1.0, 1.0, 1.0, 0.98, 0.98, 0.98, 0.92, 0.9, 0.82, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.74, 1.0, 1.0, 1.0,
  1.0, 1.0,
];
const SF_INT = [
  0.78, 0.79, 0.79, 0.8, 0.8, 0.8, 0.82, 0.8, 0.8, 0.8, 0.8, 0.8, 0.83, 0.83, 0.87, 0.92, 0.92, 0.92, 0.92, 1.0,
  1.0, 1.0,
];
const SF_GOLD = [
  0.86, 0.87, 0.87, 0.88, 0.88, 0.88, 0.9, 0.86, 0.86, 0.86, 0.88, 0.88, 0.88, 0.9, 0.9, 0.92, 0.92, 0.9, 0.9, 0.96,
  0.96, 0.96,
];

function lerpArr(frame: number, frames: number[], values: number[], eased = true): number {
  return interpolate(frame, frames, values, {
    easing: eased ? EASING.CAMERA : undefined,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function storefrontStateAtFrame(frame: number): StorefrontState {
  return {
    x: lerpArr(frame, SF_FRAMES, SF_X),
    y: lerpArr(frame, SF_FRAMES, SF_Y),
    scale: lerpArr(frame, SF_FRAMES, SF_SCALE),
    interior: lerpArr(frame, SF_FRAMES, SF_INT, false),
    gold: lerpArr(frame, SF_FRAMES, SF_GOLD, false),
  };
}

// Parallax factors per depth layer (spec §7).
export const PARALLAX = {
  backgroundCity: 0.25,
  roadNetwork: 0.45,
  midBuildings: 0.65,
  storefront: 1.0,
  foregroundUI: 1.08,
} as const;
