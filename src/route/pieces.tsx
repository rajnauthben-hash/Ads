import React from "react";
import { interpolate } from "remotion";
import { RC, RF, RE } from "./theme";
import { Pt, smoothPath, pointAtLength } from "../utils/routeGeometry";

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export function ip(f: number, a: number, b: number, from: number, to: number, easing = RE.in) {
  return interpolate(f, [a, b], [from, to], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
export function kf(f: number, frames: number[], vals: number[], easing = RE.move) {
  return interpolate(f, frames, vals, { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
function lerpHex(a: string, b: string, t: number) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(t)));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

// ---------------------------------------------------------------------------
// Background: charcoal ground + topographic contour rings + faint iso grid.
// One persistent field with a slow parallax drift.
// ---------------------------------------------------------------------------
export const BackgroundTexture: React.FC<{ driftX?: number; driftY?: number }> = ({ driftX = 0, driftY = 0 }) => {
  const rings = [];
  for (let i = 0; i < 9; i++) rings.push(<ellipse key={i} cx={900} cy={330} rx={120 + i * 130} ry={90 + i * 96} fill="none" stroke={RC.line} strokeWidth={1.2} opacity={0.35 - i * 0.03} />);
  const rings2 = [];
  for (let i = 0; i < 8; i++) rings2.push(<ellipse key={i} cx={140} cy={1650} rx={110 + i * 120} ry={80 + i * 88} fill="none" stroke={RC.line} strokeWidth={1.2} opacity={0.3 - i * 0.03} />);
  // faint isometric diamond grid across the lower map
  const iso = [];
  const TW = 108, TH = 54;
  for (let r = -2; r < 16; r++) {
    for (let c = -3; c < 12; c++) {
      const cx = c * TW + (r % 2) * (TW / 2) + 60;
      const cy = 760 + r * TH;
      iso.push(<path key={`${r}-${c}`} d={`M${cx} ${cy - TH / 2} L${cx + TW / 2} ${cy} L${cx} ${cy + TH / 2} L${cx - TW / 2} ${cy} Z`} fill="none" stroke={RC.line} strokeWidth={0.8} opacity={0.16} />);
    }
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(130% 90% at 62% 26%, ${RC.char} 0%, ${RC.black} 72%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${driftX} ${driftY})`}>
          <g opacity={0.8}>{rings}</g>
          <g opacity={0.7}>{rings2}</g>
          <g>{iso}</g>
        </g>
        <radialGradient id="rt-vig" cx="50%" cy="42%" r="75%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#rt-vig)" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Brand lockup — ring "O" mark + OMNIFLOW DIGITAL.
// ---------------------------------------------------------------------------
export const Brand: React.FC<{ x?: number; y: number; size?: number; mark?: boolean; underline?: boolean; reveal?: number }> = ({ x = 64, y, size = 26, mark = true, underline = false, reveal = 1 }) => {
  const op = clamp(reveal);
  const ty = (1 - op) * -8;
  const common: React.CSSProperties = { fontFamily: RF.ui, fontWeight: 600, fontSize: size, letterSpacing: size * 0.16, textTransform: "uppercase" };
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: op, transform: `translateY(${ty}px)` }}>
      {mark && (
        <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 40 40" fill="none">
          <circle cx={20} cy={20} r={16} stroke={RC.gold} strokeWidth={2} opacity={0.5} />
          <path d="M20 4 a16 16 0 0 1 0 32" stroke={RC.gold} strokeWidth={2.4} strokeLinecap="round" />
          <ellipse cx={20} cy={20} rx={16} ry={6} stroke={RC.gold} strokeWidth={1.4} opacity={0.7} />
        </svg>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <span style={{ ...common, color: RC.white }}>OMNIFLOW </span>
          <span style={{ ...common, color: RC.gold }}>DIGITAL</span>
        </div>
        {underline && <div style={{ height: 2, width: size * 3.2, background: RC.gold, marginTop: 8, opacity: 0.9 }} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Glowing cyan customer route + chevrons. Optional dashed grey (failed path).
// ---------------------------------------------------------------------------
export const RoutePath: React.FC<{ points: Pt[]; draw: number; color?: string; core?: number; radius?: number; dashed?: boolean; opacity?: number; chevrons?: number }> = ({ points, draw, color = RC.cyan, core = 6, radius = 26, dashed = false, opacity = 1, chevrons = 0 }) => {
  if (points.length < 2 || draw <= 0) return null;
  const d = smoothPath(points, radius);
  if (dashed) {
    return <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 16" pathLength={1} strokeDashoffset={0} opacity={opacity * 0.9} style={{ strokeDasharray: `${0.006} ${0.02}` }} />;
  }
  const dash = `${draw} ${1 - draw + 0.0001}`;
  const common = { d, fill: "none" as const, pathLength: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: dash };
  const chev = [];
  for (let i = 0; i < chevrons; i++) {
    const t = (i + 0.5) / chevrons;
    if (t > draw) continue;
    const p = pointAtLength(points, t);
    const p2 = pointAtLength(points, clamp(t + 0.02, 0, 1));
    const ang = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    chev.push(
      <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${ang})`} opacity={0.95}>
        <path d="M-9 -8 L1 0 L-9 8 M-2 -8 L8 0 L-2 8" fill="none" stroke={RC.cyanHi} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>,
    );
  }
  return (
    <g opacity={opacity} style={{ mixBlendMode: "screen" }}>
      <path {...common} stroke={color} strokeWidth={core * 3.6} opacity={0.14} style={{ filter: `blur(${core * 1.4}px)` }} />
      <path {...common} stroke={color} strokeWidth={core * 1.8} opacity={0.24} style={{ filter: `blur(${core * 0.5}px)` }} />
      <path {...common} stroke={color} strokeWidth={core} opacity={0.98} />
      <path {...common} stroke={RC.cyanHi} strokeWidth={core * 0.38} opacity={0.9} />
      {chev}
    </g>
  );
};

/** Bright arrowhead at the end of a drawn route. */
export const RouteHead: React.FC<{ points: Pt[]; draw: number; size?: number; color?: string }> = ({ points, draw, size = 16, color = RC.cyanHi }) => {
  if (points.length < 2) return null;
  const t = clamp(draw) * 0.999;
  const p = pointAtLength(points, t);
  const p2 = pointAtLength(points, clamp(t - 0.03, 0, 1));
  const ang = (Math.atan2(p.y - p2.y, p.x - p2.x) * 180) / Math.PI;
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${ang})`} style={{ mixBlendMode: "screen" }}>
      <circle cx={0} cy={0} r={size * 1.5} fill={color} opacity={0.2} style={{ filter: "blur(6px)" }} />
      <path d={`M ${-size} ${-size * 0.8} L ${size * 0.5} 0 L ${-size} ${size * 0.8} Z`} fill={color} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Customer marker — cyan node with person glyph + ripple + label.
// ---------------------------------------------------------------------------
export const CustomerMarker: React.FC<{ x: number; y: number; f: number; reveal?: number; label?: boolean }> = ({ x, y, f, reveal = 1, label = true }) => {
  const op = clamp(reveal * 1.2);
  const rip = 30 + ((f % 60) / 60) * 26;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: "translate(-50%,-50%)" }}>
      <svg width={160} height={160} viewBox="-80 -80 160 160" style={{ overflow: "visible" }}>
        <circle cx={0} cy={0} r={rip} fill="none" stroke={RC.cyan} strokeWidth={2} opacity={interpolate(rip, [30, 56], [0.5, 0])} />
        <circle cx={0} cy={0} r={26} fill="rgba(40,171,242,0.16)" stroke={RC.cyan} strokeWidth={2.6} style={{ filter: "drop-shadow(0 0 10px rgba(40,171,242,0.6))" }} />
        <g stroke={RC.cyanHi} strokeWidth={2.4} fill="none" strokeLinecap="round">
          <circle cx={0} cy={-6} r={6} />
          <path d="M-11 12 C -11 0, 11 0, 11 12" />
        </g>
      </svg>
      {label && <div style={{ position: "absolute", left: "50%", top: 44, transform: "translateX(-50%)", fontFamily: RF.ui, fontWeight: 600, fontSize: 20, letterSpacing: 2, color: RC.cyanHi, whiteSpace: "nowrap" }}>CUSTOMER</div>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Business / competitor destination card — building glyph + label + pin.
// `act` 0 (grey, bypassed) .. 1 (gold, chosen). Persistent object.
// ---------------------------------------------------------------------------
export const BizCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  act?: number;
  label: string[];
  sub?: string;
  pin?: boolean;
  dashed?: boolean;
  reveal?: number;
  scale?: number;
}> = ({ x, y, w = 210, h = 150, act = 1, label, sub, pin = true, dashed = false, reveal = 1, scale = 1 }) => {
  const a = clamp(act);
  const stroke = lerpHex(RC.gray, RC.gold, a);
  const text = lerpHex(RC.gray, RC.white, a);
  const glow = a > 0.5 ? `drop-shadow(0 0 ${16 * a}px rgba(231,169,58,0.4))` : "none";
  const op = clamp(reveal * 1.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `translate(-50%,-50%) scale(${scale})`, filter: glow }}>
      {pin && (
        <svg width={44} height={52} viewBox="0 0 44 52" style={{ position: "absolute", left: "50%", top: -46, transform: "translateX(-50%)", overflow: "visible" }}>
          <path d="M22 50 C 6 28, 8 6, 22 6 C 36 6, 38 28, 22 50 Z" fill={a < 0.5 ? "none" : RC.gold} stroke={stroke} strokeWidth={a < 0.5 ? 2.4 : 0} />
          <circle cx={22} cy={20} r={6.5} fill={a < 0.5 ? stroke : RC.char} />
        </svg>
      )}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <rect x={2} y={2} width={w - 4} height={h - 4} rx={12} fill="rgba(8,12,18,0.72)" stroke={stroke} strokeWidth={2.4} strokeDasharray={dashed ? "7 8" : undefined} />
        {/* building glyph */}
        <g transform={`translate(${w / 2 - 22} 22)`} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round">
          <rect x={0} y={8} width={26} height={30} />
          <rect x={26} y={0} width={18} height={38} />
          {[6, 14, 22].map((yy) => [4, 14].map((xx) => <rect key={`${xx}-${yy}`} x={xx} y={yy} width={4} height={4} fill={stroke} stroke="none" />))}
          {[8, 18, 28].map((yy) => <rect key={yy} x={31} y={yy} width={8} height={4} fill={stroke} stroke="none" />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 20, top: h - 62, width: w - 40 }}>
        <div style={{ fontFamily: RF.head, fontWeight: 800, fontSize: 24, lineHeight: 1.0, color: text, letterSpacing: 0.3 }}>
          {label.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        {sub && (
          <>
            <div style={{ height: 1, background: stroke, opacity: 0.6, margin: "6px 0" }} />
            <div style={{ fontFamily: RF.ui, fontWeight: 500, fontSize: 15, letterSpacing: 1.5, color: lerpHex(RC.gray, RC.goldHi, a) }}>{sub}</div>
          </>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Circle step icon (search / scales / check / click / call / pin), cyan or gold.
// ---------------------------------------------------------------------------
type IK = "search" | "scales" | "check" | "click" | "call" | "pin";
const GL: Record<IK, React.ReactNode> = {
  search: (<><circle cx={-3} cy={-3} r={8} /><line x1={3} y1={3} x2={10} y2={10} /></>),
  scales: (<><line x1={0} y1={-11} x2={0} y2={9} /><line x1={-11} y1={-7} x2={11} y2={-7} /><path d="M-11 -7 L-16 3 L-6 3 Z" /><path d="M11 -7 L6 3 L16 3 Z" /><line x1={-6} y1={9} x2={6} y2={9} /></>),
  check: (<path d="M-7 0 L-2 6 L8 -7" />),
  click: (<><path d="M-2 -9 L-2 7 L2 3 L5 9 L8 7 L5 2 L10 2 Z" /></>),
  call: (<path d="M-8 -9 C -10 -2, 3 10, 10 8 L 7 3 L 1 4 C -2 2, -4 -1, -3 -5 L -4 -9 Z" />),
  pin: (<><path d="M0 10 C -8 0, -7 -10, 0 -10 C 7 -10, 8 0, 0 10 Z" /><circle cx={0} cy={-3} r={3} /></>),
};
export const StepIcon: React.FC<{ x: number; y: number; kind: IK; r?: number; color?: string; reveal?: number; cross?: boolean }> = ({ x, y, kind, r = 40, color = RC.cyan, reveal = 1, cross = false }) => {
  const s = 0.85 + 0.15 * clamp(reveal);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp(reveal * 1.3)} style={{ transformOrigin: "center", transformBox: "fill-box" }}>
      <circle cx={0} cy={0} r={r} fill="rgba(8,12,18,0.5)" stroke={color} strokeWidth={2.4} style={{ filter: `drop-shadow(0 0 8px ${color === RC.cyan ? "rgba(40,171,242,0.4)" : "rgba(231,169,58,0.35)"})` }} />
      <g stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${r / 40})`}>
        {GL[kind]}
      </g>
      {cross && <g transform={`translate(${r * 0.7} ${-r * 0.7})`}><line x1={-7} y1={-7} x2={7} y2={7} stroke={RC.gold} strokeWidth={3} strokeLinecap="round" /><line x1={7} y1={-7} x2={-7} y2={7} stroke={RC.gold} strokeWidth={3} strokeLinecap="round" /></g>}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Condensed editorial headline (caps) with directional reveal + gold accents.
