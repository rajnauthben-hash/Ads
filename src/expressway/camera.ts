import { interpolate } from "remotion";
import { EASE } from "./anim";
import { W, H } from "./theme";

// ---- World coordinate system -------------------------------------------------
// One persistent world, larger than the viewport, that the shared camera pans,
// pushes and pulls across. Objects are placed once in WORLD space; the camera
// reframes them continuously so nothing ever "resets" at a scene boundary.
export const WORLD_W = 1600;
export const WORLD_H = 3400;

// Fixed landmark positions in world space (single instances, reused all film).
export const LAND = {
  crown: { x: 815, y: 2680 }, // Crown Hardware storefront
  competitor: { x: 1230, y: 1520 }, // competitor storefront (upper-right)
  customer: { x: 250, y: 3060 }, // customer search origin (bottom-left)
  cityCenter: { x: 1080, y: 560 }, // distant downtown skyline
} as const;

type Cam = { cx: number; cy: number; scale: number; rot: number };

// Camera keyframes. Anchored so the SETTLED comparison frames (90, 210, 330,
// 450, 570) land on a calm framing, with continuous motion between them —
// always mid-move, no cuts, no resets.
const KEYS: { f: number; cam: Cam }[] = [
  { f: 0, cam: { cx: 820, cy: 2600, scale: 1.2, rot: -0.6 } }, // S1 open, close on Crown
  { f: 90, cam: { cx: 848, cy: 2532, scale: 1.08, rot: -0.35 } }, // S1 target (frame 90)
  { f: 150, cam: { cx: 900, cy: 2150, scale: 0.78, rot: -0.1 } }, // rise into map
  { f: 210, cam: { cx: 900, cy: 1800, scale: 0.6, rot: 0.0 } }, // S2 target (frame 210)
  { f: 270, cam: { cx: 965, cy: 1990, scale: 0.72, rot: 0.2 } }, // travel down the route
  { f: 330, cam: { cx: 1010, cy: 2160, scale: 0.84, rot: 0.4 } }, // S3 target (frame 330)
  { f: 390, cam: { cx: 900, cy: 2210, scale: 0.68, rot: 0.2 } }, // widen for cause & effect
  { f: 450, cam: { cx: 770, cy: 2230, scale: 0.6, rot: 0.0 } }, // S4 target (frame 450)
  { f: 510, cam: { cx: 640, cy: 2300, scale: 0.78, rot: -0.2 } }, // repair & push to hero
  { f: 570, cam: { cx: 525, cy: 2360, scale: 1.0, rot: -0.4 } }, // S5 target (frame 570)
  { f: 599, cam: { cx: 520, cy: 2372, scale: 1.03, rot: -0.45 } }, // final settle
];

function pick(frame: number, key: keyof Cam): number {
  const fs = KEYS.map((k) => k.f);
  const vs = KEYS.map((k) => k.cam[key]);
  return interpolate(frame, fs, vs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.inOut,
  });
}

export function getCamera(frame: number) {
  const cx = pick(frame, "cx");
  const cy = pick(frame, "cy");
  const scale = pick(frame, "scale");
  const rot = pick(frame, "rot");

  // Map world point (cx,cy) to viewport centre, scaling about world origin.
  const tx = W / 2 - cx * scale;
  const ty = H / 2 - cy * scale;

  const transform = `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rot}deg)`;
  return { transform, scale, cx, cy, rot };
}
