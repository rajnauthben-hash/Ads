import React from "react";
import { interpolate } from "remotion";
import { DataParticleStream } from "./DataParticle";
import { RoutePath } from "./PersistentPulseRoute";
import { SignalNode } from "./SignalNode";
import { type Pt } from "./helpers";
import { COLORS } from "./theme";

export type NetworkNode = {
  label: string;
  icon: "photos" | "reviews" | "categories" | "hours" | "updates";
  x: number;
  y: number;
};

type Props = {
  nodes: NetworkNode[];
  center: Pt;
  // Per-node activation frames (same rhythm as the keyword stack).
  activationFrames: number[];
  frame: number;
  // 0..1 — the synchronized network-wide pulse after all five connect.
  surge: number;
};

// The five-spoke signal network of scene 05: nodes activate on the keyword
// rhythm, each energizes its connection into the storefront, and once all
// five are live a single synchronized visibility pulse travels the network.
export const SignalNetwork: React.FC<Props> = ({
  nodes,
  center,
  activationFrames,
  frame,
  surge,
}) => {
  const connection = (n: NetworkNode): Pt[] => [
    { x: n.x, y: n.y + 70 },
    { x: (n.x + center.x) / 2, y: (n.y + center.y) / 2 + 14 },
    { x: center.x, y: center.y - 100 },
  ];

  return (
    <g>
      {nodes.map((n, i) => {
        const p = interpolate(frame, [activationFrames[i] + 6, activationFrames[i] + 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const pts = connection(n);
        return (
          <g key={n.label}>
            <RoutePath
              points={pts}
              progress={p}
              frame={frame}
              pulses={surge > 0 ? 3 : 1}
              coreWidth={surge > 0 ? 3 : 2}
              glowWidth={surge > 0 ? 14 : 9}
              glowOpacity={0.15 + surge * 0.14}
              hot={surge > 0}
              mapGlow={false}
              seed={71 + i}
            />
            <DataParticleStream points={pts} progress={p} count={2} seed={81 + i} size={2.4} speed={0.02} />
          </g>
        );
      })}

      {/* Synchronized network pulse once every signal is connected */}
      {surge > 0 && surge < 1 && (
        <>
          <circle
            cx={center.x}
            cy={center.y - 100}
            r={30 + surge * 430}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={2.2 * (1 - surge)}
            opacity={(1 - surge) * 0.6}
          />
          <circle
            cx={center.x}
            cy={center.y - 100}
            r={16 + surge * 300}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={1.4 * (1 - surge)}
            opacity={(1 - surge) * 0.4}
          />
        </>
      )}

      {nodes.map((n, i) => (
        <SignalNode key={n.label} label={n.label} icon={n.icon} x={n.x} y={n.y} activateFrame={activationFrames[i]} size={148} />
      ))}
    </g>
  );
};
