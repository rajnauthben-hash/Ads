import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

/** The RANKING bracket ignites as attention compresses onto positions 1–3. */
const BracketIgnition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [14, 26, 50, 70], [0, 0.5, 0.35, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 300,
        top: 620,
        width: 470,
        height: 210,
        border: `1px solid ${COLORS.gold}`,
        borderBottom: "none",
        opacity,
        mixBlendMode: "screen",
        filter: "blur(1px)",
      }}
    />
  );
};

export const Scene03Compression: React.FC = () => (
  <PlateScene scene={3}>
    <BracketIgnition />
  </PlateScene>
);
