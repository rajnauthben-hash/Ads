import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { SCENE_LEN, T } from "../config/timing";

/**
 * Object-based scene entry/exit envelope. The outgoing scene lifts slightly
 * and dims (never fully — the persistent energy streak bridges the cut),
 * the incoming scene settles from a small offset. No full-frame slides,
 * no fade-to-black.
 */
export const SceneTransition: React.FC<{
  frame: number;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}> = ({ frame, isFirst = false, isLast = false, children }) => {
  // The scene's Sequence overhangs 14 frames past the cut (frame 90), so the
  // outgoing composition keeps dimming to zero underneath the next scene.
  const outOpacity = isLast
    ? 1
    : interpolate(frame, [T.outStart, SCENE_LEN - 1, SCENE_LEN + 13], [1, 0.4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      });
  const outY = isLast
    ? 0
    : interpolate(frame, [T.outStart, SCENE_LEN + 13], [0, -24], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const inOpacity = isFirst
    ? 1
    : interpolate(frame, [0, T.inEnd], [0.25, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      });
  const inY = isFirst
    ? 0
    : interpolate(frame, [0, T.inEnd], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  return (
    <AbsoluteFill
      style={{ opacity: Math.min(outOpacity, inOpacity), translate: `0px ${outY + inY}px` }}
    >
      {children}
    </AbsoluteFill>
  );
};
