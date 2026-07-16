import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

type Props = {
  cx: number;
  cy: number;
  // 0..1 — strength/opacity of the whole ring system.
  activity: number;
  maxRadius?: number;
  color?: string;
  rings?: number;
  // Vertical squash to sit on the map plane.
  squash?: number;
  speed?: number;
};

// Expanding concentric visibility rings pinned under a node. Ring phase is
// derived from the frame, so the system breathes continuously.
export const SignalRing: React.FC<Props> = ({
  cx,
  cy,
  activity,
  maxRadius = 120,
  color = COLORS.cyan,
  rings = 3,
  squash = 0.38,
  speed = 0.011,
}) => {
  const frame = useCurrentFrame();
  if (activity <= 0.01) {
    return null;
  }
  return (
    <g>
      {Array.from({ length: rings }, (_, i) => {
        const phase = (frame * speed + i / rings) % 1;
        const r = 14 + phase * maxRadius;
        const fade = (1 - phase) * activity;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={r}
            ry={r * squash}
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            opacity={0.5 * fade}
          />
        );
      })}
      <ellipse
        cx={cx}
        cy={cy}
        rx={16}
        ry={16 * squash}
        fill={color}
        opacity={0.18 * activity}
      />
    </g>
  );
};
