import React from "react";
import { COLORS } from "../constants";
import { ease } from "../anim";

/**
 * GoldDivider — a thin warm-gold rule that draws in from the left. The same
 * primitive extends and repurposes into card borders across scene seams.
 */
export const GoldDivider: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  frame: number;
  start: number;
  dur?: number;
}> = ({ x, y, width, height = 2, frame, start, dur = 18 }) => {
  const w = ease(frame, [start, start + dur], [0, width]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height,
        background: `linear-gradient(90deg, ${COLORS.warmGold}, ${COLORS.goldDark})`,
        boxShadow: `0 0 8px ${COLORS.goldDark}`,
        borderRadius: 1,
      }}
    />
  );
};
