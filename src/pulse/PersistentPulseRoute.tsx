import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01, smoothPath, splinePoint, type Pt } from "./helpers";
import { COLORS, TOTAL_FRAMES } from "./theme";

// ---------------------------------------------------------------------------
// RoutePath — the layered route treatment every scene uses:
// 2px sharp core, wide low-opacity glow, a travelling dash highlight,
// optional directional arrows and pulses moving along the path.
// Rendered inside a scene's own <svg>.
// ---------------------------------------------------------------------------
type RoutePathProps = {
  points: Pt[];
  // 0..1 — how much of the path has been drawn.
  progress: number;
  color?: string;
  coreWidth?: number;
  glowWidth?: number;
  glowOpacity?: number;
  // Number of pulses travelling along the visible portion.
  pulses?: number;
  // Global speed for travelling elements (frame-driven by the caller).
  frame: number;
  arrows?: boolean;
  opacity?: number;
  seed?: number;
};

export const RoutePath: React.FC<RoutePathProps> = ({
  points,
  progress,
  color = COLORS.cyan,
  coreWidth = 2,
  glowWidth = 10,
  glowOpacity = 0.16,
  pulses = 2,
  frame,
  arrows = false,
  opacity = 1,
  seed = 1,
}) => {
  const p = clamp01(progress);
  if (p <= 0.003) {
    return null;
  }
  const d = smoothPath(points);
  const dashOffset = 100 * (1 - p);
  const highlightOffset = 100 - ((frame * 1.7 + seed * 23) % 130);

  const pulseDots = Array.from({ length: pulses }, (_, i) => {
    const t = ((frame * 0.013 + i / pulses + seed * 0.31) % 1) * p;
    const pos = splinePoint(points, t);
    return (
      <circle key={i} cx={pos.x} cy={pos.y} r={4} fill={color} opacity={0.85} />
    );
  });

  const arrowMarks = arrows
    ? [0.3, 0.6, 0.85].map((t, i) => {
        if (t > p) {
          return null;
        }
        const a = splinePoint(points, Math.max(0, t - 0.015));
        const b = splinePoint(points, Math.min(1, t + 0.015));
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        return (
          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${ang})`}>
            <path d="M -7 -6 L 5 0 L -7 6" fill="none" stroke={color} strokeWidth={2.4} opacity={0.9} />
          </g>
        );
      })
    : null;

  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        opacity={glowOpacity}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
      />
      {/* Travelling highlight riding the drawn portion */}
      <path
        d={d}
        fill="none"
        stroke="#DFFBFF"
        strokeWidth={coreWidth + 0.6}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="7 93"
        strokeDashoffset={highlightOffset}
        opacity={0.8 * p}
      />
      {arrowMarks}
      {pulseDots}
    </g>
  );
};

// The single living pulse that binds all six scenes. It is rendered at the
// top level of the composition, above the scenes, and its position is a
// continuous function of the *global* frame — so its energy never restarts.
//
// Waypoints follow the story: leaves the storefront (S1), feeds the search
// interface (S2), splits down the ranking (S3), rides the bypassing traffic
// (S4), collapses into the storefront's signal core (S5) and completes the
// customer route (S6).
const WAYPOINTS: { f: number; p: Pt }[] = [
  { f: 0, p: { x: 250, y: 1565 } }, // storefront, scene 01
  { f: 22, p: { x: 470, y: 1430 } },
  { f: 46, p: { x: 700, y: 1310 } },
  { f: 66, p: { x: 850, y: 1180 } }, // gold destinations
  { f: 82, p: { x: 720, y: 830 } }, // accelerates upward
  { f: 96, p: { x: 470, y: 620 } }, // becomes the search cable
  { f: 118, p: { x: 330, y: 900 } }, // walks the modules
  { f: 140, p: { x: 520, y: 1150 } },
  { f: 158, p: { x: 800, y: 1240 } }, // into the map
  { f: 172, p: { x: 560, y: 830 } }, // ranking column top
  { f: 192, p: { x: 590, y: 1030 } }, // down the top three
  { f: 214, p: { x: 560, y: 1230 } },
  { f: 232, p: { x: 190, y: 1330 } }, // swings left, bypass traffic
  { f: 258, p: { x: 560, y: 1380 } }, // passes the storefront
  { f: 284, p: { x: 880, y: 1220 } }, // toward the gold pins
  { f: 302, p: { x: 640, y: 1180 } }, // collapse toward the store core
  { f: 330, p: { x: 540, y: 1280 } }, // scene 05 storefront core
  { f: 358, p: { x: 505, y: 1320 } },
  { f: 376, p: { x: 300, y: 1560 } }, // scene 06 storefront
  { f: 404, p: { x: 560, y: 1330 } }, // customer route
  { f: 430, p: { x: 770, y: 1120 } },
  { f: TOTAL_FRAMES, p: { x: 815, y: 1035 } }, // premium destination
];

const posAt = (frame: number): Pt => {
  const f = Math.max(0, Math.min(TOTAL_FRAMES, frame));
  let i = 0;
  while (i < WAYPOINTS.length - 2 && WAYPOINTS[i + 1].f < f) {
    i++;
  }
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const local = (f - a.f) / Math.max(1, b.f - a.f);
  // Use the spline over the whole set for smooth curvature, parameterized
  // piecewise by frame windows.
  const globalT = (i + Math.max(0, Math.min(1, local))) / (WAYPOINTS.length - 1);
  return splinePoint(
    WAYPOINTS.map((w) => w.p),
    globalT,
  );
};

export const PersistentPulseRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const head = posAt(frame);
  const trail = Array.from({ length: 9 }, (_, i) => posAt(frame - (i + 1) * 1.6));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {/* Trail — fading comet tail */}
        {trail.map((p, i) => {
          const k = 1 - i / trail.length;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5 * k + 1}
              fill={COLORS.cyan}
              opacity={0.34 * k}
            />
          );
        })}
        {/* Glow halo */}
        <circle cx={head.x} cy={head.y} r={16} fill={COLORS.cyan} opacity={0.1} />
        <circle cx={head.x} cy={head.y} r={9} fill={COLORS.cyan} opacity={0.22} />
        {/* Sharp core */}
        <circle cx={head.x} cy={head.y} r={3.2} fill="#DFFBFF" />
      </svg>
    </AbsoluteFill>
  );
};
