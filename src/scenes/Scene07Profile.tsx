import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { BusinessProfile } from "../components/BusinessProfile";
import { StoreNode } from "../components/StoreNode";
import { RoutePath } from "../components/RoutePath";

const SCENE = SCENES[6];
const DURATION = SCENE.end - SCENE.start + 1;
const PANEL = { x: 64, y: 860, width: 560 };
const STORE = { x: 830, y: 1120 };

export const Scene07Profile: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[7];
  const fade = sceneFadeOpacity(frame, DURATION, 7, 10);

  const routeProgress = interpolate(frame, [56, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const storeStrength = interpolate(frame, [56, DURATION - 4], [0.5, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[
          { x: PANEL.x + PANEL.width - 4, y: 1250 },
          { x: 740, y: 1150 },
          { x: 790, y: 1090 },
          STORE,
        ]}
        frame={frame}
        progress={routeProgress}
        particleCount={2}
      />

      <StoreNode x={STORE.x} y={STORE.y} frame={frame} strength={storeStrength} scale={0.85} entrance={1} />

      <BusinessProfile frame={frame} start={16} x={PANEL.x} y={PANEL.y} width={PANEL.width} />

      <SceneHeader frame={frame} sceneNumber={7} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={42} block={copy.body} />
    </AbsoluteFill>
  );
};
