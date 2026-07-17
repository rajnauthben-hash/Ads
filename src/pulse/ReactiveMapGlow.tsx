import React from "react";
import { COLORS } from "./theme";

type Props = {
  x: number;
  y: number;
  r?: number;
  color?: string;
  // 0..1 — instantaneous strength of the illumination.
  strength: number;
  // Squash for glows lying on the map plane.
  squash?: number;
};

// A soft pool of light the map geometry "receives" from passing energy —
// stacked translucent ellipses, no SVG filters, cheap per frame.
export const ReactiveMapGlow: React.FC<Props> = ({
  x,
  y,
  r = 90,
  color = COLORS.cyan,
  strength,
  squash = 0.5,
}) => {
  if (strength <= 0.02) {
    return null;
  }
  return (
    <g style={{ pointerEvents: "none" }}>
      <ellipse cx={x} cy={y} rx={r} ry={r * squash} fill={color} opacity={0.035 * strength} />
      <ellipse cx={x} cy={y} rx={r * 0.6} ry={r * 0.6 * squash} fill={color} opacity={0.05 * strength} />
      <ellipse cx={x} cy={y} rx={r * 0.3} ry={r * 0.3 * squash} fill={color} opacity={0.07 * strength} />
    </g>
  );
};
