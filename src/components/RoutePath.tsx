import React from "react";
import { COLORS, W, H } from "../config/design";
import { smoothPath, polylineLength, pointAtFraction, type Pt } from "./pathMath";

export const RoutePath: React.FC<{
  points: Pt[];
  frame: number;
  progress: number; // 0-1 draw-on amount
  color?: "cyan" | "gold";
  particleCount?: number;
  particleSpeed?: number; // fraction of path per frame
  arrow?: boolean;
  strokeWidth?: number;
  opacity?: number;
}> = ({
  points,
  frame,
  progress,
  color = "cyan",
  particleCount = 2,
  particleSpeed = 0.0035,
  arrow = true,
  strokeWidth = 2,
  opacity = 1,
}) => {
  if (points.length < 2) return null;
  const core = color === "gold" ? COLORS.gold : COLORS.cyan;
  const d = smoothPath(points);
  const length = polylineLength(points) * 1.18 + 40;
  const dashOffset = length * (1 - Math.max(0, Math.min(1, progress)));
  const tip = pointAtFraction(points, 1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      {/* glow */}
      <path
        d={d}
        fill="none"
        stroke={core}
        strokeWidth={strokeWidth * 6}
        strokeLinecap="round"
        opacity={0.16 * opacity}
        style={{ filter: "blur(7px)" }}
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
      />
      {/* core */}
      <path
        d={d}
        fill="none"
        stroke={core}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
      />
      {progress > 0.03 &&
        Array.from({ length: particleCount }).map((_, i) => {
          const phase = (i + 1) / (particleCount + 1);
          const t = ((frame * particleSpeed + phase) % 1) * Math.min(progress, 1);
          const p = pointAtFraction(points, t);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={strokeWidth * 1.6}
              fill={core}
              opacity={0.85 * opacity}
              style={{ filter: `drop-shadow(0 0 4px ${core})` }}
            />
          );
        })}
      {arrow && progress > 0.94 && (
        <polygon
          points="0,-6 10,0 0,6"
          fill={core}
          opacity={opacity}
          transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.angle})`}
          style={{ filter: `drop-shadow(0 0 3px ${core})` }}
        />
      )}
    </svg>
  );
};
