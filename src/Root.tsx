import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { OmniFlowPremiumAd } from "./omniflow/OmniFlowPremiumAd";

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
    </>
  );
};
