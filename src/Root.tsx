import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { OmniFlowPremiumAd } from "./omniflow/OmniFlowPremiumAd";
import { HeroDesktop, TOTAL_FRAMES } from "./hero/HeroDesktop";
import { TikTokPreview, PREVIEW_FRAMES } from "./tiktok/TikTokPreview";
import { TikTokAd } from "./tiktok/TikTokAd";
import { OmniFlowInvisibleShortlist } from "./compositions/OmniFlowInvisibleShortlist";
import { LocalSearchExpressway } from "./expressway/LocalSearchExpressway";
import { EXP } from "./expressway/theme";
import { CANVAS } from "./styles/tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LocalSearchExpressway"
        component={LocalSearchExpressway}
        durationInFrames={EXP.frames}
        fps={EXP.fps}
        width={EXP.width}
        height={EXP.height}
      />
      <Composition
        id="OmniFlowInvisibleShortlist"
        component={OmniFlowInvisibleShortlist}
        durationInFrames={CANVAS.durationInFrames}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
        defaultProps={{ dev: false }}
      />
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
      <Composition
        id="TikTokPreview"
        component={TikTokPreview}
        durationInFrames={PREVIEW_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TikTokAd"
        component={TikTokAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
