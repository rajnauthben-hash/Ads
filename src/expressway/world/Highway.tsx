import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// Highway — the persistent elevated expressway of cyan light-trails sweeping
// from the foreground up toward the skyline. Present in scenes 1, 2, 3 and 5;
// car silhouettes stream past during scene 3.
// ---------------------------------------------------------------------------

const HW =
  "M 1200 1800 C 992 1584 902 1372 824 1188 C 748 1008 706 862 764 722 C 804 636 906 598 1060 588";
const PL = 1000;

const Trail: React.FC<{ phase: number; period: number; len: number; frame: number; color: string; width: number; opacity: number; dir: number }> = ({
  phase,
  period,
  len,
  frame,
  color,
  width,
  opacity,
  dir,
}) => {
  const prog = ((frame / period * dir + phase) % 1 + 1) % 1;
  return (
    <path
      d={HW}
      pathLength={PL}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${len} ${PL - len}`}
      strokeDashoffset={PL - prog * PL}
      opacity={opacity}
      filter="url(#hwGlow)"
    />
  );
};

const Car: React.FC<{ phase: number; period: number; frame: number; up: boolean }> = ({ phase, period, frame, up }) => {
  const prog = ((frame / period * (up ? 1 : -1) + phase) % 1 + 1) % 1;
  return (
    <g filter="url(#hwBlur)">
      <path
        d={HW}
        pathLength={PL}
        fill="none"
        stroke={up ? "#EAFBFF" : "#FF6A4E"}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`26 ${PL}`}
        strokeDashoffset={PL - prog * PL}
        opacity={0.9}
      />
      <path
        d={HW}
        pathLength={PL}
        fill="none"
        stroke={up ? "#9FE9FF" : "#B5341F"}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`60 ${PL}`}
        strokeDashoffset={PL - prog * PL + (up ? -34 : 34)}
        opacity={0.5}
      />
    </g>
  );
};

export const Highway: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const carsOn = interpolate(frame, [244, 268, 356, 372], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="hwGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="hwBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* Roadbed */}
      <path d={HW} fill="none" stroke="#0A141C" strokeWidth={74} strokeLinecap="round" opacity={0.9} />
      <path d={HW} fill="none" stroke="#0E1E2A" strokeWidth={58} strokeLinecap="round" opacity={0.8} />
      {/* Cyan bloom */}
      <path d={HW} fill="none" stroke={C.cyanGlow} strokeWidth={48} strokeLinecap="round" filter="url(#hwGlow)" />

      {/* Lane light-trails (long streaks) */}
      <Trail phase={0.0} period={150} len={220} frame={frame} color={C.cyanDim} width={6} opacity={0.7} dir={1} />
      <Trail phase={0.33} period={150} len={200} frame={frame} color={C.cyan} width={5} opacity={0.8} dir={1} />
      <Trail phase={0.66} period={150} len={180} frame={frame} color={C.cyanBright} width={3.5} opacity={0.85} dir={1} />
      <Trail phase={0.16} period={190} len={160} frame={frame} color={C.cyanDim} width={5} opacity={0.5} dir={-1} />

      {/* Bright moving pulses */}
      <Trail phase={0.1} period={82} len={22} frame={frame} color={C.cyanCore} width={5} opacity={0.95} dir={1} />
      <Trail phase={0.55} period={82} len={20} frame={frame} color={C.cyanBright} width={4.5} opacity={0.85} dir={1} />

      {/* Scene-3 car traffic passing the business */}
      <g opacity={carsOn}>
        <Car phase={0.0} period={70} frame={frame} up />
        <Car phase={0.35} period={70} frame={frame} up />
        <Car phase={0.6} period={70} frame={frame} up />
        <Car phase={0.2} period={92} frame={frame} up={false} />
        <Car phase={0.75} period={92} frame={frame} up={false} />
      </g>
    </g>
  );
};
