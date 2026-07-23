import React from "react";
import { interpolate, Easing } from "remotion";
import { COLOR } from "../theme";
import { S4_ROUTE, S4_ORIGIN, S3_COMP_ROUTE, crownXf } from "../layout";
import { RoadRoute } from "../RoadRoute";
import { CustomerMarker } from "../Markers";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { Checklist } from "../text/Extras";
import { OmniFlowBrandLockup } from "../OmniFlowBrandLockup";
import { clamp01 } from "../text/anim";

export const Scene4World: React.FC<{ f: number }> = ({ f }) => {
  // competitor route loses emphasis (echo), backward pulse
  const compEmph = interpolate(f, [450, 480], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const backPulse = 1 - ((f % 40) / 40);

  // dotted "missed" path repairs (fades) as the solid route draws to Crown
  const dottedEmph = interpolate(f, [450, 480], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const solidProg = interpolate(f, [462, 540], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pulse = 0.15 + ((f % 58) / 58) * 0.85;

  const crown = crownXf(f);
  const doorArrive = clamp01((f - 520) / 30);
  const doorX = crown.x - 22;
  const doorY = crown.y - 40;
  const layer = clamp01((f - 450) / 16);

  return (
    <g opacity={layer}>
      {compEmph > 0.01 && (
        <RoadRoute points={S3_COMP_ROUTE} progress={1} pulse={backPulse} emphasis={compEmph} radius={26} />
      )}
      {dottedEmph > 0.01 && (
        <RoadRoute points={S4_ROUTE} progress={1} dotted emphasis={dottedEmph} radius={26} showPulse={false} />
      )}

      <RoadRoute points={S4_ROUTE} progress={solidProg} pulse={pulse} radius={26} />
      <CustomerMarker at={S4_ORIGIN} opacity={1} pulse={(f % 60) / 60} />

      {/* pulse/arrow entering the doorway */}
      {doorArrive > 0 && (
        <g opacity={doorArrive}>
          <circle cx={doorX} cy={doorY} r={24 * doorArrive} fill={COLOR.cyanGlowSoft} filter="url(#cyanGlowWide)" />
          <path
            d={`M ${doorX - 14} ${doorY + 16} L ${doorX} ${doorY - 14} L ${doorX + 14} ${doorY + 16}`}
            fill="none"
            stroke={COLOR.cyanCore}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cyanGlow)"
          />
        </g>
      )}
    </g>
  );
};

export const Scene4Overlay: React.FC<{ f: number }> = ({ f }) => {
  const headIn = interpolate(f, [465, 498], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [482, 516], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const listIn = interpolate(f, [490, 548], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closeIn = interpolate(f, [545, 578], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const brandIn = interpolate(f, [556, 588], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inMask = clamp01((f - 450) / 16);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(inMask, 1) }}>
      <div style={{ position: "absolute", left: 64, top: 226, width: 560 }}>
        <EditorialHeadline
          into={headIn}
          size={65}
          groups={[0, 1, 2]}
          lines={[
            [{ t: "OmniFlow Digital" }],
            [{ t: "reconnects you", c: COLOR.gold }],
            [{ t: "to local demand.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 440, width: 640 }}>
        <SupportingCopy
          into={supIn}
          size={26}
          lines={[
            [{ t: "We strengthen the signals that help customers" }],
            [{ t: "find, trust, and choose your business." }],
            [{ t: "So when the next search happens," }],
            [{ t: "the pulse leads to your door." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 626 }}>
        <Checklist into={listIn} size={30} />
      </div>

      <div style={{ position: "absolute", left: 66, top: 1042, width: 540 }}>
        <SupportingCopy
          into={closeIn}
          size={40}
          color={COLOR.gold}
          weight={600}
          lines={[[{ t: "You get found." }], [{ t: "You get chosen." }]]}
        />
        <div style={{ marginTop: 14, width: 150, height: 3, background: COLOR.cyan, opacity: 0.8 * clamp01(closeIn) }} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 1648, display: "flex", justifyContent: "center" }}>
        <OmniFlowBrandLockup into={brandIn} />
      </div>
    </div>
  );
};
