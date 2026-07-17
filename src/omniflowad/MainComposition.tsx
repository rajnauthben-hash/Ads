import { AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame } from "remotion";
import { useEffect, useRef } from "react";
import { FONT, SCENE } from "./theme";
import { initAdFonts } from "./fonts";
import { iv } from "./ui/anim";
import { CityGridBackground } from "./ui/CityGridBackground";
import { Vignette } from "./ui/Atmos";
import { Scene01Storefront } from "./scenes/Scene01Storefront";
import { Scene02PhoneSearch } from "./scenes/Scene02PhoneSearch";
import { Scene03MapLogic } from "./scenes/Scene03MapLogic";
import { Scene04ProfileVsMap } from "./scenes/Scene04ProfileVsMap";
import { Scene05SearchResults } from "./scenes/Scene05SearchResults";
import { Scene06CallOutcome } from "./scenes/Scene06CallOutcome";
import { Scene07MissedCustomers } from "./scenes/Scene07MissedCustomers";
import { Scene08Solution } from "./scenes/Scene08Solution";

/**
 * OmniFlow Digital — 32s / 960f / 1080x1920 motion ad.
 *
 * One continuous system: a shared city-grid world fades under scenes 03–08,
 * scene modules overlap by ~12 frames so outgoing elements finish their
 * hand-off underneath the incoming scene (element-level transitions, no
 * full-screen crossfades).
 */
const TAIL = 12;

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Gate on fonts (Inter Tight local files)
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("intertight-fonts");
    initAdFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  // City grid presence across the film (scenes 03–05 and 07–08)
  const gridOpacity =
    iv(frame, [SCENE.s3 - 14, SCENE.s3 + 12], [0, 1]) -
    iv(frame, [SCENE.s6 - 6, SCENE.s6 + 12], [0, 1]) +
    iv(frame, [SCENE.s7 - 10, SCENE.s7 + 14], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: `'Inter Tight', ${FONT}`,
        background: "linear-gradient(180deg, #05070A 0%, #0A0E12 58%, #05070A 100%)",
      }}
    >
      {gridOpacity > 0.001 && <CityGridBackground opacity={gridOpacity} frame={frame} />}

      <Sequence from={SCENE.s1} durationInFrames={SCENE.len + TAIL}>
        <Scene01Storefront />
      </Sequence>
      <Sequence from={SCENE.s2} durationInFrames={SCENE.len + TAIL}>
        <Scene02PhoneSearch />
      </Sequence>
      <Sequence from={SCENE.s3} durationInFrames={SCENE.len + TAIL}>
        <Scene03MapLogic />
      </Sequence>
      <Sequence from={SCENE.s4} durationInFrames={SCENE.len + TAIL}>
        <Scene04ProfileVsMap />
      </Sequence>
      <Sequence from={SCENE.s5} durationInFrames={SCENE.len + TAIL}>
        <Scene05SearchResults />
      </Sequence>
      <Sequence from={SCENE.s6} durationInFrames={SCENE.len + TAIL}>
        <Scene06CallOutcome />
      </Sequence>
      <Sequence from={SCENE.s7} durationInFrames={SCENE.len + TAIL}>
        <Scene07MissedCustomers />
      </Sequence>
      <Sequence from={SCENE.s8} durationInFrames={SCENE.end - SCENE.s8}>
        <Scene08Solution />
      </Sequence>

      <Vignette />
    </AbsoluteFill>
  );
};
