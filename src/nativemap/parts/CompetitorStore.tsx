import React from "react";
import { T } from "../tokens";

/** Stylised 2.5D vector competitor storefront (peer to Crown, plainer sign). */
export const CompetitorStore: React.FC<{ lit?: number }> = ({ lit = 0.5 }) => {
  const W = 220, H = 250, half = W / 2, D = 44;
  const g = 0.45 + lit * 0.55;
  const off = (p: { x: number; y: number }) => ({ x: p.x + D, y: p.y - D * 0.5 });
  const fBL = { x: -half, y: 0 }, fBR = { x: half, y: 0 }, fTL = { x: -half, y: -H }, fTR = { x: half, y: -H };
  const pts = (a: { x: number; y: number }[]) => a.map((p) => `${p.x},${p.y}`).join(" ");
  const win = (cx: number, w: number) => (
    <g>
      <rect x={cx - w / 2} y={-H + 96} width={w} height={122} rx={3} fill="url(#compWin)" opacity={g} />
      {[1, 2, 3].map((i) => <line key={i} x1={cx - w / 2 + 3} y1={-H + 96 + (122 / 4) * i} x2={cx + w / 2 - 3} y2={-H + 96 + (122 / 4) * i} stroke="#2E4038" strokeWidth={1.4} opacity={0.5 * g} />)}
      <rect x={cx - w / 2} y={-H + 96} width={w} height={122} rx={3} fill="none" stroke="#1A2228" strokeWidth={3} />
    </g>
  );
  return (
    <g>
      <ellipse cx={8} cy={8} rx={half + 44} ry={24} fill={T.windowWarm} opacity={0.1 * g} filter="url(#crownWarm)" />
      <polygon points={pts([{ x: -half - 18, y: 6 }, { x: half + 18, y: 6 }, { x: half + 18 + D, y: 6 - D * 0.5 }, { x: -half - 18 + D, y: 6 - D * 0.5 }])} fill="#0A0F16" />
      <polygon points={pts([fBR, off(fBR), off(fTR), fTR])} fill="#06090E" />
      <polygon points={pts([fTL, fTR, off(fTR), off(fTL)])} fill="#0C121C" />
      <polygon points={pts([fBL, fBR, fTR, fTL])} fill="url(#compBody)" />
      <rect x={-half + 10} y={-H + 20} width={W - 20} height={46} rx={3} fill="#0A0D13" />
      <text x={0} y={-H + 50} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={18} fontWeight={600} letterSpacing={4} fill="#AEB8C4" opacity={g}>COMPETITOR</text>
      <rect x={-half + 6} y={-H + 74} width={W - 12} height={7} fill="#141A22" />
      {win(-half + 44, 66)}
      <g>
        <rect x={-28} y={-H + 96} width={56} height={132} rx={3} fill="url(#compWin)" opacity={g} />
        <line x1={0} y1={-H + 96} x2={0} y2={-H + 228} stroke="#1A2228" strokeWidth={3} />
        <rect x={-28} y={-H + 96} width={56} height={132} rx={3} fill="none" stroke="#1A2228" strokeWidth={3} />
      </g>
      {win(half - 44, 66)}
      {[-half + 4, half - 4].map((px, i) => (
        <g key={i}><ellipse cx={px} cy={-28} rx={11} ry={14} fill="#1C331F" opacity={0.9} /></g>
      ))}
    </g>
  );
};

export const CompetitorDefs: React.FC = () => (
  <defs>
    <linearGradient id="compBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12161C" /><stop offset="1" stopColor="#07090E" /></linearGradient>
    <linearGradient id="compWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E7C98A" /><stop offset="1" stopColor="#7C5E2E" /></linearGradient>
  </defs>
);
