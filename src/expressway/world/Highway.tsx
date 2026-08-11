import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// Highway — the signature element: a glowing multi-lane light-trail expressway
// sweeping from the foreground up toward the skyline. Built as a bundle of
// parallel lanes (the spine offset perpendicular) so it reads like a real
// long-exposure highway of streaming light. Cars stream past during Scene 3.
// ---------------------------------------------------------------------------

const HW =
  "M 1200 1800 C 992 1584 902 1372 824 1188 C 748 1008 706 862 764 722 C 804 636 906 598 1060 588";
const PL = 1000;

// Lane offsets perpendicular to travel (near ~diagonal). Center lane brightest.
const LANES = [
  { dx: -26, dy: -9 },
  { dx: -13, dy: -4.5 },
  { dx: 0, dy: 0 },
  { dx: 13, dy: 4.5 },
  { dx: 26, dy: 9 },
];

const Trail: React.FC<{
  phase: number;
  period: number;
  len: number;
  frame: number;
  color: string;
  width: number;
  opacity: number;
  dir: number;
}> = ({ phase, period, len, frame, color, width, opacity, dir }) => {
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

const Car: React.FC<{ phase: number; period: number; frame: number; up: boolean; off: { dx: number; dy: number } }> = ({
  phase,
  period,
  frame,
  up,
  off,
}) => {
  const prog = ((frame / period * (up ? 1 : -1) + phase) % 1 + 1) % 1;
  return (
    <g transform={`translate(${off.dx} ${off.dy})`} filter="url(#hwBlur)">
      <path d={HW} pathLength={PL} fill="none" stroke={up ? "#FFFFFF" : "#FF6A4E"} strokeWidth={6} strokeLinecap="round" strokeDasharray={`30 ${PL}`} strokeDashoffset={PL - prog * PL} opacity={0.95} />
      <path d={HW} pathLength={PL} fill="none" stroke={up ? "#9FE9FF" : "#B5341F"} strokeWidth={3.5} strokeLinecap="round" strokeDasharray={`72 ${PL}`} strokeDashoffset={PL - prog * PL + (up ? -40 : 40)} opacity={0.5} />
    </g>
  );
};

export const Highway: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const carsOn = interpolate(frame, [244, 268, 356, 372], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={opacity}>
      <defs>
        <filter id="hwGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="hwGlowWide" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="hwBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      {/* Wide atmospheric bloom around the whole roadway */}
      <path d={HW} fill="none" stroke={C.cyanGlow} strokeWidth={90} strokeLinecap="round" filter="url(#hwGlowWide)" />

      {/* Per-lane light-trails */}
      {LANES.map((ln, i) => {
        const mid = i === 2;
        const edge = i === 0 || i === LANES.length - 1;
        return (
          <g key={i} transform={`translate(${ln.dx} ${ln.dy})`}>
            {/* lane bed glow */}
            <path d={HW} fill="none" stroke={C.cyanGlow} strokeWidth={mid ? 16 : 11} strokeLinecap="round" filter="url(#hwGlow)" opacity={edge ? 0.5 : 0.85} />
            {/* streaming trails */}
            <Trail phase={0.0 + i * 0.11} period={150 + i * 8} len={mid ? 260 : 210} frame={frame} color={C.cyanDim} width={mid ? 6 : 4} opacity={edge ? 0.4 : 0.7} dir={1} />
            <Trail phase={0.5 + i * 0.09} period={132 + i * 6} len={mid ? 230 : 190} frame={frame} color={mid ? C.cyanCore : C.cyanBright} width={mid ? 3.2 : 2.2} opacity={edge ? 0.55 : 0.9} dir={1} />
          </g>
        );
      })}

      {/* Hero white-hot pulses down the centre */}
      <Trail phase={0.12} period={80} len={26} frame={frame} color="#FFFFFF" width={4.5} opacity={0.98} dir={1} />
      <Trail phase={0.58} period={80} len={22} frame={frame} color={C.cyanCore} width={4} opacity={0.9} dir={1} />

      {/* Scene-3 car traffic passing the business */}
      <g opacity={carsOn}>
        <Car phase={0.0} period={70} frame={frame} up off={LANES[3]} />
        <Car phase={0.35} period={70} frame={frame} up off={LANES[4]} />
        <Car phase={0.6} period={70} frame={frame} up off={LANES[3]} />
        <Car phase={0.2} period={92} frame={frame} up={false} off={LANES[1]} />
        <Car phase={0.75} period={92} frame={frame} up={false} off={LANES[0]} />
      </g>
    </g>
  );
};
