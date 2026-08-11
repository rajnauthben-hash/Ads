import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

// ---------------------------------------------------------------------------
// Traffic — restrained light-streak cars that pass the storefront on a
// foreground road during Scene 3, then travel out of frame into Scene 4. The
// streaks move past the shop (right -> left), never turning toward it.
// ---------------------------------------------------------------------------

const FG_ROAD =
  "M 1140 1636 C 940 1690 760 1706 560 1694 C 380 1683 220 1712 -60 1786";
const PL = 1000;

const Car: React.FC<{ phase: number; period: number; frame: number; scale: number }> = ({
  phase,
  period,
  frame,
  scale,
}) => {
  const prog = ((frame / period + phase) % 1 + 1) % 1;
  const headOffset = prog * PL;
  return (
    <g filter="url(#trafficBlur)">
      {/* Headlight streak (leading, cyan-white) */}
      <path
        d={FG_ROAD}
        pathLength={PL}
        fill="none"
        stroke="#EAFBFF"
        strokeWidth={7 * scale}
        strokeLinecap="round"
        strokeDasharray={`${34 * scale} ${PL}`}
        strokeDashoffset={PL - headOffset}
        opacity={0.95}
      />
      {/* Red tail behind the head */}
      <path
        d={FG_ROAD}
        pathLength={PL}
        fill="none"
        stroke="#FF5A45"
        strokeWidth={5 * scale}
        strokeLinecap="round"
        strokeDasharray={`${20 * scale} ${PL}`}
        strokeDashoffset={PL - headOffset + 30 * scale}
        opacity={0.8}
      />
    </g>
  );
};

export const Traffic: React.FC = () => {
  const frame = useCurrentFrame();
  // Present through Scene 3, easing away as Scene 4 settles.
  const on = interpolate(
    frame,
    [244, 268, 372, 404],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (on < 0.01) return null;

  return (
    <g opacity={on}>
      <defs>
        <filter id="trafficBlur" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <Car phase={0.0} period={46} frame={frame} scale={1.15} />
      <Car phase={0.4} period={46} frame={frame} scale={0.9} />
      <Car phase={0.72} period={46} frame={frame} scale={1.0} />
      {/* A couple of brighter demand streaks on the main highway near the shop */}
      <g opacity={0.9} filter="url(#trafficBlur)">
        <path
          d="M 700 2010 C 892 1792 908 1600 802 1442"
          pathLength={PL}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={`22 ${PL}`}
          strokeDashoffset={PL - ((frame / 40) % 1) * PL}
          opacity={0.85}
        />
      </g>
    </g>
  );
};
