import React from "react";
import { iso, LEVEL_H, polyPath, Pt } from "../utils/routeGeometry";

/**
 * A dimensional 2.5D building block on the isometric grid: roof + the two
 * camera-facing faces, with a small dark awning, storefront glass hints and
 * edge highlights so it reads as a little shop like the source renders.
 */
export interface IsometricBuildingProps {
  origin: Pt;
  a: number;
  b: number;
  h: number;
  roof?: string;
  left?: string;
  right?: string;
  stroke?: string;
  label?: string;
  labelColor?: string;
  opacity?: number;
}

let _uid = 0;

function quadUV(p00: Pt, p10: Pt, p11: Pt, p01: Pt, u: number, v: number): Pt {
  const a = { x: p00.x + (p10.x - p00.x) * u, y: p00.y + (p10.y - p00.y) * u };
  const b = { x: p01.x + (p11.x - p01.x) * u, y: p01.y + (p11.y - p01.y) * u };
  return { x: a.x + (b.x - a.x) * v, y: a.y + (b.y - a.y) * v };
}
function q(p00: Pt, p10: Pt, p11: Pt, p01: Pt, us: number[], vs: number[]): string {
  return polyPath(us.map((u, i) => quadUV(p00, p10, p11, p01, u, vs[i]))) + " Z";
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
  const uid = React.useMemo(() => `bld${_uid++}`, []);
  const B = iso(origin, a, 0, 0);
  const C = iso(origin, a, b, 0);
  const D = iso(origin, 0, b, 0);
  const Ar = iso(origin, 0, 0, h);
  const Br = iso(origin, a, 0, h);
  const Cr = iso(origin, a, b, h);
  const Dr = iso(origin, 0, b, h);

  // down-right readable face (D-C edge): p00=D(base), p10=C(base), p11=Cr, p01=Dr
  const [f00, f10, f11, f01] = [D, C, Cr, Dr];

  const lx = (D.x + Cr.x) / 2;
  const ly = (D.y + Cr.y) / 2 - LEVEL_H * 0.18;
  const labelAngle = Math.atan2(C.y - D.y, C.x - D.x) * (180 / Math.PI);

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={lighten(roof, 1.25)} />
          <stop offset="100%" stopColor={roof} />
        </linearGradient>
      </defs>

      {/* faces */}
      <path d={polyPath([B, C, Cr, Br]) + " Z"} fill={left} stroke={stroke} strokeWidth={1} />
      <path d={polyPath([D, C, Cr, Dr]) + " Z"} fill={right} stroke={stroke} strokeWidth={1} />
      <path d={polyPath([Ar, Br, Cr, Dr]) + " Z"} fill={`url(#${uid}-roof)`} stroke={stroke} strokeWidth={1} />

      {/* storefront glass hints on the readable face */}
      {[
        [0.12, 0.42],
        [0.56, 0.86],
      ].map(([u0, u1], i) => (
        <path key={i} d={q(f00, f10, f11, f01, [u0, u1, u1, u0], [0.1, 0.1, 0.42, 0.42])} fill="rgba(30,40,52,0.55)" />
      ))}
      {/* dark awning strip */}
      <path d={q(f00, f10, f11, f01, [0.06, 0.94, 0.94, 0.06], [0.46, 0.46, 0.56, 0.56])} fill="rgba(6,9,13,0.75)" />

      {/* top edge highlight */}
      <path d={polyPath([Dr, Cr])} fill="none" stroke="rgba(150,170,190,0.10)" strokeWidth={1.2} />
      <path d={polyPath([Br, Cr])} fill="none" stroke="rgba(150,170,190,0.07)" strokeWidth={1.2} />

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
    <circle cx={at.x} cy={at.y - 20 * scale} r={11 * scale} fill="#1a2a1c" />
    <circle cx={at.x - 4 * scale} cy={at.y - 24 * scale} r={7 * scale} fill="#20321f" />
  </g>
);

function lighten(hex: string, f: number): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * f));
  const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * f));
  const b = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * f));
  return `rgb(${r}, ${g}, ${b})`;
}
