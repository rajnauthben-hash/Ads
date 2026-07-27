import React from "react";
import { T } from "../tokens";
import { ROUTES } from "../world";
import { Route } from "../parts/Route";
import { CustomerNode, DestinationRing } from "../parts/Icons";
import { CompetitorStore, CompetitorDefs } from "../parts/CompetitorStore";
import { EditorialHeadline, SupportingCopy, PillLabel } from "../parts/Text";
import { prog, ramp } from "../parts/motion";

export const S3World: React.FC<{ f: number }> = ({ f }) => {
  const custRing = ramp(f, 335, 344, 0, 1) * (1 - ramp(f, 340, 344, 0, 1));
  const custOp = ramp(f, 300, 314, 0.2, 1);

  const sharedRev = ramp(f, 345, 355, 0, 1);
  const sharedPulse = f < 355 ? ramp(f, 345, 355, 0.02, 0.4) : Math.min(1, ramp(f, 355, 359, 0.4, 1));

  const compRev = ramp(f, 360, 399, 0, 1);
  const compPulse = f <= 399 ? ramp(f, 360, 399, 0.05, 0.98) : ((f - 399) % 40) / 40;
  const compDest = ramp(f, 395, 404, 0, 1);

  const crownSolidRev = ramp(f, 360, 386, 0, 0.76);
  const dotted = f >= 386;
  const repair = ramp(f, 440, 449, 0, 1); // reconnect during transition
  const crownColor = f >= 415 && repair < 0.05 ? T.failed : T.cyan;

  const compWarm = ramp(f, 400, 404, 0.35, 0.72);
  const compFade = 1 - ramp(f, 445, 449, 0, 0.55);

  return (
    <g>
      <CompetitorDefs />
      {/* competitor store (base-centre at box bottom) */}
      <g transform={`translate(750,1330) scale(1.2)`} opacity={compFade}>
        <CompetitorStore lit={compWarm} />
      </g>

      {/* shared route */}
      <Route d={ROUTES.s3shared} reveal={sharedRev} pulse={sharedPulse} width={5} />

      {/* crown branch: solid → dotted → grey (repairs at end) */}
      {!dotted && <Route d={ROUTES.s3crown} reveal={crownSolidRev} width={5} pulse={ramp(f, 360, 386, 0.1, 0.7)} />}
      {dotted && repair < 0.98 && <Route d={ROUTES.s3crown} reveal={1} dotted color={crownColor} width={5} />}
      {repair > 0.02 && <Route d={ROUTES.s3crown} reveal={repair} width={5} pulse={repair} />}

      {/* competitor branch: solid, reaches competitor */}
      <Route d={ROUTES.s3comp} reveal={compRev} pulse={compPulse} width={5} emphasis={compFade} />
      {compDest > 0 && <DestinationRing x={735} y={1115} p={compDest} />}

      {/* customer node */}
      <CustomerNode x={170} y={1240} d={110} ring={custRing} opacity={custOp} />
    </g>
  );
};

export const S3Overlay: React.FC<{ f: number }> = ({ f }) => {
  const s13 = prog(f, 335, 339);
  const s46 = prog(f, 340, 344);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <EditorialHeadline x={80} y={205} width={610} size={63} lineHeight={71}
        lineP={[prog(f, 315, 319), prog(f, 320, 324), prog(f, 325, 329), prog(f, 330, 334)]}
        lines={[[{ t: "The search" }], [{ t: "is still happening." }], [{ t: "It just doesn’t", c: T.gold }], [{ t: "land on you.", c: T.gold }]]} />
      <SupportingCopy x={80} y={555} width={500} size={27} lineHeight={40} lineP={[s13, s13, s13, s46, s46, s46]}
        lines={["If your signals are weak,", "the pulse keeps moving.", "The customer was nearby.", "The need was real.", "The map simply connected them", "to a business it understood first."]} />
      <SupportingCopy x={80} y={900} width={520} size={31} lineHeight={42} color={T.gold} lineP={[prog(f, 345, 349), prog(f, 350, 354)]}
        lines={["Local demand doesn’t disappear.", "It lands somewhere else."]} />

      <PillLabel x={90} y={1085} width={270} height={78} text="Your customer" person borderP={ramp(f, 310, 314, 0, 1)} textP={prog(f, 315, 319)} />
      <PillLabel x={620} y={245} width={280} height={70} text="Crown Hardware" borderP={ramp(f, 405, 409, 0, 1)} textP={prog(f, 405, 409)} />
      <PillLabel x={640} y={930} width={220} height={70} text="Competitor" borderP={ramp(f, 410, 414, 0, 1)} textP={prog(f, 410, 414)} />
      <PillLabel x={670} y={625} width={230} height={105} text="Missed connection" borderP={ramp(f, 410, 419, 0, 1)} textP={prog(f, 415, 419)} size={26} />
    </div>
  );
};
