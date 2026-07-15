import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { PlateScene } from "./PlateScene";

/** Subtle darkening around the storefront as attention flows away from it. */
const IlluminationDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [56, 78], [0, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 230 - 260,
        top: 1290 - 190,
        width: 520,
        height: 380,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)",
        opacity,
      }}
    />
  );
};

export const Scene01Hook: React.FC = () => (
  // Gold phrase ("Google showed first.") ignites after the white lines settle.
  <PlateScene scene={1} isFirst headlineEmphasis={{ line: 3, at: 48 }}>
    <IlluminationDrop />
  </PlateScene>
);
