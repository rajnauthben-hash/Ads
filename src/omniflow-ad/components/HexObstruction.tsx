import React from "react";
import { COLORS } from "../styles/tokens";

// Controlled amber hexagonal obstruction barrier. Fixed cell pattern (no
// randomness). Impact point can brighten. Used in Scene 3 (and forms during
// the Scene 2->3 transition).
export const HexObstruction: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  rows?: number;
  cols?: number;
  opacity?: number;
  impact?: number; // 0..1 brightness burst at impact centre
  impactY?: number; // 0..1 vertical position of impact
}> = ({ x, y, width, height, rows = 9, cols = 3, opacity = 0.72, impact = 0, impactY = 0.5 }) => {
  const cellW = width / cols;
  const cellH = height / rows;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cellW + cellW / 2 + (r % 2) * cellW * 0.28;
      const cy = r * cellH + cellH / 2;
      const distToImpact = Math.abs(cy / height - impactY);
      const boost = impact * Math.max(0, 1 - distToImpact * 4);
      cells.push(
        <polygon
          key={`${r}-${c}`}
          points={hexPoints(cx, cy, cellW * 0.5)}
          fill={`rgba(229,164,71,${(0.05 + boost * 0.25).toFixed(3)})`}
          stroke={`rgba(242,163,61,${(0.45 + boost * 0.5).toFixed(3)})`}
          strokeWidth={1}
        />,
      );
    }
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity }}
    >
      {cells}
      {impact > 0 && (
        <circle
          cx={width / 2}
          cy={impactY * height}
          r={18 + impact * 10}
          fill="rgba(234,251,255,0.9)"
          opacity={impact * 0.8}
          style={{ filter: "blur(6px)" }}
        />
      )}
    </svg>
  );
};

function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export const CYAN_IMPACT = COLORS.cyan;
