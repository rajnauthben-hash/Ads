import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { initAdFonts } from "./styles/fonts";
import { COLORS } from "./styles/tokens";
import { Background } from "./components/Background";
import { VirtualCamera } from "./components/VirtualCamera";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { SceneTransition, OVERLAP } from "./components/SceneTransition";
import { Scene01WebsiteLive } from "./scenes/Scene01WebsiteLive";
import { Scene02SearchPathway } from "./scenes/Scene02SearchPathway";
import { Scene03BlockedTraffic } from "./scenes/Scene03BlockedTraffic";
import { Scene04CompetitorRedirect } from "./scenes/Scene04CompetitorRedirect";
import { Scene05OmniFlowSolution } from "./scenes/Scene05OmniFlowSolution";

initAdFonts();

export const OmniFlowCloggedArteriesAd: React.FC<{ safeZones?: boolean }> = ({
  safeZones = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      <Background />
      <VirtualCamera>
        <Sequence from={0} durationInFrames={180 + OVERLAP} name="Scene 1 — Website Live">
          <SceneTransition isFirst>
            <Scene01WebsiteLive />
          </SceneTransition>
        </Sequence>
        <Sequence from={180} durationInFrames={180 + OVERLAP} name="Scene 2 — Search Pathway">
          <SceneTransition>
            <Scene02SearchPathway />
          </SceneTransition>
        </Sequence>
        <Sequence from={360} durationInFrames={180 + OVERLAP} name="Scene 3 — Blocked Traffic">
          <SceneTransition>
            <Scene03BlockedTraffic />
          </SceneTransition>
        </Sequence>
        <Sequence from={540} durationInFrames={180 + OVERLAP} name="Scene 4 — Competitor Redirect">
          <SceneTransition>
            <Scene04CompetitorRedirect />
          </SceneTransition>
        </Sequence>
        <Sequence from={720} durationInFrames={180} name="Scene 5 — OmniFlow Solution">
          <SceneTransition isLast>
            <Scene05OmniFlowSolution />
          </SceneTransition>
        </Sequence>
      </VirtualCamera>
      <SafeZoneOverlay show={safeZones} />
    </AbsoluteFill>
  );
};
