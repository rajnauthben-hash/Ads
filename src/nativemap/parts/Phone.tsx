import React from "react";
import { T, FONT_BODY } from "../tokens";

const OPTIONS = ["open now", "closest option", "good reviews", "power tools"];

/** Clean 2.5D vector phone slab + native search UI. No hand. */
export const VectorPhone: React.FC<{
  outline?: number; // 0..1 body outline draw
  surface?: number; // 0..1 surface fill opacity
  fieldW?: number; // search field width px
  typed?: number; // 0..1 query typed
  optionP?: number[]; // per-card reveal 0..1
  iconScale?: number; // search-field icon response
}> = ({ outline = 1, surface = 1, fieldW = 378, typed = 1, optionP = [1, 1, 1, 1], iconScale = 1 }) => {
  const W = 475, H = 820;
  const query = "hardware store near me";
  const shown = query.slice(0, Math.round(query.length * Math.max(0, Math.min(1, typed))));
  return (
    <g>
      {/* body */}
      <rect x={-3} y={-3} width={W + 6} height={H + 6} rx={57} fill="none" stroke="#1B2833" strokeWidth={5} opacity={surface * 0.7} />
      <rect x={0} y={0} width={W} height={H} rx={54} fill="url(#phoneScreen)" fillOpacity={surface} stroke={T.phoneBorder} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - outline} />
      {/* glass reflection sheen */}
      <path d={`M 0 60 Q ${W * 0.5} 200 ${W} 40 L ${W} 0 L 0 0 Z`} fill="url(#phoneSheen)" opacity={surface * 0.5} />
      <rect x={W / 2 - 46} y={26} width={92} height={26} rx={13} fill="#000" opacity={surface} />
      {/* status bar */}
      <text x={40} y={40} fontFamily={FONT_BODY} fontSize={20} fontWeight={500} fill={T.white} opacity={surface}>9:41</text>
      <g transform={`translate(${W - 120}, 26)`} opacity={surface}>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 6} y={11 - i * 2.5} width={4} height={4 + i * 2.5} rx={1} fill={T.white} />)}
        <path d="M36 15 a9 9 0 0 1 14 0" fill="none" stroke={T.white} strokeWidth={2.2} />
        <path d="M40 18 a4 4 0 0 1 6 0" fill="none" stroke={T.white} strokeWidth={2.2} />
        <rect x={60} y={6} width={28} height={14} rx={3.5} fill="none" stroke={T.white} strokeWidth={2} opacity={0.85} />
        <rect x={62} y={8} width={20} height={10} rx={2} fill={T.white} />
      </g>

      {/* search field */}
      <g transform="translate(47, 95)" opacity={surface}>
        <rect x={0} y={0} width={fieldW} height={74} rx={37} fill={T.phoneCard} stroke={T.phoneBorder} strokeWidth={1.5} />
        <g transform={`translate(38,37) scale(${iconScale})`}>
          <circle cx={0} cy={-2} r={11} fill="none" stroke={T.cyan} strokeWidth={3} />
          <line x1={8} y1={7} x2={16} y2={15} stroke={T.cyan} strokeWidth={3} strokeLinecap="round" />
        </g>
        {fieldW > 200 && <text x={68} y={46} fontFamily={FONT_BODY} fontSize={23} fill={T.white}>{shown}{typed < 1 && Math.floor(typed * 44) % 2 === 0 ? "|" : ""}</text>}
        {typed >= 0.99 && (
          <g transform={`translate(${fieldW - 44}, 22)`} opacity={0.7}>
            <circle cx={12} cy={12} r={13} fill="#2A303A" />
            <line x1={6} y1={6} x2={18} y2={18} stroke={T.white} strokeWidth={2} />
            <line x1={18} y1={6} x2={6} y2={18} stroke={T.white} strokeWidth={2} />
          </g>
        )}
      </g>

      {/* option cards */}
      {OPTIONS.map((label, i) => {
        const rowY = 200 + i * 96;
        const p = Math.max(0, Math.min(1, optionP[i] ?? 0));
        return (
          <g key={label} transform={`translate(47, ${rowY + (1 - p) * 8})`} opacity={p * surface}>
            <rect x={0} y={0} width={fieldW} height={80} rx={22} fill={T.phoneCard} stroke={T.phoneBorder} strokeWidth={1.4} />
            <g transform="translate(30, 24)" stroke={T.white} fill="none">{cardIcon(i)}</g>
            <text x={80} y={48} fontFamily={FONT_BODY} fontSize={24} fill={T.white}>{label}</text>
            <path d={`M ${fieldW - 34} 32 l 10 8 l -10 8`} fill="none" stroke={T.grayMuted} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};

function cardIcon(i: number): React.ReactNode {
  const c = T.cyan;
  if (i === 0) return <g strokeWidth={2.4} strokeLinecap="round"><circle cx={16} cy={16} r={14} stroke={c} /><path d="M16 8 v8 l6 4" stroke={c} /></g>;
  if (i === 1) return <path d="M30 2 L4 15 L16 19 L20 31 Z" stroke={c} strokeWidth={2.4} strokeLinejoin="round" />;
  if (i === 2) return <path d="M16 2 l4 8.5 l9.5 1 l-7 6.3 l2 9.2 l-8.5 -4.8 l-8.5 4.8 l2 -9.2 l-7 -6.3 l9.5 -1 Z" stroke={c} strokeWidth={2.2} strokeLinejoin="round" />;
  return <g stroke={c} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round"><rect x={2} y={9} width={17} height={12} rx={3} /><path d="M19 13 h9 v5 h-9" /><path d="M7 21 v7 h6 v-7" /><line x1={28} y1={15.5} x2={32} y2={15.5} /></g>;
}

/** Circular cyan search node (route origin for Scene 2). */
export const SearchNode: React.FC<{ x: number; y: number; d?: number; active?: number; ringP?: number }> = ({ x, y, d = 112, active = 1, ringP = 1 }) => {
  const R = d / 2;
  return (
    <g transform={`translate(${x},${y})`}>
      {[0, 1, 2].map((i) => <circle key={i} r={R * (0.7 + i * 0.5) + active * 8} fill="none" stroke={T.cyan} strokeWidth={1.4} opacity={(0.35 - i * 0.1) * active} />)}
      {Array.from({ length: 16 }).map((_, i) => { const a = (i / 16) * Math.PI * 2; const rr = R * 1.2 + (i % 3) * 6; return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={1.6} fill={T.cyan} opacity={0.4 * active} />; })}
      <circle r={R * 0.62} fill="url(#nodeGrad)" opacity={0.4 + active * 0.6} filter="url(#rGlow)" />
      <circle r={R * 0.56} fill="#0B2A3D" stroke={T.cyan} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ringP} />
      <g transform={`translate(${-R * 0.06},${-R * 0.06})`}>
        <circle r={R * 0.2} fill="none" stroke={T.cyanCore} strokeWidth={4} />
        <line x1={R * 0.16} y1={R * 0.16} x2={R * 0.32} y2={R * 0.32} stroke={T.cyanCore} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

export const PhoneDefs: React.FC = () => (
  <defs>
    <radialGradient id="nodeGrad" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={T.cyanCore} /><stop offset="1" stopColor={T.cyan} /></radialGradient>
    <linearGradient id="phoneScreen" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#131C26" /><stop offset="1" stopColor="#0A0F17" /></linearGradient>
    <linearGradient id="phoneSheen" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="rgba(120,170,210,0.14)" /><stop offset="1" stopColor="rgba(120,170,210,0)" /></linearGradient>
  </defs>
);
