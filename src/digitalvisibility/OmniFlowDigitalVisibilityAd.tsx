import { AbsoluteFill, Sequence, continueRender, delayRender } from "remotion";
import { useEffect, useRef } from "react";
import { C } from "./styles";
import { SCENES, TAIL, PARALLAX } from "./timeline";
import { initDvFonts } from "./fonts";
import { CameraProvider, useCam } from "./CameraRig";
import { MapWorld } from "./components/MapWorld";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Mechanism } from "./scenes/Scene2Mechanism";
import { Scene3Consequence } from "./scenes/Scene3Consequence";
import { Scene4Solution } from "./scenes/Scene4Solution";

/** The persistent map floor, driven by the master camera at grid depth. */
const World: React.FC = () => {
  const cam = useCam();
  const d = PARALLAX.grid;
  return <MapWorld camX={cam.x * d * 6} camY={cam.y * d * 6} camScale={1 + (cam.scale - 1) * d} />;
};

/**
 * OmniFlow Digital Visibility Ad — 16s / 480f / 1080×1920 / 30fps.
 * One persistent 2.5D map world; four scene layers composite on top with a
 * continuous cyan route as the visual spine. Scenes overlap by TAIL frames so
 * element hand-offs finish beneath the incoming scene (no hard cuts).
 */
export const OmniFlowDigitalVisibilityAd: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("dv-fonts");
    initDvFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <CameraProvider>
        {/* persistent world */}
        <World />

        {/* scene layers */}
        <Sequence from={SCENES.s1.start} durationInFrames={SCENES.s1.end - SCENES.s1.start + TAIL}>
          <Scene1Hook />
        </Sequence>
        <Sequence from={SCENES.s2.start} durationInFrames={SCENES.s2.end - SCENES.s2.start + TAIL}>
          <Scene2Mechanism />
        </Sequence>
        <Sequence from={SCENES.s3.start} durationInFrames={SCENES.s3.end - SCENES.s3.start + TAIL}>
          <Scene3Consequence />
        </Sequence>
        <Sequence from={SCENES.s4.start} durationInFrames={SCENES.s4.end - SCENES.s4.start + 1}>
          <Scene4Solution />
        </Sequence>

        {/* film-wide edge darkening */}
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 118% 88% at 50% 42%, transparent 56%, rgba(3,5,7,0.5) 100%)," +
              "linear-gradient(180deg, rgba(3,5,7,0.3) 0%, transparent 12%, transparent 88%, rgba(3,5,7,0.42) 100%)",
          }}
        />
      </CameraProvider>
    </AbsoluteFill>
  );
};
