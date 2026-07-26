import React from "react";
import { LAYER } from "../styles/tokens";

/**
 * Development-only guide. Can overlay a faint reference plate or grid to check
 * composition against the approved keyframes. Never included in final render.
 */
export const ReferenceGuide: React.FC<{
  enabled?: boolean;
  opacity?: number;
}> = ({ enabled = false, opacity = 0.25 }) => {
  if (!enabled) return null;
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= 1080; x += 90) {
    lines.push(
      <line key={`vx${x}`} x1={x} y1={0} x2={x} y2={1920} stroke="rgba(18,211,238,0.25)" strokeWidth={1} />,
    );
  }
  for (let y = 0; y <= 1920; y += 90) {
    lines.push(
      <line key={`hy${y}`} x1={0} y1={y} x2={1080} y2={y} stroke="rgba(18,211,238,0.25)" strokeWidth={1} />,
    );
  }
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, zIndex: LAYER.devGuides, opacity, pointerEvents: "none" }}
    >
      {lines}
    </svg>
  );
};
