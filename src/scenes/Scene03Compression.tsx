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
import { RankingInterface } from "../components/RankingInterface";
import { STORE_POS } from "../config/routes";

const SCENE = SCENES[2];
const DURATION = SCENE.end - SCENE.start + 1;

const RANK1 = { x: 545, y: 875 };
const RANK2 = { x: 700, y: 875 };
const RANK3 = { x: 850, y: 875 };
const LOCK1 = { x: 985, y: 1180 };
const LOCK2 = { x: 915, y: 1420 };

export const Scene03Compression: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[3];
  const fade = sceneFadeOpacity(frame, DURATION, 3, 10);

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeProgress = (delay: number, span = 30) =>
    interpolate(frame, [delay, delay + span], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[STORE_POS, { x: 380, y: 1240 }, { x: 470, y: 1050 }, { x: 545, y: 940 }, RANK1]}
        frame={frame}
        progress={routeProgress(30)}
        particleCount={1}
      />
      <RoutePath
        points={[STORE_POS, { x: 420, y: 1260 }, { x: 560, y: 1080 }, { x: 660, y: 950 }, RANK2]}
        frame={frame}
        progress={routeProgress(38)}
        particleCount={1}
      />
      <RoutePath
        points={[STORE_POS, { x: 460, y: 1280 }, { x: 640, y: 1120 }, { x: 780, y: 960 }, RANK3]}
        frame={frame}
        progress={routeProgress(46)}
        particleCount={1}
      />
      <RoutePath
        points={[{ x: 780, y: 1060 }, LOCK1]}
        frame={frame}
        progress={routeProgress(46, 16)}
        arrow={false}
        strokeWidth={1.2}
        opacity={0.4}
        particleCount={0}
      />
      <RoutePath
        points={[{ x: 780, y: 1100 }, LOCK2]}
        frame={frame}
        progress={routeProgress(50, 16)}
        arrow={false}
        strokeWidth={1.2}
        opacity={0.4}
        particleCount={0}
      />

      <StoreNode x={STORE_POS.x} y={STORE_POS.y} frame={frame} strength={0.55} entrance={1} />

      <RankingInterface
        frame={frame}
        start={14}
        bracketY={780}
        bracketLeft={545}
        bracketRight={850}
        tickXs={[545, 700, 850]}
        tickBottom={875}
        fadeXs={[990, 1040]}
        fadeBottom={1150}
      />
      <LocationPin
        x={RANK1.x}
        y={RANK1.y}
        icon="star"
        tone="gold"
        frame={frame}
        seed={1}
        label="1"
        entrance={entrance(20)}
      />
      <LocationPin
        x={RANK2.x}
        y={RANK2.y}
        icon="medal"
        tone="gold"
        frame={frame}
        seed={2}
        label="2"
        entrance={entrance(26)}
      />
      <LocationPin
        x={RANK3.x}
        y={RANK3.y}
        icon="crown"
        tone="gold"
        frame={frame}
        seed={3}
        label="3"
        entrance={entrance(32)}
      />
      <LocationPin
        x={LOCK1.x}
        y={LOCK1.y}
        icon="lock"
        tone="dim"
        frame={frame}
        active={false}
        showRings={false}
        entrance={entrance(40)}
      />
      <LocationPin
        x={LOCK2.x}
        y={LOCK2.y}
        icon="lock"
        tone="dim"
        frame={frame}
        active={false}
        showRings={false}
        entrance={entrance(44)}
      />

      <SceneHeader frame={frame} sceneNumber={3} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={38} block={copy.body} />
    </AbsoluteFill>
  );
};
