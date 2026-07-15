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
import { TelemetryReadout } from "../components/WorldMap";
import { STORE_POS } from "../config/routes";

const SCENE = SCENES[9];
const DURATION = SCENE.end - SCENE.start + 1;

const CROWN = { x: 750, y: 930 };
const COFFEE = { x: 760, y: 720 };
const CART = { x: 530, y: 800 };
const BAG = { x: 935, y: 970 };
const FORK = { x: 880, y: 1370 };

export const Scene10Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[10];
  const fade = sceneFadeOpacity(frame, DURATION, 10, 10);

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeProgress = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crownPulse = interpolate(frame, [38, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <TelemetryReadout x={64} y={640} frame={frame} start={8} />

      <RoutePath
        points={[STORE_POS, { x: 430, y: 1360 }, { x: 590, y: 1190 }, { x: 660, y: 1030 }, CROWN]}
        frame={frame}
        progress={routeProgress}
        color="gold"
        particleCount={2}
      />
      <RoutePath
        points={[CROWN, { x: 660, y: 850 }, COFFEE]}
        frame={frame}
        progress={interpolate(frame, [18, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        arrow={false}
        strokeWidth={1.4}
        opacity={0.55}
        particleCount={0}
      />
      <RoutePath
        points={[CROWN, { x: 630, y: 880 }, CART]}
        frame={frame}
        progress={interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        arrow={false}
        strokeWidth={1.4}
        opacity={0.55}
        particleCount={0}
      />
      <RoutePath
        points={[CROWN, { x: 850, y: 950 }, BAG]}
        frame={frame}
        progress={interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        arrow={false}
        strokeWidth={1.4}
        opacity={0.55}
        particleCount={0}
      />
      <RoutePath
        points={[STORE_POS, { x: 600, y: 1500 }, { x: 780, y: 1500 }, FORK]}
        frame={frame}
        progress={interpolate(frame, [12, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        strokeWidth={1.6}
        opacity={0.65}
        particleCount={1}
      />

      <StoreNode x={STORE_POS.x} y={STORE_POS.y} frame={frame} strength={1} entrance={1} />

      <LocationPin x={COFFEE.x} y={COFFEE.y} icon="coffee" tone="gold" frame={frame} seed={1} entrance={entrance(20)} />
      <LocationPin x={CART.x} y={CART.y} icon="cart" tone="gold" frame={frame} seed={2} entrance={entrance(23)} />
      <LocationPin x={BAG.x} y={BAG.y} icon="bag" tone="gold" frame={frame} seed={3} entrance={entrance(26)} />
      <LocationPin x={FORK.x} y={FORK.y} icon="fork" tone="gold" frame={frame} seed={4} entrance={entrance(16)} />
      <LocationPin
        x={CROWN.x}
        y={CROWN.y}
        icon="crown"
        tone="gold"
        frame={frame}
        seed={5}
        scale={1.35 + crownPulse * 0.08}
        entrance={entrance(30)}
      />

      <SceneHeader frame={frame} sceneNumber={10} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={36} block={copy.body} />
    </AbsoluteFill>
  );
};
