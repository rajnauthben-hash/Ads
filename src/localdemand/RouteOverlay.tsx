import React from "react";
import { COLOR } from "./theme";

/**
 * Live route animation composited over the plate's baked route (which already
 * follows the roads perfectly). We add motion — a small directional pulse
 * travelling along the traced path, plus an optional soft reinforcement glow
 * to energise the route — rather than redrawing a divergent line.
 */
export const RouteDefs: React.FC = () => (
  <defs>
    <filter id="roGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="roGlowWide" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>
);

export const RouteOverlay: React.FC<{
  d: string;
  /** 0..1 travelling pulse head position (clamped to reveal). */
  pulse?: number;
  /** 0..1 reveal of the pulse's reach along the path. */
  reveal?: number;
  /** Soft reinforcement glow opacity to brighten the baked route. */
  reinforce?: number;
  emphasis?: number;
  width?: number;
  /** Shorten/dim the pulse (failing branch). */
  dying?: number;
}> = ({ d, pulse = 0, reveal = 1, reinforce = 0, emphasis = 1, width = 5, dying = 0 }) => {
  const head = Math.max(0, Math.min(reveal, pulse));
  const dead = Math.max(0, Math.min(1, dying));
  return (
    <g opacity={emphasis}>
      {reinforce > 0 && (
        <>
          <path d={d} fill="none" stroke={COLOR.cyan} strokeWidth={width * 2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce * 0.5} filter="url(#roGlowWide)" />
          <path d={d} fill="none" stroke={COLOR.cyan} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce} filter="url(#roGlow)" />
          <path d={d} fill="none" stroke={COLOR.cyanCore} strokeWidth={Math.max(1.4, width * 0.4)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - reveal} opacity={reinforce} />
        </>
      )}
      {/* travelling pulse */}
      {head > 0.01 && (
        <>
          <path d={d} fill="none" stroke={COLOR.cyanCore} strokeWidth={width * 1.9} strokeLinecap="round" pathLength={1} strokeDasharray="0.045 0.955" strokeDashoffset={-head} opacity={0.85 * (1 - dead * 0.6)} filter="url(#roGlow)" />
          <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={width * 0.8} strokeLinecap="round" pathLength={1} strokeDasharray="0.022 0.978" strokeDashoffset={-head} opacity={0.85 * (1 - dead * 0.6)} />
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
