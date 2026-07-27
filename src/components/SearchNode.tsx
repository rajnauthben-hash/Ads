import React from "react";
import { Pt } from "../utils/routeGeometry";
import { COLORS } from "../styles/tokens";

/**
 * A customer-search signal node: a cyan ring with a magnifier (or person) icon.
 * Represents a nearby customer actively searching. Scale/opacity are always
 * frame-derived by the caller.
 */
export const SearchNode: React.FC<{
  at: Pt;
  scale?: number;
  opacity?: number;
  variant?: "search" | "person";
  r?: number;
  pulse?: number; // 0..1 expanding ring
  label?: string;
  labelColor?: string;
  labelDx?: number;
  labelDy?: number;
  labelAnchor?: "start" | "middle" | "end";
}> = ({
  at,
  scale = 1,
  opacity = 1,
  variant = "search",
  r = 26,
  pulse = 0,
  label,
  labelColor = COLORS.cyan,
  labelDx = 34,
  labelDy = 0,
  labelAnchor = "start",
}) => {
  return (
    <g opacity={opacity} transform={`translate(${at.x} ${at.y}) scale(${scale})`}>
      {pulse > 0 && pulse < 1 ? (
        <circle
          cx={0}
          cy={0}
          r={r + pulse * 22}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={2}
          opacity={(1 - pulse) * 0.6}
        />
      ) : null}
      <circle cx={0} cy={0} r={r} fill="rgba(5,8,12,0.85)" stroke={COLORS.cyan} strokeWidth={2.4} />
      <circle
        cx={0}
        cy={0}
        r={r}
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth={2.4}
        opacity={0.5}
        style={{ filter: "blur(3px)" }}
      />
      {variant === "search" ? (
        <g stroke={COLORS.white} strokeWidth={2.6} fill="none" strokeLinecap="round">
          <circle cx={-3} cy={-3} r={8} />
          <line x1={4} y1={4} x2={11} y2={11} />
        </g>
      ) : (
        <g fill={COLORS.white}>
          <circle cx={0} cy={-6} r={6} />
          <path d="M -10 12 C -10 2, 10 2, 10 12 Z" />
        </g>
      )}
      {label ? (
        <text
          x={labelDx}
          y={labelDy}
          fill={labelColor}
          fontFamily="Manrope, sans-serif"
          fontSize={19}
          fontWeight={500}
          dominantBaseline="middle"
          textAnchor={labelAnchor}
        >
          {label.split("\n").map((line, i) => (
            <tspan key={i} x={labelDx} dy={i === 0 ? 0 : 22}>
              {line}
            </tspan>
          ))}
        </text>
      ) : null}
    </g>
  );
};
