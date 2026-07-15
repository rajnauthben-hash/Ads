import React from "react";
import { Img, staticFile, interpolate, Easing } from "remotion";
import { H, W } from "../config/design";
import { T } from "../config/timing";
import { PLATE_LAYOUT } from "../config/plates.generated";

/**
 * The full reference illustration plate (full-frame, text bands inpainted).
 * Assembles with a downward luminance sweep (frames ~6–52), settles into the
 * exact reference position for the lock window, and drifts within the
 * restrained motion budget (scale ≤ 1.018, translation ≤ 20px, rot ≤ 0.5°).
 */
export const ReferenceArtworkLayer: React.FC<{ scene: number; frame: number }> = ({
  scene,
  frame,
}) => {
  const src = staticFile(`generated/scene-${String(scene).padStart(2, "0")}/artwork.png`);

  const p = interpolate(frame, [T.artStart, T.artEnd - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const opacity = interpolate(frame, [T.artStart, T.artStart + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Downward reveal sweep: the background above the illustration is visible
  // immediately; the luminance edge travels from the artwork's top downward.
  const startPct = (PLATE_LAYOUT[scene].cutY / H) * 100;
  const edge = interpolate(p, [0, 1], [startPct - 4, 128]);
  const mask = `linear-gradient(to bottom, rgba(0,0,0,1) ${edge - 12}%, rgba(0,0,0,0) ${edge + 6}%)`;

  // Settle + gentle post-lock drift (deterministic, frame-driven).
  const settleY = (1 - p) * 18;
  const settleScale = 1 + (1 - p) * 0.014;
  const driftX = Math.sin(frame / 105) * 5;
  const driftY = Math.cos(frame / 140) * 4;
  const driftRot = Math.sin(frame / 160) * 0.22;
  const driftScale = 1 + (Math.sin(frame / 130) + 1) * 0.002;

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        inset: 0,
        width: W,
        height: H,
        opacity,
        WebkitMaskImage: p >= 1 ? undefined : mask,
        maskImage: p >= 1 ? undefined : mask,
        translate: `${driftX * p}px ${settleY + driftY * p}px`,
        rotate: `${driftRot * p}deg`,
        scale: `${settleScale * driftScale}`,
        transformOrigin: "50% 78%",
      }}
    />
  );
};
