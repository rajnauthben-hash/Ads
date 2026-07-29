import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";

// Shared fixed map geometry (normalised 0..100 coordinate space). The same
// road network is reused across scenes; scenes crop/scale it via the box.
const ROADS = [
  "M0 22 H100",
  "M0 48 H100",
  "M0 74 H100",
  "M18 0 V100",
  "M46 0 V100",
  "M72 0 V100",
  // diagonal arterial
  "M0 92 L40 60 L64 62 L100 30",
  "M8 0 L30 30 L30 48",
  "M72 48 L88 66 L88 100",
];
const MINOR = [
  "M0 10 H100",
  "M0 35 H100",
  "M0 61 H100",
  "M0 87 H100",
  "M9 0 V100",
  "M32 0 V100",
  "M59 0 V100",
  "M86 0 V100",
];

export const MasterMapWorld: React.FC<{
  width: number;
  height: number;
  radius?: number;
  labels?: { text: string; x: number; y: number }[]; // percentages
  glowSpot?: { x: number; y: number } | null; // cyan illumination %
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, radius = 0, labels = [], glowSpot = null, style, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: COLORS.mapEnvironment,
        ...style,
      }}
    >
      {glowSpot && (
        <div
          style={{
            position: "absolute",
            left: `${glowSpot.x}%`,
            top: `${glowSpot.y}%`,
            width: width * 0.6,
            height: width * 0.6,
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(24,216,255,0.14), transparent 65%)",
            pointerEvents: "none",
          }}
        />
      )}
      <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute" }}>
        {MINOR.map((d, i) => (
          <path key={`m${i}`} d={d} stroke="rgba(255,255,255,0.04)" strokeWidth={0.3} fill="none" vectorEffect="non-scaling-stroke" />
        ))}
        {ROADS.map((d, i) => (
          <path key={`r${i}`} d={d} stroke="rgba(255,255,255,0.075)" strokeWidth={0.6} fill="none" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {labels.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${l.x}%`,
            top: `${l.y}%`,
            transform: "translate(-50%,-50%)",
            fontFamily: FONTS.ui,
            fontSize: Math.max(11, height * 0.016),
            letterSpacing: "0.22em",
            color: COLORS.mutedGray,
            opacity: 0.65,
            whiteSpace: "nowrap",
          }}
        >
          {l.text}
        </div>
      ))}
      {children}
    </div>
  );
};
