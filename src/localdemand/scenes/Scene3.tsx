import React from "react";
import { interpolate, Easing } from "remotion";
import { COLOR } from "../theme";
import {
  S3_CUSTOMER,
  S3_COMPETITOR,
  S3_COMP_DOOR,
  S3_COMP_ROUTE,
  S3_CROWN_ROUTE,
  S3_MISSED,
  crownXf,
} from "../layout";
import { RoadRoute, DestinationRing } from "../RoadRoute";
import { CompetitorStore } from "../CompetitorStore";
import { CustomerMarker, MissedConnectionMarker, MapLabel } from "../Markers";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { clamp01 } from "../text/anim";

export const Scene3World: React.FC<{ f: number }> = ({ f }) => {
  const custIn = clamp01((f - 300) / 22);
  const compProg = interpolate(f, [345, 428], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const crownProg = interpolate(f, [348, 398], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const missedIn = clamp01((f - 396) / 24);
  const ringIn = clamp01((f - 416) / 18);
  const compLit = interpolate(f, [388, 424], [0.45, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.15 + ((f % 64) / 64) * 0.85;

  // fade the whole layer in at the start, out into Scene 4
  const fadeIn = clamp01((f - 300) / 18);
  const fadeOut = 1 - clamp01((f - 450) / 12);
  const layer = Math.min(fadeIn, fadeOut);
  const labelIn = clamp01((f - 356) / 24);

  const crown = crownXf(f);
  const crownRoof = { x: crown.x, y: crown.y - 470 * crown.scale };

  return (
    <g opacity={layer}>
      {/* competitor building (drawn before routes so route arrives at door) */}
      <g transform={`translate(${S3_COMPETITOR.x} ${S3_COMPETITOR.y}) scale(${S3_COMPETITOR.scale})`}>
        <CompetitorStore lit={compLit} />
      </g>

      {/* Crown branch — dotted, stops before Crown */}
      <RoadRoute points={S3_CROWN_ROUTE} progress={crownProg} dotted radius={26} showPulse={false} />

      {/* Competitor branch — solid, reaches competitor */}
      <RoadRoute points={S3_COMP_ROUTE} progress={compProg} pulse={pulse} radius={26} />
      {ringIn > 0 && <DestinationRing at={S3_COMP_DOOR} scale={ringIn} opacity={ringIn} />}

      {/* markers */}
      <CustomerMarker at={S3_CUSTOMER} opacity={custIn} pulse={(f % 60) / 60} />
      {missedIn > 0 && <MissedConnectionMarker at={S3_MISSED} opacity={missedIn} />}

      {/* labels */}
      <MapLabel at={crownRoof} lines={["Crown Hardware"]} dx={-30} dy={-48} anchor="start" opacity={labelIn} />
      <MapLabel at={S3_MISSED} lines={["Missed", "connection"]} dx={34} dy={-8} anchor="start" leader={false} opacity={missedIn} />
      <MapLabel at={{ x: S3_COMPETITOR.x + 30, y: S3_COMPETITOR.y - S3_COMPETITOR.scale * 300 }} lines={["Competitor"]} dx={40} dy={-60} anchor="start" opacity={labelIn} />
      <MapLabel at={S3_CUSTOMER} lines={["Your customer"]} dx={6} dy={-70} anchor="start" opacity={custIn} />
    </g>
  );
};

export const Scene3Overlay: React.FC<{ f: number }> = ({ f }) => {
  const headIn = interpolate(f, [318, 350], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [332, 366], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldIn = interpolate(f, [352, 384], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inMask = clamp01((f - 300) / 16);
  const out = clamp01((f - 440) / 13);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(inMask, 1) }}>
      <div style={{ position: "absolute", left: 64, top: 190, width: 560 }}>
        <EditorialHeadline
          into={headIn}
          out={out}
          size={71}
          groups={[0, 1, 2, 3]}
          lines={[
            [{ t: "The search" }],
            [{ t: "is still happening." }],
            [{ t: "It just doesn’t", c: COLOR.gold }],
            [{ t: "land on you.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 560, width: 540 }}>
        <SupportingCopy
          into={supIn}
          out={out}
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

      <div style={{ position: "absolute", left: 66, top: 824, width: 540 }}>
        <SupportingCopy
          into={goldIn}
          out={out}
          size={31}
          color={COLOR.gold}
          weight={500}
          lines={[[{ t: "Local demand doesn’t disappear." }], [{ t: "It lands somewhere else." }]]}
        />
      </div>
    </div>
  );
};
