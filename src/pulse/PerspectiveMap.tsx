import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { seeded } from "./helpers";
import { COLORS } from "./theme";

type Props = {
  seed?: number;
  // Overall luminosity of the neighborhood (scene 06 runs brighter).
  brightness?: number;
  // Degrees of X tilt for the dimensional look.
  tilt?: number;
  // Parallax drift multiplier driven by the scene camera.
  driftX?: number;
  driftY?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

// Dark dimensional neighborhood: a tilted plane carrying a street grid,
// city blocks and faint avenue glows. Two depth layers (distant grid +
// block plane) drift at different rates for parallax. Fully deterministic.
export const PerspectiveMap: React.FC<Props> = ({
  seed = 1,
  brightness = 1,
  tilt = 54,
  driftX = 0,
  driftY = 0,
  width = 1600,
  height = 1400,
  style,
}) => {
  const frame = useCurrentFrame();

  const blocks = useMemo(() => {
    const rnd = seeded(seed * 991 + 17);
    return Array.from({ length: 42 }, () => ({
      x: rnd() * width,
      y: rnd() * height,
      w: 60 + rnd() * 170,
      h: 45 + rnd() * 120,
      lit: rnd() > 0.62,
      phase: rnd() * Math.PI * 2,
    }));
  }, [seed, width, height]);

  const cell = 110;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const slowDrift = frame * 0.14;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        width,
        height,
        transform: `translate(-50%, -42%) perspective(1400px) rotateX(${tilt}deg) translate3d(${driftX}px, ${driftY}px, 0)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Distant grid plane — drifts slower than the block plane */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5 * brightness,
          transform: `translate3d(${driftX * 0.4}px, ${slowDrift * 0.35}px, -120px)`,
        }}
      >
        {Array.from({ length: cols }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * cell}
            y1={0}
            x2={i * cell}
            y2={height}
            stroke={COLORS.mutedUi}
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * cell}
            x2={width}
            y2={i * cell}
            stroke={COLORS.mutedUi}
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Main block plane */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(0px, ${slowDrift * 0.6}px, 0)`,
        }}
      >
        {blocks.map((b, i) => {
          const flicker = b.lit
            ? 0.5 + 0.25 * Math.sin(frame * 0.06 + b.phase)
            : 0.28;
          return (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={4}
              fill={COLORS.slate}
              stroke={
                b.lit
                  ? `rgba(0, 210, 255, ${0.24 * flicker * brightness})`
                  : "rgba(167, 175, 183, 0.08)"
              }
              strokeWidth={1.4}
              opacity={Math.min(1, (0.55 + 0.45 * flicker) * brightness)}
            />
          );
        })}
        {/* Two broad avenues catching light */}
        <line
          x1={width * 0.18}
          y1={height}
          x2={width * 0.55}
          y2={0}
          stroke={`rgba(0, 210, 255, ${0.07 * brightness})`}
          strokeWidth={26}
        />
        <line
          x1={0}
          y1={height * 0.46}
          x2={width}
          y2={height * 0.4}
          stroke={`rgba(0, 210, 255, ${0.05 * brightness})`}
          strokeWidth={20}
        />
      </svg>
    </div>
  );
};
