import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENES, SCENE_LEN } from "../config/timing";
import { EnergyStreak } from "../components/EnergyStreak";
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

const SCENE_COMPONENTS: React.FC[] = [
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
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #080B0D 0%, #0D0F11 45%, #121314 100%)",
        overflow: "hidden",
      }}
    >
      {SCENES.map((scene, i) => {
        const SceneComponent = SCENE_COMPONENTS[i];
        // Non-final scenes overhang 14 frames past their cut so the outgoing
        // composition keeps dimming underneath the incoming scene — cuts are
        // bridged by shared motion, never a black hole.
        const overhang = i < SCENES.length - 1 ? 14 : 0;
        return (
          <Sequence key={scene.id} from={scene.start} durationInFrames={SCENE_LEN + overhang}>
            <SceneComponent />
          </Sequence>
        );
      })}
      <EnergyStreak />
    </AbsoluteFill>
  );
};

export const INVISIBLE_STOREFRONT_DURATION = SCENES[SCENES.length - 1].end + 1;
