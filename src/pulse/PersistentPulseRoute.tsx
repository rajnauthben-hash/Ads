import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EnergyRoute } from "./EnergyRoute";
import { splinePoint, type Pt } from "./helpers";
import { COLORS, TOTAL_FRAMES } from "./theme";

// Every scene draws its routes through the EnergyRoute layered system.
// RoutePath is the historical name used by the scenes.
export const RoutePath = EnergyRoute;

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
