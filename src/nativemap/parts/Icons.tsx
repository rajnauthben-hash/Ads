import React from "react";
import { T } from "../tokens";

/** Filled gold location pin. */
export const MapPin: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
    <path d="M0 -22 C 11 -22 16 -13 16 -6 C 16 4 0 18 0 18 C 0 18 -16 4 -16 -6 C -16 -13 -11 -22 0 -22 Z" fill={T.gold} />
    <circle cx={0} cy={-6} r={5.5} fill={T.bg0} />
  </g>
);

/** Thin outline house POI. */
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 0.7 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity} fill="none" stroke={T.gray} strokeWidth={1.6} strokeLinejoin="round">
    <path d="M-14 -2 L0 -15 L14 -2 L14 14 L-14 14 Z" />
    <path d="M-6 14 L-6 3 L6 3 L6 14" />
  </g>
);

/** Thin outline cube POI. */
export const CubeIcon: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 0.6 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={opacity} fill="none" stroke={T.gray} strokeWidth={1.5} strokeLinejoin="round">
    <path d="M0 -14 L13 -7 L13 8 L0 15 L-13 8 L-13 -7 Z" />
    <path d="M0 -14 L0 0 M0 0 L13 -7 M0 0 L-13 -7" />
  </g>
);

/** Concentric pulse rings marking the demand origin. */
export const OriginRings: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => {
      const r = 10 + i * 16 + ((t + i * 0.25) % 1) * 14;
      return <circle key={i} cx={0} cy={0} r={r} fill="none" stroke={T.cyan} strokeWidth={2} opacity={0.4 * (1 - ((t + i * 0.25) % 1))} />;
    })}
    <circle cx={0} cy={0} r={7} fill={T.cyanCore} />
    <circle cx={0} cy={0} r={16} fill="none" stroke={T.cyanCore} strokeWidth={2} opacity={0.8} />
  </g>
);

/** Customer marker — person glyph in a glowing disc (Scene 3). */
export const CustomerMarker: React.FC<{ x: number; y: number; t: number; opacity?: number }> = ({ x, y, t, opacity = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={opacity}>
    {[0, 1].map((i) => (
      <circle key={i} cx={0} cy={0} r={26 + ((t + i * 0.5) % 1) * 18} fill="none" stroke={T.cyan} strokeWidth={2} opacity={0.35 * (1 - ((t + i * 0.5) % 1))} />
    ))}
    <circle cx={0} cy={0} r={24} fill="#0A1626" stroke={T.cyan} strokeWidth={2.5} />
    <circle cx={0} cy={-6} r={7} fill={T.cyanCore} />
    <path d="M-11 12 C -11 2 11 2 11 12 Z" fill={T.cyanCore} />
  </g>
);
