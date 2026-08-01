// ============================================================================
// FRAME_PLAN — deterministic frame map for the full 0-719 timeline.
// Every persistent-object relocation and every scene window lives here so the
// animation is fully derived from useCurrentFrame() with no random values.
// ============================================================================

import { interpolate, Easing } from "remotion";
import { EASE_BEZIER } from "./tokens";

export const ease = Easing.bezier(...EASE_BEZIER);

export type Box = { x: number; y: number; w: number; h: number };

// Scene frame ranges (inclusive)
export const SCENES = {
  s1: { start: 0, end: 131 },
  s2: { start: 132, end: 263 },
  s3: { start: 264, end: 419 },
  s4: { start: 420, end: 551 },
  s5: { start: 552, end: 719 },
} as const;

// Transition windows (object relocation happens here)
export const TRANSITIONS = {
  t1: { start: 109, end: 131 }, // S1 -> S2
  t2: { start: 241, end: 263 }, // S2 -> S3
  t3: { start: 396, end: 419 }, // S3 -> S4
  t4: { start: 530, end: 551 }, // S4 -> S5
} as const;

// ---------------------------------------------------------------------------
// Persistent storefront bounding boxes at each scene (top-left based).
// ---------------------------------------------------------------------------
export const STOREFRONT_KEYS: { frame: number; box: Box }[] = [
  { frame: 0, box: { x: 0, y: 70, w: 625, h: 810 } },
  { frame: 108, box: { x: 0, y: 70, w: 625, h: 810 } },
  { frame: 132, box: { x: -15, y: 360, w: 575, h: 595 } },
  { frame: 240, box: { x: -15, y: 360, w: 575, h: 595 } },
  { frame: 264, box: { x: -40, y: 385, w: 500, h: 500 } },
  { frame: 395, box: { x: -40, y: 385, w: 500, h: 500 } },
  { frame: 420, box: { x: 0, y: 770, w: 1080, h: 655 } },
  { frame: 529, box: { x: 0, y: 770, w: 1080, h: 655 } },
  { frame: 552, box: { x: 470, y: 855, w: 610, h: 565 } },
  { frame: 719, box: { x: 470, y: 855, w: 610, h: 565 } },
];

// Persistent phone bounding boxes at each scene.
export const PHONE_KEYS: { frame: number; box: Box }[] = [
  { frame: 0, box: { x: 538, y: 320, w: 490, h: 795 } },
  { frame: 14, box: { x: 520, y: 320, w: 490, h: 795 } },
  { frame: 108, box: { x: 520, y: 320, w: 490, h: 795 } },
  { frame: 132, box: { x: 525, y: 360, w: 480, h: 710 } },
  { frame: 240, box: { x: 525, y: 360, w: 480, h: 710 } },
  { frame: 264, box: { x: 500, y: 315, w: 490, h: 650 } },
  { frame: 395, box: { x: 500, y: 315, w: 490, h: 650 } },
  { frame: 420, box: { x: 535, y: 130, w: 470, h: 770 } },
  { frame: 529, box: { x: 535, y: 130, w: 470, h: 770 } },
  { frame: 552, box: { x: 588, y: 165, w: 455, h: 700 } },
  { frame: 719, box: { x: 588, y: 165, w: 455, h: 700 } },
];

// interiorMix: 0 = exterior facade, 1 = interior room (Scene 4 only).
export function interiorMix(frame: number): number {
  // exterior through S1-S3, ramp to interior over T3 (396-419), hold in S4,
  // ramp back to exterior over T4 (530-551).
  if (frame <= 400) return 0;
  if (frame < 420) return interpolate(frame, [400, 420], [0, 1], { easing: ease });
  if (frame <= 534) return 1;
  if (frame < 552) return interpolate(frame, [534, 552], [1, 0], { easing: ease });
  return 0;
}

function lerpBox(a: Box, b: Box, t: number): Box {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    w: a.w + (b.w - a.w) * t,
    h: a.h + (b.h - a.h) * t,
  };
}

export function boxAt(keys: { frame: number; box: Box }[], frame: number): Box {
  if (frame <= keys[0].frame) return keys[0].box;
  const last = keys[keys.length - 1];
  if (frame >= last.frame) return last.box;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      if (a.box === b.box || (a.box.x === b.box.x && a.box.y === b.box.y && a.box.w === b.box.w && a.box.h === b.box.h)) {
        return a.box; // hold
      }
      const t = ease((frame - a.frame) / (b.frame - a.frame));
      return lerpBox(a.box, b.box, t);
    }
  }
  return last.box;
}

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

// Standard text entrance: opacity 0->1, translateY 16->0, blur 7->0.
export function textEntrance(frame: number, start: number, duration = 18) {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return {
    opacity: p,
    translateY: 16 * (1 - p),
    blur: 7 * (1 - p),
  };
}

// Text exit for transitions: fade + small rise + light blur (<=8px, <=24px move).
export function textExit(frame: number, start: number, duration = 16) {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return {
    opacity: 1 - p,
    translateY: -18 * p,
    blur: 8 * p,
  };
}

// Combined visibility: entrance at `inFrame`, exit starting at `outFrame`.
export function reveal(
  frame: number,
  inFrame: number,
  outFrame: number | null,
  inDur = 18,
  outDur = 16,
) {
  const enter = textEntrance(frame, inFrame, inDur);
  if (outFrame === null) return enter;
  const exit = textExit(frame, outFrame, outDur);
  return {
    opacity: Math.min(enter.opacity, exit.opacity),
    translateY: enter.translateY + exit.translateY,
    blur: Math.max(enter.blur, exit.blur),
  };
}

export function clampInterp(
  frame: number,
  input: number[],
  output: number[],
  easing = ease,
) {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}
