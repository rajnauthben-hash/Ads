import React, { useEffect, useRef } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import { C, W, H } from "./constants";
import { initInterFonts } from "../omniflow/fonts";
import { CameraRig } from "./world/CameraRig";
import { CityMap } from "./world/CityMap";
import { SearchRoute } from "./world/SearchRoute";
import { Pins } from "./world/Pins";
import { Storefront } from "./world/Storefront";
import { WetStreet } from "./world/WetStreet";
import { Traffic } from "./world/Traffic";
import { TextOverlays } from "./TextOverlays";

// ---------------------------------------------------------------------------
// OmniFlow Digital — Ad 3.1 "Building on an Empty Road"
// One continuous premium animation: a persistent dark city-map world with an
// electric-cyan search highway threading through it, a warm LOCAL & PROUD
// storefront, travelling pins and — in the finale — an on-ramp that connects
// the road back to the business. 1080x1920, 30fps, 600 frames (20s).
// ---------------------------------------------------------------------------

export const OmniFlowRoadAd: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("road-inter-fonts");
    initInterFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
    return () => {
      if (handle.current !== null) continueRender(handle.current);
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Base environment gradient */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 78% 18%, ${C.bg2} 0%, ${C.bg} 42%, ${C.bgDeep} 100%)`,
        }}
      />

      {/* The dimensional world, under one shared camera. */}
      <AbsoluteFill>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="leftScrim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={C.bgDeep} stopOpacity="0.92" />
              <stop offset="0.55" stopColor={C.bgDeep} stopOpacity="0.5" />
              <stop offset="1" stopColor={C.bgDeep} stopOpacity="0" />
            </linearGradient>
          </defs>
          <CameraRig>
            <CityMap />
            <WetStreet />
            {/* Copy-side scrim — keeps the headline column near-black like the
                references, while the storefront (drawn after) stays warm. */}
            <rect x={-80} y={0} width={620} height={1120} fill="url(#leftScrim)" />
            <Storefront />
            {/* Route, pins and traffic sit above the storefront so the Scene-5
                on-ramp visibly reaches the shop door. */}
            <SearchRoute />
            <Pins />
            <Traffic />
          </CameraRig>
        </svg>
      </AbsoluteFill>

      {/* Cinematic lighting pass — vignette + top falloff. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(140% 120% at 30% 30%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${C.bg} 0%, rgba(7,16,22,0) 16%, rgba(7,16,22,0) 88%, ${C.bgDeep} 100%)`,
        }}
      />

      {/* Live React copy. */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <TextOverlays />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
