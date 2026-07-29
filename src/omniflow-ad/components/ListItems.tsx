import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";

// Requirement row (Scene 2): cyan icon + label with thin separator.
export const RequirementRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  y: number;
  height: number;
  width: number;
  sep?: number; // 0..1 separator draw
  labelProgress?: number;
}> = ({ icon, label, y, height, width, sep = 1, labelProgress = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width, height, display: "flex", alignItems: "center" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: `${sep * 100}%`, height: 1, background: COLORS.darkBorder }} />
    <div style={{ width: 64, display: "flex", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
    <div
      style={{
        fontFamily: FONTS.body,
        fontWeight: 500,
        fontSize: 25,
        color: COLORS.headline,
        lineHeight: 1.2,
        opacity: labelProgress,
        transform: `translateY(${(1 - labelProgress) * 8}px)`,
      }}
    >
      {label}
    </div>
  </div>
);

// Diagnostic metric column (Scene 1): label + value with line icon above.
export const DiagnosticMetric: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  progress?: number;
}> = ({ icon, label, value, progress = 1 }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 10}px)`,
      paddingRight: 12,
    }}
  >
    <div style={{ height: 58, display: "flex", alignItems: "flex-end" }}>{icon}</div>
    <div style={{ fontFamily: FONTS.ui, fontSize: 24, color: COLORS.bodyGray }}>{label}</div>
    <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 30, color: COLORS.headline }}>{value}</div>
  </div>
);

// Step card (Scene 5)
export const StepCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  copy: string;
  icon: React.ReactNode;
  progress?: number;
  active?: boolean;
}> = ({ x, y, width, height, label, copy, icon, progress = 1, active = false }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 12}px)`,
      borderRadius: 18,
      background: active ? COLORS.panelActive : COLORS.panelRaised,
      border: `1.5px solid ${active ? COLORS.goldBorder : COLORS.darkBorder}`,
      boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
      padding: 26,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12,
    }}
  >
    <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1.5px solid ${COLORS.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
    <div style={{ fontFamily: FONTS.ui, fontWeight: 600, fontSize: 22, letterSpacing: "0.14em", color: COLORS.cyan }}>{label}</div>
    <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 27, color: COLORS.headline, lineHeight: 1.12, whiteSpace: "pre-line" }}>{copy}</div>
  </div>
);
