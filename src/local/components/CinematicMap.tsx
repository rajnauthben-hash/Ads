import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { noise } from "../helpers";
import { COLORS, MAP_TRANSFORM } from "../theme";

type Props = {
  seed?: number;
  brightness?: number;
  // Fixed parallax offset (px). No per-frame drift — the map holds still so
  // the composition reads calm and premium.
  driftX?: number;
  driftY?: number;
  width?: number;
  height?: number;
  // Warm city-light amount.
  warm?: number;
  style?: React.CSSProperties;
};

// Dark dimensional neighborhood on a tilted plane: a street grid, raised
// block volumes and dim city speckles. Deliberately STILL — no flicker, no
// twinkle, no sliding — so it reads as a held cinematic environment rather
// than a busy animated background. Perspective is identical across scenes.
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
  const world = useMemo(() => {
    const blocks = Array.from({ length: 96 }, (_, i) => ({
      x: noise(seed, i) * width,
      y: noise(seed + 1, i) * height,
      w: 34 + noise(seed + 2, i) * 120,
      h: 26 + noise(seed + 3, i) * 84,
      lit: noise(seed + 4, i) > 0.58,
      warmLit: noise(seed + 5, i) < warm * 0.5,
      // Static per-block luminance — no time flicker.
      glow: 0.42 + 0.4 * noise(seed + 6, i),
      shade: 0.5 + noise(seed + 7, i) * 0.5,
    }));
    const speckles = Array.from({ length: 90 }, (_, i) => ({
      x: noise(seed + 11, i) * width,
      y: noise(seed + 12, i) * height,
      gold: noise(seed + 13, i) < warm * 0.5,
      r: 0.8 + noise(seed + 14, i) * 1.3,
      o: 0.25 + 0.5 * noise(seed + 16, i),
    }));
    return { blocks, speckles };
  }, [seed, width, height, warm]);

  const cell = 100;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;

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
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.38 * brightness, transform: "translate3d(0, 0, -120px)" }}>
        {Array.from({ length: cols }, (_, i) => (
          <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={height} stroke="rgba(31,199,255,0.055)" strokeWidth={1} />
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * cell} x2={width} y2={i * cell} stroke="rgba(31,199,255,0.055)" strokeWidth={1} />
        ))}
      </svg>

      {/* Raised blocks — static */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {world.blocks.map((b, i) => (
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
                    ? `rgba(243,188,66,${0.13 * b.glow * brightness})`
                    : `rgba(31,199,255,${0.15 * b.glow * brightness})`
                  : "rgba(98,108,119,0.08)"
              }
              strokeWidth={1.1}
            />
          </g>
        ))}
      </svg>

      {/* Speckles — static dim */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {world.speckles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.gold ? COLORS.gold : "rgba(167,175,185,0.7)"} opacity={(s.gold ? 0.45 : 0.18) * s.o * brightness} />
        ))}
      </svg>
    </div>
  );
};

// A glowing customer origin node: a soft steady core with a single slow,
// gentle ripple — one calm "ping", not a stack of racing rings.
export const CustomerNode: React.FC<{ x: number; y: number; appear?: number; scale?: number }> = ({ x, y, appear = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const since = frame - appear;
  if (since < 0) {
    return null;
  }
  // One ripple every ~2.3s, eased so it fades gently.
  const period = 70;
  const ph = (since % period) / period;
  const rippleR = 20 + ph * 66;
  const rippleO = (1 - ph) * (1 - ph) * 0.42;
  // Very soft core breath.
  const breath = 0.86 + 0.14 * Math.sin(since * 0.06);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={rippleR} ry={rippleR * 0.42} fill="none" stroke={COLORS.cyan} strokeWidth={1.5} opacity={rippleO} />
      <ellipse cx={0} cy={0} rx={30} ry={12} fill={COLORS.cyan} opacity={0.12 * breath} />
      <circle cx={0} cy={0} r={9} fill="#CFF4FF" opacity={breath} />
      <circle cx={0} cy={0} r={5} fill="#FFFFFF" />
    </g>
  );
};
