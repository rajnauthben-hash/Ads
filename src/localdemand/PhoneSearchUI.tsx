import React from "react";
import { COLOR, FONT } from "./theme";

/**
 * Rebuilt phone + search UI (Scene 2). Drawn in SVG at a top-left origin so
 * it shares the composition's coordinate space and the cyan route can start
 * exactly at the search button. Local size 470 x 940.
 */

export const PHONE_W = 470;
export const PHONE_H = 940;
/** Local coordinate of the search-button centre (route origin). */
export const PHONE_BUTTON: { x: number; y: number } = { x: 235, y: 812 };

const OPTIONS: Array<{ label: string; icon: (k: string) => React.ReactNode }> = [
  { label: "open now", icon: (k) => <ClockIcon key={k} /> },
  { label: "closest option", icon: (k) => <NavIcon key={k} /> },
  { label: "good reviews", icon: (k) => <StarIcon key={k} /> },
  { label: "power tools", icon: (k) => <DrillIcon key={k} /> },
];

export const PhoneSearchUI: React.FC<{
  typed: number; // 0..1 of query typed
  optionsIn: number; // 0..1 reveal of option rows
  pulse: number; // 0..1 search-button activation
}> = ({ typed, optionsIn, pulse }) => {
  const query = "hardware store near me";
  const shown = query.slice(0, Math.round(query.length * typed));

  return (
    <g>
      {/* device body */}
      <rect x={0} y={0} width={PHONE_W} height={PHONE_H} rx={62} fill="#05070B" stroke="#20262F" strokeWidth={3} />
      <rect x={9} y={9} width={PHONE_W - 18} height={PHONE_H - 18} rx={54} fill="url(#phoneScreen)" />
      {/* dynamic island */}
      <rect x={PHONE_W / 2 - 52} y={30} width={104} height={30} rx={15} fill="#000" />

      {/* status bar */}
      <text x={40} y={44} fontFamily={FONT.ui} fontSize={22} fontWeight={600} fill={COLOR.white}>
        9:41
      </text>
      <g transform={`translate(${PHONE_W - 118}, 30)`}>
        {/* signal */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 7} y={12 - i * 3} width={5} height={4 + i * 3} rx={1} fill={COLOR.white} />
        ))}
        {/* wifi */}
        <path d="M 40 16 a 10 10 0 0 1 16 0" fill="none" stroke={COLOR.white} strokeWidth={2.4} />
        <path d="M 44 19 a 5 5 0 0 1 8 0" fill="none" stroke={COLOR.white} strokeWidth={2.4} />
        <circle cx={48} cy={22} r={1.6} fill={COLOR.white} />
        {/* battery */}
        <rect x={64} y={6} width={30} height={16} rx={4} fill="none" stroke={COLOR.white} strokeWidth={2} opacity={0.8} />
        <rect x={66} y={8} width={22} height={12} rx={2} fill={COLOR.white} />
        <rect x={95} y={10} width={3} height={8} rx={1.5} fill={COLOR.white} />
      </g>

      {/* search field */}
      <g transform="translate(28, 92)">
        <rect x={0} y={0} width={PHONE_W - 56} height={64} rx={32} fill="#12161D" stroke="#242A33" strokeWidth={1.5} />
        <circle cx={34} cy={32} r={11} fill="none" stroke={COLOR.cyan} strokeWidth={3} />
        <line x1={42} y1={40} x2={50} y2={48} stroke={COLOR.cyan} strokeWidth={3} strokeLinecap="round" />
        <text x={64} y={40} fontFamily={FONT.ui} fontSize={23} fill={COLOR.white}>
          {shown}
          {typed < 1 && Math.floor(typed * 40) % 2 === 0 ? "|" : ""}
        </text>
        {typed >= 0.99 && (
          <g transform={`translate(${PHONE_W - 56 - 42}, 20)`} opacity={0.7}>
            <circle cx={12} cy={12} r={13} fill="#2A303A" />
            <line x1={6} y1={6} x2={18} y2={18} stroke={COLOR.white} strokeWidth={2} />
            <line x1={18} y1={6} x2={6} y2={18} stroke={COLOR.white} strokeWidth={2} />
          </g>
        )}
      </g>

      {/* option rows */}
      {OPTIONS.map((opt, i) => {
        const rowY = 182 + i * 92;
        const local = Math.max(0, Math.min(1, optionsIn * OPTIONS.length - i));
        return (
          <g key={opt.label} transform={`translate(28, ${rowY + (1 - local) * 14})`} opacity={local}>
            <rect x={0} y={0} width={PHONE_W - 56} height={78} rx={22} fill="#0E1219" stroke="#1E242D" strokeWidth={1.4} />
            <g transform="translate(28, 22)" stroke={COLOR.white} fill="none">
              {opt.icon(opt.label)}
            </g>
            <text x={78} y={46} fontFamily={FONT.ui} fontSize={24} fill={COLOR.white}>
              {opt.label}
            </text>
            <path d={`M ${PHONE_W - 56 - 34} 32 l 10 7 l -10 7`} fill="none" stroke={COLOR.grayDim} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* search button + sonar */}
      <g transform={`translate(${PHONE_BUTTON.x}, ${PHONE_BUTTON.y})`}>
        {[0, 1, 2].map((i) => {
          const rr = 44 + i * 34 + pulse * 30;
          return <circle key={i} r={rr} fill="none" stroke={COLOR.cyan} strokeWidth={1.5} opacity={(0.4 - i * 0.12) * pulse} />;
        })}
        {/* radial dots */}
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const rr = 70 + (i % 3) * 12;
          return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={1.8} fill={COLOR.cyan} opacity={0.4 * pulse} />;
        })}
        <circle r={44} fill="url(#btnGrad)" opacity={0.4 + pulse * 0.6} filter="url(#cyanGlow)" />
        <circle r={40} fill="#0B2A3D" stroke={COLOR.cyan} strokeWidth={2.5} />
        <circle cx={-3} cy={-3} r={12} fill="none" stroke={COLOR.cyanCore} strokeWidth={4} />
        <line x1={6} y1={6} x2={16} y2={16} stroke={COLOR.cyanCore} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

