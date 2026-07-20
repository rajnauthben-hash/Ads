import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

// The final #1 business result card (Scene 6). Header, status badges, three
// abstract native vector tiles (store interior / owner / tools — NOT photos),
// and a five-star review. Slides into the #1 position.
const Badge: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 4px", borderRadius: 12, border: "1px solid rgba(243,188,66,0.28)" }}>
    {icon}
    <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 17, color: COLORS.gold, textAlign: "center" }}>{label}</span>
  </div>
);

const InteriorTile: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 96" preserveAspectRatio="xMidYMid slice">
    <rect width="130" height="96" fill="#0E1319" />
    <rect x="0" y="0" width="130" height="40" fill="rgba(243,166,74,0.14)" />
    {[10, 34, 58, 82, 106].map((x, i) => <rect key={i} x={x} y={12} width={16} height={70} fill="rgba(243,188,66,0.12)" stroke="rgba(243,188,66,0.2)" strokeWidth="0.6" />)}
    {[18, 42, 66, 90, 114].map((x, i) => <circle key={i} cx={x} cy={8} r={2} fill="#FFE0A0" opacity={0.7} />)}
    <rect x="0" y="82" width="130" height="14" fill="rgba(243,166,74,0.1)" />
  </svg>
);
const OwnerTile: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 96" preserveAspectRatio="xMidYMid slice">
    <rect width="130" height="96" fill="#0E1319" />
    <circle cx="65" cy="42" r="22" fill="none" stroke={COLORS.gold} strokeWidth="2" opacity="0.7" />
    <circle cx="65" cy="34" r="9" fill="rgba(243,188,66,0.4)" />
    <path d="M46 66 C 48 52 82 52 84 66 L 84 82 L 46 82 Z" fill="rgba(31,199,255,0.18)" stroke={COLORS.cyan} strokeWidth="1.4" />
    <path d="M55 46 L75 46 L73 40 L57 40 Z" fill="rgba(31,199,255,0.3)" />
  </svg>
);
const ToolsTile: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 96" preserveAspectRatio="xMidYMid slice">
    <rect width="130" height="96" fill="#0E1319" />
    <g stroke={COLORS.gray} strokeWidth="2.4" fill="none" strokeLinecap="round" transform="rotate(-30 65 48)">
      <path d="M30 30 A 8 8 0 1 0 40 40 L 62 62 L 70 54 L 48 32 A 8 8 0 0 0 30 30 Z" fill="rgba(167,175,185,0.14)" />
    </g>
    <g stroke={COLORS.gray} strokeWidth="2.4" fill="none" strokeLinecap="round" transform="rotate(25 78 52)">
      <path d="M70 30 L70 46 M74 30 L74 46 M66 46 L78 46 L78 70 L66 70 Z" fill="rgba(167,175,185,0.12)" />
    </g>
  </svg>
);

export const ResultProfileCard: React.FC<{ x: number; y: number; width: number; height: number; appear: number }> = ({ x, y, width: w, height: h, appear }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slide = interpolate(frame, [appear, appear + 16], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0) {
    return null;
  }
  const badges: { label: string; icon: React.ReactNode }[] = [
    { label: "Top rated", icon: <svg width="26" height="26" viewBox="0 0 26 26"><path d="M13 3 L16 11 L24 11.4 L18 16 L20 24 L13 19.6 L6 24 L8 16 L2 11.4 L10 11 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinejoin="round" /></svg> },
    { label: "Open now", icon: <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="none" stroke={COLORS.gold} strokeWidth="1.6" /><path d="M13 7 L13 13 L18 16" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" /></svg> },
    { label: "In stock", icon: <svg width="26" height="26" viewBox="0 0 26 26"><path d="M4 8 L13 3 L22 8 L22 18 L13 23 L4 18 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinejoin="round" /><path d="M4 8 L13 13 L22 8 M13 13 L13 23" fill="none" stroke={COLORS.gold} strokeWidth="1.2" /></svg> },
    { label: "Local favorite", icon: <svg width="26" height="26" viewBox="0 0 26 26"><path d="M13 22 C 4 15 4 8 8.5 8 C 11 8 13 10 13 10 C 13 10 15 8 17.5 8 C 22 8 22 15 13 22 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinejoin="round" /></svg> },
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, background: "linear-gradient(160deg, rgba(14,20,28,0.96), rgba(9,14,20,0.92))", border: "1.6px solid rgba(243,188,66,0.5)", boxShadow: "0 0 40px rgba(243,188,66,0.18)", opacity: t, transform: `translate3d(0, ${slide}px, 0)`, padding: 24, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: "#1A1206", background: COLORS.gold, borderRadius: 8, padding: "3px 10px" }}>#1</span>
          <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: COLORS.gold }}>Brightview Hardware</span>
        </div>
        <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 22, color: COLORS.gray }}>0.3 mi</span>
      </div>
      <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 23, color: COLORS.gold, marginTop: 10 }}>4.7 ★★★★★ <span style={{ color: COLORS.grayMuted, fontWeight: 400 }}>(286)</span></div>
      <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 21, marginTop: 6 }}><span style={{ color: COLORS.gray }}>Hardware store • </span><span style={{ color: COLORS.green }}>Open</span><span style={{ color: COLORS.gray }}> • Closes 8 PM</span></div>
      <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 20, color: COLORS.gold, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.4" fill="none" stroke={COLORS.gold} strokeWidth="1.4" /><path d="M5 8 L7 10 L11 5.5" fill="none" stroke={COLORS.gold} strokeWidth="1.4" /></svg>
        In stock • Curbside pickup
      </div>
      {/* Badges */}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        {badges.map((b) => <Badge key={b.label} label={b.label} icon={b.icon} />)}
      </div>
      {/* Vector tiles */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, height: 118 }}>
        {[<InteriorTile key="i" />, <OwnerTile key="o" />, <ToolsTile key="t" />].map((tile, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(85,188,235,0.16)" }}>{tile}</div>
        ))}
      </div>
      {/* Review */}
      <div style={{ marginTop: 18 }}>
        <span style={{ color: COLORS.gold, fontSize: 24, letterSpacing: 2 }}>★★★★★</span>
        <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 22, color: COLORS.white, marginTop: 8 }}>Great selection and super helpful staff!</div>
        <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 20, color: COLORS.grayMuted, marginTop: 4 }}>– Local Customer</div>
      </div>
    </div>
  );
};
