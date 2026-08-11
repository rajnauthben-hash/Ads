import React, { useMemo } from "react";
import { WORLD_W, WORLD_H } from "../camera";
import { T } from "../theme";

// Deterministic PRNG so the generated city is identical on every frame.
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
type Win = { x: number; y: number; s: number; on: number; warm: boolean };
type Dot = { x: number; y: number; r: number; o: number; warm: boolean };
type Blk = { x: number; y: number; w: number; h: number; o: number; lit: number };

function skylineLayer(r: () => number, baseY: number, minH: number, maxH: number, gap: number) {
  const blds: Bld[] = [];
  let x = -60;
  while (x < WORLD_W + 60) {
    const w = 30 + r() * 82;
    const depth = r();
    const h = minH + depth * (maxH - minH) + r() * 90;
    blds.push({ x, w, h, d: depth });
    x += w + gap + r() * 24;
  }
  return blds.map((b) => ({ ...b, baseY }));
}

function buildCity() {
  const r = mulberry32(20250811);

  // two skyline depth layers for a denser downtown
  const far = skylineLayer(r, HORIZON - 40, 60, 300, 3);
  const near = skylineLayer(r, HORIZON, 120, 560, 6);

  const windows: Win[] = [];
  for (const b of [...far, ...near]) {
    const cols = Math.max(2, Math.floor(b.w / 15));
    const rows = Math.max(3, Math.floor(b.h / 24));
    for (let c = 0; c < cols; c++) {
      for (let ro = 0; ro < rows; ro++) {
        if (r() > 0.4) continue;
        windows.push({
          x: b.x + 5 + c * ((b.w - 9) / cols),
          y: (b as Bld & { baseY: number }).baseY - b.h + 9 + ro * ((b.h - 14) / rows),
          s: 2.5 + r() * 3,
          on: 0.22 + r() * 0.72,
          warm: r() > 0.62,
        });
      }
    }
  }

  // low-rise blocks scattered across the ground plane (the "map" district)
  const blocks: Blk[] = [];
  for (let i = 0; i < 150; i++) {
    const y = HORIZON + 60 + r() * (WORLD_H - HORIZON - 80);
    const persp = (y - HORIZON) / (WORLD_H - HORIZON);
    const w = 40 + persp * 130 + r() * 50;
    blocks.push({
      x: r() * WORLD_W,
      y,
      w,
      h: w * (0.5 + r() * 0.4),
      o: 0.5 + persp * 0.4,
      lit: r(),
    });
  }

  // ground light scatter (street lamps / windows)
  const dots: Dot[] = [];
  for (let i = 0; i < 340; i++) {
    const y = HORIZON + r() * (WORLD_H - HORIZON);
    const persp = (y - HORIZON) / (WORLD_H - HORIZON);
    dots.push({
      x: r() * WORLD_W,
      y,
      r: 1 + persp * 3.4,
      o: 0.14 + r() * 0.5,
      warm: r() > 0.5,
    });
  }
  return { far, near, windows, blocks, dots };
}

// Perspective ground-grid converging toward a vanishing point.
function gridPaths() {
  const vpX = 1080;
  const vpY = HORIZON;
  const streets: string[] = [];
  const cross: string[] = [];
  for (let i = -14; i <= 14; i++) {
    const bx = WORLD_W / 2 + i * 200;
    streets.push(`M ${vpX} ${vpY} L ${bx} ${WORLD_H}`);
  }
  for (let i = 1; i <= 20; i++) {
    const t = i / 20;
    const y = vpY + Math.pow(t, 1.85) * (WORLD_H - vpY);
    cross.push(`M -80 ${y} L ${WORLD_W + 80} ${y}`);
  }
  return { streets, cross };
}

export const City: React.FC = () => {
  const { far, near, windows, blocks, dots } = useMemo(buildCity, []);
  const grid = useMemo(gridPaths, []);

  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <radialGradient id="sky" cx="67%" cy="26%" r="95%">
          <stop offset="0%" stopColor="#12283A" />
          <stop offset="42%" stopColor={T.bg2} />
          <stop offset="100%" stopColor="#04090D" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1720" />
          <stop offset="100%" stopColor="#03080B" />
        </linearGradient>
        <radialGradient id="cityGlow" cx="67%" cy="27%" r="52%">
          <stop offset="0%" stopColor="rgba(40,130,190,0.32)" />
          <stop offset="100%" stopColor="rgba(40,130,190,0)" />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(30,90,130,0)" />
          <stop offset="60%" stopColor="rgba(26,70,105,0.22)" />
          <stop offset="100%" stopColor="rgba(26,70,105,0)" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="hazeBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* sky + ground */}
      <rect x={0} y={0} width={WORLD_W} height={HORIZON + 60} fill="url(#sky)" />
      <rect x={0} y={HORIZON} width={WORLD_W} height={WORLD_H - HORIZON} fill="url(#ground)" />
      <rect x={0} y={0} width={WORLD_W} height={WORLD_H} fill="url(#cityGlow)" />

      {/* perspective street grid */}
      <g stroke="rgba(72,120,150,0.10)" strokeWidth={1.4} fill="none">
        {grid.cross.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g stroke="rgba(72,120,150,0.09)" strokeWidth={1.4} fill="none">
        {grid.streets.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {/* faint warm road glow along a few streets */}
      <g stroke="rgba(233,164,81,0.06)" strokeWidth={2.4} fill="none">
        {grid.streets.filter((_, i) => i % 3 === 0).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* far skyline */}
      <g>
        {far.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.baseY - b.h}
            width={b.w}
            height={b.h}
            fill={`rgba(${10 + b.d * 8}, ${18 + b.d * 12}, ${28 + b.d * 16}, 0.9)`}
          />
        ))}
      </g>
      {/* atmospheric haze band behind the near skyline */}
      <rect x={0} y={HORIZON - 360} width={WORLD_W} height={420} fill="url(#haze)" filter="url(#hazeBlur)" />
      {/* near skyline */}
      <g>
        {near.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.baseY - b.h}
            width={b.w}
            height={b.h}
            fill={`rgba(${9 + b.d * 12}, ${17 + b.d * 18}, ${25 + b.d * 24}, 1)`}
            stroke="rgba(44,84,114,0.35)"
            strokeWidth={0.75}
          />
        ))}
      </g>

      {/* lit windows */}
      <g>
        {windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={w.s}
            height={w.s * 1.3}
            fill={w.warm ? T.storefront : "#8FD0FF"}
            opacity={w.on * 0.5}
          />
        ))}
      </g>

      {/* ground low-rise blocks */}
      <g>
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill={`rgba(10,18,26,${b.o})`} stroke="rgba(50,90,120,0.22)" strokeWidth={0.8} />
            {b.lit > 0.5 ? (
              <rect x={b.x + b.w * 0.2} y={b.y + b.h * 0.3} width={b.w * 0.6} height={b.h * 0.4} fill={b.lit > 0.75 ? T.storefront : "#7FC0F0"} opacity={0.12} />
            ) : null}
          </g>
        ))}
      </g>

      {/* ground light scatter */}
      <g filter="url(#soft)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.warm ? "rgba(233,180,120,0.9)" : "rgba(130,190,230,0.9)"} opacity={d.o} />
        ))}
      </g>
    </svg>
  );
};
