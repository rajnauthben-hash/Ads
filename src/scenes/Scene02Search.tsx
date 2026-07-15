import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

/**
 * Sequential row-activation scanlines over the painted search interface —
 * each interface row gets a brief cyan sweep as it "assembles".
 */
const RowActivation: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { y: 800, at: 12 },
    { y: 965, at: 19 },
    { y: 1095, at: 26 },
    { y: 1225, at: 33 },
    { y: 1345, at: 40 },
  ];
  return (
    <>
      {rows.map((r, i) => {
        const local = frame - r.at;
        if (local < 0 || local > 16) return null;
        const x = interpolate(local, [0, 16], [60, 470]);
        const opacity = interpolate(local, [0, 4, 12, 16], [0, 0.5, 0.5, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: r.y - 40,
              width: 5,
              height: 90,
              background: COLORS.cyan,
              opacity,
              mixBlendMode: "screen",
              filter: "blur(3px)",
            }}
          />
        );
      })}
    </>
  );
};

export const Scene02Search: React.FC = () => (
  <PlateScene scene={2}>
    <RowActivation />
  </PlateScene>
);
