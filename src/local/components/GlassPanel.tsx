import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type Props = {
  x: number;
  y: number;
  width: number;
  height?: number;
  // Local frame the panel assembles at.
  appear: number;
  // Border accent.
  accent?: "cyan" | "gold" | "muted";
  glow?: boolean;
  radius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number | string;
};

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// A raised glass panel that feels attached to the environment: gradient
// fill, thin accent border, restrained glow, assembles with a short mask +
// rise (no bounce). Positioned absolutely in the 1080×1920 field.
export const GlassPanel: React.FC<Props> = ({
  x,
  y,
  width,
  height,
  appear,
  accent = "cyan",
  glow = false,
  radius = 22,
  children,
  style,
  padding = 0,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  if (t <= 0) {
    return null;
  }
  const border =
    accent === "gold"
      ? "rgba(243, 188, 66, 0.5)"
      : accent === "muted"
        ? "rgba(98, 108, 119, 0.4)"
        : COLORS.panelBorder;
  const glowColor = accent === "gold" ? "rgba(243,188,66,0.18)" : "rgba(31,199,255,0.16)";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(155deg, rgba(12,20,30,0.86), rgba(9,16,25,0.7))",
        border: `1.4px solid ${border}`,
        boxShadow: glow
          ? `0 22px 60px rgba(0,0,0,0.5), 0 0 34px ${glowColor}, inset 0 1px 0 rgba(244,246,248,0.05)`
          : "0 18px 46px rgba(0,0,0,0.45), inset 0 1px 0 rgba(244,246,248,0.04)",
        opacity: t,
        transform: `translate3d(0, ${(1 - t) * 14}px, 0) scale(${0.99 + 0.01 * t})`,
        transformOrigin: "50% 50%",
        padding,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ opacity: interpolate(t, [0.25, 1], [0, 1], { extrapolateLeft: "clamp" }), width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
};
