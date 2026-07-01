import { AbsoluteFill, Sequence, delayRender, continueRender } from "remotion";
import { useEffect, useRef } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Outcome } from "./scenes/Scene4Outcome";
import { Scene5CTA } from "./scenes/Scene5CTA";
import { initInterFonts } from "./fonts";

export const OmniFlowPremiumAd: React.FC = () => {
  // Gate rendering until Inter fonts are ready
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("inter-fonts");
    initInterFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill>
      <AnimatedBackground />

      <Sequence from={0} durationInFrames={95}>
        <Scene1Hook />
      </Sequence>
      <Sequence from={85} durationInFrames={100}>
        <Scene2Problem />
      </Sequence>
      <Sequence from={175} durationInFrames={130}>
        <Scene3Solution />
      </Sequence>
      <Sequence from={295} durationInFrames={100}>
        <Scene4Outcome />
      </Sequence>
      <Sequence from={385} durationInFrames={65}>
        <Scene5CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
