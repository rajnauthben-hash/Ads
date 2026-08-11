import React, { useEffect, useRef } from "react";
import { AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate } from "remotion";
import { C, W, H, stageAt, Xf } from "./constants";
import { initInterFonts } from "../omniflow/fonts";
import { CameraRig } from "./world/CameraRig";
import { BackgroundCity } from "./world/BackgroundCity";
import { Highway } from "./world/Highway";
import { CrownStore } from "./world/CrownStore";
import { CompetitorStore, CustomerMarker, GoldPin, MapLabel } from "./world/Actors";
import { Pins } from "./world/Pins";
import { Scene4Routes } from "./world/Scene4Routes";
import { Scene5Route } from "./world/Scene5Route";
import { TextOverlays } from "./TextOverlays";

// Staged placement of the persistent Crown Hardware store across the 5 scenes.
const CROWN: Record<number, Xf> = {
  1: { x: 492, y: 1046, s: 0.98, o: 1 },
  2: { x: 726, y: 1302, s: 0.32, o: 1 },
  3: { x: -30, y: 1180, s: 0.62, o: 1 },
  4: { x: 60, y: 1250, s: 0.6, o: 1 },
  5: { x: 468, y: 966, s: 1.02, o: 1 },
};

const seg = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const World: React.FC = () => {
  const frame = useCurrentFrame();

  const crown = stageAt(CROWN, frame);
  const crownWarm = 0.85 + interpolate(frame, [540, 585], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Highway present in scenes 1,2,3,5; dimmed during the Scene-4 aerial map.
  const hwIn = interpolate(frame, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hwDim = interpolate(frame, [352, 374, 470, 492], [1, 0.1, 0.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hwO = hwIn * hwDim;

  // Scene-4 actors.
  const s4 = seg(frame, 364, 390, 478, 494);
  const compBright = interpolate(frame, [418, 452], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="exRouteGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="pinGlowEx" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <CameraRig>
        <BackgroundCity />
        <Highway opacity={hwO} />

        {/* Scene-4 competitor + routes + actors */}
        <g opacity={s4}>
          <g transform="translate(600 876)">
            <CompetitorStore bright={compBright} />
          </g>
          <g transform="translate(752 862)">
            <GoldPin scale={1.05} />
          </g>
        </g>
        <Scene4Routes />

        {/* Persistent Crown Hardware */}
        <g transform={`translate(${crown.x} ${crown.y}) scale(${crown.s})`} opacity={crown.o}>
          <CrownStore warm={crownWarm} />
        </g>

        {/* Scene-4 customer + map labels (above stores) */}
        <g opacity={s4}>
          <g transform="translate(512 700)">
            <CustomerMarker />
          </g>
          <MapLabel x={544} y={666} num={1} title="YOUR CUSTOMER" color={C.cyanBright} />
          <MapLabel x={600} y={838} num={2} title="YOUR COMPETITOR" color={C.gold} />
          <MapLabel x={70} y={1150} num={3} title="CROWN HARDWARE" lines={["Incomplete info stops", "customers finding you."]} color={C.gray} />
        </g>

        {/* Scene-5 repaired route to Crown */}
        <Scene5Route />

        {/* Scene 2/3 pins */}
        <Pins />
      </CameraRig>
    </svg>
  );
};

export const OmniFlowExpresswayAd: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("ex-inter-fonts");
    initInterFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
    return () => {
      if (handle.current !== null) continueRender(handle.current);
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 62% 30%, ${C.bg2} 0%, ${C.bg} 46%, ${C.bgDeep} 100%)` }} />
      <AbsoluteFill>
        <World />
      </AbsoluteFill>

      {/* Cinematic lighting pass */}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(150% 120% at 32% 34%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.4) 100%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(180deg, ${C.bgDeep} 0%, rgba(6,12,19,0) 14%, rgba(6,12,19,0) 86%, ${C.bgDeep} 100%)` }} />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <TextOverlays />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
