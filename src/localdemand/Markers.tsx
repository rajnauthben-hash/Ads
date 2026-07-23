import React from "react";
import { COLOR, FONT } from "./theme";
import { Pt } from "./projection";

/** Glowing origin marker for "Your customer" (Scene 3) / the map node. */
export const CustomerMarker: React.FC<{ at: Pt; pulse?: number; opacity?: number }> = ({
  at,
  pulse = 0,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    <circle cx={at.x} cy={at.y} r={26 + pulse * 10} fill="none" stroke={COLOR.cyan} strokeWidth={2} opacity={0.5 * (1 - pulse)} />
    <circle cx={at.x} cy={at.y} r={20} fill={COLOR.cyanGlowSoft} filter="url(#cyanGlow)" />
    <circle cx={at.x} cy={at.y} r={10} fill="none" stroke={COLOR.cyanCore} strokeWidth={2.4} />
    <circle cx={at.x} cy={at.y} r={4} fill={COLOR.cyanCore} />
  </g>
);

/** "Missed connection" X marker (Scene 3). */
export const MissedConnectionMarker: React.FC<{ at: Pt; opacity?: number }> = ({ at, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={at.x} cy={at.y} r={16} fill="none" stroke={COLOR.gray} strokeWidth={2.2} />
    <line x1={at.x - 7} y1={at.y - 7} x2={at.x + 7} y2={at.y + 7} stroke={COLOR.gray} strokeWidth={2.2} strokeLinecap="round" />
    <line x1={at.x + 7} y1={at.y - 7} x2={at.x - 7} y2={at.y + 7} stroke={COLOR.gray} strokeWidth={2.2} strokeLinecap="round" />
  </g>
);

/** A leader-line label anchored to a point on the map (SVG-native). */
export const MapLabel: React.FC<{
  at: Pt;
  lines: string[];
  dx: number;
  dy: number;
  opacity?: number;
  anchor?: "start" | "middle" | "end";
  leader?: boolean;
}> = ({ at, lines, dx, dy, opacity = 1, anchor = "start", leader = true }) => {
  const tx = at.x + dx;
  const ty = at.y + dy;
  return (
    <g opacity={opacity}>
      {leader && <line x1={at.x} y1={at.y} x2={tx} y2={ty + (dy < 0 ? 6 : -6)} stroke={COLOR.gray} strokeWidth={1.5} opacity={0.7} />}
      {lines.map((l, i) => (
        <text
          key={i}
          x={tx}
          y={ty + i * 30 + (dy < 0 ? -8 : 24)}
          textAnchor={anchor}
          fontFamily={FONT.ui}
          fontSize={26}
          fill={COLOR.white}
          opacity={0.92}
        >
          {l}
        </text>
      ))}
    </g>
  );
};
