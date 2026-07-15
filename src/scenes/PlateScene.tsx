import React from "react";
import { useCurrentFrame } from "remotion";
import { OVERLAYS } from "../config/plates";
import { T } from "../config/timing";
import { SceneTransition } from "../components/SceneTransition";
import { ReferenceArtworkLayer } from "../components/ReferenceArtworkLayer";
import { AnimatedRouteOverlay } from "../components/AnimatedRouteOverlay";
import { NodePulseOverlay } from "../components/NodePulseOverlay";
import { SignalRingOverlay } from "../components/SignalRingOverlay";
import { SceneHeaderLayer } from "../components/SceneHeaderLayer";
import { ReferenceTextLayer } from "../components/ReferenceTextLayer";

/**
 * Shared scene chassis: reference artwork plate + configured route/node/ring
 * overlays + extracted typography, all inside the standard transition
 * envelope. Scene files add scene-specific effects as children (rendered
 * between the overlays and the typography).
 */
export const PlateScene: React.FC<{
  scene: number;
  isFirst?: boolean;
  isLast?: boolean;
  headlineEmphasis?: { line: number; at: number };
  bodyEmphasis?: { line: number; at: number };
  children?: React.ReactNode;
}> = ({ scene, isFirst, isLast, headlineEmphasis, bodyEmphasis, children }) => {
  const frame = useCurrentFrame();
  const overlays = OVERLAYS[scene];

  return (
    <SceneTransition frame={frame} isFirst={isFirst} isLast={isLast}>
      <ReferenceArtworkLayer scene={scene} frame={frame} />
      {overlays.store && (
        <SignalRingOverlay
          x={overlays.store.x}
          y={overlays.store.y}
          frame={frame}
          at={overlays.store.at}
          strength={overlays.store.strength}
        />
      )}
      {overlays.routes.map((r, i) => (
        <AnimatedRouteOverlay
          key={i}
          points={r.points}
          frame={frame}
          start={r.at}
          color={r.color}
          width={r.width}
        />
      ))}
      {overlays.pulses.map((p, i) => (
        <NodePulseOverlay
          key={i}
          x={p.x}
          y={p.y}
          frame={frame}
          at={p.at}
          color={p.color}
          radius={p.radius}
        />
      ))}
      {children}
      <SceneHeaderLayer scene={scene} frame={frame} />
      <ReferenceTextLayer
        scene={scene}
        kind="headline"
        frame={frame}
        start={T.headStart + 2}
        emphasis={headlineEmphasis}
      />
      <ReferenceTextLayer
        scene={scene}
        kind="body"
        frame={frame}
        start={T.bodyStart}
        emphasis={bodyEmphasis}
      />
    </SceneTransition>
  );
};
