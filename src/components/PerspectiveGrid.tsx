import React from "react";
import { COLORS } from "../config/design";

export const PLANE_W = 1700;
export const PLANE_H = 2100;
const SPACING = 86;

export const PerspectiveGrid: React.FC = () => {
  const verticals: React.ReactNode[] = [];
  const horizontals: React.ReactNode[] = [];
  for (let x = 0; x <= PLANE_W; x += SPACING) {
    verticals.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={PLANE_H} stroke={COLORS.cyan} strokeWidth={1} />,
    );
  }
  for (let y = 0; y <= PLANE_H; y += SPACING) {
    horizontals.push(
      <line key={`h${y}`} x1={0} y1={y} x2={PLANE_W} y2={y} stroke={COLORS.cyan} strokeWidth={1} />,
    );
  }
  return (
    <svg
      width={PLANE_W}
      height={PLANE_H}
      viewBox={`0 0 ${PLANE_W} ${PLANE_H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="35%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="gridMask">
          <rect x="0" y="0" width={PLANE_W} height={PLANE_H} fill="url(#gridFade)" />
        </mask>
      </defs>
      <g opacity={0.16} mask="url(#gridMask)">
        {verticals}
        {horizontals}
      </g>
    </svg>
  );
};
