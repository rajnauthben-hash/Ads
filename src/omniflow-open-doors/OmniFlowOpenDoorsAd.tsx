import React from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender } from "remotion";
import { WIDTH, HEIGHT } from "./constants";
import { initFonts } from "./fonts";
import { ease } from "./anim";
import { NightBase, MasterCityMap } from "./components/MasterCityMap";
import { Scene01 } from "./scenes/Scene01";
import { Scene02 } from "./scenes/Scene02";
import { Scene03 } from "./scenes/Scene03";
import { Scene04 } from "./scenes/Scene04";
import { ReferenceOverlay, SafeZoneOverlay } from "./overlays/DevOverlays";

export type OmniFlowOpenDoorsAdProps = {
  showReference?: boolean;
  showSafeZone?: boolean;
};

/**
 * OmniFlowOpenDoorsAd — the full 24s / 720-frame continuous ad. Persistent
 * layers (night base + city map) live at the top level so the world never
 * resets between scenes; each scene component owns its own object-led entry and
 * exit so transitions read as morphs rather than cuts or crossfades.
 */
export const OmniFlowOpenDoorsAd: React.FC<OmniFlowOpenDoorsAdProps> = ({
  showReference = false,
  showSafeZone = false,
}) => {
  const frame = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("load-fonts"));
  React.useEffect(() => {
    initFonts().then(() => continueRender(handle));
  }, [handle]);

  // City map fades in across the Scene 2 -> Scene 3 seam and persists.
  const mapOpacity = ease(frame, [338, 384], [0, 1]);
  // Restrained slow lateral drift for the map (linear per the brief).
  const mapDrift = Math.sin((frame / 720) * Math.PI * 2) * 14;

  return (
    <AbsoluteFill style={{ width: WIDTH, height: HEIGHT, backgroundColor: "#06090D", overflow: "hidden" }}>
      <NightBase />
      {mapOpacity > 0 && <MasterCityMap opacity={mapOpacity} drift={mapDrift} />}

      <Scene01 frame={frame} />
      <Scene02 frame={frame} />
      <Scene03 frame={frame} />
      <Scene04 frame={frame} />

      <ReferenceOverlay enabled={showReference} frame={frame} />
      <SafeZoneOverlay enabled={showSafeZone} />
    </AbsoluteFill>
  );
};
