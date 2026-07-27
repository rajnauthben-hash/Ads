import React from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender, interpolate } from "remotion";
import { T } from "./tokens";
import { initInterFonts } from "../omniflow/fonts";
import { MapField, MapDefs } from "./parts/MapField";
import { CrownStore, CrownDefs } from "./parts/CrownStore";
import { RouteDefs } from "./parts/Route";
import { PhoneDefs } from "./parts/Phone";
import { GlobalGrade } from "./parts/Grade";
import { crownXf, camera, camStr } from "./world";
import { S1World, S1Overlay } from "./scenes/S1";
import { S2World, S2Overlay } from "./scenes/S2";
import { S3World, S3Overlay } from "./scenes/S3";
import { S4World, S4Overlay } from "./scenes/S4";

function crownLit(f: number): number {
  return interpolate(f, [0, 64, 74, 135, 265, 300, 405, 455, 545, 594],
    [0.25, 0.25, 0.82, 0.82, 0.9, 0.7, 0.55, 0.7, 0.94, 0.94],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Faint deep-parallax light field (slowest layer). */
const DeepLights: React.FC = () => {
  const dots: React.ReactNode[] = [];
  let s = 3;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 1080;
    const y = 120 + rnd() * 520;
    dots.push(<circle key={i} cx={x} cy={y} r={1 + rnd() * 1.6} fill={rnd() > 0.5 ? T.windowWarm : T.cyan} opacity={0.1 + rnd() * 0.14} />);
  }
  return <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{dots}</svg>;
};

export const OmniFlowMotionAd: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => { initInterFonts().then(() => continueRender(handle)).catch(() => continueRender(handle)); }, [handle]);

  const cam = camera(f);
  const crown = crownXf(f);
  const lit = crownLit(f);
  // scene 4 Crown compact? keep full geometry always.

  return (
    <AbsoluteFill style={{ background: `radial-gradient(125% 95% at 60% 32%, ${T.bg2} 0%, ${T.bg} 60%, #030409 100%)` }}>
      {/* deep parallax */}
      <div style={{ position: "absolute", inset: 0, transform: camStr({ scale: cam.scale, tx: cam.tx * 0.4, ty: cam.ty * 0.4, rot: 0 }), transformOrigin: "center center" }}>
        <DeepLights />
      </div>

      {/* world (map + crown + scene objects), camera-transformed */}
      <div style={{ position: "absolute", inset: 0, transform: camStr(cam), transformOrigin: "center center" }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <CrownDefs />
          <RouteDefs />
          <PhoneDefs />
          <MapDefs />
          <MapField />

          {/* persistent Crown Hardware (drawn before routes so arrivals show) */}
          <g transform={`translate(${crown.x}, ${crown.y}) scale(${crown.scale})`}>
            <CrownStore lit={lit} />
          </g>

          {f < 140 && <S1World f={f} />}
          {f >= 130 && f < 305 && <S2World f={f} />}
          {f >= 296 && f < 455 && <S3World f={f} />}
          {f >= 450 && <S4World f={f} />}
        </svg>
      </div>

      {/* cinematic grade (transparent centre keeps text crisp) */}
      <GlobalGrade />

      {/* editorial text (screen space → parallax vs world) */}
      {f < 138 && <S1Overlay f={f} />}
      {f >= 148 && f < 300 && <S2Overlay f={f} />}
      {f >= 300 && f < 452 && <S3Overlay f={f} />}
      {f >= 450 && <S4Overlay f={f} />}
    </AbsoluteFill>
  );
};
