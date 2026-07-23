import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLOR, PLATE } from "../theme";
import { ScenePlate, LeftScrim, SoftMatte, Vignette } from "../Plate";
import { RouteOverlay, RouteDefs, PulseRing } from "../RouteOverlay";
import { StoreGlow } from "../StoreGlow";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { CalloutBox } from "../text/Extras";
import { S2_ROUTE, S2_SEARCH_NODE, S2_STORE_GLOW } from "../layout";

export const Scene2: React.FC<{ f: number }> = ({ f }) => {
  const s = interpolate(f, [135, 299], [1.0, 1.02]);
  const cx = interpolate(f, [135, 299], [6, -6]);
  const cy = interpolate(f, [135, 299], [0, -8]);
  const cam = `translate(${cx}px, ${cy}px) scale(${s})`;

  const reveal = interpolate(f, [205, 265], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = (f % 62) / 62;
  const nodeT = (f % 46) / 46;
  const nodeOn = interpolate(f, [190, 215], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warm = interpolate(f, [255, 285], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const headIn = interpolate(f, [150, 178], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [165, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutIn = interpolate(f, [188, 218], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      <div style={{ position: "absolute", inset: 0, transform: cam, transformOrigin: "center center" }}>
        <ScenePlate src={PLATE.scene2} />
        <StoreGlow x={S2_STORE_GLOW.x} y={S2_STORE_GLOW.y} r={S2_STORE_GLOW.r} strength={0.05 + warm * 0.07} />
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RouteDefs />
          <RouteOverlay d={S2_ROUTE} reveal={reveal} pulse={pulse} reinforce={0.5} width={5} />
          <g opacity={nodeOn}>
            <PulseRing x={S2_SEARCH_NODE.x} y={S2_SEARCH_NODE.y} t={nodeT} base={30} />
          </g>
        </svg>
      </div>

      <Vignette />
      <LeftScrim width={470} feather={150} top={90} height={720} />
      {/* cover baked headline + support that extend right toward the phone */}
      <SoftMatte x={430} y={210} w={255} h={450} />

      <div style={{ position: "absolute", left: 60, top: 235, width: 600 }}>
        <EditorialHeadline
          into={headIn}
          size={60}
          lineHeight={1.06}
          groups={[0, 1]}
          lines={[[{ t: "Most local buying" }], [{ t: "starts with a search.", c: COLOR.gold }]]}
        />
      </div>

      <div style={{ position: "absolute", left: 60, top: 408, width: 600 }}>
        <SupportingCopy
          into={supIn}
          size={25}
          lines={[
            [{ t: "The customer types a few words." }],
            [{ t: "The map checks relevance, distance," }],
            [{ t: "hours, reviews, and availability in seconds." }],
            [{ t: "That small search sends a pulse" }],
            [{ t: "through the whole local market." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 60, top: 650 }}>
        <CalloutBox
          into={calloutIn}
          bordered
          size={29}
          lines={[
            [{ t: "Phone in hand." }],
            [{ t: "Need in mind." }],
            [{ t: "Decision in motion.", c: COLOR.gold }],
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
