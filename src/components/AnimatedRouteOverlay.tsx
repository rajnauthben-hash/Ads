import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS, H, W } from "../config/design";
import { smoothPath, polylineLength, pointAtFraction, type Pt } from "./pathMath";

/**
 * Additive light overlay for a painted route in the artwork plate: a faint
 * draw-on core, a bright travelling highlight segment with a directional
 * arrow at its head, and trailing data particles. Screen-blended, so it
 * energizes the painted path without repainting it.
 */
export const AnimatedRouteOverlay: React.FC<{
  points: Pt[];
  frame: number;
  start: number; // frame the draw-on begins
  color?: "gold" | "cyan";
  width?: number;
  opacity?: number;
}> = ({ points, frame, start, color = "cyan", width = 4, opacity = 1 }) => {
  if (points.length < 2 || frame < start) return null;
  const core = color === "gold" ? COLORS.gold : COLORS.cyan;
  const d = smoothPath(points);
  const len = polylineLength(points) * 1.18 + 40;

  const draw = interpolate(frame - start, [0, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  // Travelling highlight: a bright dash segment cycling along the path.
  const seg = Math.min(len * 0.22, 260);
  const speed = 9; // px per frame
  const cycle = len + seg;
  const travelled = ((frame - start) * speed) % cycle;
  const headT = Math.min(Math.max((travelled - 4) / len, 0), 1) * draw;
  const head = pointAtFraction(points, headT);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "screen", opacity }}
    >
      {/* faint draw-on core reinforcing the painted route */}
      <path
        d={d}
        fill="none"
        stroke={core}
        strokeWidth={width * 0.55}
        strokeLinecap="round"
        opacity={0.3 * draw}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
      {/* travelling highlight segment */}
      <path
        d={d}
        fill="none"
        stroke={core}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={0.85 * draw}
        strokeDasharray={`${seg} ${len}`}
        strokeDashoffset={seg - travelled}
        style={{ filter: `drop-shadow(0 0 6px ${core})` }}
      />
      {/* particles trailing behind the head */}
      {[0.12, 0.22].map((back, i) => {
        const t = Math.max(headT - back, 0);
        if (t <= 0.01) return null;
        const p = pointAtFraction(points, t);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={width * 0.9}
            fill={core}
            opacity={0.7 * draw}
            style={{ filter: `drop-shadow(0 0 4px ${core})` }}
          />
        );
      })}
      {/* directional arrow at the highlight head */}
      {headT > 0.05 && headT < 0.99 && (
        <polygon
          points="0,-7 12,0 0,7"
          fill={core}
          opacity={0.9 * draw}
          transform={`translate(${head.x}, ${head.y}) rotate(${head.angle})`}
          style={{ filter: `drop-shadow(0 0 5px ${core})` }}
        />
      )}
    </svg>
  );
};
