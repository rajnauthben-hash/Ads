import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { T, FONT } from "../tokens";
import { project, roundedPath, Pt } from "../parts/projection";
import { MapField } from "../parts/MapField";
import { CrownStore, CrownDefs } from "../parts/CrownStore";
import { Route, RouteDefs } from "../parts/Route";
import { MapPin, HouseIcon, CubeIcon, OriginRings } from "../parts/Icons";
import { EditorialHeadline, SupportingCopy } from "../../localdemand/text/EditorialText";
import { CalloutBox } from "../../localdemand/text/Extras";

const CROWN = { gx: 0.62, depth: 0.66, scale: 0.74 };

const ROUTE_NODES: Array<[number, number]> = [
  [-0.7, 0.05], [-0.7, 0.2], [-0.25, 0.2], [-0.25, 0.38],
  [0.1, 0.38], [0.1, 0.52], [0.42, 0.52], [0.42, 0.6],
];

const POI: Array<[number, number, "pin" | "house" | "cube", number]> = [
  [-0.72, 0.42, "pin", 0.9], [0.9, 0.5, "pin", 0.85], [0.62, 0.28, "pin", 0.8],
  [-0.05, 0.62, "house", 0.9], [0.95, 0.66, "house", 0.85], [-0.2, 0.86, "house", 0.8],
  [0.5, 0.82, "house", 0.75], [0.78, 0.82, "cube", 0.8], [-0.55, 0.7, "cube", 0.7],
];

export const Scene1: React.FC<{ f: number }> = ({ f }) => {
  const crownBase = project(CROWN.gx, CROWN.depth);
  const origin = project(-0.7, 0.05);
  const routePts: Pt[] = ROUTE_NODES.map(([gx, d]) => project(gx, d));
  routePts.push({ x: crownBase.x - 8, y: crownBase.y + 30 });
  const routeD = roundedPath(routePts, 30);

  const reveal = interpolate(f, [0, 40], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = (f % 70) / 70;
  const breathe = (f % 46) / 46;
  const lit = 0.7 + 0.15 * Math.sin(f / 30);

  const headIn = interpolate(f, [10, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const supIn = interpolate(f, [26, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goldIn = interpolate(f, [44, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutIn = interpolate(f, [52, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 62% 34%, ${T.bg2} 0%, ${T.bg0} 62%, #030409 100%)` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <CrownDefs />
        <RouteDefs />
        <MapField />

        {/* POI markers */}
        {POI.map(([gx, d, kind, op], i) => {
          const p = project(gx, d);
          const s = 0.5 + (1 - d) * 0.5;
          if (kind === "pin") return <MapPin key={i} x={p.x} y={p.y} s={s} opacity={op} />;
          if (kind === "house") return <HouseIcon key={i} x={p.x} y={p.y} s={s} opacity={op} />;
          return <CubeIcon key={i} x={p.x} y={p.y} s={s} opacity={op} />;
        })}

        {/* Crown Hardware */}
        <g transform={`translate(${crownBase.x}, ${crownBase.y}) scale(${CROWN.scale})`}>
          <CrownStore lit={lit} />
        </g>

        {/* route + origin */}
        <Route d={routeD} reveal={reveal} pulse={pulse} width={5} arrow breathe={breathe} />
        <OriginRings x={origin.x} y={origin.y} t={(f % 60) / 60} />
      </svg>

      {/* editorial text */}
      <div style={{ position: "absolute", left: 68, top: 232, width: 460 }}>
        <EditorialHeadline
          into={headIn}
          size={72}
          lineHeight={1.04}
          groups={[0, 1, 2, 3, 4]}
          lines={[
            [{ t: "Search" }],
            [{ t: "demand" }],
            [{ t: "is ", c: T.white }, { t: "already", c: T.gold }],
            [{ t: "moving", c: T.gold }],
            [{ t: "around you.", c: T.gold }],
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 70, top: 700, width: 420 }}>
        <SupportingCopy
          into={supIn}
          size={27}
          color={T.gray}
          lines={[
            [{ t: "People nearby are searching" }],
            [{ t: "for what they need right now." }],
            [{ t: "Not later. Not tomorrow." }],
            [{ t: "Right now — on their phone," }],
            [{ t: "a few streets away." }],
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 70, top: 930, width: 420 }}>
        <SupportingCopy into={goldIn} size={30} color={T.gold} lines={[[{ t: "The opportunity is" }], [{ t: "already in motion." }]]} />
      </div>
      <div style={{ position: "absolute", left: 486, top: 1236 }}>
        <div style={{ fontFamily: FONT }}>
          <CalloutBox
            into={calloutIn}
            bordered
            size={30}
            lines={[
              [{ t: "Nearby intent.", c: T.white }],
              [{ t: "Real customers.", c: T.white }],
              [{ t: "Active demand.", c: T.cyan }],
            ]}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
