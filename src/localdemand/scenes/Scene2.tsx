import React from "react";
import { interpolate, Easing } from "remotion";
import { COLOR } from "../theme";
import { s2Route } from "../layout";
import { RoadRoute } from "../RoadRoute";
import { PhoneSearchUI, PHONE_BUTTON, PHONE_W, PHONE_H } from "../PhoneSearchUI";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { CalloutBox } from "../text/Extras";
import { Pt } from "../projection";
import { clamp01 } from "../text/anim";

type Xf = { x: number; y: number; scale: number; rot: number };

function phoneXf(f: number): Xf {
  // slide in from the right, settle, then drift up-and-right on exit
  const x = interpolate(f, [118, 162, 268, 306], [1200, 552, 552, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(f, [118, 162, 268, 306], [392, 392, 392, 176], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rot = interpolate(f, [118, 162], [4, -4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [268, 306], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { x, y, scale, rot };
}

function applyXf(pt: Pt, xf: Xf): Pt {
  const rad = (xf.rot * Math.PI) / 180;
  const sx = pt.x * xf.scale;
  const sy = pt.y * xf.scale;
  return {
    x: xf.x + sx * Math.cos(rad) - sy * Math.sin(rad),
    y: xf.y + sx * Math.sin(rad) + sy * Math.cos(rad),
  };
}

export const Scene2World: React.FC<{ f: number }> = ({ f }) => {
  const xf = phoneXf(f);
  const button = applyXf(PHONE_BUTTON, xf);
  const route = s2Route(button);

  const typed = interpolate(f, [180, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const optionsIn = interpolate(f, [196, 238], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnPulse = interpolate(f, [150, 206, 250], [0, 1, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeProg = interpolate(f, [206, 264], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pulse = 0.15 + ((f % 60) / 60) * 0.85;

  const phoneOpacity = interpolate(f, [118, 138, 286, 302], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeEmph = interpolate(f, [286, 306], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      {/* route persists briefly as the bridge into Scene 3, then hands off */}
      {routeProg > 0 && routeEmph > 0.01 && <RoadRoute points={route} progress={routeProg} pulse={pulse} radius={22} emphasis={routeEmph} />}

      {/* hand silhouette + phone */}
      <g opacity={phoneOpacity} transform={`translate(${xf.x} ${xf.y}) rotate(${xf.rot}) scale(${xf.scale})`}>
        <Hand />
        <PhoneSearchUI typed={typed} optionsIn={optionsIn} pulse={btnPulse} />
      </g>
    </g>
  );
};

// Restrained dark hand: palm rising from the bottom-right, thumb across the
// lower-left edge of the phone. Warm rim light for dimension.
const Hand: React.FC = () => (
  <g>
    {/* palm / lower hand mass */}
    <path
      d={`M ${PHONE_W - 150} ${PHONE_H - 120}
          C ${PHONE_W + 90} ${PHONE_H - 170}, ${PHONE_W + 150} ${PHONE_H + 120}, ${PHONE_W - 40} ${PHONE_H + 240}
          C ${PHONE_W - 220} ${PHONE_H + 320}, ${20} ${PHONE_H + 300}, ${-60} ${PHONE_H + 120}
          C ${-110} ${PHONE_H + 10}, ${40} ${PHONE_H - 10}, ${160} ${PHONE_H - 40}
          Z`}
      fill="url(#handGrad)"
    />
    {/* thumb reaching up the left edge */}
    <path
      d={`M ${-30} ${PHONE_H + 40}
          C ${-70} ${PHONE_H - 120}, ${-40} ${PHONE_H - 320}, ${30} ${PHONE_H - 360}
          C ${70} ${PHONE_H - 380}, ${96} ${PHONE_H - 300}, ${74} ${PHONE_H - 180}
          C ${60} ${PHONE_H - 90}, ${60} ${PHONE_H - 10}, ${70} ${PHONE_H + 60}
          Z`}
      fill="url(#handGrad)"
    />
    <path
      d={`M ${30} ${PHONE_H - 358} C ${70} ${PHONE_H - 380}, ${96} ${PHONE_H - 300}, ${74} ${PHONE_H - 180}`}
      fill="none"
      stroke={COLOR.window}
      strokeWidth={2}
      opacity={0.22}
    />
  </g>
);

export const Scene2Overlay: React.FC<{ f: number }> = ({ f }) => {
  const headIn = interpolate(f, [155, 185], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [172, 205], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutIn = interpolate(f, [206, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inMask = clamp01((f - 120) / 18);
  const out = clamp01((f - 284) / 15);
  const gate = Math.min(inMask, 1);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: gate }}>
      <div style={{ position: "absolute", left: 64, top: 224, width: 760 }}>
        <EditorialHeadline
          into={headIn}
          out={out}
          size={70}
          groups={[0, 1]}
          lines={[[{ t: "Most local buying" }], [{ t: "starts with a search.", c: COLOR.gold }]]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 420, width: 620 }}>
        <SupportingCopy
          into={supIn}
          out={out}
          size={28}
          lines={[
            [{ t: "The customer types a few words." }],
            [{ t: "The map checks relevance, distance," }],
            [{ t: "hours, reviews, and availability in seconds." }],
            [{ t: "That small search sends a pulse" }],
            [{ t: "through the whole local market." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 662 }}>
        <CalloutBox
          into={calloutIn}
          out={out}
          bordered
          size={30}
          lines={[
            [{ t: "Phone in hand." }],
            [{ t: "Need in mind." }],
            [{ t: "Decision in motion.", c: COLOR.gold }],
          ]}
        />
      </div>
    </div>
  );
};
