import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../config/design";

/**
 * Additive activation pulse for a painted node/pin: an initial ignition
 * flash, then slow breathing rings. Screen-blended over the artwork.
 */
export const NodePulseOverlay: React.FC<{
  x: number;
  y: number;
  frame: number;
  at: number;
  color?: "gold" | "cyan";
  radius?: number;
}> = ({ x, y, frame, at, color = "gold", radius = 78 }) => {
  const local = frame - at;
  if (local < 0) return null;
  const core = color === "gold" ? COLORS.gold : COLORS.cyan;

  const ignite = interpolate(local, [0, 8, 26], [0, 0.85, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 0.16 + 0.1 * Math.sin(local / 9);
  const ringPhase = (local % 46) / 46;
  const ringR = radius * (0.35 + ringPhase * 0.85);
  const ringOpacity = (1 - ringPhase) * 0.5;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id={`npg-${x}-${y}`}>
          <stop offset="0%" stopColor={core} stopOpacity="0.9" />
          <stop offset="45%" stopColor={core} stopOpacity="0.25" />
          <stop offset="100%" stopColor={core} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={radius} fill={`url(#npg-${x}-${y})`} opacity={ignite + breathe} />
      <circle cx={x} cy={y} r={ringR} fill="none" stroke={core} strokeWidth={2} opacity={ringOpacity} />
    </svg>
  );
};
