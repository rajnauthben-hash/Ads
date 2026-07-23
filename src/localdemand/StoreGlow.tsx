import React from "react";

/** Subtle warm additive glow over storefront windows (masked lighting pass). */
export const StoreGlow: React.FC<{
  x: number;
  y: number;
  r: number;
  strength?: number;
  color?: string;
}> = ({ x, y, r, strength = 0.06, color = "240, 169, 75" }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(${color}, ${strength}) 0%, rgba(${color},0) 68%)`,
      mixBlendMode: "screen",
      pointerEvents: "none",
    }}
  />
);

/** Cyan additive glow (e.g. competitor arrival, doorway reaction). */
export const CyanGlow: React.FC<{ x: number; y: number; r: number; strength?: number }> = ({
  x,
  y,
  r,
  strength = 0.3,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(38,217,255,${strength}) 0%, rgba(38,217,255,0) 66%)`,
      mixBlendMode: "screen",
      pointerEvents: "none",
    }}
  />
);
