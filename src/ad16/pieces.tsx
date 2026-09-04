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
// Isometric city — deterministic field of dark extruded blocks on a slate
// ground with a faint grid and thin gold road outlines. One persistent world.
// ---------------------------------------------------------------------------
const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 43.7) * 43758.5453;
  return v - Math.floor(v);
};
const TW = 66, TH = 33, ZH = 30;
function iso(ox: number, oy: number, gx: number, gy: number, gz = 0): Pt {
  return { x: ox + (gx - gy) * TW, y: oy + (gx + gy) * TH - gz * ZH };
}
export const IsoCity: React.FC<{ ox?: number; oy?: number; opacity?: number }> = ({ ox = 540, oy = 720, opacity = 1 }) => {
  const boxes: { gx: number; gy: number; h: number }[] = [];
  for (let gx = -5; gx <= 8; gx++)
    for (let gy = -5; gy <= 9; gy++) {
      const r = rnd(gx * 13.3 + gy * 7.7);
      if (r < 0.66) continue;
      // leave a clear corridor for the route / hero objects
      if (Math.abs(gx - gy) < 1.4 && gy > -2) continue;
      boxes.push({ gx, gy, h: 1 + Math.floor(rnd(gx * 3.1 + gy * 5.9) * 5) });
    }
  boxes.sort((a, b) => a.gx + a.gy - (b.gx + b.gy));
  const grid = [];
  for (let g = -6; g <= 10; g++) {
    const a1 = iso(ox, oy, g, -6), a2 = iso(ox, oy, g, 10);
    const b1 = iso(ox, oy, -6, g), b2 = iso(ox, oy, 8, g);
    grid.push(<line key={`gx${g}`} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y} stroke={C.line} strokeWidth={1} />);
    grid.push(<line key={`gy${g}`} x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y} stroke={C.line} strokeWidth={1} />);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      <g opacity={0.5}>{grid}</g>
      {boxes.map((b, i) => {
        const t = iso(ox, oy, b.gx, b.gy, b.h);
        const tr = iso(ox, oy, b.gx + 1, b.gy, b.h);
        const tb = iso(ox, oy, b.gx + 1, b.gy + 1, b.h);
        const tl = iso(ox, oy, b.gx, b.gy + 1, b.h);
        const br = iso(ox, oy, b.gx + 1, b.gy, 0);
        const bb = iso(ox, oy, b.gx + 1, b.gy + 1, 0);
        const bl = iso(ox, oy, b.gx, b.gy + 1, 0);
        return (
          <g key={i}>
            <path d={`M${tr.x} ${tr.y} L${tb.x} ${tb.y} L${bb.x} ${bb.y} L${br.x} ${br.y} Z`} fill={C.slate} stroke={C.line} strokeWidth={1} />
            <path d={`M${tb.x} ${tb.y} L${tl.x} ${tl.y} L${bl.x} ${bl.y} L${bb.x} ${bb.y} Z`} fill="#0A0E13" stroke={C.line} strokeWidth={1} />
            <path d={`M${t.x} ${t.y} L${tr.x} ${tr.y} L${tb.x} ${tb.y} L${tl.x} ${tl.y} Z`} fill={C.raised} stroke={C.line} strokeWidth={1} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Result card + phone.
// ---------------------------------------------------------------------------
export const ResultCard: React.FC<{ n?: number; lit?: number; you?: boolean; w?: number; reveal?: number }> = ({ n, lit = 1, you = false, w = 320, reveal = 1 }) => {
  const a = clamp(lit);
  const edge = you ? C.dim : `rgba(217,155,37,${0.35 + 0.6 * a})`;
  const glow = you ? "none" : `0 0 ${18 * a}px rgba(217,155,37,${0.25 * a})`;
  return (
    <div style={{ width: w, borderRadius: 16, border: `2px solid ${edge}`, background: "rgba(10,13,18,0.9)", boxShadow: glow, padding: "16px 18px", display: "flex", gap: 16, opacity: clamp(reveal * 1.2), transform: `translateY(${(1 - clamp(reveal)) * 12}px)` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 2 }}>
        {you ? (
          <div style={{ width: 30, height: 30, borderRadius: 15, background: C.raised2, border: `1.5px solid ${C.dim}` }} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: 16, background: C.gold, color: C.black, fontFamily: FONT.head, fontWeight: 800, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
        )}
        <svg width={22} height={26} viewBox="0 0 22 26"><path d="M11 25 C 2 14, 3 3, 11 3 C 19 3, 20 14, 11 25 Z" fill={you ? "none" : C.gold} stroke={you ? C.dim : C.gold} strokeWidth={you ? 2 : 0} /><circle cx={11} cy={10} r={3.4} fill={you ? C.dim : C.black} /></svg>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, paddingTop: 4 }}>
        {you ? (
          <div style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: 22, color: C.muted, letterSpacing: 0.5 }}>YOUR BUSINESS</div>
        ) : (
          <div style={{ height: 8, width: "62%", borderRadius: 4, background: `linear-gradient(90deg, ${C.goldLight}, ${C.gold})`, boxShadow: `0 0 10px rgba(217,155,37,${0.4 * a})` }} />
        )}
        {[0.92, 0.78, 0.6].map((wd, i) => (
          <div key={i} style={{ height: 6, width: `${wd * 100}%`, borderRadius: 3, background: C.raised2 }} />
        ))}
      </div>
    </div>
  );
};

