import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C, MAIN_ROUTE, ON_RAMP, ON_RAMP_END } from "../constants";
import { kf } from "../helpers";

// Normalised path length so dash maths is geometry-independent.
const PL = 1000;

const Pulse: React.FC<{
  d: string;
  phase: number;
  period: number;
  len: number;
  frame: number;
  opacity: number;
  color: string;
  width: number;
}> = ({ d, phase, period, len, frame, opacity, color, width }) => {
  // Move a short bright dash along the path by shifting the dash offset.
  const prog = ((frame / period + phase) % 1 + 1) % 1;
  const offset = PL - prog * PL;
  return (
    <path
      d={d}
      pathLength={PL}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${len} ${PL - len}`}
      strokeDashoffset={offset}
      opacity={opacity}
      filter="url(#routeGlowSoft)"
    />
  );
};

export const SearchRoute: React.FC = () => {
  const frame = useCurrentFrame();

  // Draw the highway into existence early in Scene 1.
  const drawOffset = kf(frame, [8, 78], [PL, 0]);
  // Overall route presence.
  const routeOpacity = kf(frame, [0, 40], [0.25, 1]);

  // Fast "demand" pulses ramp in for scenes 2-4 then ease back.
  const fastOn = interpolate(
    frame,
    [130, 175, 470, 500],
    [0, 1, 1, 0.35],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // On-ramp (Scene 5) draw-in and pulse.
  const rampDraw = kf(frame, [500, 560], [PL, 0]);
  const rampOpacity = kf(frame, [498, 528], [0, 1]);
  const arrowOpacity = kf(frame, [552, 572], [0, 1]);
  const aa = (ON_RAMP_END.angleDeg * Math.PI) / 180;
  const ax = ON_RAMP_END.x;
  const ay = ON_RAMP_END.y;
  const arrow = `M ${ax} ${ay} L ${ax - 16 * Math.cos(aa - 0.5)} ${ay - 16 * Math.sin(aa - 0.5)} L ${ax - 16 * Math.cos(aa + 0.5)} ${ay - 16 * Math.sin(aa + 0.5)} Z`;

  return (
    <g>
      <defs>
        <filter id="routeGlowSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="routeGlowWide" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <g opacity={routeOpacity}>
        {/* Outer bloom */}
        <path
          d={MAIN_ROUTE}
          pathLength={PL}
          fill="none"
          stroke={C.cyanGlow}
          strokeWidth={34}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={drawOffset}
          filter="url(#routeGlowWide)"
        />
        {/* Main road line */}
        <path
          d={MAIN_ROUTE}
          pathLength={PL}
          fill="none"
          stroke={C.cyanDim}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={drawOffset}
          filter="url(#routeGlowSoft)"
        />
        {/* Bright inner highlight */}
        <path
          d={MAIN_ROUTE}
          pathLength={PL}
          fill="none"
          stroke={C.cyanBright}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={drawOffset}
        />

        {/* Slow ambient light pulses */}
        <Pulse d={MAIN_ROUTE} phase={0.0} period={150} len={26} frame={frame} opacity={0.9} color="#EAFBFF" width={6} />
        <Pulse d={MAIN_ROUTE} phase={0.34} period={150} len={20} frame={frame} opacity={0.75} color={C.cyanBright} width={5} />
        <Pulse d={MAIN_ROUTE} phase={0.68} period={150} len={22} frame={frame} opacity={0.7} color={C.cyanBright} width={5} />

        {/* Faster demand pulses */}
        <g opacity={fastOn}>
          <Pulse d={MAIN_ROUTE} phase={0.12} period={78} len={16} frame={frame} opacity={0.95} color="#FFFFFF" width={5} />
          <Pulse d={MAIN_ROUTE} phase={0.5} period={78} len={14} frame={frame} opacity={0.85} color={C.cyanBright} width={4.5} />
          <Pulse d={MAIN_ROUTE} phase={0.82} period={78} len={14} frame={frame} opacity={0.8} color={C.cyanBright} width={4.5} />
        </g>
      </g>

      {/* Scene 5 on-ramp — branches off the route toward the storefront. */}
      <g opacity={rampOpacity}>
        <path
          d={ON_RAMP}
          pathLength={PL}
          fill="none"
          stroke={C.cyanGlow}
          strokeWidth={26}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={rampDraw}
          filter="url(#routeGlowWide)"
        />
        <path
          d={ON_RAMP}
          pathLength={PL}
          fill="none"
          stroke={C.cyanDim}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={rampDraw}
          filter="url(#routeGlowSoft)"
        />
        <path
          d={ON_RAMP}
          pathLength={PL}
          fill="none"
          stroke={C.cyanBright}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${PL} ${PL}`}
          strokeDashoffset={rampDraw}
        />
        {/* Pulse travelling down the on-ramp toward the business. */}
        {frame > 528 && (
          <Pulse
            d={ON_RAMP}
            phase={0}
            period={64}
            len={30}
            frame={frame - 528}
            opacity={0.95}
            color="#FFFFFF"
            width={6}
          />
        )}
        {/* Arrowhead landing at the storefront door. */}
        <path d={arrow} fill={C.cyanBright} opacity={arrowOpacity} filter="url(#routeGlowSoft)" />
      </g>
    </g>
  );
};
