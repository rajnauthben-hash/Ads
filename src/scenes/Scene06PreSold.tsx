import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

/**
 * Information scan across each of the four painted result rows as they
 * assemble, top to bottom.
 */
const ResultRowScans: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { y: 860, at: 14 },
    { y: 1060, at: 22 },
    { y: 1255, at: 30 },
    { y: 1455, at: 38 },
  ];
  return (
    <>
      {rows.map((r, i) => {
        const local = frame - r.at;
        if (local < 0 || local > 18) return null;
        const x = interpolate(local, [0, 18], [50, 780]);
        const opacity = interpolate(local, [0, 4, 14, 18], [0, 0.45, 0.45, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: r.y - 75,
              width: 5,
              height: 150,
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

export const Scene06PreSold: React.FC = () => (
  <PlateScene scene={6}>
    <ResultRowScans />
  </PlateScene>
);
