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
  // Number of directional chevrons distributed along the path; they creep
  // forward slowly to keep the route visibly moving.
  chevrons?: number;
  // Adds a white-hot inner filament for the fully energized neon look.
  hot?: boolean;
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
  chevrons = 0,
  hot = false,
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

  const chevronCount = chevrons > 0 ? chevrons : arrows ? 3 : 0;
  const arrowMarks =
    chevronCount > 0
      ? Array.from({ length: chevronCount }, (_, i) => {
          // Chevrons creep forward slowly so the route always reads as flow.
          const t = (((i + 0.55) / chevronCount + frame * 0.0011) % 1) * p;
          if (t < 0.05) {
            return null;
          }
          const a = splinePoint(points, Math.max(0, t - 0.015));
          const b = splinePoint(points, Math.min(1, t + 0.015));
          const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          const s = 0.8 + coreWidth * 0.16;
          return (
            <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${ang}) scale(${s})`}>
              <path d="M -8 -7 L 6 0 L -8 7" fill="none" stroke="#DFFBFF" strokeWidth={3} opacity={0.95} strokeLinecap="round" strokeLinejoin="round" />
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
      {/* Outer soft bloom for thick neon routes */}
      {hot && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={glowWidth * 2.1}
          strokeLinecap="round"
          opacity={glowOpacity * 0.45}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={dashOffset}
        />
      )}
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
      {/* White-hot inner filament */}
      {hot && (
        <path
          d={d}
          fill="none"
          stroke="#E9FCFF"
          strokeWidth={Math.max(1.4, coreWidth * 0.42)}
          strokeLinecap="round"
          opacity={0.85}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={dashOffset}
        />
      )}
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
  { f: 0, p: { x: 258, y: 1650 } }, // storefront sidewalk, scene 01
  { f: 22, p: { x: 470, y: 1570 } },
  { f: 46, p: { x: 720, y: 1440 } },
  { f: 66, p: { x: 875, y: 1120 } }, // gold destinations
  { f: 82, p: { x: 700, y: 760 } }, // accelerates upward
  { f: 96, p: { x: 340, y: 500 } }, // becomes the search cable
  { f: 118, p: { x: 300, y: 720 } }, // walks the module rows
  { f: 140, p: { x: 640, y: 850 } }, // rides the data strands
  { f: 158, p: { x: 860, y: 950 } }, // into the map pins
  { f: 172, p: { x: 655, y: 940 } }, // ranking spine top
  { f: 192, p: { x: 660, y: 1090 } }, // down the top three
  { f: 214, p: { x: 400, y: 1260 } }, // toward the cyan origin
  { f: 232, p: { x: 140, y: 1640 } }, // swings low, bypass route start
  { f: 258, p: { x: 430, y: 1450 } }, // passes the storefront
  { f: 284, p: { x: 840, y: 900 } }, // riding the bypass upward
  { f: 302, p: { x: 730, y: 760 } }, // collapse toward the store core
  { f: 330, p: { x: 683, y: 700 } }, // scene 05 storefront core
  { f: 358, p: { x: 620, y: 860 } },
  { f: 376, p: { x: 245, y: 1640 } }, // scene 06 storefront puddle
  { f: 404, p: { x: 500, y: 1330 } }, // customer route
  { f: 430, p: { x: 720, y: 1050 } },
  { f: TOTAL_FRAMES, p: { x: 878, y: 1030 } }, // premium star destination
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
