import React from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender, interpolate, Easing } from "remotion";
import { COLOR } from "./theme";
import { initInterFonts } from "../omniflow/fonts";
import { WipeReveal, RefNumberCover } from "./Plate";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { DebugGrid } from "./DebugGrid";

const DEBUG_GRID = false;

/**
 * OmniFlow "Local Demand" — 20s / 1080x1920 / 30fps.
 * Approved reference frames act as cinematic environment plates; live React
 * text, live SVG route animation and masked lighting are composited on top.
 * Scenes hand off via feathered, route/camera-led masked reveals — never a
 * full-screen crossfade — so the whole ad reads as one continuous journey.
 */
export const OmniFlowLocalDemandAd: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    initInterFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  // Object/camera-led overlaps (wider, feathered) — no full-screen crossfades.
  const p1 = interpolate(f, [119, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const p2 = interpolate(f, [281, 315], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const p3 = interpolate(f, [431, 470], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      {f < 152 && <Scene1 f={f} />}
      {f >= 119 && f < 318 && (
        <WipeReveal progress={p1} from="right">
          <Scene2 f={f} />
        </WipeReveal>
      )}
      {f >= 281 && f < 472 && (
        <WipeReveal progress={p2} from="bottom">
          <Scene3 f={f} />
        </WipeReveal>
      )}
      {f >= 431 && (
        <WipeReveal progress={p3} from="top">
          <Scene4 f={f} />
        </WipeReveal>
      )}
      <RefNumberCover />
      {DEBUG_GRID && <DebugGrid />}
    </AbsoluteFill>
  );
};
