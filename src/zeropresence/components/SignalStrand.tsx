// ============================================================================
// SignalStrand — the primitive that renders the persistent electric-cyan
// SearchSignal. A single stroked SVG path with controlled glow and a
// deterministic draw-on (0..1). Every scene routes the same customer signal
// through this primitive so it reads as one continuous object.
// ============================================================================
import React from "react";
import { COLORS, WIDTH, HEIGHT } from "../tokens";

export const SignalStrand: React.FC<{
  d: string;
  draw?: number; // 0..1 stroke-draw progress
  opacity?: number;
  width?: number;
  color?: string;
  glow?: number; // px blur, capped at 26
  dashed?: boolean;
  headDot?: boolean; // bright dot at the leading end
}> = ({ d, draw = 1, opacity = 1, width = 3, color = COLORS.cyan, glow = 12, dashed = false, headDot = false }) => {
  const g = Math.min(glow, 26);
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {/* soft glow underlay */}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity * 0.35}
        strokeDasharray={dashed ? "0.012 0.02" : "1 1"}
        strokeDashoffset={dashed ? 0 : 1 - draw}
        style={{ filter: `blur(${g}px)` }}
      />
      {/* core stroke */}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={dashed ? color : COLORS.cyanBright}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={dashed ? "0.012 0.02" : "1 1"}
        strokeDashoffset={dashed ? 0 : 1 - draw}
      />
    </svg>
  );
};

// Bright travelling pulse dot along a path fraction (used for held-scene life).
export const SignalPulseDot: React.FC<{ x: number; y: number; r?: number; opacity?: number }> = ({ x, y, r = 5, opacity = 1 }) => (
  <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
    <circle cx={x} cy={y} r={r + 6} fill={COLORS.cyan} opacity={opacity * 0.3} style={{ filter: "blur(8px)" }} />
    <circle cx={x} cy={y} r={r} fill={COLORS.cyanBright} opacity={opacity} />
  </svg>
);
