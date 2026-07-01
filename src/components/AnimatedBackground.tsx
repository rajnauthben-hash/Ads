import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COL } from "../lib/constants";

// Perspective grid lines converging at a vanishing point above center.
const PerspGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const cx = 540;
  const vy = 680; // vanishing point y
  // Fan lines spread across the bottom edge
  const bxs = [30, 150, 270, 400, 680, 810, 930, 1050];
  // Horizontal cross-sections below vanishing point
  const hys = [820, 980, 1140, 1340, 1560, 1760, 1900];

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {bxs.map((bx, i) => (
          <line
            key={`vl${i}`}
            x1={cx} y1={vy}
            x2={bx} y2={1920}
            stroke={COL.cyan}
            strokeWidth="0.6"
          />
        ))}
        {hys.map((hy, i) => {
          const spread = ((hy - vy) / (1920 - vy)) * 520;
          return (
            <line
              key={`hl${i}`}
              x1={cx - spread} y1={hy}
              x2={cx + spread} y2={hy}
              stroke={COL.cyan}
              strokeWidth="0.5"
              opacity={0.6 + i * 0.04}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Static ambient dots for texture depth
const DOTS = [
  { x: 108,  y: 310,  r: 1.4 },
  { x: 892,  y: 248,  r: 1.0 },
  { x: 196,  y: 572,  r: 1.0 },
  { x: 944,  y: 498,  r: 1.4 },
  { x: 152,  y: 888,  r: 1.0 },
  { x: 922,  y: 820,  r: 1.0 },
  { x: 72,   y: 1180, r: 1.4 },
  { x: 1008, y: 1096, r: 1.0 },
  { x: 236,  y: 1488, r: 1.0 },
  { x: 848,  y: 1432, r: 1.4 },
  { x: 374,  y: 192,  r: 1.0 },
  { x: 706,  y: 172,  r: 1.4 },
  { x: 438,  y: 460,  r: 1.0 },
  { x: 648,  y: 436,  r: 1.0 },
  { x: 300,  y: 1720, r: 1.0 },
  { x: 780,  y: 1680, r: 1.4 },
];

export const AnimatedBackground: React.FC<{ activation?: number }> = ({
  activation = 0,
}) => {
  const frame = useCurrentFrame();

  const pulse = interpolate(
    Math.sin((frame / 150) * Math.PI),
    [-1, 1], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const baseGlow = 0.5 + activation * 0.3 + pulse * 0.06;

  const gridOpacity = interpolate(activation, [0, 1], [0.024, 0.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cyanGlow = interpolate(activation, [0, 1], [0, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dotOpacity = 0.22 + activation * 0.12;

  return (
    <AbsoluteFill>
      {/* Base fill */}
      <AbsoluteFill style={{ background: COL.bgBlack }} />

      {/* Deep upper blue glow — always present, breathes */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 28%, rgba(7,18,52,${baseGlow}) 0%, transparent 70%)`,
        }}
      />

      {/* Post-activation cyan center glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 48% 36% at 50% 36%, rgba(34,211,238,${cyanGlow}) 0%, transparent 70%)`,
        }}
      />

      {/* Subtle violet lower accent */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 80%, rgba(139,92,246,${activation * 0.06}) 0%, transparent 60%)`,
        }}
      />

      {/* Perspective grid */}
      <PerspGrid opacity={gridOpacity} />

      {/* Ambient dots */}
      <AbsoluteFill style={{ opacity: dotOpacity, pointerEvents: "none" }}>
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {DOTS.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COL.cyan} opacity="0.4" />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Top vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,5,10,0.8) 0%, transparent 22%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(3,5,10,0.88) 0%, transparent 22%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
