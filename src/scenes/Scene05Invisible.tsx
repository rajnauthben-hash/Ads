import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

const DIVIDER_X = 536;

/** Diagnostic scan travelling down the central divider, then the ghost side dims. */
const ScanDivider: React.FC = () => {
  const frame = useCurrentFrame();
  const headY = interpolate(frame, [14, 46], [620, 1940], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headOpacity = interpolate(frame, [14, 18, 42, 48], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ghostDim = interpolate(frame, [48, 74], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      {headOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: DIVIDER_X - 3,
            top: headY - 90,
            width: 6,
            height: 180,
            background: `linear-gradient(to bottom, transparent, ${COLORS.cyan}, transparent)`,
            opacity: headOpacity,
            mixBlendMode: "screen",
            filter: "blur(2px)",
          }}
        />
      )}
      {/* right (digital) side fades toward near-invisibility after the scan */}
      <div
        style={{
          position: "absolute",
          left: DIVIDER_X,
          top: 620,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.9)",
          opacity: ghostDim,
          maskImage: "linear-gradient(to right, transparent 0%, black 22%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%)",
        }}
      />
    </>
  );
};

export const Scene05Invisible: React.FC = () => (
  <PlateScene scene={5}>
    <ScanDivider />
  </PlateScene>
);
