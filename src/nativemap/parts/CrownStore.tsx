import React from "react";
import { T } from "../tokens";

/**
 * Stylised 2.5D vector Crown Hardware storefront. Drawn around a base-centre
 * origin (0,0), façade extending upward, with a restrained isometric right
 * face + roof. Geometry is identical in every scene; `lit` drives warmth.
 */
export const CrownStore: React.FC<{ lit?: number; compact?: boolean }> = ({ lit = 1, compact = false }) => {
  const W = 300;
  const H = 296;
  const half = W / 2;
  const D = 56; // isometric depth offset
  const g = 0.55 + lit * 0.45;

  // corners of the front face
  const fBL = { x: -half, y: 0 };
  const fBR = { x: half, y: 0 };
  const fTL = { x: -half, y: -H };
  const fTR = { x: half, y: -H };
  // right side (depth) offset up-right
  const off = (p: { x: number; y: number }) => ({ x: p.x + D, y: p.y - D * 0.52 });
  const sBR = off(fBR);
  const sTR = off(fTR);

  const pts = (a: { x: number; y: number }[]) => a.map((p) => `${p.x},${p.y}`).join(" ");

  // warm window group
  const windowGroup = (cx: number) => (
    <g>
      <rect x={cx - 44} y={-H + 120} width={88} height={150} rx={4} fill="url(#crownWin)" opacity={g} />
      {[1, 2, 3].map((i) => (
        <line key={`h${i}`} x1={cx - 40} y1={-H + 120 + (150 / 4) * i} x2={cx + 40} y2={-H + 120 + (150 / 4) * i} stroke="#6B471C" strokeWidth={1.6} opacity={0.5 * g} />
      ))}
      <line x1={cx} y1={-H + 120} x2={cx} y2={-H + 270} stroke="#6B471C" strokeWidth={1.6} opacity={0.5 * g} />
      <rect x={cx - 44} y={-H + 120} width={88} height={150} rx={4} fill="none" stroke="#241A10" strokeWidth={3} />
    </g>
  );

  return (
    <g>
      {/* ground glow */}
      <ellipse cx={12} cy={10} rx={half + 70} ry={34} fill={T.windowWarm} opacity={0.12 * g} filter="url(#crownWarm)" />
      {/* pavement platform */}
      <polygon points={pts([{ x: -half - 26, y: 8 }, { x: half + 26, y: 8 }, { x: half + 26 + D, y: 8 - D * 0.52 }, { x: -half - 26 + D, y: 8 - D * 0.52 }])} fill="#0A0F18" opacity={0.9} />

      {/* right side face */}
      <polygon points={pts([fBR, sBR, sTR, fTR])} fill="#070B12" />
      {/* roof top */}
      <polygon points={pts([fTL, fTR, sTR, { x: fTL.x + D, y: fTL.y - D * 0.52 }])} fill="#0E1420" />
      {/* parapet */}
      <rect x={-half - 6} y={-H - 12} width={W + 12} height={16} rx={3} fill="#141B29" />

      {/* front façade */}
      <polygon points={pts([fBL, fBR, fTR, fTL])} fill="url(#crownBody)" />

      {/* sign panel (raised) */}
      <rect x={-half + 14} y={-H + 20} width={W - 28} height={70} rx={4} fill="#0A0D14" />
      <rect x={-half + 14} y={-H + 20} width={W - 28} height={70} rx={4} fill="none" stroke="#211a10" strokeWidth={2} />
      <text x={0} y={-H + 54} textAnchor="middle" fontFamily="Georgia, serif" fontSize={38} fontWeight={700} letterSpacing={2} fill="#FFD27A" opacity={0.5 * g} filter="url(#crownWarm)">CROWN</text>
      <text x={0} y={-H + 54} textAnchor="middle" fontFamily="Georgia, serif" fontSize={38} fontWeight={700} letterSpacing={2} fill="#F5BC63">CROWN</text>
      <text x={0} y={-H + 82} textAnchor="middle" fontFamily="Georgia, serif" fontSize={19} fontWeight={600} letterSpacing={6} fill="#E7B676" opacity={0.95}>HARDWARE</text>

      {/* hanging lamps */}
      {[-90, 0, 90].map((lx) => (
        <g key={lx}>
          <line x1={lx} y1={-H + 90} x2={lx} y2={-H + 100} stroke="#3A3226" strokeWidth={3} />
          <path d={`M ${lx - 12} ${-H + 100} L ${lx + 12} ${-H + 100} L ${lx + 8} ${-H + 112} L ${lx - 8} ${-H + 112} Z`} fill="#20242C" />
          <ellipse cx={lx} cy={-H + 116} rx={20} ry={12} fill={T.windowWarm} opacity={0.32 * g} filter="url(#crownWarm)" />
        </g>
      ))}

      {/* awning */}
      <polygon points={pts([{ x: -half + 6, y: -H + 100 }, { x: half - 6, y: -H + 100 }, { x: half - 18, y: -H + 122 }, { x: -half + 18, y: -H + 122 }])} fill="#12161F" />

      {/* windows + entrance */}
      {!compact && windowGroup(-half + 60)}
      <g>
        <rect x={-40} y={-H + 128} width={80} height={162} rx={3} fill="url(#crownWin)" opacity={g} />
        <line x1={0} y1={-H + 128} x2={0} y2={-H + 290} stroke="#241A10" strokeWidth={4} />
        <rect x={-40} y={-H + 128} width={80} height={162} rx={3} fill="none" stroke="#241A10" strokeWidth={4} />
      </g>
      {!compact && windowGroup(half - 60)}

      {/* plants */}
      {[-half + 6, half - 6].map((px, i) => (
        <g key={i}>
          <path d={`M ${px - 10} -2 L ${px - 7} -26 L ${px + 7} -26 L ${px + 10} -2 Z`} fill="#1A130A" />
          <ellipse cx={px} cy={-36} rx={13} ry={17} fill="#1E3A22" opacity={0.9} />
        </g>
      ))}
    </g>
  );
};

export const CrownDefs: React.FC = () => (
  <defs>
    <linearGradient id="crownBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#141A26" />
      <stop offset="1" stopColor="#080B12" />
    </linearGradient>
    <linearGradient id="crownWin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6B65A" />
      <stop offset="0.5" stopColor="#D68A2E" />
      <stop offset="1" stopColor="#7C4E16" />
    </linearGradient>
    <filter id="crownWarm" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
  </defs>
);
