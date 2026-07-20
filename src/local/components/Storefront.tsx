import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  appear: number;
  // 0..1 interior warmth / edge lighting.
  warmth: number;
  // Show the gold map pin floating above.
  pin?: boolean;
  pinAppear?: number;
};

// Brightview Hardware — a native layered storefront (no photograph): dark
// charcoal façade, gold sign band, large warm windows with shelf hints,
// central glass door, planters, gold edge lighting. Consistent proportions
// wherever it appears (scenes 3 and 6).
export const Storefront: React.FC<Props> = ({ x, y, width: w, height: h, appear, warmth, pin = false, pinAppear = 0 }) => {
  const frame = useCurrentFrame();
  const build = Math.min(1, Math.max(0, (frame - appear) / 16));
  if (build <= 0) {
    return null;
  }
  const warm = Math.max(0.12, warmth) * (0.9 + 0.1 * Math.sin(frame * 0.08));
  const signW = w * 0.82;
  const winY = h * 0.34;
  const winH = h * 0.42;
  const pinT = Math.min(1, Math.max(0, (frame - pinAppear) / 12));

  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h + 60, opacity: build }}>
      {/* Floating gold pin */}
      {pin && pinT > 0 && (
        <svg width={70} height={90} viewBox="0 0 70 90" style={{ position: "absolute", left: w / 2 - 35, top: -70 + (1 - pinT) * -20, opacity: pinT }}>
          <circle cx={35} cy={35} r={30} fill={COLORS.gold} opacity={0.16} />
          <path d="M 35 78 C 18 52 14 44 14 32 A 21 21 0 1 1 56 32 C 56 44 52 52 35 78 Z" fill={COLORS.gold} stroke={COLORS.goldDeep} strokeWidth={1.4} />
          <circle cx={35} cy={31} r={8} fill={COLORS.bg} />
        </svg>
      )}

      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {/* Ground reflection */}
        <ellipse cx={w / 2} cy={h - 4} rx={w * 0.5} ry={16} fill={COLORS.gold} opacity={0.06 * warm} />
        {/* Façade body */}
        <rect x={w * 0.05} y={h * 0.16} width={w * 0.9} height={h * 0.8} rx={6} fill="#0C1017" stroke={`rgba(243,188,66,${0.28 * warm})`} strokeWidth={1.6} />
        {/* Cornice */}
        <rect x={w * 0.03} y={h * 0.12} width={w * 0.94} height={h * 0.06} rx={4} fill="#12171F" stroke={`rgba(243,188,66,${0.3 * warm})`} strokeWidth={1.2} />
        {/* Sign band */}
        <rect x={(w - signW) / 2} y={h * 0.2} width={signW} height={h * 0.09} rx={4} fill="#0A0D12" stroke={`rgba(243,188,66,${0.55 * warm})`} strokeWidth={1.4} />
        <text x={w / 2} y={h * 0.225} textAnchor="middle" fill={COLORS.gold} fontFamily={FONTS.head} fontWeight={800} fontSize={w * 0.072} letterSpacing="0.04em" opacity={0.6 + 0.4 * warm}>
          BRIGHTVIEW
        </text>
        <text x={w / 2} y={h * 0.262} textAnchor="middle" fill={COLORS.gold} fontFamily={FONTS.head} fontWeight={800} fontSize={w * 0.052} letterSpacing="0.06em" opacity={0.55 + 0.4 * warm}>
          HARDWARE
        </text>
        {/* Sign downwash */}
        <rect x={(w - signW) / 2} y={h * 0.29} width={signW} height={h * 0.04} fill={COLORS.gold} opacity={0.06 * warm} />

        {/* Windows */}
        {[0.09, 0.62].map((wx, wi) => (
          <g key={wi}>
            <rect x={w * (0.09 + wx * 0.5)} y={winY} width={w * 0.29} height={winH} rx={4} fill="#080B10" stroke={`rgba(243,188,66,${0.3 * warm})`} strokeWidth={1.4} />
            <rect x={w * (0.09 + wx * 0.5) + 4} y={winY + 4} width={w * 0.29 - 8} height={winH - 8} fill={`rgba(243,166,74,${0.16 + 0.4 * warm})`} />
            {/* Shelf hints */}
            {[0.2, 0.42, 0.64, 0.82].map((sy, si) => (
              <rect key={si} x={w * (0.09 + wx * 0.5) + 8} y={winY + winH * sy} width={w * 0.29 - 16} height={3} fill="rgba(0,0,0,0.4)" />
            ))}
            {/* Warm interior lights */}
            <circle cx={w * (0.09 + wx * 0.5) + w * 0.08} cy={winY + winH * 0.16} r={3} fill="#FFE0A0" opacity={0.5 + 0.5 * warm} />
            <circle cx={w * (0.09 + wx * 0.5) + w * 0.2} cy={winY + winH * 0.16} r={3} fill="#FFE0A0" opacity={0.4 + 0.5 * warm} />
          </g>
        ))}

        {/* Central glass door */}
        <rect x={w * 0.435} y={winY + winH * 0.08} width={w * 0.13} height={winH * 0.92} rx={3} fill="#0A0D12" stroke={`rgba(243,188,66,${0.34 * warm})`} strokeWidth={1.4} />
        <rect x={w * 0.44} y={winY + winH * 0.1} width={w * 0.12} height={winH * 0.86} fill={`rgba(243,166,74,${0.1 + 0.28 * warm})`} />
        <line x1={w * 0.5} y1={winY + winH * 0.1} x2={w * 0.5} y2={winY + winH * 0.96} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
        {/* Door light spill */}
        <path d={`M ${w * 0.435} ${h * 0.96} L ${w * 0.565} ${h * 0.96} L ${w * 0.62} ${h} L ${w * 0.38} ${h} Z`} fill={COLORS.gold} opacity={0.05 * warm} />

        {/* Planters */}
        {[0.03, 0.9].map((px, pi) => (
          <g key={pi}>
            <rect x={w * px} y={h * 0.86} width={w * 0.07} height={h * 0.1} rx={3} fill="#10141B" stroke="rgba(98,108,119,0.3)" strokeWidth={1} />
            <circle cx={w * px + w * 0.035} cy={h * 0.85} r={w * 0.045} fill="#14211a" stroke="rgba(83,120,80,0.5)" strokeWidth={1} />
          </g>
        ))}
      </svg>
    </div>
  );
};
