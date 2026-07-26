import React from "react";
import { FONT_UI } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

/**
 * A customer action affordance (CALL / DIRECTIONS / VISIT) — a cyan ring with a
 * vector glyph and a label beneath. The ring can draw in via `draw` (0..1).
 */
export const ActionIcon: React.FC<{
  cx: number;
  cy: number;
  type: "call" | "directions" | "visit";
  label: string;
  draw: number;
  r?: number;
  zIndex?: number;
}> = ({ cx, cy, type, label, draw, r = 34, zIndex = 55 }) => {
  const d = Math.max(0, Math.min(1, draw));
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: cx - r - 20, top: cy - r - 20, zIndex }}>
      <svg width={(r + 20) * 2} height={(r + 20) * 2 + 34} style={{ overflow: "visible" }}>
        <g transform={`translate(${r + 20} ${r + 20})`}>
          <circle
            cx={0}
            cy={0}
            r={r}
            fill="rgba(5,8,12,0.7)"
            stroke={COLORS.cyan}
            strokeWidth={2.4}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - d)}
            transform="rotate(-90)"
            style={{ filter: "drop-shadow(0 0 5px rgba(18,211,238,0.35))" }}
          />
          <Glyph type={type} />
        </g>
        <text
          x={r + 20}
          y={(r + 20) * 2 + 22}
          textAnchor="middle"
          fill={COLORS.cyan}
          fontFamily={FONT_UI}
          fontSize={17}
          fontWeight={500}
          letterSpacing={1.6}
          opacity={d}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

const Glyph: React.FC<{ type: string }> = ({ type }) => {
  const c = COLORS.white;
  if (type === "call")
    return (
      <path
        d="M-8 -10 c-1 0 -2 1 -2 2 0 9 7 16 16 16 1 0 2 -1 2 -2 l0 -4 c0 -1 -1 -2 -2 -2 l-3 0 c-1 0 -1 1 -2 1 -2 -1 -4 -3 -5 -5 0 -1 1 -1 1 -2 l0 -3 c0 -1 -1 -2 -2 -2 z"
        fill={c}
      />
    );
  if (type === "directions")
    return <path d="M-12 10 L12 -2 L-2 -2 L-2 -12 Z" fill={c} transform="rotate(12)" />;
  // visit / storefront
  return (
    <g fill="none" stroke={c} strokeWidth={2} strokeLinejoin="round">
      <path d="M-12 -4 L-10 -11 L10 -11 L12 -4 Z" />
      <path d="M-10 -4 L-10 11 L10 11 L10 -4" />
      <rect x={-3} y={2} width={6} height={9} fill={c} stroke="none" />
    </g>
  );
};
