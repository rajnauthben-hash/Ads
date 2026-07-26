import React from "react";
import { FONT_HEADLINE } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

/**
 * OMNIFLOW DIGITAL brand lockup. OMNIFLOW in white, DIGITAL in restrained warm
 * gold, matching the approved keyframes. Used top-corner as a persistent brand
 * mark and large in the Scene 6 resolution.
 */
export const BrandLockup: React.FC<{
  x: number;
  y: number;
  size?: number;
  reveal?: number; // 0..1 mask reveal
  align?: "left" | "right";
  zIndex?: number;
}> = ({ x, y, size = 26, reveal = 1, align = "left", zIndex = 65 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1080 - x : undefined,
        top: y,
        zIndex,
        textAlign: align,
        clipPath: `inset(0 ${align === "right" ? 0 : 100 - reveal * 100}% 0 ${align === "right" ? 100 - reveal * 100 : 0}%)`,
        opacity: Math.min(1, reveal * 1.4),
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADLINE,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: size * 0.22,
          color: COLORS.white,
          lineHeight: 1,
        }}
      >
        OMNIFLOW
      </div>
      <div
        style={{
          fontFamily: FONT_HEADLINE,
          fontWeight: 700,
          fontSize: size * 0.62,
          letterSpacing: size * 0.42,
          color: COLORS.gold,
          marginTop: size * 0.22,
          lineHeight: 1,
        }}
      >
        DIGITAL
      </div>
    </div>
  );
};
