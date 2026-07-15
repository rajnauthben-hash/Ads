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
import { MetricsGraph, type Callout } from "../components/MetricsGraph";
import type { Pt } from "../components/pathMath";

const SCENE = SCENES[8];
const DURATION = SCENE.end - SCENE.start + 1;
const STORE = { x: 150, y: 1680 };

const POINTS: Pt[] = [
  { x: 90, y: 1560 },
  { x: 230, y: 1480 },
  { x: 340, y: 1460 },
  { x: 430, y: 1380 },
  { x: 560, y: 1330 },
  { x: 620, y: 1250 },
  { x: 700, y: 1200 },
  { x: 790, y: 1080 },
  { x: 900, y: 950 },
  { x: 980, y: 860 },
];

const CALLOUTS: Callout[] = [
  { icon: "phone", label: "CALLS", value: "+68%", pointIndex: 1, calloutY: 820 },
  { icon: "compass", label: "DIRECTIONS", value: "+53%", pointIndex: 3, calloutY: 760 },
  { icon: "people", label: "VISITS", value: "+42%", pointIndex: 5, calloutY: 700 },
  { icon: "chartUp", label: "REVENUE", value: "+31%", pointIndex: 7, calloutY: 650 },
];

const CAR = { x: 450, y: 1530 };
const WALKER = { x: 660, y: 1490 };
const GROUP = { x: 890, y: 1360 };

export const Scene09Outcomes: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[9];
  const fade = sceneFadeOpacity(frame, DURATION, 9, 10);

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[STORE, POINTS[0]]}
        frame={frame}
        progress={interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        arrow={false}
        particleCount={0}
      />

      <MetricsGraph frame={frame} start={6} points={POINTS} callouts={CALLOUTS} duration={58} />

      <StoreNode x={STORE.x} y={STORE.y} frame={frame} strength={0.9} scale={0.85} entrance={1} />

      <LocationPin x={CAR.x} y={CAR.y} icon="car" tone="gold" frame={frame} seed={1} entrance={entrance(26)} showRings={false} />
      <LocationPin x={WALKER.x} y={WALKER.y} icon="walker" tone="gold" frame={frame} seed={2} entrance={entrance(38)} showRings={false} />
      <LocationPin x={GROUP.x} y={GROUP.y} icon="people" tone="gold" frame={frame} seed={3} entrance={entrance(50)} showRings={false} />

      <SceneHeader frame={frame} sceneNumber={9} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={36} block={copy.body} />
    </AbsoluteFill>
  );
};
