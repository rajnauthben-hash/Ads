import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

type Props = {
  // Local frame the infinity mark starts drawing.
  appear: number;
  y: number;
};

// OmniFlow infinity mark drawn via SVG stroke animation, then the wordmark
// materializes from a directional mask. "OmniFlow" white, "Digital" cyan.
export const OmniFlowLogo: React.FC<Props> = ({ appear, y }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [appear, appear + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.8, 0.3, 1),
  });
  const textT = interpolate(frame, [appear + 12, appear + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  if (draw <= 0) {
    return null;
  }
  // Infinity as two overlapping loops via a single cubic path.
  const markW = 108;
  const markPath =
    "M 30 27 C 12 27 12 54 30 54 C 48 54 60 27 78 27 C 96 27 96 54 78 54 C 60 54 48 27 30 27 Z";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      <svg width={markW} height={80} viewBox="0 0 108 80" style={{ overflow: "visible" }}>
        <path d={markPath} fill="none" stroke={COLORS.cyan} strokeWidth={7} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - draw)} style={{ filter: "drop-shadow(0 0 8px rgba(31,199,255,0.5))" }} />
      </svg>
      <div
        style={{
          fontFamily: FONTS.head,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: "-0.02em",
          opacity: textT,
          filter: `blur(${(1 - textT) * 8}px)`,
          transform: `translate3d(${(1 - textT) * -16}px, 0, 0)`,
        }}
      >
        <span style={{ color: COLORS.white }}>OmniFlow</span>
        <span style={{ color: COLORS.cyanDeep }}> Digital</span>
      </div>
    </div>
  );
};
