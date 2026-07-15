import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { NodePulseOverlay } from "../components/NodePulseOverlay";
import { PlateScene } from "./PlateScene";

const NODES = [
  { x: 147, y: 933 },
  { x: 539, y: 752 },
  { x: 930, y: 936 },
  { x: 197, y: 1424 },
  { x: 867, y: 1424 },
];

/** One synchronized visibility pulse across all five signal nodes + store. */
const FinalSyncPulse: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 62) return null;
  return (
    <>
      {NODES.map((n, i) => (
        <NodePulseOverlay key={i} x={n.x} y={n.y} frame={frame} at={62} color="cyan" radius={95} />
      ))}
      <NodePulseOverlay x={540} y={1150} frame={frame} at={62} color="cyan" radius={170} />
    </>
  );
};

/** Central signal intensity grows with each completed connection. */
const CentralIntensity: React.FC = () => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [12, 20, 28, 36, 44, 52], [0, 0.2, 0.4, 0.6, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (level <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 220,
        top: 1150 - 160,
        width: 440,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,210,255,0.5) 0%, rgba(0,210,255,0) 65%)",
        opacity: 0.35 * level + 0.08 * Math.sin(frame / 8) * level,
        mixBlendMode: "screen",
      }}
    />
  );
};

export const Scene08Signals: React.FC = () => (
  <PlateScene scene={8}>
    <CentralIntensity />
    <FinalSyncPulse />
  </PlateScene>
);
