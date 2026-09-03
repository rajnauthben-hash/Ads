import React from "react";
import { interpolate } from "remotion";
import { C, FONT, EASE } from "./theme";
import { Pt, smoothPath, pointAtLength } from "../utils/routeGeometry";

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export function ip(f: number, a: number, b: number, from: number, to: number, e = EASE.in) {
  return interpolate(f, [a, b], [from, to], { easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
export function kf(f: number, fr: number[], v: number[], e = EASE.cam) {
  return interpolate(f, fr, v, { easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ---------------------------------------------------------------------------
// Blueprint background — fine grid, plus-marks, corner ticks, vignette.
// ---------------------------------------------------------------------------
export const BlueprintBg: React.FC<{ driftX?: number; driftY?: number }> = ({ driftX = 0, driftY = 0 }) => {
  const v = [], h = [], pl = [];
  for (let i = 0; i <= 18; i++) v.push(<line key={`v${i}`} x1={i * 60} y1={-40} x2={i * 60} y2={1960} stroke={C.line} strokeWidth={i % 3 === 0 ? 1 : 0.6} />);
  for (let i = 0; i <= 32; i++) h.push(<line key={`h${i}`} x1={-40} y1={i * 60} x2={1120} y2={i * 60} stroke={C.line} strokeWidth={i % 3 === 0 ? 1 : 0.6} />);
  for (let gx = 1; gx < 6; gx++) for (let gy = 1; gy < 11; gy++) { const x = gx * 180, y = gy * 180; pl.push(<g key={`${gx}-${gy}`} stroke={C.line} strokeWidth={1}><line x1={x - 6} y1={y} x2={x + 6} y2={y} /><line x1={x} y1={y - 6} x2={x} y2={y + 6} /></g>); }
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(135% 100% at 50% 30%, ${C.panel} 0%, ${C.bg} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${driftX} ${driftY})`} opacity={0.7}>{v}{h}</g>
        <g transform={`translate(${driftX} ${driftY})`} opacity={0.5}>{pl}</g>
        <radialGradient id="ad62vig" cx="50%" cy="40%" r="75%"><stop offset="52%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.55)" /></radialGradient>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#ad62vig)" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Cyan signal rope — the continuous device. Glowing SVG path, draw 0..1.
// ---------------------------------------------------------------------------
export const SignalRope: React.FC<{ points: Pt[]; draw?: number; color?: string; core?: number; radius?: number; dashed?: boolean; opacity?: number; glowPulse?: number }> = ({ points, draw = 1, color = C.cyan, core = 5, radius = 24, dashed = false, opacity = 1, glowPulse }) => {
  if (points.length < 2 || draw <= 0) return null;
  const d = smoothPath(points, radius);
  if (dashed) return <path d={d} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.008} ${0.02}`} strokeDashoffset={0} opacity={opacity * 0.85} />;
  const dash = `${draw} ${1 - draw + 0.0001}`;
  const cm = { d, fill: "none" as const, pathLength: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: dash };
  const g = glowPulse ?? 1;
  return (
    <g opacity={opacity} style={{ mixBlendMode: "screen" }}>
      <path {...cm} stroke={color} strokeWidth={core * 4} opacity={0.12 * g} style={{ filter: `blur(${core * 1.6}px)` }} />
      <path {...cm} stroke={color} strokeWidth={core} opacity={0.95} />
      <path {...cm} stroke="#D6FCFF" strokeWidth={core * 0.38} opacity={0.9} />
    </g>
  );
};
export const RopePulse: React.FC<{ points: Pt[]; t: number; maxDraw?: number; size?: number; color?: string }> = ({ points, t, maxDraw = 1, size = 7, color = C.cyan }) => {
  if (points.length < 2 || t < 0 || t > maxDraw) return null;
  const p = pointAtLength(points, t);
  return <g style={{ mixBlendMode: "screen" }}><circle cx={p.x} cy={p.y} r={size * 3} fill={color} opacity={0.22} style={{ filter: "blur(5px)" }} /><circle cx={p.x} cy={p.y} r={size} fill="#EAFEFF" /></g>;
};

// ---------------------------------------------------------------------------
// Gold apex podium — 1 (tall centre), 2 (left), 3 (right).
// ---------------------------------------------------------------------------
export const ApexPodium: React.FC<{ cx: number; cy: number; scale?: number; reveal?: number; laurel?: boolean; triangle?: boolean }> = ({ cx, cy, scale = 1, reveal = 1, laurel = false, triangle = false }) => {
  const a = clamp(reveal);
  const blk = (dx: number, w: number, h: number, n: number, delay: number) => {
    const rv = clamp((a - delay) / (1 - delay));
    return (
      <g transform={`translate(${dx} ${-h * rv})`} opacity={rv}>
        <rect x={-w / 2} y={0} width={w} height={h} rx={4} fill="url(#ad62gold)" stroke={C.goldHi} strokeWidth={1.5} />
        <text x={0} y={h * 0.6} textAnchor="middle" fontFamily={FONT.head} fontWeight={800} fontSize={w * 0.5} fill="#3A2C0C">{n}</text>
      </g>
    );
  };
  return (
    <svg width={520} height={420} viewBox="-260 -280 520 420" style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${scale})`, overflow: "visible" }}>
      <defs><linearGradient id="ad62gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.goldHi} /><stop offset="100%" stopColor={C.gold} /></linearGradient></defs>
      {triangle && <path d={`M0 -260 L210 120 L-210 120 Z`} fill="none" stroke={C.goldLine} strokeWidth={2} opacity={a} style={{ filter: "drop-shadow(0 0 10px rgba(214,168,74,0.4))" }} />}
      <g style={{ filter: `drop-shadow(0 0 ${20 * a}px rgba(214,168,74,0.35))` }}>
        {blk(-130, 120, 130, 2, 0.15)}
        {blk(130, 120, 100, 3, 0.3)}
        {blk(0, 130, 200, 1, 0)}
      </g>
      {laurel && a > 0.5 && (
        <g stroke={C.goldHi} strokeWidth={3} fill="none" opacity={clamp((a - 0.5) * 2)}>
          <path d="M-44 -212 C -60 -190, -60 -160, -40 -150 M-44 -196 c -14 4 -18 20 -12 30" />
          <path d="M44 -212 C 60 -190, 60 -160, 40 -150 M44 -196 c 14 4 18 20 12 30" />
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Velvet-rope barrier — two gold stanchions + sagging rope (scene 1).
// ---------------------------------------------------------------------------
export const VelvetRope: React.FC<{ x1: number; x2: number; y: number; sag?: number; reveal?: number }> = ({ x1, x2, y, sag = 70, reveal = 1 }) => {
  const a = clamp(reveal);
  const mx = (x1 + x2) / 2;
  const rd = `M${x1} ${y} Q ${mx} ${y + sag} ${x2} ${y}`;
  const post = (x: number) => (
    <g stroke={C.gold} strokeWidth={4} fill="url(#ad62gold2)">
      <circle cx={x} cy={y - 18} r={11} />
      <rect x={x - 5} y={y - 8} width={10} height={130} rx={4} />
      <ellipse cx={x} cy={y + 128} rx={26} ry={9} fill="none" stroke={C.gold} strokeWidth={3} />
    </g>
  );
  return (
    <svg width={1080} height={400} viewBox="0 0 1080 400" style={{ position: "absolute", left: 0, top: y - 40, overflow: "visible", opacity: a }}>
      <defs><linearGradient id="ad62gold2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.goldHi} /><stop offset="100%" stopColor={C.gold} /></linearGradient></defs>
      <g transform={`translate(0 ${-(y - 40)})`}>
        <path d={rd} fill="none" stroke="url(#ad62gold2)" strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(214,168,74,0.4))" }} pathLength={1} strokeDasharray={`${a} ${1 - a + 0.001}`} />
        {post(x1)}{post(x2)}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Signal gate — blueprint arch enclosing the gold apex + keyhole lock.
// locked (0..1 how locked), open (0..1 how open). Scenes 5 & 6.
// ---------------------------------------------------------------------------
export const SignalGate: React.FC<{ cx: number; cy: number; scale?: number; reveal?: number; open?: number; coral?: number }> = ({ cx, cy, scale = 1, reveal = 1, open = 0, coral = 0 }) => {
  const a = clamp(reveal);
  const op = clamp(open);
  const lockCol = coral > 0.3 ? C.coral : C.cyan;
  return (
    <svg width={520} height={620} viewBox="-260 -360 520 620" style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${scale})`, overflow: "visible", opacity: a }}>
      <defs><linearGradient id="ad62gold3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.goldHi} /><stop offset="100%" stopColor={C.gold} /></linearGradient></defs>
      {/* gold stepped apex inside the arch */}
      <g opacity={0.9} style={{ filter: "drop-shadow(0 0 16px rgba(214,168,74,0.45))" }}>
        <path d="M-150 40 L-150 -40 L-70 -40 L-70 -120 L0 -200 L70 -120 L70 -40 L150 -40 L150 40 Z" fill="url(#ad62gold3)" opacity={0.16} stroke={C.gold} strokeWidth={2} />
        <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.head} fontWeight={800} fontSize={44} fill={C.goldHi}>1</text>
        <text x={-108} y={10} textAnchor="middle" fontFamily={FONT.head} fontWeight={800} fontSize={34} fill={C.gold}>2</text>
        <text x={108} y={10} textAnchor="middle" fontFamily={FONT.head} fontWeight={800} fontSize={34} fill={C.gold}>3</text>
      </g>
      {/* blueprint arch */}
      <path d="M-200 60 L-200 -140 A200 200 0 0 1 200 -140 L200 60" fill="none" stroke={C.cyan} strokeWidth={4} opacity={0.9} style={{ filter: "drop-shadow(0 0 8px rgba(34,217,242,0.4))" }} />
      <path d="M-176 60 L-176 -140 A176 176 0 0 1 176 -140 L176 60" fill="none" stroke={C.cyan} strokeWidth={1.6} opacity={0.4} />
      {/* door leaves (swing open with `open`) */}
      <g transform={`translate(-2 0)`}>
        <g transform={`rotate(${-op * 55} -176 60)`} opacity={0.85}><rect x={-176} y={-120} width={172} height={180} fill="rgba(12,24,32,0.6)" stroke={C.cyan} strokeWidth={2} /><line x1={-90} y1={-120} x2={-90} y2={60} stroke={C.cyan} strokeWidth={1} opacity={0.4} /></g>
        <g transform={`rotate(${op * 55} 176 60)`} opacity={0.85}><rect x={4} y={-120} width={172} height={180} fill="rgba(12,24,32,0.6)" stroke={C.cyan} strokeWidth={2} /><line x1={90} y1={-120} x2={90} y2={60} stroke={C.cyan} strokeWidth={1} opacity={0.4} /></g>
      </g>
      {/* central lock / unlock */}
      <g transform="translate(0 80)" style={{ filter: `drop-shadow(0 0 10px ${lockCol === C.coral ? "rgba(255,106,95,0.5)" : "rgba(34,217,242,0.5)"})` }}>
        <path d={op > 0.5 ? "M-18 0 h36 v34 h-36 z M-12 0 v-10 a12 12 0 0 1 24 0" : "M-18 0 h36 v34 h-36 z M-12 0 v-12 a12 12 0 0 1 24 0 v12"} fill="rgba(7,16,22,0.9)" stroke={lockCol} strokeWidth={2.6} strokeLinecap="round" />
        <circle cx={0} cy={16} r={4} fill={lockCol} />
      </g>
    </svg>
  );
};
export const LockChip: React.FC<{ x: number; y: number; label: string; locked?: number; coral?: number; reveal?: number }> = ({ x, y, label, locked = 1, coral = 0, reveal = 1 }) => {
  const col = coral > 0.3 && locked > 0.5 ? C.coral : locked > 0.5 ? C.cyan : C.gold;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: clamp(reveal * 1.3) }}>
      <svg width={40} height={44} viewBox="-20 -22 40 44" style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
        <path d="M-13 -2 h26 v18 h-26 z M-8 -2 v-6 a8 8 0 0 1 16 0 v6" fill="rgba(7,16,22,0.9)" stroke={col} strokeWidth={2.2} />
      </svg>
      <span style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 17, letterSpacing: 1.5, color: col }}>{label}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Profile / signal-status card, signal chip, step chip, diagnostic panel.
