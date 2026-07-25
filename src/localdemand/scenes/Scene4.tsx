import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLOR, PLATE } from "../theme";
import { ScenePlate, LeftScrim, SoftMatte, Vignette, AtmosphericHaze } from "../Plate";
import { RouteOverlay, RouteDefs, PulseRing } from "../RouteOverlay";
import { StoreGlow, CyanGlow } from "../StoreGlow";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { Checklist } from "../text/Extras";
import { camTransform, sceneCam } from "../camera";
import { S4_ROUTE, S4_DOOR, S4_ORIGIN, S4_STORE_GLOW } from "../layout";

export const Scene4: React.FC<{ f: number }> = ({ f }) => {
  // gentler push on the final scene; settles to a still brand hold at the end
  const c = sceneCam(f, 450, 600, 12, -14);
  const holdEnd = interpolate(f, [584, 592], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camTransform(c.scale, c.tx * holdEnd, c.ty * holdEnd, c.rot * holdEnd);

  const reveal = interpolate(f, [462, 540], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.1 + ((f % 70) / 70) * 0.9;
  const breathe = (f % 50) / 50;
  const haze = Math.sin(f / 150) * 20;
  const warm = interpolate(f, [465, 505], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doorArrive = interpolate(f, [524, 552], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const custT = (f % 60) / 60;

  const headIn = interpolate(f, [462, 495], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [480, 515], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const listIn = interpolate(f, [485, 532], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closeIn = interpolate(f, [535, 570], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      <div style={{ position: "absolute", inset: 0, transform: cam, transformOrigin: "center center" }}>
        <ScenePlate src={PLATE.scene4} />
        <AtmosphericHaze drift={haze} y={20} />
        <LeftScrim width={482} feather={140} top={200} height={1200} />
        <SoftMatte x={455} y={300} w={225} h={445} />
        <StoreGlow x={S4_STORE_GLOW.x} y={S4_STORE_GLOW.y} r={S4_STORE_GLOW.r} strength={0.03 + warm * 0.06 + (0.5 + 0.5 * Math.sin(f / 30)) * 0.012} />
        <CyanGlow x={S4_DOOR.x} y={S4_DOOR.y} r={70} strength={doorArrive * 0.28} />
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RouteDefs />
          <RouteOverlay d={S4_ROUTE} reveal={reveal} pulse={pulse} reinforce={0.18} width={5} breathe={breathe} />
          <PulseRing x={S4_ORIGIN.x} y={S4_ORIGIN.y} t={custT} base={16} />
          {doorArrive > 0 && (
            <path
              d={`M ${S4_DOOR.x - 12} ${S4_DOOR.y + 14} L ${S4_DOOR.x} ${S4_DOOR.y - 12} L ${S4_DOOR.x + 12} ${S4_DOOR.y + 14}`}
              fill="none"
              stroke={COLOR.cyanCore}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={doorArrive}
              filter="url(#roGlow)"
            />
          )}
        </svg>
      </div>

      <Vignette />

      <div style={{ position: "absolute", left: 70, top: 315, width: 560 }}>
        <EditorialHeadline
          into={headIn}
          size={62}
          lineHeight={1.06}
          groups={[0, 1, 2]}
          lines={[
            [{ t: "OmniFlow Digital" }],
            [{ t: "reconnects you", c: COLOR.gold }],
            [{ t: "to local demand.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 588, width: 600 }}>
        <SupportingCopy
          into={supIn}
          size={25}
          lines={[
            [{ t: "We strengthen the signals that help customers" }],
            [{ t: "find, trust, and choose your business." }],
            [{ t: "So when the next search happens," }],
            [{ t: "the pulse leads to your door." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 760 }}>
        <Checklist into={listIn} size={29} />
      </div>

      <div style={{ position: "absolute", left: 70, top: 1190, width: 520 }}>
        <SupportingCopy
          into={closeIn}
          size={38}
          color={COLOR.gold}
          lines={[[{ t: "You get found." }], [{ t: "You get chosen." }]]}
        />
      </div>
    </AbsoluteFill>
  );
};
