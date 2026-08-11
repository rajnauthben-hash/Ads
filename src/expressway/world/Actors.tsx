import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// Scene-4 actors: the competitor storefront, the searching-customer marker, a
// reusable location pin, and small map label chips.
// ---------------------------------------------------------------------------

const CW = 300;
const CH = 180;

// Competitor — a brighter, modern lit storefront. `bright` (0..1) lifts as the
// active route lands.
export const CompetitorStore: React.FC<{ bright?: number }> = ({ bright = 0 }) => {
  const b = 0.8 + bright * 0.35;
  return (
    <g>
      <defs>
        <linearGradient id="compFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B222B" />
          <stop offset="1" stopColor="#0D1219" />
        </linearGradient>
        <radialGradient id="compAmb" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#FFD79A" stopOpacity={0.28 * b} />
          <stop offset="1" stopColor="#FFD79A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={CW / 2} cy={CH + 8} rx={CW / 2 + 16} ry={14} fill="#000" opacity={0.45} />
      <rect x={-30} y={20} width={CW + 60} height={CH + 40} fill="url(#compAmb)" />
      {/* upper storey */}
      <rect x={10} y={0} width={CW - 20} height={70} fill="url(#compFace)" stroke="#070B10" strokeWidth={2} />
      {/* sign band (name carried by the map label above) */}
      <rect x={28} y={14} width={CW - 56} height={42} rx={3} fill="#0A0E13" stroke="#2C3540" strokeWidth={1.5} />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={44 + i * 58} y={28} width={40} height={14} fill="#1B2530" rx={1} />
      ))}
      {/* ground storey w/ lit windows */}
      <rect x={0} y={70} width={CW} height={CH - 70} fill="url(#compFace)" stroke="#070B10" strokeWidth={2} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={16 + i * 56} y={86} width={42} height={80} fill="#FBD79A" opacity={b} rx={1} />
      ))}
      <rect x={CW / 2 - 24} y={120} width={48} height={60} fill="#0D1219" stroke="#2C3540" strokeWidth={2} />
    </g>
  );
};

// A searching customer — glowing person marker on the map.
export const CustomerMarker: React.FC<{ reveal?: number }> = ({ reveal = 1 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]);
  return (
    <g opacity={reveal}>
      <circle cx={0} cy={0} r={44} fill={C.cyanGlow} opacity={pulse} />
      <circle cx={0} cy={0} r={30} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={0.5 + pulse * 0.4} />
      <circle cx={0} cy={0} r={19} fill="#0A1620" stroke={C.cyanBright} strokeWidth={2} />
      {/* person glyph */}
      <circle cx={0} cy={-6} r={5.5} fill={C.cyanBright} />
      <path d="M -9 9 C -9 0 9 0 9 9 Z" fill={C.cyanBright} />
    </g>
  );
};

// Gold location pin (tip at 0,0). Optional rating chip label.
export const GoldPin: React.FC<{ scale?: number; label?: string; rating?: string }> = ({ scale = 1, label, rating }) => {
  const r = 15 * scale;
  const topY = -40 * scale;
  const d =
    `M 0 0 C ${-r * 1.35} ${-26 * scale}, ${-r} ${topY - r * 0.2}, 0 ${topY - r} ` +
    `C ${r} ${topY - r * 0.2}, ${r * 1.35} ${-26 * scale}, 0 0 Z`;
  return (
    <g>
      <ellipse cx={0} cy={2} rx={15 * scale} ry={5 * scale} fill={C.goldGlow} />
      {label && (
        <g>
          <rect
            x={16 * scale}
            y={topY - r - 10 * scale}
            width={(Math.max(label.length, (rating ?? "").length) * 8.4 + 20) * scale}
            height={(rating ? 44 : 28) * scale}
            rx={6}
            fill="rgba(8,14,18,0.86)"
            stroke="rgba(243,184,75,0.28)"
            strokeWidth={1}
          />
          <text x={26 * scale} y={topY - r + 4 * scale} fill="#EEF1F4" fontFamily="Inter, sans-serif" fontSize={15 * scale} fontWeight={700}>
            {label}
          </text>
          {rating && (
            <text x={26 * scale} y={topY - r + 24 * scale} fill={C.gold} fontFamily="Inter, sans-serif" fontSize={14 * scale} fontWeight={600}>
              {rating}
            </text>
          )}
        </g>
      )}
      <path d={d} fill={C.gold} stroke={C.goldDeep} strokeWidth={1} filter="url(#pinGlowEx)" />
      <circle cx={0} cy={topY} r={6 * scale} fill="#2A1B06" />
    </g>
  );
};

// Numbered / plain map label chip (e.g. "YOUR CUSTOMER").
export const MapLabel: React.FC<{ x: number; y: number; num?: number; title: string; lines?: string[]; color?: string; reveal?: number }> = ({
  x,
  y,
  num,
  title,
  lines = [],
  color = C.cyan,
  reveal = 1,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={reveal}>
    {num !== undefined && (
      <g>
        <circle cx={0} cy={0} r={16} fill="none" stroke={color} strokeWidth={2} />
        <text x={0} y={5} textAnchor="middle" fill={color} fontFamily="Inter, sans-serif" fontSize={16} fontWeight={700}>
          {num}
        </text>
      </g>
    )}
    <text x={num !== undefined ? 28 : 0} y={-2} fill={color} fontFamily="Inter, sans-serif" fontSize={19} fontWeight={700} letterSpacing="0.04em">
      {title}
    </text>
    {lines.map((l, i) => (
      <text key={i} x={num !== undefined ? 28 : 0} y={22 + i * 22} fill={C.support} fontFamily="Inter, sans-serif" fontSize={17} fontWeight={400}>
        {l}
      </text>
    ))}
  </g>
);
