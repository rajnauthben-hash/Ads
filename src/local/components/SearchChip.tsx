import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  x: number;
  y: number;
  label: string;
  appear: number;
  // Length of the vertical stem down to the map node.
  stem?: number;
  align?: "left" | "right";
};

// A rounded search chip (magnifier + typing query) connected by a vertical
// stem to a glowing map node below it. The query types on quickly.
export const SearchChip: React.FC<Props> = ({ x, y, label, appear, stem = 80, align = "left" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  if (t <= 0) {
    return null;
  }
  const typed = Math.floor(interpolate(frame, [appear + 4, appear + 20], [0, label.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const chipW = 60 + label.length * 17;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: t, transform: `translate3d(0, ${(1 - t) * 12}px, 0)` }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          height: 66,
          padding: "0 26px",
          borderRadius: 33,
          background: "rgba(9,16,25,0.9)",
          border: "1.4px solid rgba(85,188,235,0.4)",
          boxShadow: "0 0 22px rgba(31,199,255,0.14)",
          width: chipW,
          boxSizing: "border-box",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" /><line x1="15" y1="15" x2="21" y2="21" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" /></svg>
        <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 26, color: COLORS.white, whiteSpace: "nowrap" }}>{label.slice(0, typed)}</span>
      </div>
      {/* Stem + node */}
      <svg width="120" height={stem + 60} viewBox={`0 0 120 ${stem + 60}`} style={{ position: "absolute", left: align === "left" ? 40 : chipW - 80, top: 60, overflow: "visible" }}>
        <line x1="60" y1="0" x2="60" y2={stem} stroke={COLORS.cyan} strokeWidth="2" opacity={0.6} pathLength={100} strokeDasharray={100} strokeDashoffset={interpolate(frame, [appear + 8, appear + 18], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        {/* Node ripple */}
        {[0, 1].map((i) => {
          const ph = (frame * 0.016 + i / 2) % 1;
          return <ellipse key={i} cx="60" cy={stem} rx={12 + ph * 44} ry={(12 + ph * 44) * 0.4} fill="none" stroke={COLORS.cyan} strokeWidth="1.4" opacity={(1 - ph) * 0.5} />;
        })}
        <ellipse cx="60" cy={stem} rx="20" ry="8" fill={COLORS.cyan} opacity={0.16} />
        <circle cx="60" cy={stem} r="6" fill="#CFF4FF" />
      </svg>
    </div>
  );
};
