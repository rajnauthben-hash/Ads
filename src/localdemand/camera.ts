import { interpolate, Easing } from "remotion";

/**
 * MasterCameraRig helper. Scaling a full-frame plate about its centre gives a
 * coverage margin of (scale-1)*half; we clamp the pan/rotation within that
 * margin so the camera can push, pan and drift without ever revealing a plate
 * edge. Scaling about centre also makes near (bottom) pixels travel more than
 * far (top) pixels — a cheap, seam-free parallax from a single plate.
 */
export function camTransform(scale: number, tx: number, ty: number, rot = 0): string {
  const mH = Math.max(0, (scale - 1) * 540 - 5);
  const mV = Math.max(0, (scale - 1) * 960 - 6);
  const cx = Math.max(-mH, Math.min(mH, tx));
  const cy = Math.max(-mV, Math.min(mV, ty));
  return `translate(${cx}px, ${cy}px) scale(${scale}) rotate(${rot}deg)`;
}

const eio = Easing.inOut(Easing.cubic);
const eout = Easing.out(Easing.cubic);

/**
 * A continuous cinematic move for one scene. Entrance settles from a slightly
 * pushed/panned start, holds near baseline through the comparison frame with a
 * tiny living drift, then eases off toward the next scene during the overlap.
 *
 * dir: pan direction the camera drifts toward the destination (store).
 */
export function sceneCam(
  f: number,
  start: number,
  end: number,
  panX: number,
  panY: number,
): { scale: number; tx: number; ty: number; rot: number } {
  const holdEnd = end - 16;
  // gentle continuous forward push; stays near baseline through the comparison
  // frame (in the hold) and eases off into the transition overlap.
  const scale = interpolate(
    f,
    [start, start + 34, holdEnd, end],
    [1.02, 1.023, 1.027, 1.046],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: eio },
  );
  // slow pan toward the destination across the scene, then continue on exit
  const baseX = interpolate(f, [start, holdEnd, end], [-panX * 0.6, panX, panX * 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: eout,
  });
  const baseY = interpolate(f, [start, holdEnd, end], [-panY * 0.6, panY, panY * 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: eout,
  });
  // tiny living drift so nothing is ever fully frozen
  const t = (f - start) / 30;
  const driftX = Math.sin(t * 0.9) * 3;
  const driftY = Math.cos(t * 0.7) * 2.5;
  const rot = Math.sin((f - start) / 90) * 0.18;
  return { scale, tx: baseX + driftX, ty: baseY + driftY, rot };
}
