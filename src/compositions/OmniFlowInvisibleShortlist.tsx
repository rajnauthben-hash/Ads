import React from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { CameraRig, ParallaxLayer } from "../components/CameraRig";
import { CityWorld } from "../components/CityWorld";
import { PersistentStorefront } from "../components/PersistentStorefront";
import { SafeArea } from "../components/SafeArea";
import { ReferenceGuide } from "../components/ReferenceGuide";
import { ReferenceOverlay } from "../components/ReferenceOverlay";
import { Scene01Recognition } from "../scenes/Scene01Recognition";
import { Scene02Shortlist } from "../scenes/Scene02Shortlist";
import { Scene03PhysicalDigital } from "../scenes/Scene03PhysicalDigital";
import { Scene04Bypassed } from "../scenes/Scene04Bypassed";
import { Scene05VisibilitySystem } from "../scenes/Scene05VisibilitySystem";
import { Scene06Resolution } from "../scenes/Scene06Resolution";
import { COLORS, LAYER } from "../styles/tokens";
import { initFonts } from "../styles/fonts";

/**
 * OmniFlowInvisibleShortlist — the complete OmniFlow "Invisible Shortlist" ad.
 * 1080x1920, 30fps, 780 frames (26s). One continuous camera; a persistent city
 * and storefront; six scenes whose transitions morph objects into one another.
 *
 * `dev` enables the safe-zone / reference guides (never on for final render).
 * `refSrc` optionally overlays an approved reference plate for comparison mode.
 */
export const OmniFlowInvisibleShortlist: React.FC<{
  dev?: boolean;
  refSrc?: string;
  refMode?: "opacity" | "sideBySide" | "difference";
}> = ({ dev = false, refSrc, refMode = "opacity" }) => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    initFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <CameraRig>
        {/* Persistent world — the same city everywhere. */}
        <ParallaxLayer depth="backgroundCity" zIndex={LAYER.distantBuildings}>
          <CityWorld dim={0.15} showLabels />
        </ParallaxLayer>

        {/* Persistent hero storefront. */}
        <ParallaxLayer depth="storefront" zIndex={LAYER.storefronts}>
          <PersistentStorefront />
        </ParallaxLayer>

        {/* Scene overlays (each gates itself by absolute frame). */}
        <Scene01Recognition />
        <Scene02Shortlist />
        <Scene03PhysicalDigital />
        <Scene04Bypassed />
        <Scene05VisibilitySystem />
        <Scene06Resolution />

        {/* Development guides only. */}
        <ReferenceGuide enabled={dev} />
        <SafeArea enabled={dev} />
        <ReferenceOverlay enabled={dev && !!refSrc} src={refSrc} mode={refMode} opacity={0.5} />
      </CameraRig>
    </AbsoluteFill>
  );
};
