import React, { useMemo } from "react";
import { WORLD_W, WORLD_H } from "../camera";
import { T } from "../theme";

// Deterministic PRNG so the generated city is identical on every frame
// (no per-frame flicker under Remotion's stateless re-render).
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HORIZON = 980; // y of skyline base / map horizon in world space

type Bld = { x: number; w: number; h: number; d: number };
type Win = { x: number; y: number; s: number; on: number };
type Dot = { x: number; y: number; r: number; o: number };

// Build a deterministic city once.
function buildCity() {
  const r = mulberry32(20250811);
  const skyline: Bld[] = [];
  let x = -40;
  while (x < WORLD_W + 40) {
    const w = 34 + r() * 78;
    const depth = r(); // 0 far .. 1 near
    const h = 90 + depth * 480 + r() * 120;
    skyline.push({ x, w, h, d: depth });
    x += w + 6 + r() * 22;
  }

  const windows: Win[] = [];
  for (const b of skyline) {
    const cols = Math.max(2, Math.floor(b.w / 16));
    const rows = Math.max(3, Math.floor(b.h / 26));
    for (let c = 0; c < cols; c++) {
      for (let ro = 0; ro < rows; ro++) {
        if (r() > 0.42) continue;
        windows.push({
          x: b.x + 6 + c * ((b.w - 10) / cols),
          y: HORIZON - b.h + 10 + ro * ((b.h - 16) / rows),
          s: 3 + r() * 3,
          on: 0.25 + r() * 0.7,
        });
      }
    }
  }

  // Street-grid glow dots scattered across the map ground plane.
  const dots: Dot[] = [];
  for (let i = 0; i < 260; i++) {
    const y = HORIZON + r() * (WORLD_H - HORIZON);
    const persp = (y - HORIZON) / (WORLD_H - HORIZON); // 0 far .. 1 near
    dots.push({
      x: r() * WORLD_W,
      y,
      r: 1 + persp * 3.2,
      o: 0.15 + r() * 0.5,
    });
  }
  return { skyline, windows, dots };
}

// Perspective ground-grid lines converging toward a vanishing point.
function gridPaths() {
  const vpX = 1080;
  const vpY = HORIZON;
  const lines: string[] = [];
  // radiating streets
  for (let i = -10; i <= 10; i++) {
    const bx = WORLD_W / 2 + i * 260;
    lines.push(`M ${vpX} ${vpY} L ${bx} ${WORLD_H}`);
  }
  // horizontal cross-streets, spaced with perspective
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const y = vpY + Math.pow(t, 1.8) * (WORLD_H - vpY);
    lines.push(`M -60 ${y} L ${WORLD_W + 60} ${y}`);
  }
  return lines;
}

export const City: React.FC = () => {
  const { skyline, windows, dots } = useMemo(buildCity, []);
  const grid = useMemo(gridPaths, []);

  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <radialGradient id="sky" cx="67%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#0E1F2B" />
          <stop offset="45%" stopColor={T.bg2} />
          <stop offset="100%" stopColor="#04090D" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A141B" />
          <stop offset="100%" stopColor="#04090C" />
        </linearGradient>
        <radialGradient id="cityGlow" cx="67%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(34,120,180,0.28)" />
          <stop offset="100%" stopColor="rgba(34,120,180,0)" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* sky + ground */}
      <rect x={0} y={0} width={WORLD_W} height={HORIZON + 40} fill="url(#sky)" />
      <rect x={0} y={HORIZON} width={WORLD_W} height={WORLD_H - HORIZON} fill="url(#ground)" />
      <rect x={0} y={0} width={WORLD_W} height={WORLD_H} fill="url(#cityGlow)" />

      {/* perspective street grid */}
      <g stroke="rgba(70,120,150,0.10)" strokeWidth={1.4} fill="none">
        {grid.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* skyline silhouettes */}
      <g>
        {skyline.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={HORIZON - b.h}
            width={b.w}
            height={b.h}
            fill={`rgba(${8 + b.d * 10}, ${16 + b.d * 16}, ${24 + b.d * 22}, 1)`}
            stroke="rgba(40,80,110,0.35)"
            strokeWidth={0.75}
          />
        ))}
      </g>

      {/* lit windows */}
      <g fill={T.storefront}>
        {windows.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.s} height={w.s * 1.3} opacity={w.on * 0.5} />
        ))}
      </g>

      {/* ground light scatter */}
      <g filter="url(#soft)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="rgba(120,180,220,0.9)" opacity={d.o} />
        ))}
      </g>
    </svg>
  );
};
