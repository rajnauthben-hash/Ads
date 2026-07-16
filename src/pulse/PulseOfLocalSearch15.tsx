import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender } from "remotion";
import { initPulseFonts } from "./fonts";
import { PersistentPulseRoute } from "./PersistentPulseRoute";
import { ReferenceOverlay } from "./ReferenceOverlay";
import { COLORS } from "./theme";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Search } from "./scenes/Scene02Search";
import { Scene03Ranking } from "./scenes/Scene03Ranking";
import { Scene04PassedOver } from "./scenes/Scene04PassedOver";
import { Scene05Signals } from "./scenes/Scene05Signals";
import { Scene06Resolution } from "./scenes/Scene06Resolution";

// THE PULSE OF LOCAL SEARCH — 1080×1920 / 30fps / 450 frames.
//
// One continuous motion film: six scenes joined by object-based
// transitions (each sequence extends past its nominal boundary so the
// outgoing object hands the energy to the incoming scene), plus one
// persistent cyan pulse whose position is a continuous function of the
// global frame across all 450 frames.
export const PulseOfLocalSearch15: React.FC = () => {
  const [fontsReady, setFontsReady] = useState(false);
  const handle = useRef<number | null>(null);

  useEffect(() => {
    handle.current = delayRender("pulse-fonts");
    initPulseFonts().then(() => {
      setFontsReady(true);
      if (handle.current !== null) {
        continueRender(handle.current);
        handle.current = null;
      }
    });
    return () => {
      if (handle.current !== null) {
        continueRender(handle.current);
        handle.current = null;
      }
    };
  }, []);

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {fontsReady && (
        <>
          {/* Ambient depth: matte background gradient (plane 1) */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse 120% 60% at 50% 8%, rgba(0,210,255,0.05), transparent 60%), radial-gradient(ellipse 110% 55% at 50% 100%, rgba(18,19,20,0.9), transparent 70%)",
            }}
          />

          <Sequence  durationInFrames={100} name="01 — The Hook">
            <Scene01Hook />
          </Sequence>
          <Sequence from={80} durationInFrames={92} name="02 — Search Happens First">
            <Scene02Search />
          </Sequence>
          <Sequence from={152} durationInFrames={80} name="03 — People Choose Quickly">
            <Scene03Ranking />
          </Sequence>
          <Sequence from={212} durationInFrames={92} name="04 — Passed Over">
            <Scene04PassedOver />
          </Sequence>
          <Sequence from={284} durationInFrames={98} name="05 — What Actually Matters">
            <Scene05Signals />
          </Sequence>
          <Sequence from={362} durationInFrames={88} name="06 — The Resolution">
            <Scene06Resolution />
          </Sequence>

          {/* The one living pulse binding all six scenes */}
          <PersistentPulseRoute />

          {/* Dev-only reference comparison; renders nothing when disabled */}
          <ReferenceOverlay />
        </>
      )}
    </AbsoluteFill>
  );
};
