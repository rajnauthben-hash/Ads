import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import { clamp01 } from "../util";
import { Glyph, IconName } from "./icons";

/**
 * Gold (or dim) map destination pin with glow, pulse rings and an
 * optional glyph. Renders an SVG <g> positioned at (x, y) = pin tip.
 */
export interface DestinationPinProps {
  x: number;
  y: number;
  frame: number;
  appear?: number;
  size?: number;
  color?: string;
  icon?: IconName;
  rings?: boolean;
  ringPeriod?: number;
  dim?: number; // 0..1 brightness multiplier
  idPrefix: string;
  bob?: boolean;
}

export const DestinationPin: React.FC<DestinationPinProps> = ({
  x,
  y,
  frame,
  appear = 0,
  size = 1,
  color = C.gold,
  icon,
  rings = false,
  ringPeriod = 46,
  dim = 1,
  idPrefix,
  bob = true,
}) => {
  const local = frame - appear;
  if (local < 0) return null;
  const pop = interpolate(local, [0, 10, 16], [0.25, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = clamp01(local / 8) * dim;
  const bobY = bob ? Math.sin(frame * 0.07 + x * 0.01) * 3.5 : 0;

  const ringEls: React.ReactNode[] = [];
  if (rings && local > 6) {
    for (let i = 0; i < 2; i++) {
      const q = (((local - 6) / ringPeriod + i / 2) % 1 + 1) % 1;
      ringEls.push(
        <ellipse
          key={i}
          cx={0}
          cy={0}
          rx={(18 + q * 60) * size}
          ry={(7 + q * 24) * size}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          opacity={(1 - q) * 0.5 * dim}
        />,
      );
    }
    // static base ring
    ringEls.push(
      <ellipse key="base" cx={0} cy={0} rx={26 * size} ry={10.5 * size} fill="none" stroke={color} strokeWidth={1.2} opacity={0.35 * dim} />,
    );
  }

  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <defs>
        <filter id={`${idPrefix}-pinblur`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>
      {ringEls}
      <ellipse cx={0} cy={2} rx={16 * size * pop} ry={6 * size * pop} fill={color} opacity={0.3 * dim} filter={`url(#${idPrefix}-pinblur)`} />
      <g transform={`translate(0 ${bobY - 4}) scale(${(pop * size).toFixed(3)})`}>
        {/* glow copy */}
        <path
          d="M 0 0 C -11 -18 -26 -26 -26 -44 C -26 -60 -14 -70 0 -70 C 14 -70 26 -60 26 -44 C 26 -26 11 -18 0 0 Z"
          fill={color}
          opacity={0.5 * dim}
          filter={`url(#${idPrefix}-pinblur)`}
        />
        <path
          d="M 0 0 C -11 -18 -26 -26 -26 -44 C -26 -60 -14 -70 0 -70 C 14 -70 26 -60 26 -44 C 26 -26 11 -18 0 0 Z"
          fill={color}
        />
        <circle cx={0} cy={-45} r={13.5} fill="#0B0C0E" opacity={0.85} />
        {icon ? (
          <g transform="translate(0 -45)">
            <Glyph name={icon} color={color} scale={0.8} />
          </g>
        ) : (
          <circle cx={0} cy={-45} r={5.5} fill={color} />
        )}
      </g>
    </g>
  );
};
