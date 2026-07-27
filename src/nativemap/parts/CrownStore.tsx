import React from "react";
import { T } from "../tokens";

/**
 * Premium stylised 2.5D vector Crown Hardware storefront. Base-centre origin
 * (0,0), façade extending upward, restrained isometric right face + roof.
 * Geometry (W/H/D) is unchanged so scene placement/scale stay identical; the
 * detailing (warm interiors, mullions, awning, lamps, wet reflection) is the
 * upgrade. `lit` drives interior/sign warmth.
 */
export const CrownStore: React.FC<{ lit?: number; compact?: boolean }> = ({ lit = 1, compact = false }) => {
  const W = 300, H = 296, half = W / 2, D = 56;
  const g = 0.5 + lit * 0.5;
  const off = (p: { x: number; y: number }) => ({ x: p.x + D, y: p.y - D * 0.52 });
  const fBL = { x: -half, y: 0 }, fBR = { x: half, y: 0 }, fTL = { x: -half, y: -H }, fTR = { x: half, y: -H };
  const pts = (a: { x: number; y: number }[]) => a.map((p) => `${p.x},${p.y}`).join(" ");

  // A lit display window with warm interior glow + mullions + shelf silhouettes.
  const win = (cx: number, w: number, top: number, h: number, door = false) => (
    <g>
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={3} fill="#1A0F04" />
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={3} fill="url(#crownInterior)" opacity={g} />
      {/* shelf silhouettes */}
      {[0.34, 0.56, 0.78].map((v, i) => <line key={`s${i}`} x1={cx - w / 2 + 4} y1={top + h * v} x2={cx + w / 2 - 4} y2={top + h * v} stroke="#3A2408" strokeWidth={2} opacity={0.6 * g} />)}
      {[0.28, 0.5, 0.72].map((u, i) => <rect key={`p${i}`} x={cx - w / 2 + w * u} y={top + h * 0.4} width={2.5} height={h * 0.5} fill="#2A1906" opacity={0.5 * g} />)}
      {/* mullions */}
      {[0.5].map((u) => <line key="m" x1={cx - w / 2 + w * u} y1={top} x2={cx - w / 2 + w * u} y2={top + h} stroke="#0B0803" strokeWidth={door ? 5 : 4} />)}
      {[0.5].map((v) => <line key="mh" x1={cx - w / 2} y1={top + h * (door ? 0.14 : 0.5)} x2={cx + w / 2} y2={top + h * (door ? 0.14 : 0.5)} stroke="#0B0803" strokeWidth={3} />)}
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={3} fill="none" stroke="#0C0A06" strokeWidth={5} />
      {/* sill glow */}
      <rect x={cx - w / 2 + 2} y={top + h - 5} width={w - 4} height={5} fill={T.windowWarm} opacity={0.5 * g} />
    </g>
  );

  const winTop = -H + 128, winH = 162;

  return (
    <g>
      {/* wet pavement reflection of the warm windows */}
      <g opacity={0.4 * g} transform="translate(0,4) scale(1,-0.5)">
        <rect x={-half + 26} y={winTop} width={W - 52} height={winH} fill="url(#crownReflect)" />
      </g>
      {/* warm ground spill */}
      <ellipse cx={12} cy={12} rx={half + 90} ry={40} fill={T.windowWarm} opacity={0.16 * g} filter="url(#crownWarm)" />
      {/* pavement platform */}
      <polygon points={pts([{ x: -half - 26, y: 8 }, { x: half + 26, y: 8 }, { x: half + 26 + D, y: 8 - D * 0.52 }, { x: -half - 26 + D, y: 8 - D * 0.52 }])} fill="#0A0F18" />
      <polygon points={pts([{ x: -half - 26, y: 8 }, { x: half + 26, y: 8 }, { x: half + 26, y: 14 }, { x: -half - 26, y: 14 }])} fill="#05080D" />

      {/* right side face + roof */}
      <polygon points={pts([fBR, off(fBR), off(fTR), fTR])} fill="url(#crownSide)" />
      <polygon points={pts([fTL, fTR, off(fTR), off(fTL)])} fill="#0E1420" />
      <polyline points={pts([off(fTL), off(fTR)])} fill="none" stroke="#1C2636" strokeWidth={1.5} opacity={0.7} />
      {/* parapet / cornice */}
      <rect x={-half - 8} y={-H - 14} width={W + 16} height={18} rx={3} fill="#161D2A" />
      <rect x={-half - 8} y={-H - 16} width={W + 16} height={4} rx={2} fill="#222C3E" opacity={0.8} />

      {/* front façade + subtle pilasters */}
      <polygon points={pts([fBL, fBR, fTR, fTL])} fill="url(#crownBody)" />
      {[-half + 2, -half + 118, half - 118, half - 2].map((x, i) => <rect key={i} x={x} y={-H} width={4} height={H} fill="#0A0E16" opacity={0.7} />)}

      {/* sign panel */}
      <rect x={-half + 14} y={-H + 20} width={W - 28} height={70} rx={4} fill="#0A0D14" />
      <rect x={-half + 14} y={-H + 20} width={W - 28} height={70} rx={4} fill="url(#crownSignGlow)" opacity={0.5 * g} />
      <rect x={-half + 14} y={-H + 20} width={W - 28} height={70} rx={4} fill="none" stroke="#241a10" strokeWidth={2} />
      <text x={0} y={-H + 55} textAnchor="middle" fontFamily="Georgia, serif" fontSize={38} fontWeight={700} letterSpacing={2} fill="#FFD98A" opacity={0.55 * g} filter="url(#crownWarm)">CROWN</text>
      <text x={0} y={-H + 55} textAnchor="middle" fontFamily="Georgia, serif" fontSize={38} fontWeight={700} letterSpacing={2} fill="#F6C067">CROWN</text>
      <text x={0} y={-H + 82} textAnchor="middle" fontFamily="Georgia, serif" fontSize={19} fontWeight={600} letterSpacing={6} fill="#EBBE7E" opacity={0.96}>HARDWARE</text>

      {/* hanging lamps + warm cones */}
      {[-92, 0, 92].map((lx) => (
        <g key={lx}>
          <line x1={lx} y1={-H + 92} x2={lx} y2={-H + 102} stroke="#3A3226" strokeWidth={3} />
          <path d={`M ${lx - 13} ${-H + 102} L ${lx + 13} ${-H + 102} L ${lx + 8} ${-H + 114} L ${lx - 8} ${-H + 114} Z`} fill="#22262E" />
          <ellipse cx={lx} cy={-H + 116} rx={11} ry={5} fill="#FFE6AE" opacity={0.8 * g} />
          <path d={`M ${lx - 9} ${-H + 114} L ${lx + 9} ${-H + 114} L ${lx + 30} ${-H + 60} L ${lx - 30} ${-H + 60} Z`} fill={T.windowWarm} opacity={0.12 * g} />
          <ellipse cx={lx} cy={-H + 122} rx={26} ry={14} fill={T.windowWarm} opacity={0.28 * g} filter="url(#crownWarm)" />
        </g>
      ))}

      {/* awning */}
      <polygon points={pts([{ x: -half + 4, y: -H + 100 }, { x: half - 4, y: -H + 100 }, { x: half - 20, y: -H + 126 }, { x: -half + 20, y: -H + 126 }])} fill="url(#crownAwning)" />
      <polyline points={pts([{ x: -half + 20, y: -H + 126 }, { x: half - 20, y: -H + 126 }])} fill="none" stroke="#2A323F" strokeWidth={1.4} opacity={0.8} />
      <rect x={-half + 20} y={-H + 126} width={W - 40} height={4} fill={T.windowWarm} opacity={0.28 * g} />

      {/* windows + entrance */}
      {!compact && win(-half + 60, 84, winTop, winH)}
      {win(0, 80, winTop, winH + 8, true)}
      {!compact && win(half - 60, 84, winTop, winH)}

      {/* plants */}
      {[-half + 6, half - 6].map((px, i) => (
        <g key={i}>
          <path d={`M ${px - 10} -2 L ${px - 7} -26 L ${px + 7} -26 L ${px + 10} -2 Z`} fill="#1A130A" />
          <ellipse cx={px} cy={-36} rx={13} ry={17} fill="#1E3A22" />
          <ellipse cx={px - 6} cy={-30} rx={8} ry={12} fill="#24462A" opacity={0.9} />
          <ellipse cx={px + 6} cy={-30} rx={8} ry={12} fill="#1A3420" opacity={0.9} />
        </g>
      ))}
    </g>
  );
};

export const CrownDefs: React.FC = () => (
  <defs>
    <linearGradient id="crownBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#182030" /><stop offset="1" stopColor="#080B12" /></linearGradient>
    <linearGradient id="crownSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0B0F17" /><stop offset="1" stopColor="#050810" /></linearGradient>
    <linearGradient id="crownAwning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A202B" /><stop offset="1" stopColor="#0E131C" /></linearGradient>
    <radialGradient id="crownInterior" cx="0.5" cy="0.78" r="0.9"><stop offset="0" stopColor="#FFC876" /><stop offset="0.45" stopColor="#D48A2E" /><stop offset="1" stopColor="#6E4416" /></radialGradient>
    <linearGradient id="crownReflect" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D48A2E" stopOpacity="0.5" /><stop offset="1" stopColor="#D48A2E" stopOpacity="0" /></linearGradient>
    <radialGradient id="crownSignGlow" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stopColor="#7A5416" /><stop offset="1" stopColor="#7A5416" stopOpacity="0" /></radialGradient>
    <filter id="crownWarm" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="8" /></filter>
  </defs>
);