const ClockIcon = () => (
  <g strokeWidth={2.4} strokeLinecap="round">
    <circle cx={17} cy={17} r={15} stroke={COLOR.gold} fill="none" />
    <path d="M 17 8 v 9 l 6 4" stroke={COLOR.gold} fill="none" />
  </g>
);
const NavIcon = () => (
  <path d="M 32 3 L 4 16 L 17 20 L 21 33 Z" stroke={COLOR.gold} strokeWidth={2.4} fill="none" strokeLinejoin="round" />
);
const StarIcon = () => (
  <path d="M 17 3 l 4.3 9.2 l 10 1 l -7.5 6.8 l 2.2 9.8 l -8.9 -5.1 l -8.9 5.1 l 2.2 -9.8 l -7.5 -6.8 l 10 -1 Z" stroke={COLOR.gold} strokeWidth={2.2} fill="none" strokeLinejoin="round" />
);
const DrillIcon = () => (
  <g stroke={COLOR.gold} strokeWidth={2.4} fill="none" strokeLinejoin="round" strokeLinecap="round">
    <rect x={3} y={10} width={18} height={13} rx={3} />
    <path d="M 21 14 h 9 v 5 h -9" />
    <path d="M 8 23 v 7 h 6 v -7" />
    <line x1={30} y1={16.5} x2={34} y2={16.5} />
  </g>
);

export const PhoneDefs: React.FC = () => (
  <defs>
    <linearGradient id="phoneScreen" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor="#0A0E15" />
      <stop offset="1" stopColor="#05080D" />
    </linearGradient>
    <radialGradient id="btnGrad" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor={COLOR.cyanCore} />
      <stop offset="1" stopColor={COLOR.cyanDeep} />
    </radialGradient>
  </defs>
);
