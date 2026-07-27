import React from "react";
import { T } from "../tokens";
import { ROUTES } from "../world";
import { Route } from "../parts/Route";
import { GoldLocationPin, BusinessNode, OriginRings } from "../parts/Icons";
import { EditorialHeadline, SupportingCopy, MotionCallout } from "../parts/Text";
import { prog, ramp, clamp01 } from "../parts/motion";

const PINS = [[205, 1005, 20], [470, 485, 30], [705, 930, 55], [795, 700, 75]] as const;
const NODES = [[455, 370, "home"], [445, 635, "home"], [500, 755, "shop"], [565, 1040, "home"], [765, 855, "shop"]] as const;

export const S1World: React.FC<{ f: number }> = ({ f }) => {
  const reveal = ramp(f, 5, 84, 0.12, 1);
  const pulse = prog(f, 85, 118);
  const breathe = (f % 46) / 46;
  const originT = (f % 60) / 60;
  const out = prog(f, 119, 134);
  return (
    <g opacity={1 - out * 0.9}>
      {PINS.map(([x, y, fr], i) => <GoldLocationPin key={i} x={x} y={y} s={0.9} opacity={prog(f, fr, fr + 4)} />)}
      {NODES.map(([x, y, k], i) => <BusinessNode key={i} x={x as number} y={y as number} kind={k as "home" | "shop"} s={0.95} opacity={0.6 * prog(f, 65, 74)} />)}
      <Route d={ROUTES.s1} reveal={reveal} pulse={pulse} width={5} arrow breathe={breathe} />
      <OriginRings x={170} y={1335} t={originT} />
    </g>
  );
};

export const S1Overlay: React.FC<{ f: number }> = ({ f }) => {
  const p12 = prog(f, 45, 49);
  const p35 = prog(f, 50, 54);
  const out = prog(f, 125, 134);
  const exit = (): React.CSSProperties => out > 0 ? { clipPath: `inset(-0.2em -0.05em -0.2em ${out * 100}%)`, WebkitClipPath: `inset(-0.2em -0.05em -0.2em ${out * 100}%)`, transform: `translateX(${out * 8}px)`, filter: `blur(${out * 3}px)`, opacity: 1 - clamp01((out - 0.5) / 0.5) } : {};
  return (
    <div style={{ position: "absolute", inset: 0, ...exit() }}>
      <EditorialHeadline x={80} y={210} width={470} size={76} lineHeight={76}
        lineP={[prog(f, 15, 19), prog(f, 20, 24), prog(f, 25, 34), prog(f, 35, 39), prog(f, 40, 44)]}
        lines={[[{ t: "Search" }], [{ t: "demand" }], [{ t: "is ", c: T.white }, { t: "already", c: T.gold }], [{ t: "moving", c: T.gold }], [{ t: "around you.", c: T.gold }]]} />
      <SupportingCopy x={80} y={685} width={490} size={31} lineHeight={42} lineP={[p12, p12, p35, p35, p35]}
        lines={["People nearby are searching", "for what they need right now.", "Not later. Not tomorrow.", "Right now — on their phone,", "a few streets away."]} />
      <SupportingCopy x={80} y={970} width={440} size={36} lineHeight={47} color={T.gold} lineP={[prog(f, 55, 59), prog(f, 60, 64)]}
        lines={["The opportunity is", "already in motion."]} />
      <MotionCallout x={470} y={1160} width={325} height={175} size={31} lineHeight={43}
        borderP={ramp(f, 75, 84, 0, 1)} bgP={ramp(f, 80, 84, 0, 0.92)}
        lineP={[prog(f, 85, 89), prog(f, 90, 94), prog(f, 95, 99)]}
        lines={[{ t: "Nearby intent." }, { t: "Real customers." }, { t: "Active demand.", c: T.cyan }]} />
    </div>
  );
};
