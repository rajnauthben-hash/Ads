import React from "react";
import { COLORS } from "../styles/tokens";

// Restrained expanding ring at a destination/origin. Progress 0..1 drives one
// ripple; caller controls timing deterministically.
export const DestinationRipple: React.FC<{
  x: number;
  y: number;
  progress: number; // 0..1
  color?: string;
  maxR?: number;
}> = ({ x, y, progress, color = COLORS.cyan, maxR = 40 }) => {
  const r = progress * maxR;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={2} opacity={(1 - progress) * 0.8} />
      <ellipse cx={x} cy={y + 4} rx={r * 0.9} ry={r * 0.32} fill="none" stroke={color} strokeWidth={1.5} opacity={(1 - progress) * 0.4} />
    </svg>
  );
};
