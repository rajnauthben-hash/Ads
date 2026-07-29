import React from "react";
import { FONTS } from "../styles/typography";
import { COLORS } from "../styles/tokens";

// Broken cyan circular ring + "OmniFlow" wordmark + widely-tracked "DIGITAL".
export const OmniFlowRing: React.FC<{ size: number; glow?: boolean }> = ({
  size,
  glow = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ filter: glow ? "drop-shadow(0 0 10px rgba(24,216,255,0.5))" : undefined }}
  >
    {/* two broken arcs forming a ring */}
    <path
      d="M 38 13 A 18 18 0 1 0 41 27"
      fill="none"
      stroke={COLORS.cyan}
      strokeWidth={4.5}
      strokeLinecap="round"
    />
    <path
      d="M 10 35 A 18 18 0 0 0 20 41.4"
      fill="none"
      stroke={COLORS.cyanSecondary}
      strokeWidth={4.5}
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="6.5" fill="none" stroke={COLORS.cyan} strokeWidth={3} />
  </svg>
);

export const OmniFlowBrandLockup: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  opacity?: number;
  ringGlow?: boolean;
}> = ({ x, y, width, height, scale = 1, opacity = 1, ringGlow }) => {
  const ringSize = Math.min(height * 0.78, 62);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        display: "flex",
        alignItems: "center",
        gap: ringSize * 0.28,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
        opacity,
      }}
    >
      <OmniFlowRing size={ringSize} glow={ringGlow} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: FONTS.headline,
            fontWeight: 700,
            fontSize: ringSize * 0.62,
            color: COLORS.headline,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          OmniFlow
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontWeight: 500,
            fontSize: ringSize * 0.26,
            color: COLORS.cyan,
            letterSpacing: "0.42em",
            marginTop: ringSize * 0.08,
          }}
        >
          DIGITAL
        </div>
      </div>
    </div>
  );
};
