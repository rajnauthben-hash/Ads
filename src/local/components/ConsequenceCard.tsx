import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  appear: number;
  label: string;
  icon: "eyeoff" | "phonex" | "userstar";
};

const Icon: React.FC<{ kind: Props["icon"] }> = ({ kind }) => {
  const c = COLORS.cyan;
  switch (kind) {
    case "eyeoff":
      return (
        <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke={c} strokeWidth="2" opacity="0.5" /><path d="M14 28 C 19 20 37 20 42 28 C 37 36 19 36 14 28 Z" fill="none" stroke={c} strokeWidth="2" /><circle cx="28" cy="28" r="4.5" fill="none" stroke={c} strokeWidth="2" /><line x1="15" y1="15" x2="41" y2="41" stroke={c} strokeWidth="2.4" strokeLinecap="round" /></svg>
      );
    case "phonex":
      return (
        <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke={c} strokeWidth="2" opacity="0.5" /><path d="M20 18 C 18 24 26 36 34 38 L 38 33 L 32 30 C 30 32 26 28 27 26 L 24 20 Z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" /><circle cx="40" cy="18" r="7" fill="none" stroke={c} strokeWidth="1.8" /><line x1="37" y1="15" x2="43" y2="21" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
      );
    default:
      return (
        <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke={c} strokeWidth="2" opacity="0.5" /><circle cx="26" cy="23" r="7" fill="none" stroke={c} strokeWidth="2" /><path d="M15 40 C 16 32 36 32 37 40" fill="none" stroke={c} strokeWidth="2" /><path d="M40 22 L42 27 L47 27 L43 30 L44 35 L40 32 L36 35 L37 30 L33 27 L38 27 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinejoin="round" /></svg>
      );
  }
};

// One of the three "missed connection" cards. Icon + label + small gold
// rule. Reveals with a mask + rise, staggered by the scene.
export const ConsequenceCard: React.FC<Props> = ({ x, y, width, height, appear, label, icon }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  if (t <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 18,
        background: "rgba(9,16,25,0.7)",
        border: "1px solid rgba(85,188,235,0.16)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: t,
        transform: `translate3d(0, ${(1 - t) * 18}px, 0)`,
        boxSizing: "border-box",
      }}
    >
      <Icon kind={icon} />
      <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 27, color: COLORS.white, textAlign: "center" }}>{label}</span>
      <div style={{ width: 40, height: 2, background: COLORS.gold, opacity: 0.7 }} />
    </div>
  );
};