// ---------------------------------------------------------------------------
export const SignalChip: React.FC<{ x: number; y: number; w?: number; label: string; sub?: string[]; n?: string; color?: string; reveal?: number; state?: "pass" | "warn" | "off" }> = ({ x, y, w = 300, label, sub, n, color = C.cyan, reveal = 1, state = "off" }) => {
  const edge = state === "warn" ? C.coral : color;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: clamp(reveal * 1.3), transform: `translateX(${(1 - clamp(reveal)) * -10}px)` }}>
      <div style={{ border: `2px solid ${edge}`, borderRadius: 12, background: "rgba(12,24,32,0.72)", padding: "14px 18px", boxShadow: `0 0 16px ${state === "off" ? "transparent" : "rgba(34,217,242,0.2)"}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {n && <div style={{ width: 30, height: 30, borderRadius: 15, border: `2px solid ${edge}`, color: edge, fontFamily: FONT.head, fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>}
          <span style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, letterSpacing: 1.5, color: C.white }}>{label}</span>
        </div>
        {sub && <div style={{ fontFamily: FONT.body, fontSize: 21, lineHeight: 1.3, color: C.muted, marginTop: 8 }}>{sub.map((s, i) => <div key={i}>{s}</div>)}</div>}
      </div>
    </div>
  );
};
export const StatusRow: React.FC<{ x: number; y: number; w?: number; label: string; value: string; ok?: boolean; reveal?: number }> = ({ x, y, w = 400, label, value, ok = false, reveal = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.line}`, padding: "12px 0", opacity: clamp(reveal * 1.3), transform: `translateX(${(1 - clamp(reveal)) * -8}px)` }}>
    <svg width={26} height={26} viewBox="-13 -13 26 26" stroke={ok ? C.cyan : C.gold} strokeWidth={2.2} fill="none" strokeLinecap="round">
      {ok ? <path d="M-6 0 L-1 5 L7 -6" /> : <><path d="M0 -9 L9 8 H-9 Z" /><line x1={0} y1={-2} x2={0} y2={3} /></>}
    </svg>
    <span style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, letterSpacing: 1, color: C.white, flex: 1 }}>{label}</span>
    <span style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: ok ? C.cyan : C.gold }}>{value}</span>
  </div>
);
export const DiagPanel: React.FC<{ x: number; y: number; w: number; title: string; titleColor?: string; rows: string[]; ok?: boolean; reveal?: number }> = ({ x, y, w, title, titleColor = C.cyan, rows, ok = true, reveal = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, border: `1.5px solid ${ok ? C.line : C.goldLine}`, borderRadius: 14, background: "rgba(12,24,32,0.5)", padding: "22px 24px", opacity: clamp(reveal * 1.3), transform: `translateY(${(1 - clamp(reveal)) * 12}px)` }}>
    <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: 24, letterSpacing: 1.5, color: titleColor, marginBottom: 16 }}>{title}</div>
    {rows.map((r, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
        <svg width={24} height={24} viewBox="-12 -12 24 24" stroke={ok ? C.cyan : C.gold} strokeWidth={2.2} fill="none" strokeLinecap="round">{ok ? <path d="M-6 0 L-1 5 L7 -6" /> : <><path d="M0 -8 L8 7 H-8 Z" /><line x1={0} y1={-2} x2={0} y2={2} /></>}</svg>
        <span style={{ fontFamily: FONT.body, fontSize: 24, color: ok ? C.white : C.muted }}>{r}</span>
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Text + brand atoms.
// ---------------------------------------------------------------------------
export interface Part { t: string; c?: string }
export const Headline: React.FC<{ x: number; y: number; size: number; lines: Part[][]; weight?: number; lh?: number; p?: number; ex?: number; color?: string; caps?: boolean }> = ({ x, y, size, lines, weight = 800, lh = 1.0, p = 1, ex = 0, color = C.white, caps = true }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(${ex * -24}px, ${ex * -36}px)`, opacity: 1 - clamp(ex * 1.1) }}>
    {lines.map((parts, i) => {
      const lp = clamp((p - i * 0.1) / 0.5);
      return (
        <div key={i} style={{ fontFamily: FONT.head, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: "-0.01em", textTransform: caps ? "uppercase" : "none", whiteSpace: "nowrap", clipPath: `inset(0 0 ${(1 - lp) * 100}% 0)`, transform: `translateY(${(1 - lp) * 14}px)`, filter: lp < 1 ? `blur(${(1 - lp) * 4}px)` : undefined, opacity: clamp(lp * 1.4), color }}>
          {parts.map((pt, j) => <span key={j} style={{ color: pt.c ?? color }}>{pt.t}</span>)}
        </div>
      );
    })}
  </div>
);
export const Copy: React.FC<{ x: number; y: number; size: number; lines: (string | Part[])[]; color?: string; weight?: number; lh?: number; p?: number; ex?: number; width?: number }> = ({ x, y, size, lines, color = C.muted, weight = 400, lh = 1.34, p = 1, ex = 0, width }) => (
  <div style={{ position: "absolute", left: x, top: y, width, opacity: (1 - clamp(ex * 1.15)) * clamp(p * 1.3), transform: `translate(${ex * -18}px, ${(1 - clamp(p)) * 12}px)` }}>
    {lines.map((ln, i) => <div key={i} style={{ fontFamily: FONT.body, fontWeight: weight, fontSize: size, lineHeight: lh, color }}>{typeof ln === "string" ? ln : ln.map((pt, j) => <span key={j} style={{ color: pt.c ?? color }}>{pt.t}</span>)}</div>)}
  </div>
);
export const Label: React.FC<{ x: number; y: number; text: string; color?: string; size?: number; p?: number; center?: boolean; w?: number }> = ({ x, y, text, color = C.cyan, size = 21, p = 1, center = false, w }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: center ? "center" : "left", fontFamily: FONT.ui, fontWeight: 600, fontSize: size, letterSpacing: 2.5, color, opacity: clamp(p * 1.3), textTransform: "uppercase" }}>{text}</div>
);
export const Divider: React.FC<{ x: number; y: number; w: number; reveal?: number; color?: string; thick?: number }> = ({ x, y, w, reveal = 1, color = C.cyan, thick = 2 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w * clamp(reveal), height: thick, background: color, opacity: 0.8 }} />
);
export const PayoffBar: React.FC<{ x: number; y: number; w: number; lines: Part[][]; size: number; p?: number; gold?: boolean }> = ({ x, y, w, lines, size, p = 1, gold = true }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, border: `2px solid ${gold ? C.goldLine : C.cyanDim}`, borderRadius: 12, padding: "18px 24px", background: "rgba(7,16,22,0.5)", textAlign: "center", opacity: clamp(p * 1.3), transform: `translateY(${(1 - clamp(p)) * 12}px)` }}>
    {lines.map((parts, i) => <div key={i} style={{ fontFamily: FONT.head, fontWeight: 800, fontSize: size, lineHeight: 1.12, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{parts.map((pt, j) => <span key={j} style={{ color: pt.c ?? C.gold }}>{pt.t}</span>)}</div>)}
  </div>
);
export const BusinessMarker: React.FC<{ x: number; y: number; label?: string; sub?: string; active?: number; reveal?: number; w?: number }> = ({ x, y, label = "YOUR BUSINESS", sub, active = 0, reveal = 1, w = 240 }) => {
  const col = active > 0.5 ? C.gold : C.cyan;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: "translate(-50%,-50%)", opacity: clamp(reveal * 1.3) }}>
      <div style={{ border: `2px solid ${col}`, borderRadius: 12, background: "rgba(12,24,32,0.8)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: `0 0 16px ${active > 0.5 ? "rgba(214,168,74,0.3)" : "rgba(34,217,242,0.2)"}` }}>
        <svg width={30} height={30} viewBox="-15 -15 30 30" stroke={col} strokeWidth={2} fill="none"><path d="M-10 8 V-2 L0 -10 L10 -2 V8 Z" /><rect x={-3} y={2} width={6} height={6} /></svg>
        <div><div style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 20, color: C.white, letterSpacing: 0.5 }}>{label}</div>{sub && <div style={{ fontFamily: FONT.body, fontSize: 16, color: C.muted }}>{sub}</div>}</div>
      </div>
    </div>
  );
};
export const Brand: React.FC<{ y: number; p?: number; center?: boolean; x?: number; size?: number }> = ({ y, p = 1, center = true, x = 90, size = 40 }) => (
  <div style={{ position: "absolute", top: y, left: center ? 0 : x, width: center ? 1080 : undefined, textAlign: center ? "center" : "left", opacity: clamp(p * 1.3) }}>
    <span style={{ fontFamily: FONT.head, fontWeight: 800, fontSize: size, letterSpacing: 4, color: C.white, textTransform: "uppercase" }}>OMNIFLOW </span>
    <span style={{ fontFamily: FONT.head, fontWeight: 800, fontSize: size, letterSpacing: 4, color: C.cyan, textTransform: "uppercase" }}>DIGITAL</span>
  </div>
);
export const CTA: React.FC<{ y: number; p?: number }> = ({ y, p = 1 }) => (
  <div style={{ position: "absolute", top: y, left: 0, width: 1080, textAlign: "center", opacity: clamp(p * 1.3), fontFamily: FONT.ui, fontWeight: 700, fontSize: 30, letterSpacing: 1.5 }}>
    <span style={{ color: C.cyan }}>GET FOUND. </span><span style={{ color: C.white }}>LOOK PROFESSIONAL. </span><span style={{ color: C.cyan }}>GROW ONLINE.</span>
  </div>
);
