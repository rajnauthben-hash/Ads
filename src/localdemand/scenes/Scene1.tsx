import React from "react";
import { interpolate, Easing } from "remotion";
import { COLOR } from "../theme";
import { S1_ROUTE } from "../layout";
import { RoadRoute } from "../RoadRoute";
import { EditorialHeadline, SupportingCopy } from "../text/EditorialText";
import { CalloutBox } from "../text/Extras";
import { clamp01 } from "../text/anim";

const ease = (t: number) => Math.max(0, Math.min(1, t));

export const Scene1World: React.FC<{ f: number }> = ({ f }) => {
  const progress = interpolate(f, [0, 68], [0.32, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const pulse = (f % 70) / 70; // continuous travelling pulse
  const out = clamp01((f - 128) / 22); // route hands off to Scene 2
  return (
    <g opacity={1 - out * 0.85}>
      <RoadRoute points={S1_ROUTE} progress={progress} pulse={0.2 + pulse * 0.8} radius={26} />
    </g>
  );
};

export const Scene1Overlay: React.FC<{ f: number }> = ({ f }) => {
  const headIn = interpolate(f, [12, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [35, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldIn = interpolate(f, [52, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutIn = interpolate(f, [58, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = ease((f - 122) / 14);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 64, top: 208, width: 560 }}>
        <EditorialHeadline
          into={headIn}
          out={out}
          size={84}
          groups={[0, 1, 2, 3, 4]}
          lines={[
            [{ t: "Search" }],
            [{ t: "demand" }],
            [{ t: "is " }, { t: "already", c: COLOR.gold }],
            [{ t: "moving", c: COLOR.gold }],
            [{ t: "around you.", c: COLOR.gold }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 700, width: 520 }}>
        <SupportingCopy
          into={supIn}
          out={out}
          size={31}
          lines={[
            [{ t: "People nearby are searching" }],
            [{ t: "for what they need right now." }],
            [{ t: "Not later. Not tomorrow." }],
            [{ t: "Right now — on their phone," }],
            [{ t: "a few streets away." }],
          ]}
        />
      </div>

      <div style={{ position: "absolute", left: 66, top: 918, width: 520 }}>
        <SupportingCopy
          into={goldIn}
          out={out}
          size={33}
          color={COLOR.gold}
          weight={500}
          lines={[[{ t: "The opportunity is" }], [{ t: "already in motion." }]]}
        />
      </div>

      <div style={{ position: "absolute", left: 360, top: 1150 }}>
        <CalloutBox
          into={calloutIn}
          out={out}
          bordered={false}
          size={30}
          lines={[
            [{ t: "Nearby intent." }],
            [{ t: "Real customers." }],
            [{ t: "Active demand.", c: COLOR.cyan }],
          ]}
        />
      </div>
    </div>
  );
};
