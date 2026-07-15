import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { StoreNode } from "../components/StoreNode";
import { LocationPin } from "../components/LocationPin";
import { RoutePath } from "../components/RoutePath";
import { STORE_POS } from "../config/routes";

const SCENE = SCENES[3];
const DURATION = SCENE.end - SCENE.start + 1;

const COFFEE = { x: 790, y: 800 };
const BAG = { x: 940, y: 1080 };
const FORK = { x: 900, y: 1420 };

export const Scene04Skipped: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[4];
  const fade = sceneFadeOpacity(frame, DURATION, 4, 10);

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeProgress = (delay: number, span = 28) =>
    interpolate(frame, [delay, delay + span], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const storeStrength = interpolate(frame, [0, DURATION - 10], [0.5, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[STORE_POS, { x: 500, y: 1250 }, { x: 560, y: 1000 }, { x: 700, y: 850 }, COFFEE]}
        frame={frame}
        progress={routeProgress(10)}
        particleCount={2}
      />
      <RoutePath
        points={[STORE_POS, { x: 350, y: 1450 }, { x: 650, y: 1500 }, { x: 850, y: 1300 }, BAG]}
        frame={frame}
        progress={routeProgress(28)}
        particleCount={1}
      />
      <RoutePath
        points={[STORE_POS, { x: 300, y: 1500 }, { x: 450, y: 1620 }, { x: 700, y: 1600 }, FORK]}
        frame={frame}
        progress={routeProgress(44)}
        particleCount={1}
      />

      <StoreNode x={STORE_POS.x} y={STORE_POS.y} frame={frame} strength={storeStrength} entrance={1} />

      <LocationPin x={COFFEE.x} y={COFFEE.y} icon="coffee" tone="gold" frame={frame} seed={1} entrance={entrance(20)} />
      <LocationPin x={BAG.x} y={BAG.y} icon="bag" tone="gold" frame={frame} seed={2} entrance={entrance(38)} />
      <LocationPin x={FORK.x} y={FORK.y} icon="fork" tone="gold" frame={frame} seed={3} entrance={entrance(54)} />

      <SceneHeader frame={frame} sceneNumber={4} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={40} block={copy.body} />
    </AbsoluteFill>
  );
};
