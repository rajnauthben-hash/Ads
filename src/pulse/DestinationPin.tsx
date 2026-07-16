import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

type Props = {
  x: number;
  y: number;
  // Local frame at which the pin drops in.
  appearFrame: number;
  scale?: number;
  color?: string;
  // 0..1 — glow strength once landed.
  glow?: number;
  // If set, the pin emits a single stronger pulse at this local frame.
  pulseAt?: number;
  dim?: boolean;
};

// A gold map pin that drops onto the map, lands with a soft ground pulse
// and keeps a heartbeat glow while traffic reaches it.
export const DestinationPin: React.FC<Props> = ({
  x,
  y,
  appearFrame,
  scale = 1,
  color = COLORS.gold,
  glow = 1,
  pulseAt,
  dim = false,
}) => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.3, 1),
  });
  if (drop <= 0) {
    return null;
  }
  const rise = (1 - drop) * -46;
  const heartbeat = 0.75 + 0.25 * Math.sin(frame * 0.14 + x * 0.05);
  const baseOpacity = dim ? 0.34 : 1;

  // One restrained premium pulse.
  const extraPulse =
    pulseAt !== undefined
      ? interpolate(frame, [pulseAt, pulseAt + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.01;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={drop * baseOpacity}>
      {/* Landing ring */}
      <ellipse
        cx={0}
        cy={2}
        rx={20 + (1 - drop) * 14}
        ry={7}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.5 * drop * (dim ? 0.5 : 1)}
      />
      {extraPulse < 1 && (
        <ellipse
          cx={0}
          cy={2}
          rx={16 + extraPulse * 70}
          ry={6 + extraPulse * 25}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={(1 - extraPulse) * 0.85}
        />
      )}
      <g transform={`translate(0 ${rise})`}>
        {/* Glow */}
        <circle cx={0} cy={-26} r={22} fill={color} opacity={0.14 * glow * heartbeat * (dim ? 0.3 : 1)} />
        {/* Teardrop */}
        <path
          d="M 0 0 C -14 -18 -16 -24 -16 -32 A 16 16 0 1 1 16 -32 C 16 -24 14 -18 0 0 Z"
          fill={dim ? COLORS.slate : color}
          stroke={color}
          strokeWidth={dim ? 1.6 : 0}
        />
        <circle cx={0} cy={-31} r={6} fill={dim ? "rgba(255,199,0,0.4)" : COLORS.bg} />
      </g>
    </g>
  );
};
