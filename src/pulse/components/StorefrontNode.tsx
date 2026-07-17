import React from "react";
import { C, FONT_BODY } from "../theme";
import { clamp01 } from "../util";

/**
 * Stylized physical storefront, built natively in SVG: parapet, sign
 * band, striped awning, warm glowing windows and a door. `glow` (0..1)
 * drives how alive the business looks. Anchored at bottom-centre (x, y).
 */
export interface StorefrontNodeProps {
  x: number;
  y: number;
  frame: number;
  width?: number;
  glow?: number;
  sign?: string;
  pinColor?: string;
  pinOpacity?: number;
  ringLevel?: number; // 0..1 strength of the visibility ring
  ringFlicker?: boolean;
  idPrefix: string;
  appear?: number;
  premium?: boolean;
}

export const StorefrontNode: React.FC<StorefrontNodeProps> = ({
  x,
  y,
  frame,
  width = 360,
  glow = 0.5,
  sign = "YOUR BUSINESS",
  pinColor = C.cyan,
  pinOpacity = 0.8,
  ringLevel = 0,
  ringFlicker = false,
  idPrefix,
  appear = 0,
  premium = false,
}) => {
  const local = frame - appear;
  if (local < 0) return null;
  const o = clamp01(local / 10);
  const g = clamp01(glow);
  const h = width * 0.82;
  const warm = premium ? "#FFE3B0" : "#FFD9A0";

  const flick = ringFlicker ? 0.55 + 0.45 * Math.sin(frame * 0.32) * Math.sin(frame * 0.13 + 2) : 1;
  const ringEls: React.ReactNode[] = [];
  if (ringLevel > 0.02) {
    for (let i = 0; i < 3; i++) {
      const q = ((frame * 0.016 + i / 3) % 1 + 1) % 1;
      ringEls.push(
        <ellipse
          key={i}
          cx={150}
          cy={228}
          rx={30 + q * 130 * ringLevel}
          ry={11 + q * 48 * ringLevel}
          fill="none"
          stroke={pinColor}
          strokeWidth={1.8}
          opacity={(1 - q) * 0.55 * ringLevel * flick}
        />,
      );
    }
  }

  const pinBob = Math.sin(frame * 0.08) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - h,
        width,
        height: h,
        opacity: o,
      }}
    >
      <svg viewBox="0 0 300 246" width={width} height={h} style={{ display: "block", overflow: "visible" }}>
        <defs>
          <radialGradient id={`${idPrefix}-win`} cx="50%" cy="35%" r="80%">
            <stop offset="0%" stopColor={warm} />
            <stop offset="70%" stopColor="#8A5D22" />
            <stop offset="100%" stopColor="#3A2A12" />
          </radialGradient>
          <filter id={`${idPrefix}-soft`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>

        {ringEls}

        {/* warm light spill on the sidewalk */}
        <ellipse cx={150} cy={232} rx={110} ry={26} fill={warm} opacity={0.12 * g + (premium ? 0.08 : 0)} filter={`url(#${idPrefix}-soft)`} />

        {/* building body */}
        <rect x={18} y={66} width={264} height={158} rx={4} fill="#0D0F11" stroke={premium ? "#2E2A20" : "#22272B"} strokeWidth={1.6} />
        {/* parapet */}
        <rect x={10} y={52} width={280} height={18} rx={3} fill="#121416" stroke="#1E2327" strokeWidth={1.2} />
        <rect x={26} y={44} width={248} height={10} rx={2.5} fill="#0F1113" stroke="#1B2024" strokeWidth={1} />

        {/* sign band */}
        <rect x={30} y={82} width={240} height={30} rx={3} fill={premium ? "#17140E" : "#141719"} stroke={premium ? "#4A3B1E" : "#22272B"} strokeWidth={1.2} />
        <text
          x={150}
          y={102}
          textAnchor="middle"
          fill={premium ? C.goldWarm : "#DCE2E6"}
          opacity={0.35 + 0.55 * g}
          style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, letterSpacing: 4 }}
        >
          {sign}
        </text>

        {/* awning */}
        <g>
          <rect x={24} y={118} width={252} height={8} fill="#1B2024" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              x={24 + i * 28}
              y={126}
              width={28}
              height={20}
              fill={i % 2 === 0 ? (premium ? "#20190F" : "#171B1E") : premium ? "#161005" : "#101315"}
              stroke="#0B0D0F"
              strokeWidth={0.8}
            />
          ))}
        </g>

        {/* windows + door */}
        <rect x={38} y={154} width={88} height={62} rx={3} fill={`url(#${idPrefix}-win)`} opacity={0.22 + 0.72 * g} stroke="#23282C" strokeWidth={1.4} />
        <rect x={134} y={154} width={44} height={62} rx={3} fill={`url(#${idPrefix}-win)`} opacity={0.18 + 0.62 * g} stroke="#23282C" strokeWidth={1.4} />
        <rect x={186} y={154} width={76} height={62} rx={3} fill={`url(#${idPrefix}-win)`} opacity={0.22 + 0.72 * g} stroke="#23282C" strokeWidth={1.4} />
        {/* window mullions */}
        <line x1={82} y1={154} x2={82} y2={216} stroke="#0C0E10" strokeWidth={2} opacity={0.8} />
        <line x1={224} y1={154} x2={224} y2={216} stroke="#0C0E10" strokeWidth={2} opacity={0.8} />
        <line x1={156} y1={160} x2={156} y2={216} stroke="#0C0E10" strokeWidth={3} opacity={0.9} />

        {/* interior glow */}
        <ellipse cx={150} cy={196} rx={112} ry={30} fill={warm} opacity={0.16 * g} filter={`url(#${idPrefix}-soft)`} />

        {/* planters (premium) */}
        {premium ? (
          <g>
            <circle cx={26} cy={196} r={12} fill="#15200F" />
            <rect x={19} y={204} width={14} height={16} fill="#12100A" stroke="#241E12" strokeWidth={1} />
            <circle cx={274} cy={196} r={12} fill="#15200F" />
            <rect x={267} y={204} width={14} height={16} fill="#12100A" stroke="#241E12" strokeWidth={1} />
          </g>
        ) : null}

        {/* ground line */}
        <line x1={0} y1={224} x2={300} y2={224} stroke="#1A1F23" strokeWidth={1.6} />

        {/* location pin above the store */}
        <g transform={`translate(150 ${18 + pinBob})`} opacity={pinOpacity}>
          <path
            d="M 0 22 C -7 11 -15 6 -15 -4 C -15 -14 -8 -20 0 -20 C 8 -20 15 -14 15 -4 C 15 6 7 11 0 22 Z"
            fill={pinColor}
            opacity={0.9}
          />
          <circle cx={0} cy={-4.5} r={5.5} fill="#0B0C0E" opacity={0.85} />
          <path
            d="M 0 22 C -7 11 -15 6 -15 -4 C -15 -14 -8 -20 0 -20 C 8 -20 15 -14 15 -4 C 15 6 7 11 0 22 Z"
            fill={pinColor}
            opacity={0.4}
            filter={`url(#${idPrefix}-soft)`}
          />
        </g>
      </svg>
    </div>
  );
};
