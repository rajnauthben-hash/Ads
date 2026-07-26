import React from "react";
import { iso, Pt } from "../utils/routeGeometry";
import { RoadNetwork, RoadSeg } from "./RoadNetwork";
import { SurroundingBusiness } from "./SurroundingBusiness";
import { IsoTree } from "./IsometricBuilding";
import { COLORS } from "../styles/tokens";

/**
 * The persistent isometric city. Same roads, same surrounding businesses, same
 * ground plane in every scene — only camera/parallax and dimming change. The
 * hero YOUR BUSINESS storefront is rendered separately (on its own depth layer)
 * so scenes can position and light it; everything here is the environment.
 */

export const WORLD_ORIGIN: Pt = { x: 540, y: 690 };

// Fixed road grid (grid-space). Two axes only -> always correct perspective.
export const ROADS: RoadSeg[] = [
  { along: "x", fixed: 0.5, from: -6, to: 7 },
  { along: "x", fixed: 3.5, from: -6, to: 7 },
  { along: "x", fixed: 6.5, from: -6, to: 7 },
  { along: "y", fixed: -3.5, from: -1, to: 10 },
  { along: "y", fixed: -0.5, from: -1, to: 10 },
  { along: "y", fixed: 2.5, from: -1, to: 10 },
  { along: "y", fixed: 5.5, from: -1, to: 10 },
];

// Fixed surrounding-business layout (block centres).
export interface CityBiz {
  name: string;
  cx: number;
  cy: number;
  a: number;
  b: number;
  h: number;
}
export const CITY_BIZ: CityBiz[] = [
  { name: "AUTO REPAIR", cx: -2, cy: 2, a: 1.5, b: 1.2, h: 1.0 },
  { name: "DENTAL CLINIC", cx: 1, cy: 2, a: 1.6, b: 1.3, h: 1.1 },
  { name: "FITNESS STUDIO", cx: 4, cy: 2, a: 1.7, b: 1.4, h: 1.6 },
  { name: "HAIR SALON", cx: -2, cy: 5, a: 1.6, b: 1.3, h: 1.2 },
  { name: "PLUMBING", cx: 1, cy: 5, a: 1.4, b: 1.2, h: 1.0 },
  { name: "CHIROPRACTOR", cx: 4, cy: 5, a: 1.6, b: 1.3, h: 1.3 },
  { name: "CAFE", cx: -2, cy: 8, a: 1.5, b: 1.2, h: 1.0 },
  { name: "PIZZERIA", cx: 1, cy: 8, a: 1.5, b: 1.4, h: 1.5 },
  { name: "NAIL SALON", cx: 4, cy: 8, a: 1.5, b: 1.2, h: 1.1 },
];

// Where the hero storefront sits in the shared world (grid centre).
export const HERO_CENTER = { cx: 3, cy: 6 };

export function bizOrigin(b: { cx: number; cy: number; a: number; b: number }): Pt {
  // origin = min corner of the footprint centred at (cx,cy)
  return iso(WORLD_ORIGIN, b.cx - b.a / 2, b.cy - b.b / 2, 0);
}

export const CityWorld: React.FC<{
  origin?: Pt;
  dim?: number; // 0 = full, 1 = fully dimmed atmosphere
  showLabels?: boolean;
  exclude?: string[];
  roadOpacity?: number;
}> = ({ origin = WORLD_ORIGIN, dim = 0, showLabels = true, exclude = [], roadOpacity = 1 }) => {
  const k = 1 - dim * 0.7;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* deep ground gradient */}
      <defs>
        <radialGradient id="ground" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#0a0e14" />
          <stop offset="100%" stopColor={COLORS.background} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ground)" />

      <RoadNetwork origin={origin} roads={ROADS} opacity={roadOpacity * k} />

      {/* atmosphere trees */}
      {[
        { cx: -3.4, cy: 3.6 },
        { cx: 2.6, cy: 3.6 },
        { cx: -0.4, cy: 6.6 },
        { cx: 5.6, cy: 6.6 },
        { cx: -3.4, cy: 6.6 },
      ].map((t, i) => (
        <IsoTree key={i} at={iso(origin, t.cx, t.cy, 0)} scale={0.9 * k} />
      ))}

      {CITY_BIZ.filter((b) => !exclude.includes(b.name)).map((b) => (
        <SurroundingBusiness
          key={b.name}
          origin={bizOrigin(b)}
          a={b.a}
          b={b.b}
          h={b.h}
          label={showLabels ? b.name : undefined}
          dim={dim}
        />
      ))}
    </svg>
  );
};
