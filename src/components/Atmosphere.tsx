import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../styles/tokens";

/**
 * Cinematic atmosphere: a slow field of drifting cyan data-motes, a soft
 * vignette and depth fog. Fully deterministic (seeded per index, driven by the
 * frame) — adds constant subtle life so no shot ever feels frozen.
 */

function seeded(i: number): { x: number; y: number; s: number; sp: number; ph: number } {
  // cheap deterministic hash -> stable per-mote params
  const r = (n: number) => {
    const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return {
    x: r(i + 1) * 1080,
    y: r(i + 2) * 1920,
    s: 0.6 + r(i + 3) * 1.8,
    sp: 0.25 + r(i + 4) * 0.6,
    ph: r(i + 5) * Math.PI * 2,
  };
}

export const Atmosphere: React.FC<{ count?: number; opacity?: number }> = ({ count = 42, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const motes = [];
  for (let i = 0; i < count; i++) {
    const m = seeded(i);
    const drift = frame * m.sp;
    const y = ((m.y - drift) % 1920 + 1920) % 1920;
    const x = m.x + Math.sin(frame * 0.015 + m.ph) * 16;
    const tw = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(frame * 0.06 + m.ph));
    motes.push(
      <circle key={i} cx={x} cy={y} r={m.s} fill={COLORS.cyan} opacity={tw * 0.5 * opacity} />,
    );
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <radialGradient id="atm-vig" cx="50%" cy="46%" r="72%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <linearGradient id="atm-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(5,8,12,0.55)" />
          <stop offset="18%" stopColor="rgba(5,8,12,0)" />
          <stop offset="82%" stopColor="rgba(5,8,12,0)" />
          <stop offset="100%" stopColor="rgba(5,8,12,0.6)" />
        </linearGradient>
      </defs>
      <g style={{ filter: "blur(0.4px)" }}>{motes}</g>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#atm-fog)" />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#atm-vig)" />
    </svg>
  );
};
