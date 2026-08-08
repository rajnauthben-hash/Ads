import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// Storefront — the same warm "LOCAL & PROUD" shop across every scene. Drawn in
// world SVG space, lower-left. Interior warmth rises subtly in Scene 1 and
// again in Scene 5 when the on-ramp connects.
// ---------------------------------------------------------------------------

// Facade footprint.
const X = 44;
const Y = 1150;
const Wd = 402;
const Ht = 430;

export const Storefront: React.FC = () => {
  const frame = useCurrentFrame();

  // Base warm-up in Scene 1, then a stronger response as the route connects.
  const warm =
    interpolate(frame, [10, 70], [0.62, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) +
    interpolate(frame, [532, 585], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const winGlow = Math.min(1, warm);

  return (
    <g>
      <defs>
        <linearGradient id="brick" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241C16" />
          <stop offset="1" stopColor="#140F0B" />
        </linearGradient>
        <linearGradient id="winWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6C778" />
          <stop offset="0.5" stopColor={C.storefront} />
          <stop offset="1" stopColor={C.storefrontDeep} />
        </linearGradient>
        <radialGradient id="lampCone" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#FFE1A8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFE1A8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="storeAmbient" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#EBA552" stopOpacity="0.28" />
          <stop offset="1" stopColor="#EBA552" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlurStore" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Ground contact shadow */}
      <ellipse cx={X + Wd / 2} cy={Y + Ht + 8} rx={Wd / 2 + 40} ry={26} fill="#000" opacity={0.5} filter="url(#softBlurStore)" />

      {/* Warm ambient pool spilling from the shop */}
      <rect x={X - 60} y={Y - 40} width={Wd + 160} height={Ht + 120} fill="url(#storeAmbient)" opacity={winGlow} />

      {/* Facade */}
      <rect x={X} y={Y} width={Wd} height={Ht} fill="url(#brick)" stroke="#0C0906" strokeWidth={2} />
      {/* Brick courses */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={X} y1={Y + 22 + i * 20} x2={X + Wd} y2={Y + 22 + i * 20} stroke="#0A0806" strokeWidth={1} opacity={0.5} />
      ))}

      {/* Sign board */}
      <rect x={X + 26} y={Y + 30} width={Wd - 52} height={54} rx={4} fill="#0B0906" stroke="#3A2A16" strokeWidth={2} />
      <text
        x={X + Wd / 2}
        y={Y + 68}
        textAnchor="middle"
        fill={C.gold}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={30}
        fontWeight={700}
        letterSpacing="0.04em"
      >
        LOCAL &amp; PROUD
      </text>

      {/* Gooseneck lamp + soft light wash onto the sign */}
      <path d={`M ${X + 60} ${Y - 6} q 0 -30 34 -30`} stroke="#1A140E" strokeWidth={5} fill="none" />
      <circle cx={X + 94} cy={Y - 36} r={8} fill="#2A2016" />
      <ellipse cx={X + 90} cy={Y - 26} rx={5} ry={4} fill="#FFE9BC" opacity={winGlow} />
      <polygon
        points={`${X + 90},${Y - 26} ${X + 30},${Y + 90} ${X + 170},${Y + 90}`}
        fill="url(#lampCone)"
        opacity={winGlow * 0.45}
      />

      {/* Awning — striped trapezoid with scalloped hem */}
      <polygon points={`${X + 18},${Y + 96} ${X + Wd - 18},${Y + 96} ${X + Wd - 40},${Y + 150} ${X + 40},${Y + 150}`} fill="#161B1E" stroke="#0A0D0F" strokeWidth={1.5} />
      {Array.from({ length: 7 }).map((_, i) => {
        const t0 = i / 7;
        const x1 = X + 18 + (Wd - 36) * t0;
        const x2 = X + 40 + (Wd - 80) * t0;
        return <line key={i} x1={x1} y1={Y + 96} x2={x2} y2={Y + 150} stroke={i % 2 ? "#1E262A" : "#10161A"} strokeWidth={16} opacity={0.9} />;
      })}
      {/* Scalloped hem */}
      {Array.from({ length: 6 }).map((_, i) => {
        const w = (Wd - 80) / 6;
        return <path key={i} d={`M ${X + 40 + w * i} ${Y + 150} q ${w / 2} 16 ${w} 0`} fill="none" stroke="#0A0D0F" strokeWidth={2} />;
      })}

      {/* Display windows (warm interior) */}
      {/* Left window */}
      <g>
        <rect x={X + 24} y={Y + 170} width={158} height={210} rx={3} fill="url(#winWarm)" opacity={winGlow} />
        <rect x={X + 24} y={Y + 170} width={158} height={210} rx={3} fill="none" stroke="#20160C" strokeWidth={6} />
        <line x1={X + 103} y1={Y + 170} x2={X + 103} y2={Y + 380} stroke="#20160C" strokeWidth={3} />
        <line x1={X + 24} y1={Y + 262} x2={X + 182} y2={Y + 262} stroke="#20160C" strokeWidth={3} />
        {/* interior shelf silhouettes */}
        <rect x={X + 34} y={Y + 300} width={40} height={70} fill="#6E4A22" opacity={winGlow * 0.7} />
        <rect x={X + 120} y={Y + 290} width={30} height={80} fill="#5A3C1C" opacity={winGlow * 0.7} />
      </g>
      {/* Door */}
      <rect x={X + 196} y={Y + 190} width={92} height={218} rx={3} fill="#0D0A07" stroke="#241811" strokeWidth={4} />
      <rect x={X + 206} y={Y + 202} width={72} height={120} fill="url(#winWarm)" opacity={winGlow * 0.85} />
      <circle cx={X + 280} cy={Y + 312} r={3} fill={C.gold} />
      {/* Right window */}
      <g>
        <rect x={X + 300} y={Y + 190} width={80} height={190} rx={3} fill="url(#winWarm)" opacity={winGlow * 0.92} />
        <rect x={X + 300} y={Y + 190} width={80} height={190} rx={3} fill="none" stroke="#20160C" strokeWidth={5} />
        <line x1={X + 340} y1={Y + 190} x2={X + 340} y2={Y + 380} stroke="#20160C" strokeWidth={2.5} />
      </g>

      {/* Wall lantern */}
      <rect x={X + 6} y={Y + 250} width={12} height={20} fill="#1A140E" />
      <circle cx={X + 12} cy={Y + 268} r={7} fill="#FFDFA0" opacity={winGlow} />

      {/* Bench */}
      <g>
        <rect x={X + 120} y={Y + 396} width={110} height={8} rx={2} fill="#241A12" />
        <rect x={X + 126} y={Y + 404} width={6} height={22} fill="#1A120C" />
        <rect x={X + 218} y={Y + 404} width={6} height={22} fill="#1A120C" />
      </g>

      {/* Sandwich board */}
      <g>
        <polygon points={`${X + 8},${Y + 432} ${X + 78},${Y + 432} ${X + 70},${Y + 360} ${X + 16},${Y + 360}`} fill="#0B0906" stroke="#2A1E12" strokeWidth={2} />
        <text x={X + 43} y={Y + 384} textAnchor="middle" fill="#C8A25E" fontFamily="Georgia, serif" fontSize={12} fontWeight={700}>GREAT</text>
        <text x={X + 43} y={Y + 402} textAnchor="middle" fill="#C8A25E" fontFamily="Georgia, serif" fontSize={12} fontWeight={700}>PEOPLE</text>
        <text x={X + 43} y={Y + 420} textAnchor="middle" fill="#C8A25E" fontFamily="Georgia, serif" fontSize={11} fontWeight={700}>SERVICE</text>
      </g>

      {/* Planters */}
      <g>
        <rect x={X + 300} y={Y + 400} width={40} height={30} rx={3} fill="#181009" />
        <path d={`M ${X + 306} ${Y + 400} q 6 -30 14 -20 q 8 -22 16 0 q 8 -12 10 20 z`} fill="#274028" opacity={0.9} />
      </g>
    </g>
  );
};
