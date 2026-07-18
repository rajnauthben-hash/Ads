import { AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame } from "remotion";
import { useEffect, useRef } from "react";
import { C, F, LV } from "./styles/tokens";
import { initLvFonts } from "./styles/fonts";
import { iv } from "../omniflowad/ui/anim";
import { CityGridBackground } from "../omniflowad/ui/CityGridBackground";
import { Vignette } from "../omniflowad/ui/Atmos";
import { Scene01VisibleStorefront } from "./scenes/Scene01VisibleStorefront";
import { Scene02ProfileMismatch } from "./scenes/Scene02ProfileMismatch";
import { Scene03CompetitorCall } from "./scenes/Scene03CompetitorCall";
import { Scene04OmniFlowSolution } from "./scenes/Scene04OmniFlowSolution";

/**
 * OmniFlow Local Visibility Ad — 16s / 480f / 1080x1920 / 30fps.
 * One continuous environment: wet-street world (sc.01, 03), city-grid map
 * (sc.02 diagram, sc.04), one cyan signal connecting search → profile →
 * call → final route. Scenes overlap 12f so element hand-offs finish under
 * the incoming scene; no full-screen crossfades.
 */
const TAIL = 12;

export const OmniFlowLocalVisibilityAd: React.FC = () => {
  const frame = useCurrentFrame();

  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("lv-fonts");
    initLvFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  // City grid: under scene 02's diagram and scene 04's map world.
  const gridOpacity =
    iv(frame, [LV.s2 - 12, LV.s2 + 10], [0, 0.9]) -
    iv(frame, [LV.s3 - 10, LV.s3 + 8], [0, 0.55]) +
    iv(frame, [LV.s4 - 12, LV.s4 + 10], [0, 0.65]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: F.body,
        background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 58%, ${C.bg} 100%)`,
      }}
    >
      {gridOpacity > 0.001 && <CityGridBackground opacity={gridOpacity} frame={frame} />}

      <Sequence from={LV.s1} durationInFrames={LV.len + TAIL}>
        <Scene01VisibleStorefront />
      </Sequence>
      <Sequence from={LV.s2} durationInFrames={LV.len + TAIL}>
        <Scene02ProfileMismatch />
      </Sequence>
      <Sequence from={LV.s3} durationInFrames={LV.len + TAIL}>
        <Scene03CompetitorCall />
      </Sequence>
      <Sequence from={LV.s4} durationInFrames={LV.end - LV.s4}>
        <Scene04OmniFlowSolution />
      </Sequence>

      <Vignette />
    </AbsoluteFill>
  );
};
