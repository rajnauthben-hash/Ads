import React from "react";
import { interpolate } from "remotion";
import { C, F, E } from "./theme";
import { Pt, smoothPath, pointAtLength } from "../utils/routeGeometry";

// ---------------------------------------------------------------------------
// Small deterministic helpers
// ---------------------------------------------------------------------------
export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export function ip(frame: number, a: number, b: number, from: number, to: number, easing = E.textIn) {
  return interpolate(frame, [a, b], [from, to], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
/** keyframe interpolation over arrays */
export function kf(frame: number, frames: number[], vals: number[], easing = E.camera) {
  return interpolate(frame, frames, vals, { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ---------------------------------------------------------------------------
// Brand lockup — the OmniFlow "swirl" ring + wordmark. Persistent element.
// ---------------------------------------------------------------------------
export const Brand: React.FC<{ x: number; y: number; size?: number; underline?: boolean; reveal?: number }> = ({
  x,
  y,
  size = 30,
  underline = false,
  reveal = 1,
}) => {
  const tx = ip(reveal, 0, 1, -12, 0);
  const blur = ip(reveal, 0, 1, 5, 0);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: reveal, transform: `translateX(${tx}px)`, filter: `blur(${blur}px)` }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx={20} cy={20} r={17} stroke={C.cyan} strokeWidth={3} opacity={0.35} />
        <path d="M20 3 a17 17 0 0 1 0 34" stroke={C.cyan} strokeWidth={3.4} strokeLinecap="round" />
        <path d="M20 9 a11 11 0 0 1 0 22" stroke={C.cyanHi} strokeWidth={2.6} strokeLinecap="round" opacity={0.8} />
        <circle cx={20} cy={20} r={3.2} fill={C.cyan} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: size * 0.62, letterSpacing: size * 0.14, color: C.white }}>
          OMNIFLOW <span style={{ fontWeight: 400 }}>DIGITAL</span>
        </span>
        {underline && <div style={{ height: 2, width: size * 5.2, background: C.gold, marginTop: 6, opacity: 0.9 }} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Location pin (gold or gray/cyan). Persistent-style component.
// ---------------------------------------------------------------------------
export const Pin: React.FC<{ x: number; y: number; size?: number; color?: string; reveal?: number; ping?: number }> = ({
  x,
  y,
  size = 34,
  color = C.gold,
  reveal = 1,
  ping,
}) => {
  const s = ip(reveal, 0, 1, 0.5, 1) * (0.9 + 0.1 * reveal);
  const drop = ip(reveal, 0, 1, -10, 0);
  return (
    <g transform={`translate(${x} ${y + drop}) scale(${s})`} opacity={clamp(reveal * 1.2)} style={{ transformOrigin: "center", transformBox: "fill-box" }}>
      {ping !== undefined && ping > 0 && ping < 1 && (
        <circle cx={0} cy={0} r={interpolate(ping, [0, 1], [size * 0.4, size * 1.6])} fill="none" stroke={color} strokeWidth={2} opacity={interpolate(ping, [0, 1], [0.5, 0])} />
      )}
      <path
        d={`M0 ${size * 0.5} C ${-size * 0.62} ${-size * 0.15}, ${-size * 0.55} ${-size * 0.75}, 0 ${-size * 0.75} C ${size * 0.55} ${-size * 0.75}, ${size * 0.62} ${-size * 0.15}, 0 ${size * 0.5} Z`}
        fill={color === C.gray ? "none" : color}
        stroke={color}
        strokeWidth={color === C.gray ? 2.4 : 0}
      />
      <circle cx={0} cy={-size * 0.34} r={size * 0.2} fill={color === C.gray ? C.gray : C.navy} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Glowing cyan route drawn along waypoints via strokeDasharray. `draw` 0..1.
// Optional dashed/dead variant. This is the persistent discovery route look.
// ---------------------------------------------------------------------------
export const Route: React.FC<{
  points: Pt[];
  draw: number;
  color?: string;
  core?: number;
  glow?: number;
  dead?: boolean;
  radius?: number;
  opacity?: number;
}> = ({ points, draw, color = C.cyan, core = 6, glow = 22, dead = false, radius = 26, opacity = 1 }) => {
  if (points.length < 2 || draw <= 0) return null;
  const d = smoothPath(points, radius);
  if (dead) {
    return (
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 14" pathLength={1} strokeDashoffset={0} opacity={opacity * 0.9} style={{ strokeDasharray: `${0.008} ${0.02}` }} />
    );
  }
  const dash = `${draw} ${1 - draw + 0.0001}`;
  const common = { d, fill: "none" as const, pathLength: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: dash };
  return (
    <g opacity={opacity} style={{ mixBlendMode: "screen" }}>
      <path {...common} stroke={color} strokeWidth={glow} opacity={0.16} style={{ filter: `blur(${glow * 0.4}px)` }} />
      <path {...common} stroke={color} strokeWidth={glow * 0.5} opacity={0.28} style={{ filter: `blur(${glow * 0.18}px)` }} />
      <path {...common} stroke={color} strokeWidth={core} opacity={0.95} />
      <path {...common} stroke={C.cyanHi} strokeWidth={core * 0.42} opacity={0.9} />
    </g>
  );
};

/** A luminous packet travelling along the route, with bloom + streak. */
export const Packet: React.FC<{ points: Pt[]; t: number; size?: number; maxDraw?: number; color?: string; opacity?: number }> = ({
  points,
  t,
  size = 10,
  maxDraw = 1,
  color = C.cyan,
  opacity = 1,
}) => {
  if (points.length < 2 || t < 0 || t > maxDraw) return null;
  const p = pointAtLength(points, t);
  const dots = [];
  for (let i = 12; i >= 1; i--) {
    const tt = t - i * 0.012;
    if (tt < 0 || tt > maxDraw) continue;
    const g = pointAtLength(points, tt);
    const f = 1 - i / 13;
    dots.push(<circle key={i} cx={g.x} cy={g.y} r={size * (0.16 + f * 0.7)} fill={color} opacity={(0.02 + f * 0.16) * opacity} style={{ filter: `blur(${(1 - f) * 2 + 0.5}px)` }} />);
  }
  return (
    <g style={{ mixBlendMode: "screen" }} opacity={opacity}>
      {dots}
      <circle cx={p.x} cy={p.y} r={size * 3.4} fill={color} opacity={0.16} style={{ filter: "blur(8px)" }} />
      <circle cx={p.x} cy={p.y} r={size * 1.7} fill={color} opacity={0.3} style={{ filter: "blur(3px)" }} />
      <circle cx={p.x} cy={p.y} r={size * 0.9} fill={C.white} opacity={0.98} />
      <circle cx={p.x} cy={p.y} r={size * 0.45} fill={color} />
    </g>
  );
};

/** Directional chevron/arrow travelling up a path (used on the highway). */
export const RouteArrow: React.FC<{ points: Pt[]; t: number; size?: number; color?: string; opacity?: number }> = ({
  points,
  t,
  size = 13,
  color = C.cyanHi,
  opacity = 1,
}) => {
  if (points.length < 2 || t < 0 || t > 1) return null;
  const p = pointAtLength(points, t);
  const p2 = pointAtLength(points, clamp(t + 0.02, 0, 1));
  const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${ang})`} opacity={opacity}>
      <path d={`M ${-size} ${-size * 0.72} L ${size * 0.62} 0 L ${-size} ${size * 0.72}`} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Editorial gold divider (line + optional end dots), reveal-aware.
// ---------------------------------------------------------------------------
export const Divider: React.FC<{ x: number; y: number; w: number; reveal?: number; dots?: boolean; color?: string; thick?: number }> = ({
  x,
  y,
  w,
  reveal = 1,
  dots = false,
  color = C.gold,
  thick = 3,
}) => {
  const ww = w * clamp(reveal);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: ww, height: thick, background: color, borderRadius: 2 }} />
      {dots && reveal > 0.9 && <div style={{ width: 6, height: 6, borderRadius: 3, background: color }} />}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Circular line icon set (search, pin, reviews, www, people, trend, target,
// bars, clock, phone, lock, check, x, person).
// ---------------------------------------------------------------------------
type IconKind =
  | "search"
  | "pin"
  | "reviews"
  | "www"
  | "people"
  | "trend"
  | "target"
  | "bars"
  | "clock"
  | "phone"
  | "lock"
  | "check"
  | "x"
  | "person"
  | "warning";

const GLYPH: Record<IconKind, React.ReactNode> = {
  search: (
    <>
      <circle cx={-2} cy={-2} r={7} />
      <line x1={3} y1={3} x2={9} y2={9} />
    </>
  ),
  pin: (
    <>
      <path d="M0 9 C -6 1, -5 -8, 0 -8 C 5 -8, 6 1, 0 9 Z" />
      <circle cx={0} cy={-2} r={2.4} />
    </>
  ),
  reviews: (
    <>
      <path d="M-9 -7 H9 V4 H0 L-4 9 V4 H-9 Z" />
      <path d="M0 -4 l1.3 2.7 3 .3 -2.2 2 .7 3 -2.8 -1.6 -2.8 1.6 .7 -3 -2.2 -2 3 -.3 Z" />
    </>
  ),
  www: (
    <>
      <rect x={-9} y={-7} width={18} height={14} rx={2} />
      <line x1={-9} y1={-2} x2={9} y2={-2} />
      <text x={0} y={4.5} textAnchor="middle" fontSize={5.4} fontFamily="'IBM Plex Sans'" fill="currentColor" stroke="none">
        www
      </text>
    </>
  ),
  people: (
    <>
      <circle cx={-4} cy={-3} r={3.2} />
      <circle cx={5} cy={-3} r={2.6} />
      <path d="M-9 8 C -9 2, 1 2, 1 8" />
      <path d="M2 8 C 2 3, 10 3, 10 8" />
    </>
  ),
  trend: (
    <>
      <path d="M-8 6 L -2 -1 L 2 3 L 8 -5" />
      <path d="M4 -5 H8 V-1" />
    </>
  ),
  target: (
    <>
      <circle cx={0} cy={0} r={8} />
      <circle cx={0} cy={0} r={3.6} />
      <line x1={0} y1={-11} x2={0} y2={-6} />
      <line x1={0} y1={11} x2={0} y2={6} />
      <line x1={-11} y1={0} x2={-6} y2={0} />
      <line x1={11} y1={0} x2={6} y2={0} />
    </>
  ),
  bars: (
    <>
      <line x1={-6} y1={7} x2={-6} y2={1} />
      <line x1={0} y1={7} x2={0} y2={-3} />
      <line x1={6} y1={7} x2={6} y2={-6} />
    </>
  ),
  clock: (
    <>
      <circle cx={0} cy={0} r={8} />
      <path d="M0 -4 V0 L3 3" />
    </>
  ),
  phone: (
    <>
      <path d="M-6 -8 C -8 -2, 2 8, 8 6 L 5 2 L 1 3 C -2 1, -3 -1, -2 -4 L -3 -8 Z" />
    </>
  ),
  lock: (
    <>
      <rect x={-6} y={-1} width={12} height={9} rx={1.6} />
      <path d="M-3 -1 V-4 A3 3 0 0 1 3 -4 V-1" />
    </>
  ),
  check: (
    <>
      <path d="M-6 0 L -2 5 L 7 -6" />
    </>
  ),
  x: (
    <>
      <line x1={-5} y1={-5} x2={5} y2={5} />
      <line x1={5} y1={-5} x2={-5} y2={5} />
    </>
  ),
  person: (
    <>
      <circle cx={0} cy={-4} r={3.4} />
      <path d="M-7 8 C -7 1, 7 1, 7 8" />
    </>
  ),
  warning: (
    <>
      <path d="M0 -8 L9 8 H-9 Z" />
      <line x1={0} y1={-2} x2={0} y2={3} />
      <circle cx={0} cy={6} r={0.6} />
    </>
  ),
};

export const CircleIcon: React.FC<{
  x: number;
  y: number;
  kind: IconKind;
  r?: number;
  color?: string;
  ring?: boolean;
  reveal?: number;
  fill?: boolean;
}> = ({ x, y, kind, r = 30, color = C.cyan, ring = true, reveal = 1, fill = false }) => {
  const s = 0.86 + 0.14 * clamp(reveal);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp(reveal * 1.3)} style={{ transformOrigin: "center", transformBox: "fill-box" }}>
      {ring && <circle cx={0} cy={0} r={r} fill={fill ? color : "none"} stroke={color} strokeWidth={2.2} opacity={fill ? 0.14 : 1} />}
      {ring && fill && <circle cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth={2.2} />}
      <g stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" color={color} transform={`scale(${r / 30})`}>
        {GLYPH[kind]}
      </g>
    </g>
  );
};

/** Broken-connection X marker in a circle (used for failed routes). */
export const BrokenX: React.FC<{ x: number; y: number; r?: number; reveal?: number; color?: string }> = ({ x, y, r = 22, reveal = 1, color = C.gray }) => (
  <g transform={`translate(${x} ${y})`} opacity={clamp(reveal * 1.2)}>
    <circle cx={0} cy={0} r={r} fill={C.navy} stroke={color} strokeWidth={2.4} />
    <line x1={-r * 0.4} y1={-r * 0.4} x2={r * 0.4} y2={r * 0.4} stroke={color} strokeWidth={2.6} strokeLinecap="round" />
    <line x1={r * 0.4} y1={-r * 0.4} x2={-r * 0.4} y2={r * 0.4} stroke={color} strokeWidth={2.6} strokeLinecap="round" />
  </g>
);
