import React, { useEffect, useRef } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import { initFonts } from "./fonts";
import { WorldLayer } from "./world/WorldLayer";
import { Hud } from "./hud/Hud";
import { ReferenceOverlay } from "./hud/ReferenceOverlay";
import { T } from "./theme";

// Cinematic atmosphere: vignette + top/bottom scrims so HUD text stays legible
// over the moving world, plus a faint cyan atmospheric wash.
const Atmosphere: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 45%, rgba(2,6,9,0.55) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(4,9,13,0.78) 0%, rgba(4,9,13,0.15) 22%, rgba(4,9,13,0) 42%, rgba(4,9,13,0) 68%, rgba(4,9,13,0.35) 86%, rgba(4,9,13,0.82) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 45% at 72% 24%, ${T.cyan}14 0%, rgba(0,0,0,0) 60%)`,
        mixBlendMode: "screen",
      }}
    />
  </AbsoluteFill>
);

export const LocalSearchExpressway: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("expressway-fonts");
    initFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill style={{ background: "#04090C" }}>
      <WorldLayer />
      <Atmosphere />
      <Hud />
      <ReferenceOverlay />
    </AbsoluteFill>
  );
};
