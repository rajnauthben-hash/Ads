import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { noise, seeded, smoothPath, type Pt } from "./helpers";
import { COLORS, FONTS } from "./theme";

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
  // Street names sprinkled onto the plane.
  labels?: string[];
  // 0..1 — amount of warm gold city-light dust.
  goldDust?: number;
  style?: React.CSSProperties;
};

const DEFAULT_LABELS = ["PINE ST", "OAK AVE", "MAPLE DR", "RIVER RD", "MAIN ST"];

// Dark dimensional city: a tilted plane carrying arterial roads with warm
// light-dust, a minor street grid, hundreds of block volumes with lit
// windows, twinkling city speckles and street labels. Three internal depth
// layers drift at different rates. Fully deterministic.
export const PerspectiveMap: React.FC<Props> = ({
  seed = 1,
  brightness = 1,
  tilt = 54,
  driftX = 0,
  driftY = 0,
  width = 1700,
  height = 1500,
  labels = DEFAULT_LABELS,
  goldDust = 0.8,
  style,
}) => {
  const frame = useCurrentFrame();

  const world = useMemo(() => {
    const rnd = seeded(seed * 991 + 17);
    // City blocks — denser, varied footprints.
    const blocks = Array.from({ length: 110 }, () => ({
      x: rnd() * width,
      y: rnd() * height,
      w: 34 + rnd() * 130,
      h: 26 + rnd() * 90,
      lit: rnd() > 0.55,
      warm: rnd() > 0.7,
      phase: rnd() * Math.PI * 2,
      shade: 0.5 + rnd() * 0.5,
    }));
    // Arterial roads — organic polylines crossing the plane.
    const arteries: Pt[][] = Array.from({ length: 4 }, (_, a) => {
      const vertical = a % 2 === 0;
      const base = rnd() * (vertical ? width : height);
      const pts: Pt[] = [];
      for (let i = 0; i <= 7; i++) {
        const t = i / 7;
        const wobble = (rnd() - 0.5) * 220;
        pts.push(
          vertical
            ? { x: base + wobble, y: t * height }
            : { x: t * width, y: base + wobble },
        );
      }
      return pts;
    });
    // Window lights inside lit blocks.
    const windows = blocks
      .filter((b) => b.lit)
      .flatMap((b, bi) =>
        Array.from({ length: 2 + Math.floor(noise(seed, bi) * 4) }, (_, wi) => ({
          x: b.x + 6 + noise(seed + 5, bi * 7 + wi) * (b.w - 12),
          y: b.y + 6 + noise(seed + 6, bi * 7 + wi) * (b.h - 12),
          warm: b.warm,
          phase: noise(seed + 7, bi * 7 + wi) * Math.PI * 2,
        })),
      );
    // Free-floating city speckles.
    const speckles = Array.from({ length: 130 }, (_, i) => ({
      x: noise(seed + 11, i) * width,
      y: noise(seed + 12, i) * height,
      gold: noise(seed + 13, i) < goldDust * 0.55,
      r: 0.8 + noise(seed + 14, i) * 1.5,
      phase: noise(seed + 15, i) * Math.PI * 2,
    }));
    // Label placements.
    const labelPos = labels.map((text, i) => ({
      text,
      x: 100 + noise(seed + 21, i) * (width - 300),
      y: 120 + noise(seed + 22, i) * (height - 240),
      rot: noise(seed + 23, i) > 0.5 ? 24 : -18,
    }));
    return { blocks, arteries, windows, speckles, labelPos };
  }, [seed, width, height, labels, goldDust]);

  const cell = 96;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const slowDrift = frame * 0.12;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        width,
        height,
        transform: `translate(-50%, -42%) perspective(1500px) rotateX(${tilt}deg) translate3d(${driftX}px, ${driftY}px, 0)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Layer 1 — distant minor street grid (slowest drift) */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.42 * brightness,
          transform: `translate3d(${driftX * 0.35}px, ${slowDrift * 0.3}px, -140px)`,
        }}
      >
        {Array.from({ length: cols }, (_, i) => (
          <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={height} stroke="rgba(0,216,255,0.07)" strokeWidth={1} />
        ))}
        {Array.from({ length: rows }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * cell} x2={width} y2={i * cell} stroke="rgba(0,216,255,0.07)" strokeWidth={1} />
        ))}
      </svg>

      {/* Layer 2 — block volumes + windows */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(0px, ${slowDrift * 0.55}px, 0)`,
        }}
      >
        {world.blocks.map((b, i) => {
          const flicker = b.lit ? 0.55 + 0.25 * Math.sin(frame * 0.05 + b.phase) : 0.3;
          return (
            <g key={i}>
              {/* Soft drop shadow for depth */}
              <rect x={b.x + 3} y={b.y + 4} width={b.w} height={b.h} rx={3} fill="#000" opacity={0.35 * b.shade} />
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={3}
                fill={`rgba(18,19,20,${0.72 + 0.28 * b.shade})`}
                stroke={
                  b.lit
                    ? b.warm
                      ? `rgba(224,184,91,${0.16 * flicker * brightness})`
                      : `rgba(0,216,255,${0.16 * flicker * brightness})`
                    : "rgba(154,163,173,0.07)"
                }
                strokeWidth={1.1}
              />
              {/* Lit top edge to suggest volume */}
              <line x1={b.x} y1={b.y} x2={b.x + b.w} y2={b.y} stroke={`rgba(154,163,173,${0.1 + 0.1 * b.shade})`} strokeWidth={1} />
            </g>
          );
        })}
        {world.windows.map((w, i) => {
          const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.07 + w.phase));
          return (
            <circle
              key={i}
              cx={w.x}
              cy={w.y}
              r={1.4}
              fill={w.warm ? COLORS.gold : COLORS.cyan}
              opacity={(w.warm ? 0.5 : 0.3) * tw * brightness}
            />
          );
        })}
      </svg>

      {/* Layer 3 — arterial roads with light dust + speckles + labels */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate3d(${driftX * 0.12}px, ${slowDrift * 0.62}px, 0)`,
        }}
      >
        {world.arteries.map((pts, i) => {
          const d = smoothPath(pts);
          const goldRoad = i % 2 === 1 && goldDust > 0.3;
          const c = goldRoad ? COLORS.gold : COLORS.cyan;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={c} strokeWidth={14} opacity={0.045 * brightness} strokeLinecap="round" />
              <path d={d} fill="none" stroke={c} strokeWidth={2.4} opacity={0.14 * brightness} />
              {/* Travelling light dust along the artery */}
              <path
                d={d}
                fill="none"
                stroke={c}
                strokeWidth={2.4}
                opacity={0.4 * brightness}
                pathLength={100}
                strokeDasharray="0.7 5.2"
                strokeDashoffset={-((frame * (goldRoad ? 0.12 : 0.2) + i * 17) % 100)}
              />
            </g>
          );
        })}
        {world.speckles.map((s, i) => {
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.06 + s.phase));
          return (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={s.gold ? COLORS.gold : "rgba(154,163,173,0.8)"}
              opacity={(s.gold ? 0.5 : 0.2) * tw * brightness}
            />
          );
        })}
        {world.labelPos.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            fill="rgba(154,163,173,0.4)"
            fontFamily={FONTS.mono}
            fontWeight={500}
            fontSize={17}
            letterSpacing={5}
            opacity={0.55 * brightness}
            transform={`rotate(${l.rot} ${l.x} ${l.y})`}
          >
            {l.text}
          </text>
        ))}
      </svg>
    </div>
  );
};
