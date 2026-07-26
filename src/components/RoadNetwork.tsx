import React from "react";
import { iso, polyPath, Pt } from "../utils/routeGeometry";

export interface RoadSeg {
  along: "x" | "y";
  fixed: number; // grid coordinate of the other axis (road centre line)
  from: number;
  to: number;
  width?: number; // in tile fractions
}

/**
 * Isometric road network. Draws matte asphalt strips down road centres with
 * restrained dashed lane markings. Roads only run along the two grid axes so
 * they always respect isometric perspective and never wander.
 */
export const RoadNetwork: React.FC<{
  origin: Pt;
  roads: RoadSeg[];
  color?: string;
  opacity?: number;
}> = ({ origin, roads, color = "#0a0d11", opacity = 1 }) => {
  return (
    <g opacity={opacity}>
      {roads.map((r, i) => {
        const w = (r.width ?? 0.62) / 2;
        let corners: Pt[];
        let dashA: Pt, dashB: Pt;
        if (r.along === "x") {
          corners = [
            iso(origin, r.from, r.fixed - w),
            iso(origin, r.to, r.fixed - w),
            iso(origin, r.to, r.fixed + w),
            iso(origin, r.from, r.fixed + w),
          ];
          dashA = iso(origin, r.from, r.fixed);
          dashB = iso(origin, r.to, r.fixed);
        } else {
          corners = [
            iso(origin, r.fixed - w, r.from),
            iso(origin, r.fixed - w, r.to),
            iso(origin, r.fixed + w, r.to),
            iso(origin, r.fixed + w, r.from),
          ];
          dashA = iso(origin, r.fixed, r.from);
          dashB = iso(origin, r.fixed, r.to);
        }
        return (
          <g key={i}>
            <path d={polyPath(corners) + " Z"} fill={color} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
            <path
              d={polyPath([dashA, dashB])}
              stroke="rgba(139,148,158,0.22)"
              strokeWidth={1.4}
              strokeDasharray="10 14"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
};
