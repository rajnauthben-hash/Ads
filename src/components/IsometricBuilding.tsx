import React from "react";
import { iso, LEVEL_H, polyPath, Pt } from "../utils/routeGeometry";

/**
 * A dimensional 2.5D building block on the isometric grid. Draws roof + the two
 * camera-facing faces as an extruded prism. Simplified, designed, matte — never
 * photoreal. Optional engraved label sits on the front-right face.
 */
export interface IsometricBuildingProps {
  origin: Pt; // screen position of grid cell (0,0) for this building
  a: number; // footprint tiles along +x axis
  b: number; // footprint tiles along +y axis
  h: number; // height in levels
  roof?: string;
  left?: string;
  right?: string;
  stroke?: string;
  label?: string;
  labelColor?: string;
  opacity?: number;
}

export const IsometricBuilding: React.FC<IsometricBuildingProps> = ({
  origin,
  a,
  b,
  h,
  roof = "#1a2029",
  left = "#0f141b",
  right = "#141b23",
  stroke = "rgba(255,255,255,0.05)",
  label,
  labelColor = "rgba(139,148,158,0.6)",
  opacity = 1,
}) => {
  const B = iso(origin, a, 0, 0);
  const C = iso(origin, a, b, 0);
  const D = iso(origin, 0, b, 0);
  const Ar = iso(origin, 0, 0, h);
  const Br = iso(origin, a, 0, h);
  const Cr = iso(origin, a, b, h);
  const Dr = iso(origin, 0, b, h);

  const roofPath = polyPath([Ar, Br, Cr, Dr]);
  const rightFace = polyPath([B, C, Cr, Br]); // faces down-right
  const leftFace = polyPath([D, C, Cr, Dr]); // faces down-left

  // Label anchor: centre of the down-right-facing face (D-C edge) so text reads
  // left-to-right along the isometric perspective (never mirrored).
  const lx = (D.x + Cr.x) / 2;
  const ly = (D.y + Cr.y) / 2 - LEVEL_H * 0.15;
  const labelAngle = Math.atan2(C.y - D.y, C.x - D.x) * (180 / Math.PI);

  return (
    <g opacity={opacity}>
      <path d={leftFace + " Z"} fill={left} stroke={stroke} strokeWidth={1} />
      <path d={rightFace + " Z"} fill={right} stroke={stroke} strokeWidth={1} />
      <path d={roofPath + " Z"} fill={roof} stroke={stroke} strokeWidth={1} />
      {label ? (
        <text
          x={lx}
          y={ly}
          fill={labelColor}
          fontFamily="IBM Plex Sans, sans-serif"
          fontSize={15}
          fontWeight={500}
          letterSpacing={1.4}
          textAnchor="middle"
          transform={`rotate(${labelAngle} ${lx} ${ly})`}
        >
          {label.toUpperCase()}
        </text>
      ) : null}
    </g>
  );
};

/** A small isometric tree, used sparingly as city atmosphere. */
export const IsoTree: React.FC<{ at: Pt; scale?: number }> = ({ at, scale = 1 }) => (
  <g opacity={0.9}>
    <ellipse cx={at.x} cy={at.y} rx={10 * scale} ry={5 * scale} fill="rgba(0,0,0,0.4)" />
    <rect x={at.x - 2 * scale} y={at.y - 16 * scale} width={4 * scale} height={16 * scale} fill="#161d16" />
    <circle cx={at.x} cy={at.y - 20 * scale} r={11 * scale} fill="#18241a" />
    <circle cx={at.x - 4 * scale} cy={at.y - 24 * scale} r={7 * scale} fill="#1d2b1f" />
  </g>
);
