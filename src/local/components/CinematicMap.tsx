import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { noise } from "../helpers";
import { COLORS, MAP_TRANSFORM } from "../theme";

type Props = {
  seed?: number;
  brightness?: number;
  // Parallax drift from the scene camera.
  driftX?: number;
  driftY?: number;
  width?: number;
  height?: number;
  // Warm city-light amount.
  warm?: number;
  style?: React.CSSProperties;
};

// Dark dimensional neighborhood on a tilted plane: a street grid, raised
// block volumes with lit windows, arterial glows and deterministic city
// speckles. Perspective stays identical across scenes for continuity.
export const CinematicMap: React.FC<Props> = ({
  seed = 1,
  brightness = 1,
  driftX = 0,
  driftY = 0,
  width = 1600,
  height = 1500,
  warm = 0.5,
  style,
}) => {
  const frame = useCurrentFrame();

  const world = useMemo(() => {
    const blocks = Array.from({ length: 96 }, (_, i) => ({
      x: noise(seed, i) * width,
      y: noise(seed + 1, i) * height,
      w: 34 + noise(seed + 2, i) * 120,
      h: 26 + noise(seed + 3, i) * 84,
      lit: noise(seed + 4, i) > 0.58,
      warmLit: noise(seed + 5, i) < warm * 0.5,
      phase: noise(seed + 6, i) * Math.PI * 2,
      shade: 0.5 + noise(seed + 7, i) * 0.5,
    }));
    const speckles = Array.from({ length: 120 }, (_, i) => ({
      x: noise(seed + 11, i) * width,
      y: noise(seed + 12, i) * height,
      gold: noise(seed + 13, i) < warm * 0.5,
      r: 0.8 + noise(seed + 14, i) * 1.4,
      phase: noise(seed + 15, i) * Math.PI * 2,
    }));
    return { blocks, speckles };
  }, [seed, width, height, warm]);

  const cell = 100;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const slow = frame * 0.12;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "56%",
        width,
        height,
        transform: `translate(-50%, -44%) ${MAP_TRANSFORM} translate3d(${driftX}px, ${driftY}px, 0)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Distant grid */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.4 * brightness, transform: `translate3d(0, ${slow * 0.3}px, -120px)` }}>
        {Array.from({ length: cols }, (_, i) => (
          <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={height} stroke="rgba(31,199,255,0.06)" strokeWidth={1} />
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * cell} x2={width} y2={i * cell} stroke="rgba(31,199,255,0.06)" strokeWidth={1} />
        ))}
      </svg>

      {/* Raised blocks */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `translate3d(0, ${slow * 0.5}px, 0)` }}>
        {world.blocks.map((b, i) => {
          const flick = b.lit ? 0.5 + 0.28 * Math.sin(frame * 0.05 + b.phase) : 0.3;
          return (
            <g key={i}>
              <rect x={b.x + 3} y={b.y + 4} width={b.w} height={b.h} rx={3} fill="#000" opacity={0.4 * b.shade} />
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={3}
                fill={`rgba(9,16,25,${0.72 + 0.28 * b.shade})`}
                stroke={
                  b.lit
                    ? b.warmLit
                      ? `rgba(243,188,66,${0.14 * flick * brightness})`
                      : `rgba(31,199,255,${0.16 * flick * brightness})`
                    : "rgba(98,108,119,0.08)"
                }
                strokeWidth={1.1}
              />
            </g>
          );
        })}
      </svg>

      {/* Speckles */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `translate3d(0, ${slow * 0.6}px, 0)` }}>
        {world.speckles.map((s, i) => {
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.06 + s.phase));
          return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.gold ? COLORS.gold : "rgba(167,175,185,0.7)"} opacity={(s.gold ? 0.5 : 0.2) * tw * brightness} />;
        })}
      </svg>
    </div>
  );
};

// A glowing customer origin node (concentric cyan rings + bright core).
export const CustomerNode: React.FC<{ x: number; y: number; appear?: number; scale?: number }> = ({ x, y, appear = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const since = frame - appear;
  if (since < 0) {
    return null;
  }
  const beat = 0.7 + 0.3 * Math.sin(frame * 0.13);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 1, 2].map((i) => {
        const ph = (frame * 0.014 + i / 3) % 1;
        return <ellipse key={i} cx={0} cy={0} rx={18 + ph * 70} ry={(18 + ph * 70) * 0.42} fill="none" stroke={COLORS.cyan} strokeWidth={1.6} opacity={(1 - ph) * 0.5} />;
      })}
      <ellipse cx={0} cy={0} rx={30} ry={12} fill={COLORS.cyan} opacity={0.14 * beat} />
      <circle cx={0} cy={0} r={9} fill="#CFF4FF" />
      <circle cx={0} cy={0} r={5} fill="#FFFFFF" />
    </g>
  );
};
