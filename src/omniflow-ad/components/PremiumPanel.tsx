import React from "react";
import { COLORS, RADII, SHADOWS } from "../styles/tokens";

type Border = "gold" | "cyan" | "dark";

// Bordered surface used everywhere. Supports a border-draw progress so the
// outline can wipe in during entrances (clip-path reveal from top).
export const PremiumPanel: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  border?: Border;
  borderWidth?: number;
  surface?: string;
  opacity?: number;
  glow?: string;
  padding?: number;
  drawProgress?: number; // 0..1 vertical reveal of contents
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  width,
  height,
  radius = RADII.panel,
  border = "gold",
  borderWidth = 1.5,
  surface = COLORS.panelRaised,
  opacity = 1,
  glow,
  padding,
  drawProgress = 1,
  style,
  children,
}) => {
  const borderColor =
    border === "gold"
      ? COLORS.goldBorder
      : border === "cyan"
        ? COLORS.cyanActiveBorder
        : COLORS.darkBorder;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: radius,
        background: surface,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: glow ? `${SHADOWS.panel}, ${glow}` : SHADOWS.panel,
        opacity,
        boxSizing: "border-box",
        padding,
        overflow: "hidden",
        // reveal contents top->bottom
        clipPath:
          drawProgress < 1
            ? `inset(0 0 ${(1 - drawProgress) * 100}% 0 round ${radius}px)`
            : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
