import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config/design";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { StoreNode } from "../components/StoreNode";
import { LocationPin } from "../components/LocationPin";
import { RoutePath } from "../components/RoutePath";
import { STORE_POS } from "../config/routes";

const SCENE = SCENES[4];
const DURATION = SCENE.end - SCENE.start + 1;
const DIVIDER_X = 620;
const GHOST = { x: 940, y: 1300 };

export const Scene05Invisible: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[5];
  const fade = sceneFadeOpacity(frame, DURATION, 5, 10);

  const dividerOpacity = interpolate(frame, [10, 30], [0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scanX = interpolate(frame, [24, 60], [340, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [24, 34, 52, 62], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ghostEntrance = interpolate(frame, [34, 50, 70, DURATION - 4], [0, 0.8, 0.8, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const routeProgress = interpolate(frame, [16, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[STORE_POS, { x: 300, y: 1480 }, { x: 400, y: 1630 }, { x: 500, y: 1730 }]}
        frame={frame}
        progress={routeProgress}
        arrow={false}
        particleCount={2}
      />

      <StoreNode x={STORE_POS.x} y={STORE_POS.y} frame={frame} strength={1} entrance={1} />
      <LocationPin
        x={GHOST.x}
        y={GHOST.y}
        icon="pin"
        tone="dim"
        frame={frame}
        active={false}
        showRings={ghostEntrance > 0.1}
        entrance={Math.max(ghostEntrance, 0.001)}
      />

      <div
        style={{
          position: "absolute",
          left: DIVIDER_X,
          top: 600,
          bottom: 80,
          width: 1,
          opacity: dividerOpacity,
          background:
            "repeating-linear-gradient(to bottom, rgba(0,210,255,0.6) 0 3px, transparent 3px 12px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: scanX,
          top: 560,
          bottom: 40,
          width: 3,
          opacity: scanOpacity,
          background: COLORS.cyan,
          boxShadow: `0 0 30px 6px rgba(0,210,255,0.5)`,
        }}
      />

      <SceneHeader frame={frame} sceneNumber={5} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={36} block={copy.body} />
    </AbsoluteFill>
  );
};
