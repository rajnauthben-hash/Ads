import React from "react";
import { COLOR } from "./theme";

/**
 * Rebuilt competitor storefront (Scene 3). Same architectural language as
 * Crown Hardware but a plainer "COMPETITOR" sign, so the two read as peers
 * in one consistent city. Base-centre origin, facade extends upward.
 */

export const CompetitorStore: React.FC<{ lit?: number }> = ({ lit = 0.7 }) => {
  const glow = 0.45 + lit * 0.55;
  const W = 360;
  const half = W / 2;
  const H = 330;

  const win = (x: number, w: number) => (
    <g>
      <rect x={x} y={-H + 120} width={w} height={170} rx={3} fill="url(#compWin)" opacity={glow} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x + 3} y1={-H + 120 + (170 / 4) * i} x2={x + w - 3} y2={-H + 120 + (170 / 4) * i} stroke="#3A4A38" strokeWidth={1.5} opacity={0.5 * glow} />
      ))}
      <rect x={x} y={-H + 120} width={w} height={170} rx={3} fill="none" stroke="#1C2228" strokeWidth={4} />
    </g>
  );

  return (
    <g>
      <ellipse cx={0} cy={10} rx={half + 60} ry={40} fill={COLOR.window} opacity={0.1 * glow} filter="url(#warmGlow)" />
      <rect x={-half} y={-H} width={W} height={H} rx={5} fill="url(#compBody)" />
      <rect x={-half - 8} y={-H} width={W + 16} height={20} rx={3} fill="#16181D" />
      {/* sign */}
      <rect x={-half + 14} y={-H + 34} width={W - 28} height={64} rx={3} fill="#0A0B0E" />
      <text
        x={0}
        y={-H + 74}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={26}
        fontWeight={600}
        letterSpacing={7}
        fill="#B9C2CE"
        opacity={glow}
      >
        COMPETITOR
      </text>
      <rect x={-half + 8} y={-H + 104} width={W - 16} height={8} fill="#1A1C20" />
      {win(-half + 20, 120)}
      {/* door */}
      <g>
        <rect x={-38} y={-H + 120} width={76} height={186} rx={3} fill="url(#compWin)" opacity={glow} />
        <line x1={0} y1={-H + 120} x2={0} y2={-H + 306} stroke="#1C2228" strokeWidth={4} />
        <rect x={-38} y={-H + 120} width={76} height={186} rx={3} fill="none" stroke="#1C2228" strokeWidth={4} />
      </g>
      {win(half - 140, 120)}
      <rect x={-half - 20} y={-H + 306} width={W + 40} height={7} fill="#191B20" />
      <rect x={-half - 40} y={-H + 313} width={W + 80} height={22} fill="url(#compWet)" opacity={0.5} />
      {[-half + 2, half - 2].map((px, i) => (
        <g key={i}>
          <path d={`M ${px - 12} ${-4} L ${px - 9} ${-30} L ${px + 9} ${-30} L ${px + 12} ${-4} Z`} fill="#1A130A" />
          <ellipse cx={px} cy={-42} rx={15} ry={20} fill="#1C331C" opacity={0.9} />
        </g>
      ))}
    </g>
  );
};

export const CompetitorDefs: React.FC = () => (
  <defs>
    <linearGradient id="compBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#13161B" />
      <stop offset="1" stopColor="#07090D" />
    </linearGradient>
    <linearGradient id="compWin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E7C98A" />
      <stop offset="1" stopColor="#7C5E2E" />
    </linearGradient>
    <linearGradient id="compWet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(231,201,138,0.35)" />
      <stop offset="1" stopColor="rgba(231,201,138,0)" />
    </linearGradient>
  </defs>
);
