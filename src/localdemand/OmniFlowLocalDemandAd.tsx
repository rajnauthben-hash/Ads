import React from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender } from "remotion";
import { COLOR, WIDTH, HEIGHT } from "./theme";
import { initInterFonts } from "../omniflow/fonts";
import { MasterCityMap, MapDefs } from "./MasterCityMap";
import { CrownHardwareStore, CrownDefs } from "./CrownHardwareStore";
import { CompetitorDefs } from "./CompetitorStore";
import { PhoneDefs } from "./PhoneSearchUI";
import { camera, camTransform, crownXf } from "./layout";
import { Scene1World, Scene1Overlay } from "./scenes/Scene1";
import { Scene2World, Scene2Overlay } from "./scenes/Scene2";
import { Scene3World, Scene3Overlay } from "./scenes/Scene3";
import { Scene4World, Scene4Overlay } from "./scenes/Scene4";

const ExtraDefs: React.FC = () => (
  <defs>
    <linearGradient id="handGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#241812" />
      <stop offset="0.5" stopColor="#160E0A" />
      <stop offset="1" stopColor="#0C0806" />
    </linearGradient>
  </defs>
);

export const OmniFlowLocalDemandAd: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    initInterFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  const cam = camera(f);
  const crown = crownXf(f);

  // litBoost brightens the wet road as the story resolves
  const litBoost = f > 450 ? 0.3 : 0.1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <MapDefs />
        <CrownDefs />
        <CompetitorDefs />
        <PhoneDefs />
        <ExtraDefs />

        <g transform={camTransform(cam)}>
          <MasterCityMap litBoost={litBoost} />

          {/* Crown Hardware — shared, consistent, moves continuously */}
          <g transform={`translate(${crown.x} ${crown.y}) scale(${crown.scale})`}>
            <CrownHardwareStore lit={crown.lit} />
          </g>

          {/* Scene-specific world layers (short overlaps = object transitions) */}
          {f < 150 && <Scene1World f={f} />}
          {f >= 118 && f < 309 && <Scene2World f={f} />}
          {f >= 300 && f < 463 && <Scene3World f={f} />}
          {f >= 449 && <Scene4World f={f} />}
        </g>
      </svg>

      {/* Editorial text overlays (screen space → restrained parallax vs map) */}
      {f < 145 && <Scene1Overlay f={f} />}
      {f >= 120 && f < 306 && <Scene2Overlay f={f} />}
      {f >= 300 && f < 460 && <Scene3Overlay f={f} />}
      {f >= 449 && <Scene4Overlay f={f} />}
    </AbsoluteFill>
  );
};
