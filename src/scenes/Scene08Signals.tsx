import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { StoreNode } from "../components/StoreNode";
import { SignalNode } from "../components/SignalNode";

const SCENE = SCENES[7];
const DURATION = SCENE.end - SCENE.start + 1;
const STORE = { x: 540, y: 1150 };

export const Scene08Signals: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[8];
  const fade = sceneFadeOpacity(frame, DURATION, 8, 10);

  const storeStrength = interpolate(frame, [10, DURATION - 10], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <StoreNode x={STORE.x} y={STORE.y} frame={frame} strength={storeStrength} entrance={1} />

      <SignalNode
        frame={frame}
        start={12}
        x={170}
        y={1000}
        bendX={350}
        bendY={1080}
        storeX={STORE.x}
        storeY={STORE.y}
        icon="camera"
        label="PHOTOS"
        gold
      />
      <SignalNode
        frame={frame}
        start={20}
        x={540}
        y={780}
        bendX={540}
        bendY={950}
        storeX={STORE.x}
        storeY={STORE.y}
        icon="star"
        label="REVIEWS"
        showStars
      />
      <SignalNode
        frame={frame}
        start={28}
        x={930}
        y={1000}
        bendX={730}
        bendY={1080}
        storeX={STORE.x}
        storeY={STORE.y}
        icon="list"
        label="CATEGORIES"
        gold
      />
      <SignalNode
        frame={frame}
        start={36}
        x={260}
        y={1400}
        bendX={400}
        bendY={1280}
        storeX={STORE.x}
        storeY={STORE.y}
        icon="clock"
        label="HOURS"
        gold
      />
      <SignalNode
        frame={frame}
        start={44}
        x={830}
        y={1400}
        bendX={680}
        bendY={1280}
        storeX={STORE.x}
        storeY={STORE.y}
        icon="chartUp"
        label="ACTIVITY"
        gold
      />

      <SceneHeader frame={frame} sceneNumber={8} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={36} block={copy.body} />
    </AbsoluteFill>
  );
};
