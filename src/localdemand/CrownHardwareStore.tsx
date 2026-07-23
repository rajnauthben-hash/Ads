import React from "react";
import { COLOR } from "./theme";

/**
 * Rebuilt Crown Hardware storefront. Drawn around a base-centre origin (0,0)
 * with the facade extending upward, so it can be anchored to any ground point
 * and scaled by perspective. Kept visually identical across every scene:
 * same architecture, sign, window arrangement and warm interior light.
 */

export const CrownHardwareStore: React.FC<{
  lit?: number; // 0..1 interior/sign brightness
  compact?: boolean; // slightly simpler for far placement
}> = ({ lit = 1, compact = false }) => {
  const glow = 0.55 + lit * 0.45;
  const W = 520;
  const half = W / 2;
  const H = 470;

  // interior shelves inside a window
  const shelves = (x: number, y: number, w: number, h: number, key: string) => {
    const items: React.ReactNode[] = [];
    for (let i = 1; i < 5; i++) {
      const yy = y + (h / 5) * i;
      items.push(
        <line
          key={`${key}-h${i}`}
          x1={x + 4}
          y1={yy}
          x2={x + w - 4}
          y2={yy}
          stroke="#7A4E1E"
          strokeWidth={2}
          opacity={0.5 * glow}
        />,
      );
    }
    for (let i = 1; i < 4; i++) {
      const xx = x + (w / 4) * i;
      items.push(
        <line
          key={`${key}-v${i}`}
          x1={xx}
          y1={y + 4}
          x2={xx}
          y2={y + h - 4}
          stroke="#6B4520"
          strokeWidth={1.5}
          opacity={0.4 * glow}
        />,
      );
    }
    return items;
  };

  const windowFill = (key: string, x: number, y: number, w: number, h: number) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={`url(#crownWin)`} opacity={glow} />
      {shelves(x, y, w, h, key)}
      {/* mullion frame */}
      <rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke="#2A1E12" strokeWidth={4} />
    </g>
  );

  return (
    <g>
      {/* warm ground spill */}
      <ellipse cx={0} cy={12} rx={half + 90} ry={54} fill={COLOR.window} opacity={0.14 * glow} filter="url(#warmGlow)" />

      {/* building body */}
      <rect x={-half} y={-H} width={W} height={H} rx={6} fill="#0C0E12" />
      <rect x={-half} y={-H} width={W} height={H} rx={6} fill="url(#crownBody)" opacity={0.9} />
      {/* parapet / cornice */}
      <rect x={-half - 10} y={-H} width={W + 20} height={26} rx={4} fill="#15171C" />
      <rect x={-half - 10} y={-H - 12} width={W + 20} height={14} rx={3} fill="#0E1014" />

      {/* sign band */}
      <rect x={-half + 18} y={-H + 40} width={W - 36} height={112} rx={4} fill="#0B0C10" />
      <rect x={-half + 18} y={-H + 40} width={W - 36} height={112} rx={4} fill="none" stroke="#241C10" strokeWidth={2} />
      {/* warm glow behind the sign copy */}
      <text
        x={0}
        y={-H + 98}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={64}
        fontWeight={700}
        letterSpacing={7}
        fill="#FFD27A"
        opacity={0.5 * glow}
        filter="url(#warmGlow)"
      >
        CROWN
      </text>
      <text
        x={0}
        y={-H + 98}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={64}
        fontWeight={700}
        letterSpacing={7}
        fill="#F5BC63"
      >
        CROWN
      </text>
      <text
        x={0}
        y={-H + 140}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={29}
        fontWeight={600}
        letterSpacing={12}
        fill="#E7B676"
        opacity={0.96}
      >
        HARDWARE
      </text>

      {/* gooseneck sign lamps */}
      {[-150, 0, 150].map((lx) => (
        <g key={`lamp${lx}`}>
          <line x1={lx} y1={-H + 30} x2={lx} y2={-H + 12} stroke="#3A3227" strokeWidth={4} />
          <ellipse cx={lx} cy={-H + 10} rx={16} ry={7} fill="#20242B" />
          <ellipse cx={lx} cy={-H + 22} rx={26} ry={16} fill={COLOR.window} opacity={0.3 * glow} filter="url(#warmGlow)" />
        </g>
      ))}

      {/* base moulding between sign and windows */}
      <rect x={-half + 10} y={-H + 158} width={W - 20} height={10} fill="#1A1C20" />

      {/* windows + central doors */}
      {!compact && windowFill("wl", -half + 26, -H + 182, 132, 236)}
      {/* central double door */}
      <g>
        <rect x={-70} y={-H + 182} width={140} height={252} rx={3} fill="url(#crownWin)" opacity={glow} />
        {shelves(-70, -H + 182, 140, 252, "door")}
        <line x1={0} y1={-H + 182} x2={0} y2={-H + 434} stroke="#2A1E12" strokeWidth={5} />
        <rect x={-70} y={-H + 182} width={140} height={252} rx={3} fill="none" stroke="#2A1E12" strokeWidth={5} />
        <rect x={-70} y={-H + 168} width={140} height={16} fill="#15171C" />
      </g>
      {!compact && windowFill("wr", half - 158, -H + 182, 132, 236)}

      {/* sidewalk */}
      <rect x={-half - 30} y={-H + 434} width={W + 60} height={8} fill="#191B20" />
      <rect x={-half - 60} y={-H + 442} width={W + 120} height={30} fill="url(#crownWet)" opacity={0.5} />

      {/* potted plants */}
      {[-half + 4, half - 4].map((px, i) => (
        <g key={`plant${i}`}>
          <path d={`M ${px - 16} ${-6} L ${px - 12} ${-40} L ${px + 12} ${-40} L ${px + 16} ${-6} Z`} fill="#20160C" />
          <g fill="#1E3A1E" opacity={0.9}>
            <ellipse cx={px} cy={-56} rx={20} ry={26} />
            <ellipse cx={px - 14} cy={-48} rx={12} ry={20} />
            <ellipse cx={px + 14} cy={-48} rx={12} ry={20} />
          </g>
        </g>
      ))}
    </g>
  );
};

export const CrownDefs: React.FC = () => (
  <defs>
    <linearGradient id="crownBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#181B21" />
      <stop offset="1" stopColor="#080A0E" />
    </linearGradient>
    <linearGradient id="crownWin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6B65A" />
      <stop offset="0.5" stopColor="#D68A2E" />
      <stop offset="1" stopColor="#8A5416" />
    </linearGradient>
    <linearGradient id="crownWet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(240,169,75,0.4)" />
      <stop offset="1" stopColor="rgba(240,169,75,0)" />
    </linearGradient>
  </defs>
);
