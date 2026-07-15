import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { PlateScene } from "./PlateScene";

/**
 * Metric callouts ignite in sequence: a soft cyan halo behind each painted
 * metric label as the graph passes beneath it.
 */
const MetricIgnitions: React.FC = () => {
  const frame = useCurrentFrame();
  const metrics = [
    { x: 169, y: 990, at: 20 },
    { x: 410, y: 950, at: 30 },
    { x: 643, y: 870, at: 40 },
    { x: 899, y: 800, at: 50 },
  ];
  return (
    <>
      {metrics.map((m, i) => {
        const local = frame - m.at;
        if (local < 0) return null;
        const o = interpolate(local, [0, 8, 26], [0, 0.4, 0.16], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x - 130,
              top: m.y - 190,
              width: 260,
              height: 340,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${COLORS.cyan} 0%, transparent 62%)`,
              opacity: o,
              mixBlendMode: "screen",
              filter: "blur(6px)",
            }}
          />
        );
      })}
    </>
  );
};

export const Scene09Outcomes: React.FC = () => (
  <PlateScene scene={9}>
    <MetricIgnitions />
  </PlateScene>
);
