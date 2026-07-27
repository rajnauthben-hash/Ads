import React from "react";
import { T } from "../tokens";
import { ROUTES } from "../world";
import { Route } from "../parts/Route";
import { OriginRings, DestinationRing } from "../parts/Icons";
import { CyanDoor } from "../parts/Route";
import { EditorialHeadline, SupportingCopy } from "../parts/Text";
import { Checklist } from "../parts/Checklist";
import { OmniFlowBrandLockup } from "../parts/Brand";
import { prog, ramp, clamp01 } from "../parts/motion";

export const S4World: React.FC<{ f: number }> = ({ f }) => {
  const reveal = ramp(f, 475, 534, 0, 1);
  const pulse = f <= 544 ? ramp(f, 520, 544, 0.02, 1) : ((f - 544) % 40) / 40;
  const destP = ramp(f, 540, 544, 0, 1);
  const doorResp = ramp(f, 535, 544, 0.15, 1);
  const breathe = (f % 46) / 46;
  const originFade = 1 - ramp(f, 555, 564, 0, 1);
  return (
    <g>
      <Route d={ROUTES.s4} reveal={reveal} pulse={pulse} width={5} arrow breathe={breathe} />
      {destP > 0 && <DestinationRing x={710} y={580} p={destP} />}
      <CyanDoor x={710} y={580} p={doorResp} />
      <g opacity={originFade}><OriginRings x={405} y={1160} t={(f % 60) / 60} /></g>
    </g>
  );
};

export const S4Overlay: React.FC<{ f: number }> = ({ f }) => {
  const s12 = prog(f, 475, 479);
  const s34 = prog(f, 480, 484);
  const circleP = [0, 1, 2, 3, 4, 5].map((i) => ramp(f, 485 + i * 5, 489 + i * 5, 0, 1));
  const labelP = [0, 1, 2, 3, 4, 5].map((i) => prog(f, 490 + i * 5, 494 + i * 5));
  const underline = ramp(f, 550, 554, 0, 1);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <EditorialHeadline x={80} y={210} width={590} size={61} lineHeight={70}
        lineP={[prog(f, 460, 464), prog(f, 465, 469), prog(f, 470, 474)]}
        lines={[[{ t: "OmniFlow Digital" }], [{ t: "reconnects you", c: T.gold }], [{ t: "to local demand.", c: T.gold }]]} />
      <SupportingCopy x={80} y={465} width={550} size={27} lineHeight={40} lineP={[s12, s12, s34, s34]}
        lines={["We strengthen the signals that help customers", "find, trust, and choose your business.", "So when the next search happens,", "the pulse leads to your door."]} />
      <Checklist x={80} y={690} size={29} rowGap={58} circleP={circleP} labelP={labelP} />
      <div style={{ position: "absolute", left: 80, top: 1100 }}>
        <SupportingCopy x={0} y={0} width={520} size={39} lineHeight={50} color={T.gold} lineP={[prog(f, 545, 549), prog(f, 550, 554)]}
          lines={["You get found.", "You get chosen."]} />
        <div style={{ position: "absolute", top: 108, left: 0, width: 150 * clamp01(underline), height: 3, background: T.cyan, opacity: 0.85 }} />
      </div>
      <OmniFlowBrandLockup x={170} y={1280} logoDraw={ramp(f, 555, 564, 0, 1)} nameP={ramp(f, 565, 569, 0, 1)} tagWhiteP={ramp(f, 570, 574, 0, 1)} tagCyanP={ramp(f, 575, 579, 0, 1)} />
    </div>
  );
};
