import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { CheckCircleIcon, WarningIcon } from "./Icons";

// Small node card used in the Scene 2 pathway network.
export const PathwayNode: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  icon: React.ReactNode;
  title: string;
  lines?: string[];
  status?: "none" | "check" | "warn";
  warnActive?: number; // 0..1 amber activation
  progress?: number;
}> = ({ x, y, width, height, icon, title, lines = [], status = "none", warnActive = 1, progress = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 8}px)`,
      borderRadius: 12,
      background: "rgba(8,13,18,0.9)",
      border: `1.25px solid ${status === "warn" ? `rgba(242,163,61,${0.3 + 0.4 * warnActive})` : COLORS.darkBorder}`,
      boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
      padding: 14,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 20, color: COLORS.headline, lineHeight: 1.05 }}>{title}</div>
    </div>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: FONTS.ui, fontSize: 16, color: COLORS.cyanSecondary, lineHeight: 1.2 }}>{l}</div>
    ))}
    {status === "check" && (
      <div style={{ marginTop: "auto" }}>
        <CheckCircleIcon size={22} color={COLORS.cyan} strokeWidth={1.8} />
      </div>
    )}
    {status === "warn" && (
      <div style={{ marginTop: "auto", opacity: warnActive }}>
        <WarningIcon size={22} color={COLORS.amber} strokeWidth={1.8} />
      </div>
    )}
  </div>
);
