import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { SIGNAL_ICON, type SignalKind } from "./SignalChecklist";

const ROWS: { kind: SignalKind; title: string; sub: string }[] = [
  { kind: "categories", title: "Correct categories", sub: "Hardware store" },
  { kind: "hours", title: "Current hours", sub: "Open • Closes 8 PM" },
  { kind: "reviews", title: "Reviews", sub: "4.7 ★★★★★ (286)" },
  { kind: "photos", title: "Photos", sub: "24+ photos" },
  { kind: "activity", title: "Consistent activity", sub: "Active this week" },
];

const GreenCheck: React.FC<{ t: number }> = ({ t }) => (
  <svg width="38" height="38" viewBox="0 0 38 38" style={{ opacity: t }}>
    <circle cx="19" cy="19" r="15" fill="none" stroke={COLORS.green} strokeWidth="2" />
    <path d="M11 19 L17 25 L27 13" fill="none" stroke={COLORS.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - t)} />
  </svg>
);

// Right profile card: header (name, rating, hours, chips), five signal rows
// that sharpen + gain a green check as each activates, and a profile-strength
// bar that fills incrementally. Gold border glows once all five are active.
export const BusinessProfileCard: React.FC<{ x: number; y: number; width: number; height: number; appear: number; activations: number[] }> = ({ x, y, width: w, height: h, appear, activations }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0) {
    return null;
  }
  const activeCount = activations.filter((a) => frame >= a + 6).length;
  const strength = activeCount / activations.length;
  const allActive = activeCount >= activations.length;
  const rowH = 92;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 24,
        background: "linear-gradient(160deg, rgba(14,20,28,0.95), rgba(9,14,20,0.9))",
        border: `1.6px solid rgba(243,188,66,${0.4 + 0.4 * strength})`,
        boxShadow: allActive ? "0 0 40px rgba(243,188,66,0.22)" : "0 20px 50px rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translate3d(0, ${(1 - t) * 20}px, 0)`,
        padding: 26,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <div style={{ width: 84, height: 84, borderRadius: 42, border: "1.6px solid rgba(243,188,66,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="46" height="46" viewBox="0 0 46 46"><path d="M8 20 L11 11 L35 11 L38 20 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.8" /><rect x="11" y="20" width="24" height="16" fill="none" stroke={COLORS.gold} strokeWidth="1.8" /><rect x="15" y="24" width="7" height="12" fill={COLORS.gold} opacity="0.5" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 32, color: COLORS.white }}>Brightview Hardware</div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 24, color: COLORS.gold, marginTop: 4 }}>4.7 ★★★★★ <span style={{ color: COLORS.grayMuted, fontWeight: 400 }}>(286)</span></div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 22, marginTop: 4 }}><span style={{ color: COLORS.green }}>Open</span> <span style={{ color: COLORS.gray }}>• Closes 8 PM</span></div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {["In stock", "Curbside pickup"].map((chip) => (
              <span key={chip} style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 19, color: COLORS.gold, border: "1px solid rgba(243,188,66,0.45)", borderRadius: 16, padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.6" fill="none" stroke={COLORS.gold} strokeWidth="1.2" /><path d="M4.5 7 L6.2 8.8 L9.5 5" fill="none" stroke={COLORS.gold} strokeWidth="1.2" /></svg>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Signal rows */}
      <div style={{ marginTop: 22 }}>
        {ROWS.map((row, i) => {
          const rt = interpolate(frame, [activations[i], activations[i] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 16, padding: "0 16px", marginBottom: 10, borderRadius: 14, background: rt > 0.5 ? "rgba(31,199,255,0.05)" : "rgba(9,14,20,0.6)", border: `1px solid rgba(85,188,235,${0.1 + 0.15 * rt})`, opacity: 0.5 + 0.5 * rt, filter: `blur(${(1 - rt) * 2}px)`, boxSizing: "border-box" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <SIGNAL_ICON kind={row.kind} color={rt > 0.5 ? COLORS.gold : COLORS.cyan} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.white }}>{row.title}</div>
                <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 21, color: COLORS.gray, marginTop: 2 }}>{row.sub}</div>
              </div>
              <GreenCheck t={rt} />
            </div>
          );
        })}
      </div>

      {/* Profile strength */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 16, padding: "16px", borderRadius: 14, background: "rgba(9,14,20,0.7)", border: "1px solid rgba(85,188,235,0.14)" }}>
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 4 L34 10 L34 20 C 34 30 27 35 20 37 C 13 35 6 30 6 20 L 6 10 Z" fill="none" stroke={COLORS.cyan} strokeWidth="1.8" /><path d="M13 20 L18 25 L28 14" fill="none" stroke={COLORS.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.white }}>Profile strength</div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 21, color: allActive ? COLORS.green : COLORS.gray }}>Strong</div>
        </div>
        <div style={{ width: 180, height: 8, borderRadius: 4, background: "rgba(98,108,119,0.3)", overflow: "hidden" }}>
          <div style={{ width: `${strength * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${COLORS.cyanDeep}, ${COLORS.cyan})` }} />
        </div>
      </div>
    </div>
  );
};
