import React, { useMemo } from "react";
import { WIDTH, HEIGHT, COLORS } from "../constants";

/** Deterministic PRNG so the city is identical on every rendered frame. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * MasterCityMap — a native dark nighttime city rendered as a perspective plane
 * of blocks separated by roads, with restrained amber window lights. No cheap
 * neon grids or floating routes: this is the believable ground plane that the
 * SVG routes are drawn on top of.
 */
export const MasterCityMap: React.FC<{ opacity?: number; drift?: number }> = ({
  opacity = 1,
  drift = 0,
}) => {
  const { blocks, roadsV, roadsH } = useMemo(() => {
    const rnd = mulberry32(20240811);
    const cols = 9;
    const rows = 16;
    const cellW = 150;
    const cellH = 150;
    const road = 26;
    const blocks: {
      x: number;
      y: number;
      w: number;
      h: number;
      lit: { x: number; y: number; s: number; a: number }[];
    }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + road;
        const y = r * cellH + road;
        const w = cellW - road;
        const h = cellH - road;
        const lit: { x: number; y: number; s: number; a: number }[] = [];
        const n = Math.floor(rnd() * 5);
        for (let k = 0; k < n; k++) {
          lit.push({
            x: x + rnd() * w,
            y: y + rnd() * h,
            s: 2 + rnd() * 3,
            a: 0.25 + rnd() * 0.55,
          });
        }
        blocks.push({ x, y, w, h, lit });
      }
    }
    const roadsV = Array.from({ length: cols + 1 }, (_, c) => c * cellW + road / 2);
    const roadsH = Array.from({ length: rows + 1 }, (_, r) => r * cellH + road / 2);
    return { blocks, roadsV, roadsH };
  }, []);

  const planeW = 9 * 150 + 26;
  const planeH = 16 * 150 + 26;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        overflow: "hidden",
        perspective: "1400px",
        perspectiveOrigin: "50% 12%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (WIDTH - planeW) / 2 + drift,
          top: -120,
          width: planeW,
          height: planeH,
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) scale(1.35)",
          transformOrigin: "50% 30%",
        }}
      >
        <svg
          width={planeW}
          height={planeH}
          viewBox={`0 0 ${planeW} ${planeH}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <rect x={0} y={0} width={planeW} height={planeH} fill={COLORS.bgBase} />
          {/* Roads (dark asphalt gaps with faint amber edge glow). */}
          {roadsV.map((x, i) => (
            <line key={`v${i}`} x1={x} y1={0} x2={x} y2={planeH} stroke="#11161d" strokeWidth={22} />
          ))}
          {roadsH.map((y, i) => (
            <line key={`h${i}`} x1={0} y1={y} x2={planeW} y2={y} stroke="#11161d" strokeWidth={22} />
          ))}
          {roadsV.map((x, i) => (
            <line key={`vg${i}`} x1={x} y1={0} x2={x} y2={planeH} stroke="rgba(214,163,74,0.05)" strokeWidth={1} />
          ))}
          {roadsH.map((y, i) => (
            <line key={`hg${i}`} x1={0} y1={y} x2={planeW} y2={y} stroke="rgba(214,163,74,0.05)" strokeWidth={1} />
          ))}
          {/* Building blocks with restrained amber windows. */}
          {blocks.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={3}
                fill="#0c1219"
                stroke="#161d26"
                strokeWidth={1}
              />
              {b.lit.map((l, j) => (
                <rect
                  key={j}
                  x={l.x}
                  y={l.y}
                  width={l.s}
                  height={l.s}
                  fill={COLORS.warmGold}
                  opacity={l.a}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
      {/* Atmospheric depth fade toward the horizon. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, ${COLORS.bgBase} 0%, rgba(6,9,13,0.4) 22%, rgba(6,9,13,0) 45%, rgba(6,9,13,0.55) 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/** Convenience full-bleed night base (base color + matte grain). */
export const NightBase: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: COLORS.bgBase }} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(130% 80% at 50% 0%, ${COLORS.bgSecondary} 0%, ${COLORS.bgBase} 60%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
      }}
    />
    <div style={{ position: "absolute", inset: 0, width: WIDTH, height: HEIGHT, pointerEvents: "none" }} />
  </>
);
