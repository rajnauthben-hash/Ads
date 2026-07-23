import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLOR, PLATE } from "../theme";
import { ScenePlate, LeftScrim, SoftMatte, Vignette } from "../Plate";
import { RouteOverlay, RouteDefs, PulseRing } from "../RouteOverlay";
import { StoreGlow, CyanGlow } from "../StoreGlow";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import {
  S3_MAIN_ROUTE,
  S3_COMP_ROUTE,
  S3_CUSTOMER,
  S3_COMP_GLOW,
  S3_COMP_DOOR,
  S3_CROWN_GLOW,
} from "../layout";

export const Scene3: React.FC<{ f: number }> = ({ f }) => {
  const s = interpolate(f, [300, 449], [1.0, 1.02]);
  const cx = interpolate(f, [300, 449], [0, 6]);
  const cy = interpolate(f, [300, 449], [0, -6]);
  const cam = `translate(${cx}px, ${cy}px) scale(${s})`;

  const mainReveal = interpolate(f, [338, 402], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mainPulse = 0.15 + ((f % 84) / 84) * 0.85;
  const compReveal = interpolate(f, [350, 398], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const compPulse = (f % 50) / 50;
  const compWarm = interpolate(f, [388, 424], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const custT = (f % 60) / 60;

  const headIn = interpolate(f, [314, 348], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [330, 366], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldIn = interpolate(f, [352, 384], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.black }}>
      <div style={{ position: "absolute", inset: 0, transform: cam, transformOrigin: "center center" }}>
        <ScenePlate src={PLATE.scene3} />
        <StoreGlow x={S3_CROWN_GLOW.x} y={S3_CROWN_GLOW.y} r={S3_CROWN_GLOW.r} strength={0.035} />
        <CyanGlow x={S3_COMP_GLOW.x} y={S3_COMP_GLOW.y} r={S3_COMP_GLOW.r} strength={compWarm * 0.26} />
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <RouteDefs />
          {/* main pulse: keeps moving, fails near Crown */}
          <RouteOverlay d={S3_MAIN_ROUTE} reveal={mainReveal} pulse={mainPulse} width={5} dying={0.35} />
          {/* competitor branch: successful connection */}
          <RouteOverlay d={S3_COMP_ROUTE} reveal={compReveal} pulse={compPulse} width={5} />
          {compReveal > 0.9 && (
            <>
              <circle cx={S3_COMP_DOOR.x} cy={S3_COMP_DOOR.y} r={14} fill="none" stroke={COLOR.cyanCore} strokeWidth={2.4} filter="url(#roGlow)" />
              <circle cx={S3_COMP_DOOR.x} cy={S3_COMP_DOOR.y} r={5} fill={COLOR.cyanCore} filter="url(#roGlow)" />
            </>
          )}
          <PulseRing x={S3_CUSTOMER.x} y={S3_CUSTOMER.y} t={custT} base={20} />
        </svg>
      </div>

      <Vignette />
      <LeftScrim width={492} feather={130} top={110} height={1000} />
      {/* cover baked headline that extends right (dark sky above Crown) */}
      <SoftMatte x={470} y={230} w={220} h={290} />

      <div style={{ position: "absolute", left: 68, top: 246, width: 600 }}>
        <EditorialHeadline
          into={headIn}
          size={64}
          lineHeight={1.06}
          groups={[0, 1, 2, 3]}
          lines={[
            [{ t: "The search" }],
            [{ t: "is still happening." }],
            [{ t: "It just doesn’t", c: COLOR.gold }],
            [{ t: "land on you.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 600, width: 512 }}>
        <SupportingCopy
          into={supIn}
          size={28}
          lines={[
            [{ t: "If your signals are weak," }],
            [{ t: "the pulse keeps moving." }],
            [{ t: "The customer was nearby." }],
            [{ t: "The need was real." }],
            [{ t: "The map simply connected them" }],
            [{ t: "to a business it understood first." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 928, width: 512 }}>
        <SupportingCopy
          into={goldIn}
          size={31}
          color={COLOR.gold}
          lines={[[{ t: "Local demand doesn’t disappear." }], [{ t: "It lands somewhere else." }]]}
        />
      </div>
    </AbsoluteFill>
  );
};
