import React, { useMemo } from "react";
import { mulberry32, lerp } from "../helpers";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// CityMap — dense low-relief dimensional city blocks on an elevated
// three-quarter plane, fading into darkness at the top. Rendered once as a
// static SVG group (deterministic) and parallaxed by the camera rig.
// ---------------------------------------------------------------------------

const NEAR_Y = 1790;
const FAR_Y = 235;
const COLS = 17;
const ROWS = 19;

// Project grid coords -> screen. u in [-1,1] across width, t in [0,1] depth
// (0 = near/bottom, 1 = far/top). Gentle convergence keeps the plane reading
// as a tilted city grid rather than a funnel of streaks.
function depthY(t: number) {
  return NEAR_Y + (FAR_Y - NEAR_Y) * Math.pow(t, 0.72);
}
function halfW(t: number) {
  return lerp(660, 300, t);
}
function centerX(t: number) {
  return lerp(556, 790, t);
}
function project(u: number, t: number): [number, number] {
  return [centerX(t) + u * halfW(t), depthY(t)];
}
function heightPx(t: number) {
  return lerp(22, 4, t);
}

type Quad = [number, number][];
const poly = (q: Quad) => q.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

interface Building {
  top: Quad;
  left: Quad;
  right: Quad;
  fill: string;
  sideL: string;
  sideR: string;
  rim?: string;
}

function buildCity(): { buildings: Building[] } {
  const rnd = mulberry32(20240311);
  const buildings: Building[] = [];

  // Depth start a little into the plane so the very-near row sits behind the
  // foreground street/storefront.
  const T0 = 0.06;

  const cellU = 2 / COLS;

  for (let r = 0; r < ROWS; r++) {
    const t0 = T0 + ((1 - T0) * r) / ROWS;
    const t1 = T0 + ((1 - T0) * (r + 1)) / ROWS;
    const cellT = t1 - t0;

    for (let c = 0; c < COLS; c++) {
      const u0 = -1 + cellU * c;

      // Occasional empty lots / plazas break up the grid.
      if (rnd() < 0.14) continue;

      // Road margins on every side so blocks stay separate — the gaps between
      // them form a continuous, believable road network on the ground plane.
      const mU = cellU * (0.2 + rnd() * 0.08);
      const mT = cellT * (0.26 + rnd() * 0.1);
      const jU = (rnd() - 0.5) * cellU * 0.12;

      const uA = u0 + mU + jU;
      const uB = u0 + cellU - mU + jU;
      const ta = t0 + mT;
      const tb = t1 - mT;

      const gD = project(uA, ta); // near-left
      const gC = project(uB, ta); // near-right
      const gA = project(uA, tb); // far-left
      const gB = project(uB, tb); // far-right

      const tMid = (t0 + t1) / 2;
      const h = heightPx(tMid) * (0.6 + rnd() * 1.0);

      // Raised top corners (extrude up in screen space).
      const tA: [number, number] = [gA[0], gA[1] - h];
      const tB: [number, number] = [gB[0], gB[1] - h];
      const tC: [number, number] = [gC[0], gC[1] - h];
      const tD: [number, number] = [gD[0], gD[1] - h];

      // Depth shading: far buildings dim into the background. Tops catch light
      // so each reads as a distinct low box.
      const depthMix = Math.pow(tMid, 0.78);
      const lit = 0.85 + rnd() * 0.3;
      const topBase = lerp(0x2a, 0x0c, depthMix) * lit;
      const topFill = `rgb(${Math.round(topBase + 6)}, ${Math.round(topBase + 15)}, ${Math.round(topBase + 21)})`;
      const sideLFill = `rgb(${Math.round(topBase - 4)}, ${Math.round(topBase + 2)}, ${Math.round(topBase + 6)})`;
      const sideRFill = `rgb(${Math.round(topBase - 8)}, ${Math.round(topBase - 3)}, ${Math.round(topBase + 1)})`;

      buildings.push({
        top: [tA, tB, tC, tD],
        // Near (front) face along D->C.
        left: [gD, gC, tC, tD],
        // Right face along C->B.
        right: [gC, gB, tB, tC],
        fill: topFill,
        sideL: sideLFill,
        sideR: sideRFill,
        rim: rnd() < 0.14 ? C.cyanGlow : undefined,
      });
    }
  }
  return { buildings };
}

export const CityMap: React.FC = () => {
  const { buildings } = useMemo(buildCity, []);

  return (
    <g>
      {/* Ground plane — slightly lifted tarmac so the road network reads
          through the gaps between blocks. */}
      <polygon
        points={poly([
          project(-1, 0.06),
          project(1, 0.06),
          project(1, 1),
          project(-1, 1),
        ])}
        fill="#0A131A"
        opacity={0.9}
      />

      {/* Extruded blocks — draw far-to-near via array order (already far-first). */}
      {buildings.map((b, i) => (
        <g key={`b${i}`}>
          <polygon points={poly(b.left)} fill={b.sideL} />
          <polygon points={poly(b.right)} fill={b.sideR} />
          <polygon
            points={poly(b.top)}
            fill={b.fill}
            stroke={b.rim ?? "rgba(120,160,190,0.05)"}
            strokeWidth={b.rim ? 1 : 0.5}
          />
        </g>
      ))}

      {/* Atmospheric fade — top of the map dissolves into darkness. */}
      <defs>
        <linearGradient id="cityFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} stopOpacity={1} />
          <stop offset="0.28" stopColor={C.bg} stopOpacity={0.55} />
          <stop offset="0.55" stopColor={C.bg} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="cityVignette" cx="0.35" cy="0.5" r="0.85">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={900} fill="url(#cityFade)" />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#cityVignette)" />
    </g>
  );
};
