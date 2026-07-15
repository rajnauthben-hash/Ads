import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { SearchInterface } from "../components/SearchInterface";
import { LocationPin } from "../components/LocationPin";
import { RoutePath } from "../components/RoutePath";

const SCENE = SCENES[1];
const DURATION = SCENE.end - SCENE.start + 1;

const PANEL = { x: 64, y: 760, width: 560 };
const CONVERGE = { x: 678, y: 1111 };
const STAR = { x: 800, y: 820 };
const COFFEE = { x: 962, y: 980 };
const BAG = { x: 826, y: 1250 };
const GHOST = { x: 700, y: 1120 };

export const Scene02Search: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[2];
  const fade = sceneFadeOpacity(frame, DURATION, 2, 10);

  const entrance = (delay: number) =>
    interpolate(frame, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bridgeProgress = interpolate(frame, [46, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[{ x: 20, y: 1500 }, { x: 260, y: 1400 }, { x: 500, y: 1220 }, CONVERGE]}
        frame={frame}
        progress={interpolate(frame, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        particleCount={2}
        arrow={false}
      />
      <RoutePath
        points={[CONVERGE, { x: 720, y: 980 }, { x: 800, y: 860 }, STAR]}
        frame={frame}
        progress={bridgeProgress}
        particleCount={1}
      />
      <RoutePath
        points={[CONVERGE, { x: 860, y: 1050 }, COFFEE]}
        frame={frame}
        progress={bridgeProgress}
        particleCount={1}
      />
      <RoutePath
        points={[CONVERGE, { x: 760, y: 1200 }, BAG]}
        frame={frame}
        progress={bridgeProgress}
        particleCount={1}
      />

      <LocationPin x={STAR.x} y={STAR.y} icon="star" tone="gold" frame={frame} seed={1} entrance={entrance(48)} />
      <LocationPin
        x={COFFEE.x}
        y={COFFEE.y}
        icon="coffee"
        tone="gold"
        frame={frame}
        seed={2}
        entrance={entrance(56)}
      />
      <LocationPin x={BAG.x} y={BAG.y} icon="bag" tone="gold" frame={frame} seed={3} entrance={entrance(64)} />
      <LocationPin
        x={GHOST.x}
        y={GHOST.y}
        icon="storefront"
        tone="dim"
        frame={frame}
        seed={4}
        active={false}
        showRings={false}
        entrance={entrance(40)}
      />

      <SearchInterface frame={frame} start={4} x={PANEL.x} y={PANEL.y} width={PANEL.width} />

      <SceneHeader frame={frame} sceneNumber={2} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={22} block={copy.body} />
    </AbsoluteFill>
  );
};
