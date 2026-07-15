import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

/** Interface scan sweeping down the painted business-profile panel. */
const PanelScan: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 20;
  if (local < 0 || local > 30) return null;
  const y = interpolate(local, [0, 30], [700, 1700]);
  const opacity = interpolate(local, [0, 5, 25, 30], [0, 0.4, 0.4, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 62,
        top: y,
        width: 470,
        height: 5,
        background: COLORS.cyan,
        opacity,
        mixBlendMode: "screen",
        filter: "blur(3px)",
      }}
    />
  );
};

export const Scene07Profile: React.FC = () => (
  // "first impression." (body line 2) carries the cyan emphasis pulse.
  <PlateScene scene={7} bodyEmphasis={{ line: 1, at: 46 }}>
    <PanelScan />
  </PlateScene>
);
