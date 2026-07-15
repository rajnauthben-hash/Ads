import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { PlateScene } from "./PlateScene";

/** The storefront's signal visibly weakens while traffic passes it by. */
const StoreSignalDim: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [40, 74], [0, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 240 - 250,
        top: 1350 - 180,
        width: 500,
        height: 360,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)",
        opacity,
      }}
    />
  );
};

export const Scene04Skipped: React.FC = () => (
  <PlateScene scene={4}>
    <StoreSignalDim />
  </PlateScene>
);
