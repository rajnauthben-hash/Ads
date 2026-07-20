import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

export type SignalKind = "categories" | "hours" | "reviews" | "photos" | "activity";

export const SIGNAL_ICON: React.FC<{ kind: SignalKind; color: string }> = ({ kind, color }) => {
  switch (kind) {
    case "categories":
      return <svg width="34" height="34" viewBox="0 0 34 34"><path d="M5 17 L15 5 L29 5 L29 19 L17 29 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" /><circle cx="23" cy="11" r="2.4" fill={color} /></svg>;
    case "hours":
      return <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="12" fill="none" stroke={color} strokeWidth="2" /><path d="M17 9 L17 17 L23 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>;
    case "reviews":
      return <svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 4 L21 13 L31 13.6 L23.5 20 L26 30 L17 24.4 L8 30 L10.5 20 L3 13.6 L13 13 Z" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" /></svg>;
    case "photos":
      return <svg width="34" height="34" viewBox="0 0 34 34"><rect x="4" y="7" width="26" height="20" rx="3" fill="none" stroke={color} strokeWidth="2" /><circle cx="11" cy="14" r="2.6" fill={color} /><path d="M7 24 L15 16 L20 21 L25 16 L29 20" fill="none" stroke={color} strokeWidth="2" /></svg>;
    default:
      return <svg width="34" height="34" viewBox="0 0 34 34"><path d="M5 24 L13 14 L19 19 L29 7" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 7 L29 7 L29 13" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
};

const ITEMS: { kind: SignalKind; label: string[] }[] = [
  { kind: "categories", label: ["Correct", "categories"] },
  { kind: "hours", label: ["Current hours"] },
  { kind: "reviews", label: ["Reviews"] },
  { kind: "photos", label: ["Photos"] },
  { kind: "activity", label: ["Consistent", "activity"] },
];

// Left checklist panel: five signal rows, each with cyan icon, white label,
// gold check that activates in sequence, and a thin separator.
export const SignalChecklist: React.FC<{ x: number; y: number; width: number; height: number; activations: number[] }> = ({ x, y, width, height, activations }) => {
  const frame = useCurrentFrame();
  const rowH = height / ITEMS.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height }}>
      {ITEMS.map((item, i) => {
        const check = interpolate(frame, [activations[i], activations[i] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const iconColor = check > 0.5 ? COLORS.gold : COLORS.cyan;
        return (
          <div key={i} style={{ position: "absolute", top: i * rowH, left: 0, width, height: rowH, display: "flex", alignItems: "center", gap: 20, padding: "0 26px", boxSizing: "border-box", borderTop: i > 0 ? "1px solid rgba(85,188,235,0.12)" : "none" }}>
            <div style={{ width: 58, height: 58, borderRadius: 29, border: `1.5px solid ${check > 0.5 ? "rgba(243,188,66,0.5)" : "rgba(31,199,255,0.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SIGNAL_ICON kind={item.kind} color={iconColor} />
            </div>
            <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 28, color: COLORS.white, lineHeight: 1.15, flex: 1 }}>
              {item.label.map((l, li) => <div key={li}>{l}</div>)}
            </span>
            {/* Gold check */}
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: check }}>
              <circle cx="20" cy="20" r="16" fill="none" stroke={COLORS.gold} strokeWidth="2" />
              <path d="M12 20 L18 26 L28 14" fill="none" stroke={COLORS.gold} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - check)} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
