import React from "react";

/** Premium stylised 2.5D vector competitor storefront (peer to Crown, cooler). */
export const CompetitorStore: React.FC<{ lit?: number }> = ({ lit = 0.5 }) => {
  const W = 220, H = 250, half = W / 2, D = 44;
  const g = 0.42 + lit * 0.58;
  const off = (p: { x: number; y: number }) => ({ x: p.x + D, y: p.y - D * 0.5 });
  const fBL = { x: -half, y: 0 }, fBR = { x: half, y: 0 }, fTL = { x: -half, y: -H }, fTR = { x: half, y: -H };
  const pts = (a: { x: number; y: number }[]) => a.map((p) => `${p.x},${p.y}`).join(" ");
  const win = (cx: number, w: number, door = false) => (
    <g>
      <rect x={cx - w / 2} y={-H + 96} width={w} height={door ? 132 : 122} rx={3} fill="#0F1A12" />
      <rect x={cx - w / 2} y={-H + 96} width={w} height={door ? 132 : 122} rx={3} fill="url(#compInterior)" opacity={g} />
      {[0.35, 0.6, 0.82].map((v, i) => <line key={i} x1={cx - w / 2 + 3} y1={-H + 96 + (door ? 132 : 122) * v} x2={cx + w / 2 - 3} y2={-H + 96 + (door ? 132 : 122) * v} stroke="#24382C" strokeWidth={1.6} opacity={0.55 * g} />)}
      <line x1={cx} y1={-H + 96} x2={cx} y2={-H + 96 + (door ? 132 : 122)} stroke="#0C140E" strokeWidth={door ? 4 : 3} />
      <rect x={cx - w / 2} y={-H + 96} width={w} height={door ? 132 : 122} rx={3} fill="none" stroke="#0C140E" strokeWidth={3.5} />
    </g>
  );
  return (
    <g>
      {/* wet reflection */}
      <g opacity={0.35 * g} transform="translate(0,4) scale(1,-0.45)">
        <rect x={-half + 16} y={-H + 96} width={W - 32} height={122} fill="url(#compReflect)" />
      </g>
      <ellipse cx={8} cy={10} rx={half + 50} ry={22} fill="#8FE0C0" opacity={0.06 * g} filter="url(#crownWarm)" />
      <polygon points={pts([{ x: -half - 18, y: 6 }, { x: half + 18, y: 6 }, { x: half + 18 + D, y: 6 - D * 0.5 }, { x: -half - 18 + D, y: 6 - D * 0.5 }])} fill="#0A0F16" />
      <polygon points={pts([fBR, off(fBR), off(fTR), fTR])} fill="url(#compSide)" />
      <polygon points={pts([fTL, fTR, off(fTR), off(fTL)])} fill="#0C121C" />
      <rect x={-half - 6} y={-H - 10} width={W + 12} height={14} rx={2} fill="#141A22" />
      <polygon points={pts([fBL, fBR, fTR, fTL])} fill="url(#compBody)" />
      <rect x={-half + 10} y={-H + 20} width={W - 20} height={46} rx={3} fill="#0A0D13" />
      <text x={0} y={-H + 50} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={18} fontWeight={600} letterSpacing={4} fill="#B6C0CC" opacity={g}>COMPETITOR</text>
      {/* awning */}
      <polygon points={pts([{ x: -half + 4, y: -H + 74 }, { x: half - 4, y: -H + 74 }, { x: half - 14, y: -H + 92 }, { x: -half + 14, y: -H + 92 }])} fill="#12161F" />
      {win(-half + 44, 66)}
      {win(0, 56, true)}
      {win(half - 44, 66)}
      {[-half + 4, half - 4].map((px, i) => (
        <g key={i}><path d={`M ${px - 8} -2 L ${px - 6} -22 L ${px + 6} -22 L ${px + 8} -2 Z`} fill="#161009" /><ellipse cx={px} cy={-30} rx={11} ry={14} fill="#1C331F" /></g>
      ))}
    </g>
  );
};

export const CompetitorDefs: React.FC = () => (
  <defs>
    <linearGradient id="compBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141922" /><stop offset="1" stopColor="#07090E" /></linearGradient>
    <linearGradient id="compSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0A0E15" /><stop offset="1" stopColor="#05080D" /></linearGradient>
    <radialGradient id="compInterior" cx="0.5" cy="0.78" r="0.9"><stop offset="0" stopColor="#E7C98A" /><stop offset="0.5" stopColor="#9C7C42" /><stop offset="1" stopColor="#4E3C1E" /></radialGradient>
    <linearGradient id="compReflect" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9C7C42" stopOpacity="0.45" /><stop offset="1" stopColor="#9C7C42" stopOpacity="0" /></linearGradient>
  </defs>
);
