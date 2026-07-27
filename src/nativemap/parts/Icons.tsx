import React from "react";
import { T } from "../tokens";

export const GoldLocationPin: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
    <path d="M0 -24 C 12 -24 18 -14 18 -6 C 18 5 0 20 0 20 C 0 20 -18 5 -18 -6 C -18 -14 -12 -24 0 -24 Z" fill={T.gold} />
    <circle cx={0} cy={-6} r={6} fill={T.bg} />
  </g>
);

/** Muted business/home node (spec: "muted white business/home nodes"). */
export const BusinessNode: React.FC<{ x: number; y: number; s?: number; opacity?: number; kind?: "home" | "shop" }> = ({ x, y, s = 1, opacity = 0.6, kind = "home" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity} fill="none" stroke={T.gray} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round">
    {kind === "home" ? (
      <>
        <path d="M-13 -1 L0 -14 L13 -1 L13 13 L-13 13 Z" />
        <path d="M-5 13 L-5 3 L5 3 L5 13" />
      </>
    ) : (
      <>
        <path d="M-13 -3 L-10 -12 L10 -12 L13 -3 Z" />
        <path d="M-11 -3 L-11 13 L11 13 L11 -3" />
        <path d="M-3 13 L-3 4 L3 4 L3 13" />
      </>
    )}
  </g>
);

/** Concentric demand-origin pulse rings. */
export const OriginRings: React.FC<{ x: number; y: number; t: number; core?: number }> = ({ x, y, t, core = 8 }) => (
  <g transform={`translate(${x},${y})`}>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t + i * 0.25) % 1;
      return <circle key={i} r={12 + i * 16 + ph * 14} fill="none" stroke={T.cyan} strokeWidth={2} opacity={0.4 * (1 - ph)} />;
    })}
    <circle r={core} fill={T.cyanCore} />
    <circle r={core * 2} fill="none" stroke={T.cyanCore} strokeWidth={2} opacity={0.8} />
  </g>
);

/** Customer node — person glyph in a glowing disc (Scene 3). */
export const CustomerNode: React.FC<{ x: number; y: number; d?: number; ring?: number; opacity?: number }> = ({ x, y, d = 110, ring = 0, opacity = 1 }) => {
  const R = d / 2;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {ring > 0 && <circle r={R + ring * 35} fill="none" stroke={T.cyan} strokeWidth={2.4} opacity={0.5 * (1 - ring)} />}
      <circle r={R} fill="#0A1826" stroke={T.cyan} strokeWidth={3} />
      <circle cy={-R * 0.28} r={R * 0.28} fill={T.cyanCore} />
      <path d={`M ${-R * 0.5} ${R * 0.5} C ${-R * 0.5} ${-R * 0.05} ${R * 0.5} ${-R * 0.05} ${R * 0.5} ${R * 0.5} Z`} fill={T.cyanCore} />
    </g>
  );
};

/** Route junction node where the signal splits. */
export const RouteJunction: React.FC<{ x: number; y: number; opacity?: number }> = ({ x, y, opacity = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={opacity}>
    <circle r={13} fill="none" stroke={T.cyanCore} strokeWidth={2.4} filter="url(#rGlow)" />
    <circle r={5} fill={T.cyanCore} filter="url(#rGlow)" />
  </g>
);

export const DestinationRing: React.FC<{ x: number; y: number; p?: number; color?: string }> = ({ x, y, p = 1, color = T.cyanCore }) => (
  <g transform={`translate(${x},${y})`} opacity={Math.max(0, Math.min(1, p))}>
    <circle r={16} fill="none" stroke={color} strokeWidth={2.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p))} filter="url(#rGlow)" />
    <circle r={6} fill={color} filter="url(#rGlow)" />
  </g>
);
