import React from "react";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// CrownStore — the persistent Crown Hardware shop: dark brick, gold sign, three
// gooseneck lamps and warm display windows full of goods. Drawn at a local
// origin (0,0 = top-left of facade); the parent supplies world placement.
// `warm` (0..1) drives interior brightness (rises in Scene 5).
// ---------------------------------------------------------------------------

const Wd = 560;
const Ht = 300;

export const CrownStore: React.FC<{ warm?: number }> = ({ warm = 0.85 }) => {
  const glow = Math.min(1, warm);
  const win = (x: number, w: number, extra = 1) => (
    <g>
      <rect x={x} y={116} width={w} height={150} rx={2} fill="url(#crownWin)" opacity={glow * extra} />
      {/* shelved goods silhouettes */}
      {Array.from({ length: Math.floor(w / 26) }).map((_, i) => (
        <rect
          key={i}
          x={x + 8 + i * 26}
          y={150 + (i % 3) * 12}
          width={16}
          height={110 - (i % 3) * 12}
          fill={i % 2 ? "#7A5222" : "#5E3E19"}
          opacity={glow * 0.6}
        />
      ))}
      <rect x={x} y={116} width={w} height={150} rx={2} fill="none" stroke="#1C130A" strokeWidth={6} />
      <line x1={x + w / 2} y1={116} x2={x + w / 2} y2={266} stroke="#1C130A" strokeWidth={3} />
    </g>
  );

  return (
    <g>
      <defs>
        <linearGradient id="crownBrick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241A13" />
          <stop offset="1" stopColor="#120C08" />
        </linearGradient>
        <linearGradient id="crownWin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.warmLight} />
          <stop offset="0.5" stopColor={C.warm} />
          <stop offset="1" stopColor={C.warmDeep} />
        </linearGradient>
        <radialGradient id="crownAmbient" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#EBA552" stopOpacity="0.3" />
          <stop offset="1" stopColor="#EBA552" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="crownLamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#FFE1A8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE1A8" stopOpacity="0" />
        </radialGradient>
        <filter id="crownShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Warm pool + contact shadow */}
      <ellipse cx={Wd / 2} cy={Ht + 12} rx={Wd / 2 + 30} ry={22} fill="#000" opacity={0.5} filter="url(#crownShadow)" />
      <rect x={-50} y={40} width={Wd + 100} height={Ht + 60} fill="url(#crownAmbient)" opacity={glow} />

      {/* Facade */}
      <rect x={0} y={0} width={Wd} height={Ht} fill="url(#crownBrick)" stroke="#0A0705" strokeWidth={2} />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={0} y1={20 + i * 20} x2={Wd} y2={20 + i * 20} stroke="#0A0705" strokeWidth={1} opacity={0.5} />
      ))}

      {/* Sign band */}
      <rect x={20} y={26} width={Wd - 40} height={58} rx={3} fill="#0B0805" stroke="#3A2A16" strokeWidth={2} />
      <text
        x={Wd / 2}
        y={68}
        textAnchor="middle"
        fill={C.gold}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={34}
        fontWeight={700}
        letterSpacing="0.08em"
      >
        CROWN HARDWARE
      </text>

      {/* Gooseneck lamps + light wash on sign */}
      {[Wd * 0.24, Wd * 0.5, Wd * 0.76].map((lx, i) => (
        <g key={i}>
          <path d={`M ${lx} 4 q 0 -22 20 -22`} stroke="#1A140E" strokeWidth={4} fill="none" />
          <circle cx={lx + 20} cy={-18} r={7} fill="#2A2016" />
          <ellipse cx={lx + 16} cy={-8} rx={5} ry={4} fill="#FFE9BC" opacity={glow} />
          <polygon points={`${lx + 16},-10 ${lx - 34},84 ${lx + 34},84`} fill="url(#crownLamp)" opacity={glow * 0.4} />
        </g>
      ))}

      {/* Display windows + door */}
      {win(24, 150)}
      {win(354, 182)}
      {/* Door */}
      <rect x={196} y={130} width={150} height={140} rx={2} fill="#0D0A07" stroke="#241811" strokeWidth={4} />
      <rect x={210} y={144} width={122} height={80} fill="url(#crownWin)" opacity={glow * 0.85} />
      <circle cx={324} cy={205} r={3} fill={C.gold} />
    </g>
  );
};
