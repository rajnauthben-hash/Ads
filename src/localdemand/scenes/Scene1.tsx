import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLOR, PLATE } from "../theme";
import { ScenePlate, LeftScrim, SoftMatte, Vignette } from "../Plate";
import { RouteOverlay, RouteDefs } from "../RouteOverlay";
import { StoreGlow } from "../StoreGlow";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { CalloutBox } from "../text/Extras";
import { S1_ROUTE, S1_STORE_GLOW } from "../layout";

export const Scene1: React.FC<{ f: number }> = ({ f }) => {
  const s = interpolate(f, [0, 134], [1.0, 1.02]);
  const cx = interpolate(f, [0, 134], [0, -8]);
  const cy = interpolate(f, [0, 134], [0, -6]);
  const cam = `translate(${cx}px, ${cy}px) scale(${s})`;

  const reveal = interpolate(f, [0, 40], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = (f % 80) / 80;
  const warm = 0.5 + 0.5 * Math.sin((f / 40) * Math.PI);

  const headIn = interpolate(f, [10, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [28, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldIn = interpolate(f, [45, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutIn = interpolate(f, [52, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      <div style={{ position: "absolute", inset: 0, transform: cam, transformOrigin: "center center" }}>
        <ScenePlate src={PLATE.scene1} />
        <StoreGlow x={S1_STORE_GLOW.x} y={S1_STORE_GLOW.y} r={S1_STORE_GLOW.r} strength={0.04 + warm * 0.05} />
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RouteDefs />
          <RouteOverlay d={S1_ROUTE} reveal={reveal} pulse={pulse} reinforce={0.6} width={5} />
        </svg>
      </div>

      <Vignette />
      <LeftScrim width={470} feather={150} top={120} height={1050} />
      <SoftMatte x={352} y={1356} w={324} h={196} />

      <div style={{ position: "absolute", left: 68, top: 250, width: 440 }}>
        <EditorialHeadline
          into={headIn}
          size={76}
          lineHeight={1.03}
          groups={[0, 1, 2, 3, 4]}
          lines={[
            [{ t: "Search" }],
            [{ t: "demand" }],
            [{ t: "is ", c: COLOR.white }, { t: "already", c: COLOR.gold }],
            [{ t: "moving", c: COLOR.gold }],
            [{ t: "around you.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 712, width: 480 }}>
        <SupportingCopy
          into={supIn}
          size={30}
          lines={[
            [{ t: "People nearby are searching" }],
            [{ t: "for what they need right now." }],
            [{ t: "Not later. Not tomorrow." }],
            [{ t: "Right now — on their phone," }],
            [{ t: "a few streets away." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 958, width: 480 }}>
        <SupportingCopy
          into={goldIn}
          size={33}
          color={COLOR.gold}
          lines={[[{ t: "The opportunity is" }], [{ t: "already in motion." }]]}
        />
      </div>

      <div style={{ position: "absolute", left: 366, top: 1396 }}>
        <CalloutBox
          into={calloutIn}
          bordered={false}
          size={29}
          lines={[
            [{ t: "Nearby intent." }],
            [{ t: "Real customers." }],
            [{ t: "Active demand.", c: COLOR.cyan }],
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
