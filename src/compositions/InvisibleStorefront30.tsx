import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, delayRender, continueRender } from "remotion";
import { COLORS } from "../config/design";
import { SCENES } from "../config/timing";
import { fontsReady } from "../config/fonts";
import { RouteSystem } from "../components/RouteSystem";
import { Scene01Hook } from "../scenes/Scene01Hook";
import { Scene02Search } from "../scenes/Scene02Search";
import { Scene03Compression } from "../scenes/Scene03Compression";
import { Scene04Skipped } from "../scenes/Scene04Skipped";
import { Scene05Invisible } from "../scenes/Scene05Invisible";
import { Scene06PreSold } from "../scenes/Scene06PreSold";
import { Scene07Profile } from "../scenes/Scene07Profile";
import { Scene08Signals } from "../scenes/Scene08Signals";
import { Scene09Outcomes } from "../scenes/Scene09Outcomes";
import { Scene10Resolution } from "../scenes/Scene10Resolution";

const SCENE_COMPONENTS = [
  Scene01Hook,
  Scene02Search,
  Scene03Compression,
  Scene04Skipped,
  Scene05Invisible,
  Scene06PreSold,
  Scene07Profile,
  Scene08Signals,
  Scene09Outcomes,
  Scene10Resolution,
];

export const InvisibleStorefront30: React.FC = () => {
  const frame = useCurrentFrame();
  const handle = useRef<number | null>(null);

  useEffect(() => {
    handle.current = delayRender("invisible-storefront-fonts");
    fontsReady().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <RouteSystem frame={frame} />

      {SCENES.map((scene, i) => {
        const SceneComponent = SCENE_COMPONENTS[i];
        return (
          <Sequence key={scene.id} from={scene.start} durationInFrames={scene.end - scene.start + 1}>
            <SceneComponent />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const INVISIBLE_STOREFRONT_DURATION = SCENES[SCENES.length - 1].end + 1;
