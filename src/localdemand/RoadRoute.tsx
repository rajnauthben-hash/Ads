import React from "react";
import { COLOR } from "./theme";
import { roundedPath, polyPointAt, Pt } from "./projection";

/**
 * A cyan navigation route that follows the street grid. Animated with a
 * normalized pathLength draw-on (strokeDasharray / strokeDashoffset) plus a
 * small directional pulse travelling along the path — like data moving
 * through a real city, not a neon ribbon.
 *
 * Takes explicit projected `points` so callers can build grid-following
 * routes (via projectNodes) or phone-origin routes (custom screen points).
 */

export type RouteProps = {
  points: Pt[];
  progress: number; // 0..1 draw-on
  pulse?: number; // 0..1 travelling pulse position
  radius?: number;
  dotted?: boolean;
  emphasis?: number;
  core?: string;
  showPulse?: boolean;
  /** For a fixed-length dotted path, reveal by opacity ramp. */
};

export const RoadRoute: React.FC<RouteProps> = ({
  points,
  progress,
  pulse = 0,
  radius = 30,
  dotted = false,
  emphasis = 1,
  core = COLOR.cyanCore,
  showPulse = true,
}) => {
  const d = roundedPath(points, radius);
  const draw = Math.max(0, Math.min(1, progress));
  const dashOffset = 1 - draw;

  const pulsePos = Math.min(draw, pulse);
  const { p: pulsePt } = polyPointAt(points, pulsePos);
  const { p: headPt } = polyPointAt(points, draw);

  return (
    <g opacity={emphasis}>
      {/* Outer soft glow */}
      <path
        d={d}
        fill="none"
        stroke={COLOR.cyan}
        strokeWidth={dotted ? 5 : 12}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={dotted ? "0.010 0.020" : 1}
        strokeDashoffset={dotted ? 0 : dashOffset}
        opacity={dotted ? 0.4 * clipDot(draw) : 0.3}
        filter="url(#cyanGlowWide)"
      />
      {/* Mid stroke */}
      <path
        d={d}
        fill="none"
        stroke={dotted ? COLOR.cyanDeep : COLOR.cyan}
        strokeWidth={dotted ? 3.6 : 6.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={dotted ? "0.010 0.020" : 1}
        strokeDashoffset={dotted ? 0 : dashOffset}
        opacity={dotted ? 0.85 * clipDot(draw) : 0.9}
        filter={dotted ? undefined : "url(#cyanGlow)"}
      />
      {/* Bright core */}
      {!dotted && (
        <path
          d={d}
          fill="none"
          stroke={core}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={dashOffset}
          opacity={0.95}
        />
      )}

      {showPulse && !dotted && draw > 0.02 && draw < 0.999 && (
        <>
          <circle cx={headPt.x} cy={headPt.y} r={9} fill={COLOR.cyanCore} opacity={0.9} filter="url(#cyanGlow)" />
          <circle cx={pulsePt.x} cy={pulsePt.y} r={5.5} fill={COLOR.cyanCore} opacity={0.85} filter="url(#cyanGlow)" />
        </>
      )}
      {showPulse && !dotted && draw >= 0.999 && (
        <circle cx={pulsePt.x} cy={pulsePt.y} r={6} fill={COLOR.cyanCore} opacity={0.9} filter="url(#cyanGlow)" />
      )}
    </g>
  );
};

function clipDot(draw: number): number {
  return Math.max(0, Math.min(1, (draw - 0.02) / 0.35));
}

export const DestinationRing: React.FC<{
  at: Pt;
  color?: string;
  scale?: number;
  opacity?: number;
}> = ({ at, color = COLOR.cyanCore, scale = 1, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={at.x} cy={at.y} r={16 * scale} fill="none" stroke={color} strokeWidth={2.5} opacity={0.9} filter="url(#cyanGlow)" />
    <circle cx={at.x} cy={at.y} r={7 * scale} fill={color} opacity={0.85} filter="url(#cyanGlow)" />
  </g>
);
