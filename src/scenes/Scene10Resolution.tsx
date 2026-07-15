import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { PlateScene } from "./PlateScene";

/** Final resolution: the whole neighborhood lifts to its brightest state. */
const ResolutionLift: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [44, 70], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 70% 45% at 62% 55%, rgba(0,210,255,0.55) 0%, rgba(255,199,0,0.2) 45%, transparent 75%)",
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
};

export const Scene10Resolution: React.FC = () => (
  // "local buying decisions" (cyan in the plate) gets the emphasis pulse.
  <PlateScene scene={10} isLast bodyEmphasis={{ line: 0, at: 50 }}>
    <ResolutionLift />
  </PlateScene>
);
