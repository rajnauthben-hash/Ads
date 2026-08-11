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
  const win = (x: number, w: number, extra = 1) => {
    const o = glow * extra;
    return (
      <g>
        {/* Warm glowing interior */}
        <rect x={x} y={116} width={w} height={150} rx={2} fill="url(#crownWin)" opacity={o} />
        <rect x={x} y={116} width={w} height={150} rx={2} fill="url(#crownWinGlow)" opacity={o} />
        {/* Shelf lines + soft goods silhouettes (backlit, low contrast) */}
        {[150, 186, 222].map((sy) => (
          <line key={sy} x1={x + 4} y1={sy} x2={x + w - 4} y2={sy} stroke="#9C6A2E" strokeWidth={2} opacity={o * 0.5} />
        ))}
        {Array.from({ length: Math.floor(w / 22) }).map((_, i) => (
          <rect
            key={i}
            x={x + 8 + i * 22}
            y={150 + (i % 3) * 24}
            width={13}
            height={30 + (i % 4) * 8}
            rx={1}
            fill={i % 2 ? "#8A5A26" : "#6E4620"}
            opacity={o * 0.42}
          />
        ))}
        {/* Bright warm bloom near the top of the glass */}
        <rect x={x} y={116} width={w} height={64} rx={2} fill="url(#crownWinBloom)" opacity={o * 0.9} />
        {/* Frame + mullions */}
        <rect x={x} y={116} width={w} height={150} rx={2} fill="none" stroke="#180F08" strokeWidth={7} />
        <line x1={x + w / 2} y1={116} x2={x + w / 2} y2={266} stroke="#180F08" strokeWidth={3} />
        {/* Warm light spill onto the sill/ground */}
        <rect x={x - 6} y={264} width={w + 12} height={26} fill="url(#crownSpill)" opacity={o} />
      </g>
    );
  };

  return (
    <g>
      <defs>
        <linearGradient id="crownBrick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E211734" stopOpacity="1" />
          <stop offset="0" stopColor="#2C2016" />
          <stop offset="1" stopColor="#140D08" />
        </linearGradient>
        <linearGradient id="crownWin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD68A" />
          <stop offset="0.45" stopColor={C.warm} />
          <stop offset="1" stopColor="#8A5417" />
        </linearGradient>
        <radialGradient id="crownWinGlow" cx="0.5" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#FFE8B8" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#FFC877" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FFC877" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="crownWinBloom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1D2" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFF1D2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="crownSpill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFCB80" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFCB80" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="crownAmbient" cx="0.5" cy="0.5" r="0.62">
          <stop offset="0" stopColor="#F2A94E" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="#E88C34" stopOpacity="0.16" />
          <stop offset="1" stopColor="#E88C34" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="crownLamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#FFE1A8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE1A8" stopOpacity="0" />
        </radialGradient>
        <filter id="crownShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Broad warm pool spilling into the surrounding city + contact shadow */}
      <ellipse cx={Wd / 2} cy={Ht + 12} rx={Wd / 2 + 30} ry={22} fill="#000" opacity={0.5} filter="url(#crownShadow)" />
      <rect x={-260} y={-180} width={Wd + 520} height={Ht + 420} fill="url(#crownAmbient)" opacity={glow} />

      {/* Facade */}
      <rect x={0} y={0} width={Wd} height={Ht} fill="url(#crownBrick)" stroke="#0A0705" strokeWidth={2} />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={0} y1={20 + i * 20} x2={Wd} y2={20 + i * 20} stroke="#0A0705" strokeWidth={1} opacity={0.5} />
      ))}
      {/* Warm wash down the brick from the sign lamps */}
      <rect x={0} y={84} width={Wd} height={Ht - 84} fill="url(#crownWinBloom)" opacity={glow * 0.14} />

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