export const PhoneWithResults: React.FC<{
  x: number; y: number; scale?: number; query?: string; queryChars?: number; cards: { n: number; lit: number }[]; you?: number; reveal?: number; tilt?: number;
}> = ({ x, y, scale = 1, query, queryChars, cards, you, reveal = 1, tilt = -13 }) => {
  const shown = query && queryChars !== undefined ? query.slice(0, queryChars) : query;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${scale})`, opacity: clamp(reveal * 1.3) }}>
      <div style={{ transform: `perspective(1500px) rotateY(${tilt}deg) rotateX(3deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ width: 462, height: 946, borderRadius: 58, background: "linear-gradient(150deg, #1a1f26, #05070a 60%)", border: "3px solid #2a3138", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", padding: 18 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 44, background: "#05070a", padding: "26px 22px", display: "flex", flexDirection: "column", gap: 20, overflow: "hidden" }}>
            <div style={{ height: 62, borderRadius: 31, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 14, padding: "0 22px" }}>
              <svg width={26} height={26} viewBox="-13 -13 26 26" stroke={C.muted} strokeWidth={2.2} fill="none"><circle cx={-3} cy={-3} r={7} /><line x1={2} y1={2} x2={9} y2={9} /></svg>
              {shown && <span style={{ fontFamily: FONT.ui, fontSize: 24, color: C.white }}>{shown}</span>}
            </div>
            {cards.map((c, i) => (
              <ResultCard key={i} n={c.n} lit={c.lit} w={378} reveal={1} />
            ))}
            {you !== undefined && you > 0 && <ResultCard you w={378} reveal={you} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Isometric storefront (dark, awning) — the YOUR BUSINESS shop.
// ---------------------------------------------------------------------------
export const Storefront: React.FC<{ x: number; y: number; scale?: number; lit?: number; reveal?: number }> = ({ x, y, scale = 1, lit = 0, reveal = 1 }) => {
  const a = clamp(lit);
  const edge = a > 0.4 ? C.gold : C.line;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${scale})`, opacity: clamp(reveal * 1.2) }}>
      <svg width={280} height={230} viewBox="0 0 280 230" style={{ overflow: "visible", filter: a > 0.4 ? `drop-shadow(0 0 16px rgba(217,155,37,${0.4 * a}))` : "none" }}>
        {/* base slab (iso) */}
        <path d="M140 210 L250 150 L140 90 L30 150 Z" fill="#0A0E13" stroke={edge} strokeWidth={1.5} opacity={0.9} />
        {/* building block */}
        <path d="M60 150 L140 104 L140 40 L60 86 Z" fill={C.slate} stroke={edge} strokeWidth={1.5} />
        <path d="M140 104 L220 150 L220 86 L140 40 Z" fill="#0A0E13" stroke={edge} strokeWidth={1.5} />
        <path d="M60 86 L140 40 L220 86 L140 132 Z" fill={C.raised} stroke={edge} strokeWidth={1.5} />
        {/* awning (striped) front-left face */}
        <path d="M60 150 L140 104 L140 128 L60 174 Z" fill="#0C1016" stroke={edge} strokeWidth={1.4} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={60 + i * 16} y1={150 - i * 9.2} x2={60 + i * 16} y2={174 - i * 9.2} stroke={edge} strokeWidth={1} opacity={0.6} />)}
        {/* window glow */}
        <path d="M78 150 L118 127 L118 145 L78 168 Z" fill={a > 0.4 ? `rgba(241,186,75,${0.28 * a})` : "rgba(255,255,255,0.04)"} stroke={edge} strokeWidth={1} />
        <path d="M150 150 L200 150 L200 120 L150 148 Z" fill={a > 0.4 ? `rgba(241,186,75,${0.2 * a})` : "rgba(255,255,255,0.03)"} stroke={edge} strokeWidth={1} />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Route + pulse (cyan spine) and gold connectors.
// ---------------------------------------------------------------------------
export const RoutePath: React.FC<{ points: Pt[]; draw: number; color?: string; core?: number; radius?: number; dashed?: boolean; opacity?: number }> = ({ points, draw, color = C.cyan, core = 5, radius = 22, dashed = false, opacity = 1 }) => {
  if (points.length < 2 || draw <= 0) return null;
  const d = smoothPath(points, radius);
  if (dashed) return <path d={d} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.006} ${0.02}`} strokeDashoffset={0} opacity={opacity * 0.9} />;
  const dash = `${draw} ${1 - draw + 0.0001}`;
  const cm = { d, fill: "none" as const, pathLength: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: dash };
  return (
    <g opacity={opacity} style={{ mixBlendMode: "screen" }}>
      <path {...cm} stroke={color} strokeWidth={core * 4} opacity={0.12} style={{ filter: `blur(${core * 1.5}px)` }} />
      <path {...cm} stroke={color} strokeWidth={core} opacity={0.95} />
      <path {...cm} stroke="#CFFBFF" strokeWidth={core * 0.4} opacity={0.9} />
    </g>
  );
};
export const RoutePulse: React.FC<{ points: Pt[]; t: number; maxDraw?: number; color?: string; size?: number }> = ({ points, t, maxDraw = 1, color = C.cyan, size = 8 }) => {
  if (points.length < 2 || t < 0 || t > maxDraw) return null;
  const p = pointAtLength(points, t);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <circle cx={p.x} cy={p.y} r={size * 3} fill={color} opacity={0.2} style={{ filter: "blur(6px)" }} />
      <circle cx={p.x} cy={p.y} r={size} fill="#EAFEFF" />
      <circle cx={p.x} cy={p.y} r={size * 0.5} fill={color} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Gold triangle of three ranked slots + connectors (scenes 5 & 6).
// ---------------------------------------------------------------------------
export const TriangleSlots: React.FC<{ cx: number; cy: number; f: number; reveal?: number; storefront?: boolean }> = ({ cx, cy, f, reveal = 1, storefront = false }) => {
  const P = [{ x: cx, y: cy - 190 }, { x: cx - 230, y: cy + 150 }, { x: cx + 230, y: cy + 150 }];
  const dl = clamp(reveal * 1.3);
  const Slot: React.FC<{ p: Pt; n: number; i: number }> = ({ p, n, i }) => {
    const rv = ip(f, 0, 1, 0, 1); // reveal handled by parent opacity
    void rv;
    return (
      <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)" }}>
        <div style={{ position: "absolute", left: "50%", top: -34, transform: "translateX(-50%)", width: 30, height: 30, borderRadius: 15, border: `2px solid ${C.gold}`, color: C.goldLight, fontFamily: FONT.head, fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", background: C.black }}>{n}</div>
        <div style={{ width: 132, height: 96, borderRadius: 12, border: `2px solid ${C.gold}`, background: "rgba(10,13,18,0.85)", boxShadow: "0 0 22px rgba(217,155,37,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width={26} height={30} viewBox="0 0 26 30"><path d="M13 29 C 3 16, 4 4, 13 4 C 22 4, 23 16, 13 29 Z" fill={C.gold} /><circle cx={13} cy={12} r={4} fill={C.black} /></svg>
          <div style={{ height: 5, width: 70, borderRadius: 3, background: C.gold, opacity: 0.7 }} />
        </div>
        {/* gold diamond footprint */}
        <svg width={200} height={120} viewBox="0 0 200 120" style={{ position: "absolute", left: "50%", top: 44, transform: "translateX(-50%)", overflow: "visible" }}>
          <path d="M100 20 L180 60 L100 100 L20 60 Z" fill="none" stroke={C.gold} strokeWidth={2} opacity={0.6} style={{ filter: "drop-shadow(0 0 8px rgba(217,155,37,0.4))" }} />
        </svg>
        <span style={{ position: "absolute", left: 132, top: 30 }}>{i === 0 ? "" : ""}</span>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: dl }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g opacity={clamp((reveal - 0.3) * 2)} style={{ mixBlendMode: "screen" }}>
          {[[0, 1], [1, 2], [2, 0]].map(([a, b], i) => (
            <line key={i} x1={P[a].x} y1={P[a].y + 40} x2={P[b].x} y2={P[b].y + 40} stroke={C.gold} strokeWidth={2.4} opacity={0.7} style={{ filter: "drop-shadow(0 0 6px rgba(217,155,37,0.4))" }} />
          ))}
        </g>
      </svg>
      {storefront && (
        <>
          <div style={{ position: "absolute", left: cx, top: cy + 150, transform: "translate(-50%,-50%)", textAlign: "center", fontFamily: FONT.head, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: C.goldLight, lineHeight: 1.05 }}>YOUR BUSINESS</div>
          <Storefront x={cx} y={cy + 120} scale={0.95} lit={1} />
        </>
      )}
      {P.map((p, i) => <Slot key={i} p={p} n={i + 1} i={i} />)}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Text + UI atoms.
// ---------------------------------------------------------------------------
export interface Part { t: string; c?: string; b?: boolean }
export const Headline: React.FC<{ x: number; y: number; size: number; lines: Part[][]; weight?: number; lh?: number; p?: number; ex?: number; color?: string; exDir?: { x: number; y: number } }> = ({ x, y, size, lines, weight = 700, lh = 1.04, p = 1, ex = 0, color = C.white, exDir = { x: -24, y: -40 } }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(${ex * exDir.x}px, ${ex * exDir.y}px)`, opacity: 1 - clamp(ex * 1.1) }}>
    {lines.map((parts, i) => {
      const lp = clamp((p - i * 0.09) / 0.5);
      return (
        <div key={i} style={{ fontFamily: FONT.head, fontWeight: weight, fontSize: size, lineHeight: lh, letterSpacing: "-0.015em", whiteSpace: "nowrap", clipPath: `inset(0 0 ${(1 - lp) * 100}% 0)`, transform: `translateY(${(1 - lp) * 14}px)`, filter: lp < 1 ? `blur(${(1 - lp) * 4}px)` : undefined, opacity: clamp(lp * 1.4), color }}>
          {parts.map((pt, j) => <span key={j} style={{ color: pt.c ?? color }}>{pt.t}</span>)}
        </div>
      );
    })}
  </div>
);
export const Copy: React.FC<{ x: number; y: number; size: number; lines: (string | Part[])[]; color?: string; weight?: number; lh?: number; p?: number; ex?: number; width?: number; font?: string }> = ({ x, y, size, lines, color = C.muted, weight = 400, lh = 1.34, p = 1, ex = 0, width, font = FONT.body }) => (
  <div style={{ position: "absolute", left: x, top: y, width, opacity: (1 - clamp(ex * 1.15)) * clamp(p * 1.3), transform: `translate(${ex * -20}px, ${(1 - clamp(p)) * 12}px)` }}>
    {lines.map((ln, i) => (
      <div key={i} style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: lh, color }}>
        {typeof ln === "string" ? ln : ln.map((pt, j) => <span key={j} style={{ color: pt.c ?? color, fontWeight: pt.b ? 700 : weight }}>{pt.t}</span>)}
      </div>
    ))}
  </div>
);
export const Label: React.FC<{ x: number; y: number; text: string; color?: string; size?: number; p?: number }> = ({ x, y, text, color = C.cyan, size = 22, p = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT.ui, fontWeight: 600, fontSize: size, letterSpacing: 2.5, color, opacity: clamp(p * 1.3), textTransform: "uppercase" }}>{text}</div>
);
export const GoldDivider: React.FC<{ x: number; y: number; w: number; reveal?: number; color?: string; thick?: number }> = ({ x, y, w, reveal = 1, color = C.gold, thick = 2 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w * clamp(reveal), height: thick, background: color, opacity: 0.8 }} />
);
export const Brand: React.FC<{ x?: number; y: number; size?: number; center?: boolean; p?: number }> = ({ x = 0, y, size = 40, center = true, p = 1 }) => (
  <div style={{ position: "absolute", left: center ? 0 : x, top: y, width: center ? 1080 : undefined, textAlign: center ? "center" : "left", fontFamily: FONT.head, fontWeight: 700, fontSize: size, color: C.white, opacity: clamp(p * 1.3), letterSpacing: "-0.01em" }}>OmniFlow <span style={{ color: C.white }}>Digital</span></div>
);
export const NumberedSignal: React.FC<{ x: number; y: number; n: number; head: string; body: string[]; p?: number; ex?: number; accent?: string }> = ({ x, y, n, head, body, p = 1, ex = 0, accent = C.cyan }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: (1 - clamp(ex * 1.1)) * clamp(p * 1.3), transform: `translateY(${(1 - clamp(p)) * 10}px)` }}>
    <div style={{ display: "flex", gap: 18 }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, border: `2px solid ${C.gold}`, color: C.goldLight, fontFamily: FONT.head, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 26, letterSpacing: 1.5, color: accent }}>{head}</div>
        <div style={{ fontFamily: FONT.body, fontSize: 25, lineHeight: 1.3, color: C.muted, marginTop: 4 }}>{body.map((b, i) => <div key={i}>{b}</div>)}</div>
      </div>
    </div>
  </div>
);
export const CheckItem: React.FC<{ x: number; y: number; text: string; p?: number }> = ({ x, y, text, p = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: clamp(p * 1.3), transform: `translateX(${(1 - clamp(p)) * -8}px)` }}>
    <svg width={30} height={30} viewBox="-15 -15 30 30"><circle cx={0} cy={0} r={13} fill="none" stroke={C.gold} strokeWidth={2} /><path d="M-6 0 L-1 5 L7 -6" fill="none" stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
    <span style={{ fontFamily: FONT.body, fontSize: 27, color: C.muted }}>{text}</span>
  </div>
);
export const StatementBox: React.FC<{ x: number; y: number; w: number; lines: Part[][]; size: number; p?: number; align?: "left" | "center" }> = ({ x, y, w, lines, size, p = 1, align = "center" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, border: `1.5px solid ${C.goldLine}`, borderRadius: 14, padding: "22px 26px", background: "rgba(10,13,18,0.5)", textAlign: align, opacity: clamp(p * 1.3), transform: `translateY(${(1 - clamp(p)) * 12}px)` }}>
    {lines.map((parts, i) => (
      <div key={i} style={{ fontFamily: FONT.head, fontWeight: 700, fontSize: size, lineHeight: 1.18 }}>
        {parts.map((pt, j) => <span key={j} style={{ color: pt.c ?? C.white }}>{pt.t}</span>)}
      </div>
    ))}
  </div>
);
export const CTAButton: React.FC<{ x: number; y: number; p?: number }> = ({ x, y, p = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 16, opacity: clamp(p * 1.3), transform: `translateY(${(1 - clamp(p)) * 10}px)` }}>
    <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 12, padding: "14px 22px", fontFamily: FONT.head, fontWeight: 700, fontSize: 26, color: C.white, lineHeight: 1.05 }}>OmniFlow<br />Digital</div>
    <div style={{ background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold})`, borderRadius: 12, padding: "14px 26px", fontFamily: FONT.head, fontWeight: 800, fontSize: 25, color: C.black, letterSpacing: 0.5, lineHeight: 1.15, maxWidth: 430, display: "flex", alignItems: "center" }}>GET FOUND. LOOK PROFESSIONAL. GROW ONLINE.</div>
  </div>
);
