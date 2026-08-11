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

// Camera keyframes. Every scene has an anchor; the camera eases continuously
// between them so it is always mid-move (no cuts, no resets).
const KEYS: { f: number; cam: Cam }[] = [
  { f: 0, cam: { cx: 815, cy: 2560, scale: 1.14, rot: -0.6 } }, // S1 open on Crown, lower-right
  { f: 110, cam: { cx: 900, cy: 2360, scale: 1.02, rot: -0.3 } }, // S1->2 begin rise/pull-back
  { f: 200, cam: { cx: 900, cy: 1820, scale: 0.62, rot: 0.0 } }, // S2 elevated map of whole route
  { f: 300, cam: { cx: 1030, cy: 2180, scale: 0.86, rot: 0.4 } }, // S3 down the active road, Crown lower-left
  { f: 430, cam: { cx: 770, cy: 2230, scale: 0.60, rot: 0.0 } }, // S4 wide cause-&-effect view
  { f: 540, cam: { cx: 525, cy: 2360, scale: 1.0, rot: -0.4 } }, // S5 hero Crown pushed to the right
  { f: 599, cam: { cx: 525, cy: 2375, scale: 1.03, rot: -0.5 } }, // S5 settle hold
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
