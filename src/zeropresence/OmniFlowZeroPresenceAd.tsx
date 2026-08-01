// ============================================================================
// OmniFlowZeroPresenceAd — master composition (1080x1920, 30fps, 720 frames).
// One persistent storefront, one persistent phone, one persistent SearchSignal.
// All motion derives from useCurrentFrame() + FRAME_PLAN. No random values.
// ============================================================================
import React, { useState } from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { COLORS } from "./tokens";
import { initFonts } from "./fonts";
import {
  STOREFRONT_KEYS,
  PHONE_KEYS,
  boxAt,
  interiorMix,
  clampInterp,
} from "./framePlan";
import { VirtualCamera, AtmosphericBackground, SafeAreaOverlay } from "./components/Environment";
import { CrownHardwareEnvironment } from "./components/CrownHardware";
import { PhoneShell } from "./components/Phone";
import { PhoneContent } from "./components/PhoneContent";
import { SignalsBehind, SignalsFront } from "./components/Signals";
import { Scene1Copy } from "./scenes/Scene1";
import { Scene2Copy } from "./scenes/Scene2";
import { Scene3Copy } from "./scenes/Scene3";
import { Scene4Copy } from "./scenes/Scene4";
import { Scene5Copy } from "./scenes/Scene5";

function lightingAt(frame: number): number {
  // S1 intro 0.94 -> 1.0 over 0-14
  let l = clampInterp(frame, [0, 14], [0.94, 1.0]);
  if (frame >= 552) {
    // S5: up to +5% (well within +12% cap), gentle 99-101% variation on hold
    const base = clampInterp(frame, [552, 570], [1.0, 1.05]);
    const jitter = frame >= 660 ? 0.01 * Math.sin((frame - 660) * 0.25) : 0;
    l = base + jitter;
  }
  return l;
}

export const OmniFlowZeroPresenceAd: React.FC<{ showSafe?: boolean }> = ({ showSafe = false }) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("fonts"));
  React.useEffect(() => {
    initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);

  const storeBox = boxAt(STOREFRONT_KEYS, frame);
  const phoneBox = boxAt(PHONE_KEYS, frame);
  const mix = interiorMix(frame);
  const lighting = lightingAt(frame);
  const active = frame >= 540;

  const phoneBlur = clampInterp(frame, [0, 14], [3, 0]);
  const s = phoneBox.w / 500;

  return (
    <AbsoluteFill style={{ background: COLORS.canvasBlack }}>
      <VirtualCamera>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <AtmosphericBackground />
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, isolation: "isolate" }}>
          <CrownHardwareEnvironment box={storeBox} lighting={lighting} interiorMix={mix} active={active} />
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <SignalsBehind frame={frame} />
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <PhoneShell box={phoneBox} blur={phoneBlur} rotateY={-4} rotateZ={1.2}>
            <PhoneContent frame={frame} s={s} />
          </PhoneShell>
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 6 }}>
          <SignalsFront frame={frame} />
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 7 }}>
          {frame <= 140 && <Scene1Copy frame={frame} />}
          {frame >= 118 && frame <= 270 && <Scene2Copy frame={frame} />}
          {frame >= 250 && frame <= 424 && <Scene3Copy frame={frame} />}
          {frame >= 408 && frame <= 556 && <Scene4Copy frame={frame} />}
          {frame >= 540 && <Scene5Copy frame={frame} />}
        </div>
      </VirtualCamera>

      {showSafe && <SafeAreaOverlay />}
    </AbsoluteFill>
  );
};
