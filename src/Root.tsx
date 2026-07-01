import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { OmniFlowPremiumAd } from "./omniflow/OmniFlowPremiumAd";
import { OmniFlowInvisibleAd } from "./omniflow/OmniFlowInvisibleAd";
import { HeroDesktop, TOTAL_FRAMES } from "./hero/HeroDesktop";
import { HeroMobile } from "./hero/HeroMobile";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="OmniFlowPremiumAd"
        component={OmniFlowPremiumAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HeroDesktop"
        component={HeroDesktop}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Primary mobile deliverable — 1080×1920 */}
      <Composition
        id="HeroMobile"
        component={HeroMobile}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* OmniFlow Digital — "From Invisible to Unmissable" — 18s ad */}
      <Composition
        id="OmniFlowInvisibleAd"
        component={OmniFlowInvisibleAd}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />

    </>
  );
};
