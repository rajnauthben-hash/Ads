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
import { TelemetryReadout } from "../components/WorldMap";
import { STORE_POS } from "../config/routes";

const SCENE = SCENES[0];
const DURATION = SCENE.end - SCENE.start + 1;
const COFFEE = { x: 745, y: 800 };
const BAG = { x: 918, y: 1068 };
const FORK = { x: 878, y: 1450 };

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[1];
  const fade = sceneFadeOpacity(frame, DURATION, 1, 10);

  const blackOverlay = interpolate(frame, [0, 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const storeStrength = interpolate(frame, [50, DURATION - 6], [1, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const routeProgress = interpolate(frame, [40, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pinEntrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <TelemetryReadout x={64} y={640} frame={frame} start={30} />

      <RoutePath
        points={[
          STORE_POS,
          { x: 430, y: 1360 },
          { x: 590, y: 1190 },
          { x: 630, y: 980 },
          { x: 700, y: 830 },
          { x: 745, y: 800 },
        ]}
        frame={frame}
        progress={routeProgress}
        particleCount={2}
      />
      <RoutePath
        points={[
          { x: 630, y: 980 },
          { x: 730, y: 1160 },
          { x: 820, y: 1340 },
          FORK,
        ]}
        frame={frame}
        progress={interpolate(frame, [58, 98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        particleCount={1}
      />
      <RoutePath
        points={[
          { x: 800, y: 1010 },
          BAG,
        ]}
        frame={frame}
        progress={interpolate(frame, [70, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        particleCount={0}
        arrow={false}
        strokeWidth={1.3}
        opacity={0.6}
      />

      <StoreNode x={STORE_POS.x} y={STORE_POS.y} frame={frame} strength={storeStrength} entrance={1} />
      <LocationPin
        x={COFFEE.x}
        y={COFFEE.y}
        icon="coffee"
        tone="gold"
        frame={frame}
        seed={1}
        entrance={pinEntrance(46)}
      />
      <LocationPin x={BAG.x} y={BAG.y} icon="bag" tone="gold" frame={frame} seed={2} entrance={pinEntrance(64)} />
      <LocationPin x={FORK.x} y={FORK.y} icon="fork" tone="gold" frame={frame} seed={3} entrance={pinEntrance(80)} />

      <SceneHeader frame={frame} sceneNumber={1} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={i === 0 ? 18 : 55} block={block} />
      ))}
      <BodyCopy frame={frame} start={76} block={copy.body} />

      <AbsoluteFill style={{ background: COLORS.bg, opacity: blackOverlay, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
