import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";
import { kf } from "../../road/helpers";

// ---------------------------------------------------------------------------
// Scene4Routes — the cause-and-effect fork.
//   • Solid electric-cyan route: YOUR CUSTOMER -> YOUR COMPETITOR (arrows point
//     toward the competitor, a pulse lands at its entrance).
//   • Dead gray dotted route: same customer origin -> CROWN HARDWARE, broken and
//     inactive (no pulse), with an X marking the failed connection.
// At the end of the scene the gray route is *repaired* segment by segment into
// cyan, carrying the flow toward Crown — this creates Scene 5.
// ---------------------------------------------------------------------------

const PL = 1000;

// Customer (512,724) -> competitor entrance (~750,1052).
const ACTIVE =
  "M 512 724 C 606 796 660 878 700 958 C 726 1010 742 1036 750 1052";
// Customer (508,740) -> Crown entrance (~258,1388), staying clear of the copy.
const DEAD =
  "M 508 740 C 524 906 500 1052 452 1172 C 402 1284 322 1350 258 1388";

// Arrowheads along the active route, pointing toward the competitor.
const ARROWS: { x: number; y: number; a: number }[] = [
  { x: 596, y: 800, a: 40 },
  { x: 668, y: 908, a: 54 },
  { x: 722, y: 998, a: 62 },
];

const Arrow: React.FC<{ x: number; y: number; a: number; o: number }> = ({ x, y, a, o }) => {
  const rad = (a * Math.PI) / 180;
  const s = 13;
  const tip = [x + s * Math.cos(rad), y + s * Math.sin(rad)];
  const l = [x - s * Math.cos(rad - 0.7), y - s * Math.sin(rad - 0.7)];
  const r = [x - s * Math.cos(rad + 0.7), y - s * Math.sin(rad + 0.7)];
  return (
    <path
      d={`M ${tip[0]} ${tip[1]} L ${l[0]} ${l[1]} L ${r[0]} ${r[1]} Z`}
      fill={C.cyanCore}
      opacity={o}
      filter="url(#exRouteGlow)"
    />
  );
};

export const Scene4Routes: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 366 || frame > 508) return null;

  // Draw-ins.
  const activeDraw = kf(frame, [376, 418], [PL, 0]);
  const deadDraw = kf(frame, [384, 430], [PL, 0]);
  // Fade out into Scene 5 so the fixed-coordinate geometry doesn't linger once
  // the camera and Crown store reframe.
  const routeOpacity = kf(frame, [366, 392], [0, 1]) * kf(frame, [488, 506], [1, 0]);
  const arrowsO = kf(frame, [412, 440], [0, 1]);

  // Active pulse customer -> competitor.
  const pulseProg = (((frame - 402) / 60) % 1 + 1) % 1;

  // Repair: gray route recolours to cyan from the customer end, frames 452-498.
  const repair = kf(frame, [452, 500], [PL, 0]);
  const repairOn = frame > 450 ? 1 : 0;
  // Once repaired, a pulse runs down the (now cyan) Crown route.
  const crownPulse = (((frame - 470) / 58) % 1 + 1) % 1;

  const xMarkO = interpolate(frame, [432, 452, 458, 476], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      <g opacity={routeOpacity}>
        {/* ---- Dead gray Crown route ---- */}
        <path
          d={DEAD}
          pathLength={PL}
          fill="none"
          stroke={C.gray}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`10 16`}
          strokeDashoffset={deadDraw}
          opacity={0.42}
        />
        {/* Repaired cyan overlay grows along the gray route */}
        <g opacity={repairOn}>
          <path d={DEAD} pathLength={PL} fill="none" stroke={C.cyanGlow} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={repair} filter="url(#exRouteGlow)" />
          <path d={DEAD} pathLength={PL} fill="none" stroke={C.cyanDim} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={repair} />
          <path d={DEAD} pathLength={PL} fill="none" stroke={C.cyanBright} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={repair} />
          {frame > 470 && (
            <path d={DEAD} pathLength={PL} fill="none" stroke={C.cyanCore} strokeWidth={6} strokeLinecap="round" strokeDasharray={`24 ${PL}`} strokeDashoffset={PL - crownPulse * PL} opacity={0.9} filter="url(#exRouteGlow)" />
          )}
        </g>
        {/* Broken-connection X near Crown */}
        <g opacity={xMarkO} transform="translate(330 1330)">
          <line x1={-11} y1={-11} x2={11} y2={11} stroke={C.gray} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={11} y1={-11} x2={-11} y2={11} stroke={C.gray} strokeWidth={3.5} strokeLinecap="round" />
        </g>

        {/* ---- Active cyan competitor route ---- */}
        <path d={ACTIVE} pathLength={PL} fill="none" stroke={C.cyanGlow} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={activeDraw} filter="url(#exRouteGlow)" />
        <path d={ACTIVE} pathLength={PL} fill="none" stroke={C.cyanDim} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={activeDraw} />
        <path d={ACTIVE} pathLength={PL} fill="none" stroke={C.cyanBright} strokeWidth={3.2} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={activeDraw} />
        {/* Pulse to competitor */}
        {frame > 402 && (
          <path d={ACTIVE} pathLength={PL} fill="none" stroke={C.cyanCore} strokeWidth={6} strokeLinecap="round" strokeDasharray={`26 ${PL}`} strokeDashoffset={PL - pulseProg * PL} opacity={0.95} filter="url(#exRouteGlow)" />
        )}
        {/* Directional arrows */}
        {ARROWS.map((ar, i) => (
          <Arrow key={i} x={ar.x} y={ar.y} a={ar.a} o={arrowsO} />
        ))}
      </g>
    </g>
  );
};
