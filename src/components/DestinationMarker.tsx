import React from "react";
import { COLORS } from "../styles/tokens";

/**
 * The warm-gold destination marker that forms above YOUR BUSINESS in Scene 6.
 * An outer ring draws in, the pin body resolves, and destination text follows a
 * gentle arc above it — kept readable, never rotated to an unreadable angle.
 */
export const DestinationMarker: React.FC<{
  cx: number;
  cy: number;
  ringDraw: number; // 0..1
  bodyScale: number; // 0.92..1
  glow: number; // 0..1
  textReveal: number; // 0..1
  zIndex?: number;
}> = ({ cx, cy, ringDraw, bodyScale, glow, textReveal, zIndex = 55 }) => {
  const R = 46;
  const circ = 2 * Math.PI * R;
  const gold = COLORS.gold;
  return (
    <svg
      width={520}
      height={300}
      viewBox="0 0 520 300"
      style={{ position: "absolute", left: cx - 260, top: cy - 210, zIndex, overflow: "visible" }}
    >
      <defs>
        <path id="destArc1" d="M 120 120 Q 260 40 400 120" fill="none" />
        <path id="destArc2" d="M 140 150 Q 260 82 380 150" fill="none" />
      </defs>

      {/* curved destination text */}
      <g opacity={textReveal} style={{ filter: `drop-shadow(0 0 6px rgba(228,179,99,${0.3 * glow}))` }}>
        <text fill={gold} fontFamily="Inter Tight, sans-serif" fontWeight={700} fontSize={26} letterSpacing={2}>
          <textPath href="#destArc1" startOffset="50%" textAnchor="middle">
            EASIER TO FIND
          </textPath>
        </text>
        <text fill={gold} fontFamily="Inter Tight, sans-serif" fontWeight={700} fontSize={22} letterSpacing={3}>
          <textPath href="#destArc2" startOffset="50%" textAnchor="middle">
            TRUSTED • CHOSEN
          </textPath>
        </text>
      </g>

      {/* pin */}
      <g transform={`translate(260 205) scale(${bodyScale})`}>
        {/* teardrop body */}
        <path
          d="M 0 40 C -30 5 -34 -10 -34 -24 A 34 34 0 1 1 34 -24 C 34 -10 30 5 0 40 Z"
          fill="rgba(9,12,17,0.92)"
          stroke={gold}
          strokeWidth={2.4}
          opacity={Math.min(1, ringDraw * 1.2)}
          style={{ filter: `drop-shadow(0 0 ${10 * glow}px rgba(228,179,99,${0.4 * glow}))` }}
        />
        {/* outer ring draw */}
        <circle
          cx={0}
          cy={-24}
          r={R}
          fill="none"
          stroke={gold}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - ringDraw)}
          transform="rotate(-90)"
          opacity={0.5}
        />
        {/* magnifier icon */}
        <g stroke={gold} strokeWidth={3} fill="none" strokeLinecap="round" opacity={Math.min(1, ringDraw * 1.3)}>
          <circle cx={-5} cy={-28} r={11} />
          <line x1={4} y1={-19} x2={13} y2={-10} />
        </g>
      </g>
    </svg>
  );
};
