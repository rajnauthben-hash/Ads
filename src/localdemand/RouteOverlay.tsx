import React from "react";
import { COLOR } from "./theme";
import { pointAtFrac } from "./pathSample";

/**
 * Live route animation composited over the plate's baked route (which already
 * follows the roads). Adds directional life: a pathLength draw-on, a travelling
 * pulse dash, a bright pulse head with a soft cyan road-reflection glow that
 * moves along the route, and a gently breathing glow.
 */
export const RouteDefs: React.FC = () => (
  <defs>
    <filter id="roGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="roGlowWide" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
    <filter id="roReflect" x="-160%" y="-160%" width="420%" height="420%">
      <feGaussianBlur stdDeviation="22" />
    </filter>
  </defs>
);

export const RouteOverlay: React.FC<{
  d: string;
  pulse?: number; // 0..1 travelling pulse head position
  reveal?: number; // 0..1 reveal of the pulse's reach
  reinforce?: number;
  emphasis?: number;
  width?: number;
  dying?: number;
  breathe?: number; // 0..1 phase for glow breathing
}> = ({ d, pulse = 0, reveal = 1, reinforce = 0, emphasis = 1, width = 5, dying = 0, breathe = 0 }) => {
  const head = Math.max(0, Math.min(reveal, pulse));
  const dead = Math.max(0, Math.min(1, dying));
  const br = 1 + Math.sin(breathe * Math.PI * 2) * 0.08; // ±8% glow breathing
  const hp = head > 0.01 ? pointAtFrac(d, head) : null;

  return (
    <g opacity={emphasis}>
      {reinforce > 0 && (
        <>
          <path d={d} fill="none" stroke={COLOR.cyan} strokeWidth={width * 2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce * 0.5 * br} filter="url(#roGlowWide)" />
          <path d={d} fill="none" stroke={COLOR.cyan} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce * br} filter="url(#roGlow)" />
          <path d={d} fill="none" stroke={COLOR.cyanCore} strokeWidth={Math.max(1.4, width * 0.4)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce} />
        </>
      )}
      {/* travelling pulse dash */}
      {head > 0.01 && (
        <>
          <path d={d} fill="none" stroke={COLOR.cyanCore} strokeWidth={width * 1.9} strokeLinecap="round" pathLength={1} strokeDasharray="0.05 0.95" strokeDashoffset={-head} opacity={0.85 * (1 - dead * 0.6)} filter="url(#roGlow)" />
          <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={width * 0.8} strokeLinecap="round" pathLength={1} strokeDasharray="0.024 0.976" strokeDashoffset={-head} opacity={0.85 * (1 - dead * 0.6)} />
        </>
      )}
      {/* moving pulse head + road-reflection glow */}
      {hp && head < 0.995 && (
        <>
          <circle cx={hp.x} cy={hp.y} r={26 * br} fill={COLOR.cyan} opacity={0.22 * (1 - dead * 0.7)} filter="url(#roReflect)" />
          <circle cx={hp.x} cy={hp.y} r={7 * br} fill={COLOR.cyanCore} opacity={0.95 * (1 - dead * 0.6)} filter="url(#roGlow)" />
        </>
      )}
    </g>
  );
};

/** Small pulsing ring on a marker (customer origin / search node). */
export const PulseRing: React.FC<{ x: number; y: number; t: number; color?: string; base?: number }> = ({
  x,
  y,
  t,
  color = COLOR.cyan,
  base = 16,
}) => (
  <circle cx={x} cy={y} r={base + t * 14} fill="none" stroke={color} strokeWidth={2} opacity={0.5 * (1 - t)} />
);
