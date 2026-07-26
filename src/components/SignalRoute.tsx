import React from "react";
import { pointAtLength, Pt, smoothPath } from "../utils/routeGeometry";
import { COLORS } from "../styles/tokens";

/**
 * A cyan customer-signal route drawn along road centres. Built with SVG:
 * a wide restrained glow underlay + a thin core, drawn deterministically via
 * pathLength=1 + strokeDasharray. Supports a dotted (unconnected/failed) mode.
 */
export interface SignalRouteProps {
  points: Pt[];
  progress: number; // 0..1 draw
  color?: string;
  core?: number; // core stroke width 2..4
  glow?: number; // outer glow width 8..13
  dotted?: boolean;
  brightness?: number; // 0..1 multiplies opacity
  radius?: number;
}

export const SignalRoute: React.FC<SignalRouteProps> = ({
  points,
  progress,
  color = COLORS.cyan,
  core = 3,
  glow = 10,
  dotted = false,
  brightness = 1,
  radius = 16,
}) => {
  if (points.length < 2 || progress <= 0) return null;
  const d = smoothPath(points, radius);
  const dash = dotted ? `${0.012} ${0.02}` : `${progress} ${1 - progress + 0.0001}`;
  const common = {
    d,
    fill: "none" as const,
    pathLength: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDasharray: dotted ? `${0.012} ${0.02}` : dash,
    strokeDashoffset: 0,
  };
  // For dotted mode we still clip the reveal by an inset via a second dash on a
  // group opacity gate keyed on progress. Simplicity: draw dotted fully once it
  // begins, scaling opacity by progress for the leading edge.
  return (
    <g opacity={brightness}>
      <path
        {...common}
        stroke={color}
        strokeWidth={glow}
        opacity={0.28}
        style={{ filter: `blur(${Math.min(6, glow * 0.4)}px)` }}
      />
      <path {...common} stroke={color} strokeWidth={core} opacity={0.95} />
    </g>
  );
};

/** A directional pulse travelling along the actual route path. */
export const MovingPulse: React.FC<{
  points: Pt[];
  t: number; // 0..1 position along path
  color?: string;
  size?: number;
  maxProgress?: number; // only show while within the drawn part
  opacity?: number;
}> = ({ points, t, color = COLORS.cyan, size = 6, maxProgress = 1, opacity = 1 }) => {
  if (points.length < 2 || t > maxProgress) return null;
  const p = pointAtLength(points, t);
  return (
    <g opacity={opacity}>
      <circle cx={p.x} cy={p.y} r={size * 2} fill={color} opacity={0.22} style={{ filter: "blur(4px)" }} />
      <circle cx={p.x} cy={p.y} r={size} fill={COLORS.white} opacity={0.95} />
      <circle cx={p.x} cy={p.y} r={size * 0.55} fill={color} />
    </g>
  );
};

/** A small arrowhead marker pointing along the route direction at fraction t. */
export const RouteArrow: React.FC<{ points: Pt[]; t: number; color?: string; size?: number }> = ({
  points,
  t,
  color = COLORS.cyan,
  size = 9,
}) => {
  if (points.length < 2) return null;
  const p = pointAtLength(points, t);
  const p2 = pointAtLength(points, Math.min(1, t + 0.02));
  const ang = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${ang})`}>
      <path d={`M ${-size} ${-size * 0.7} L ${size * 0.6} 0 L ${-size} ${size * 0.7} Z`} fill={color} />
    </g>
  );
};