// ---------------------------------------------------------------------------
export interface Part { t: string; c?: string }
export const Headline: React.FC<{ x: number; y: number; size: number; lines: Part[][]; weight?: number; condense?: number; lh?: number; p?: number; ex?: number; dir?: { x: number; y: number }; exDir?: { x: number; y: number } }> = ({ x, y, size, lines, weight = 800, condense = 0.9, lh = 0.94, p = 1, ex = 0, dir = { x: 0, y: 20 }, exDir = { x: -30, y: -50 } }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(${ex * exDir.x}px, ${ex * exDir.y}px)`, opacity: 1 - clamp(ex * 1.1) }}>
    {lines.map((parts, i) => {
      const lp = clamp((p - i * 0.08) / 0.5);
      return (
        <div key={i} style={{ fontFamily: RF.head, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: "-0.01em", textTransform: "uppercase", whiteSpace: "nowrap", transform: `translateX(${(1 - lp) * dir.x}px) translateY(${(1 - lp) * dir.y}px) scaleX(${condense})`, transformOrigin: "left top", clipPath: `inset(0 0 ${(1 - lp) * 100}% 0)`, filter: lp < 1 ? `blur(${(1 - lp) * 6}px)` : undefined, opacity: clamp(lp * 1.4) }}>
          {parts.map((pt, j) => <span key={j} style={{ color: pt.c ?? RC.cream }}>{pt.t}</span>)}
        </div>
      );
    })}
  </div>
);

export const Copy: React.FC<{ x: number; y: number; size: number; lines: (string | Part[])[]; color?: string; weight?: number; lh?: number; p?: number; ex?: number; width?: number }> = ({ x, y, size, lines, color = RC.muted, weight: fontWeight = 400, lh = 1.32, p = 1, ex = 0, width }) => (
  <div style={{ position: "absolute", left: x, top: y, width, opacity: (1 - clamp(ex * 1.15)) * clamp(p * 1.3), transform: `translate(${ex * -24}px, ${(1 - clamp(p)) * 14 + ex * -20}px)` }}>
    {lines.map((ln, i) => (
      <div key={i} style={{ fontFamily: RF.body, fontWeight, fontSize: size, lineHeight: lh, color }}>
        {typeof ln === "string" ? ln : ln.map((pt, j) => <span key={j} style={{ color: pt.c ?? color, fontWeight: pt.c ? 600 : fontWeight }}>{pt.t}</span>)}
      </div>
    ))}
  </div>
);

export const Divider: React.FC<{ x: number; y: number; w: number; reveal?: number; color?: string }> = ({ x, y, w, reveal = 1, color = RC.gold }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w * clamp(reveal), height: 3, background: color, borderRadius: 2 }} />
);
