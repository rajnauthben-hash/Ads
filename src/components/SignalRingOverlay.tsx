import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../config/design";

/**
 * Large concentric signal rings expanding around the storefront, layered
 * additively over the painted rings in the artwork plate.
 */
export const SignalRingOverlay: React.FC<{
  x: number;
  y: number;
  frame: number;
  at: number;
  strength?: number; // 0–1 brightness multiplier
  maxRadius?: number;
}> = ({ x, y, frame, at, strength = 1, maxRadius = 190 }) => {
  const local = frame - at;
  if (local < 0 || strength <= 0.02) return null;
  const fadeIn = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const period = 64;

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
      {[0, 1, 2].map((i) => {
        const phase = ((local + (i * period) / 3) % period) / period;
        // Rings expand along a squashed ellipse to sit on the map plane.
        const r = 26 + phase * maxRadius;
        const opacity = (1 - phase) * 0.4 * strength * fadeIn;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={r}
            ry={r * 0.48}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={1.8}
            opacity={opacity}
          />
        );
      })}
      <circle
        cx={x}
        cy={y}
        r={7}
        fill={COLORS.cyan}
        opacity={0.5 * strength * fadeIn}
        style={{ filter: `blur(3px)` }}
      />
    </svg>
  );
};
