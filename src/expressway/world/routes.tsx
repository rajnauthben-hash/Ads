import React from "react";
import { Seg, toD, sampleRoute } from "./path";
import { T } from "../theme";

const P = (x: number, y: number) => ({ x, y });

// ---- Route geometry (world space) -------------------------------------------
export const MAIN: Seg[] = [
  [P(150, 3260), P(360, 3160), P(470, 2980), P(560, 2760)],
  [P(560, 2760), P(650, 2600), P(940, 2620), P(980, 2400)],
  [P(980, 2400), P(1010, 2200), P(1170, 2120), P(1210, 1860)],
  [P(1210, 1860), P(1250, 1600), P(1120, 1420), P(1095, 1160)],
  [P(1095, 1160), P(1075, 940), P(1078, 760), P(1080, 600)],
];

// customer -> competitor (Scene 4 active route)
export const COMP: Seg[] = [
  [P(250, 3040), P(370, 2900), P(470, 2820), P(570, 2720)],
  [P(570, 2720), P(700, 2610), P(900, 2640), P(985, 2470)],
  [P(985, 2470), P(1060, 2320), P(1010, 2160), P(1110, 2010)],
  [P(1110, 2010), P(1190, 1880), P(1215, 1700), P(1230, 1545)],
];

// broken branch toward Crown (Scene 4 failed route) — note the gap between segs
export const CROWNFAIL: Seg[] = [
  [P(470, 2872), P(560, 2822), P(620, 2802), P(690, 2772)],
  [P(724, 2756), P(762, 2738), P(792, 2712), P(813, 2688)],
];

// repaired road down to Crown (Scene 5)
export const REPAIR: Seg[] = [
  [P(980, 2400), P(945, 2500), P(895, 2560), P(852, 2612)],
  [P(852, 2612), P(838, 2640), P(826, 2662), P(815, 2682)],
];

// ---- Chevron / arrowhead -----------------------------------------------------
const Chevron: React.FC<{ x: number; y: number; angle: number; size?: number; color?: string; opacity?: number }> = ({
  x,
  y,
  angle,
  size = 15,
  color = "#EAFBFF",
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacity}>
    <path
      d={`M ${-size * 0.5} ${-size * 0.7} L ${size * 0.7} 0 L ${-size * 0.5} ${size * 0.7} L ${-size * 0.1} 0 Z`}
      fill={color}
    />
  </g>
);

// ---- Active glowing route ----------------------------------------------------
export const GlowRoute: React.FC<{
  segs: Seg[];
  progress: number; // 0..1 draw-on
  pulseT?: number | null; // travelling pulse position along route
  arrowTs?: number[]; // static directional chevrons revealed by draw-on
  width?: number;
  glow?: number; // outer bloom multiplier
}> = ({ segs, progress, pulseT = null, arrowTs = [], width = 7, glow = 1 }) => {
  const d = toD(segs);
  const dash = 1000;
  const off = dash * (1 - Math.max(0, Math.min(1, progress)));
  const common = {
    d,
    pathLength: dash,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDasharray: dash,
    strokeDashoffset: off,
  };
  return (
    <g>
      {/* outer bloom */}
      <path {...common} stroke={T.cyan} strokeOpacity={0.16 * glow} strokeWidth={width * 4.2} />
      <path {...common} stroke={T.cyan} strokeOpacity={0.3 * glow} strokeWidth={width * 2.2} />
      {/* body */}
      <path {...common} stroke={T.cyan} strokeWidth={width} />
      {/* bright core */}
      <path {...common} stroke={T.cyanHi} strokeWidth={width * 0.4} strokeOpacity={0.95} />

      {/* directional chevrons */}
      {arrowTs.map((t, i) => {
        if (t > progress) return null;
        const s = sampleRoute(segs, t);
        return <Chevron key={i} x={s.x} y={s.y} angle={s.angle} size={14} opacity={0.9} />;
      })}

      {/* travelling pulse */}
      {pulseT !== null && pulseT >= 0 && pulseT <= progress + 0.001
        ? (() => {
            const s = sampleRoute(segs, pulseT);
            return (
              <g>
                <circle cx={s.x} cy={s.y} r={26} fill={T.cyan} opacity={0.18} />
                <circle cx={s.x} cy={s.y} r={12} fill={T.cyanHi} opacity={0.35} />
                <circle cx={s.x} cy={s.y} r={5.5} fill="#FFFFFF" />
                <Chevron x={s.x} y={s.y} angle={s.angle} size={17} color="#FFFFFF" />
              </g>
            );
          })()
        : null}
    </g>
  );
};

// ---- Failed (dead) route with repair capability ------------------------------
export const FailedRoute: React.FC<{
  segs: Seg[];
  reveal: number; // 0..1 how much of the dead route is shown
  repair?: number; // 0..1 turns it back into a live cyan route
  breakAt?: { x: number; y: number }; // X marker location
}> = ({ segs, reveal, repair = 0, breakAt }) => {
  const d = toD(segs);
  const dash = 1000;
  const off = dash * (1 - Math.max(0, Math.min(1, reveal)));
  const grayOpacity = (1 - repair) * 0.75;
  return (
    <g>
      {/* dead gray dashed line */}
      <path
        d={d}
        pathLength={dash}
        fill="none"
        stroke={T.grayRoute}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`10 16`}
        opacity={grayOpacity}
        style={{ strokeDashoffset: off }}
      />
      {/* X marker over the break */}
      {breakAt && repair < 0.35 ? (
        <g
          transform={`translate(${breakAt.x} ${breakAt.y})`}
          opacity={(1 - repair / 0.35) * Math.min(1, reveal * 2)}
          stroke={T.grayRoute}
          strokeWidth={5}
          strokeLinecap="round"
        >
          <line x1={-13} y1={-13} x2={13} y2={13} />
          <line x1={13} y1={-13} x2={-13} y2={13} />
        </g>
      ) : null}
      {/* repaired cyan overlay drawing along the same path */}
      {repair > 0 ? <GlowRoute segs={segs} progress={repair} width={6} /> : null}
    </g>
  );
};
