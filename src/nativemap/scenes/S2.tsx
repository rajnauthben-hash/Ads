import React from "react";
import { T } from "../tokens";
import { ROUTES } from "../world";
import { Route } from "../parts/Route";
import { VectorPhone, SearchNode } from "../parts/Phone";
import { RouteJunction, DestinationRing } from "../parts/Icons";
import { EditorialHeadline, SupportingCopy, MotionCallout } from "../parts/Text";
import { prog, ramp, clamp01 } from "../parts/motion";

export const S2World: React.FC<{ f: number }> = ({ f }) => {
  const outline = ramp(f, 135, 154, 0, 1);
  const surface = ramp(f, 140, 154, 0, 1);
  const pt = prog(f, 150, 164);
  const offX = (1 - pt) * 55;
  const offY = (1 - pt) * 16;
  const scale = 0.97 + pt * 0.03;
  const rot = -2 - pt * 2;

  const fieldW = ramp(f, 175, 184, 74, 378);
  const typed = ramp(f, 185, 205, 0, 1);
  const iconScale = 1 + 0.08 * Math.sin(prog(f, 205, 209) * Math.PI);
  const optionP = [prog(f, 210, 214), prog(f, 215, 219), prog(f, 220, 224), prog(f, 225, 229)];

  const nodeRing = ramp(f, 230, 234, 0, 1);
  const nodeActive = ramp(f, 230, 239, 0.3, 1);
  const reveal = ramp(f, 235, 269, 0, 1);
  const pulse = f <= 269 ? ramp(f, 235, 269, 0.05, 0.95) : ((f - 269) % 34) / 34;
  const destP = ramp(f, 265, 269, 0, 1);
  const breathe = (f % 44) / 44;

  const phoneOut = prog(f, 281, 299);
  const junctionIn = prog(f, 290, 299);

  return (
    <g>
      {/* route + node */}
      {reveal > 0 && <Route d={ROUTES.s2} reveal={reveal} pulse={pulse} width={5} breathe={breathe} />}
      {destP > 0 && <DestinationRing x={255} y={1030} p={destP} />}
      {junctionIn > 0.01 && <RouteJunction x={505} y={835} opacity={junctionIn} />}

      <g opacity={1 - phoneOut} transform={`translate(${548 + offX},${380 + offY}) rotate(${rot} 237.5 410) translate(237.5 410) scale(${scale}) translate(-237.5 -410)`}>
        <VectorPhone outline={outline} surface={surface} fieldW={fieldW} typed={typed} optionP={optionP} iconScale={iconScale} />
      </g>
      <g opacity={1 - phoneOut * 0.4}>
        <SearchNode x={690} y={1050} d={112} active={nodeActive} ringP={nodeRing} />
      </g>
    </g>
  );
};

export const S2Overlay: React.FC<{ f: number }> = ({ f }) => {
  const s12 = prog(f, 160, 164);
  const s35 = prog(f, 165, 169);
  const out = prog(f, 283, 296);
  const exit = (): React.CSSProperties => out > 0 ? { clipPath: `inset(-0.2em -0.05em -0.2em ${out * 100}%)`, WebkitClipPath: `inset(-0.2em -0.05em -0.2em ${out * 100}%)`, transform: `translateX(${out * 8}px)`, filter: `blur(${out * 3}px)`, opacity: 1 - clamp01((out - 0.5) / 0.5) } : {};
  return (
    <div style={{ position: "absolute", inset: 0, ...exit() }}>
      <EditorialHeadline x={80} y={215} width={620} size={64} lineHeight={73}
        lineP={[prog(f, 150, 154), prog(f, 155, 159)]}
        lines={[[{ t: "Most local buying" }], [{ t: "starts with a search.", c: T.gold }]]} />
      <SupportingCopy x={80} y={410} width={530} size={27} lineHeight={40} lineP={[s12, s12, s35, s35, s35]}
        lines={["The customer types a few words.", "The map checks relevance, distance,", "hours, reviews, and availability in seconds.", "That small search sends a pulse", "through the whole local market."]} />
      <MotionCallout x={80} y={670} width={330} height={175} size={28} lineHeight={39}
        borderP={ramp(f, 165, 174, 0, 1)} bgP={ramp(f, 170, 174, 0, 0.92)}
        lineP={[prog(f, 170, 174), prog(f, 175, 179), prog(f, 180, 184)]}
        lines={[{ t: "Phone in hand." }, { t: "Need in mind." }, { t: "Decision in motion.", c: T.gold }]} />
    </div>
  );
};
