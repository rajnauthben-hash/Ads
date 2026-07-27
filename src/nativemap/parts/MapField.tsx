import React from "react";
import { T } from "../tokens";
import { project, persp, poly, rng, Pt } from "./projection";

/**
 * Premium stylised 2.5D vector map plane — receding street grid + dark modular
 * blocks with warm/cool window pinpricks, top-face highlights, glowing
 * intersections and atmospheric depth fade. Decorative backdrop; scene objects
 * are placed in screen coordinates on top.
 */
const AVENUES = [-1.4, -1.08, -0.78, -0.48, -0.18, 0.12, 0.42, 0.72, 1.02, 1.34, 1.66];
const STREETS = [0.0, 0.08, 0.17, 0.27, 0.39, 0.53, 0.69, 0.88];

const lerp = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

function Block({ gx0, gx1, d0, d1, seed }: { gx0: number; gx1: number; d0: number; d1: number; seed: number }) {
  const r = rng(seed);
  const ix = (gx1 - gx0) * (0.15 + r() * 0.05);
  const iz = (d1 - d0) * (0.15 + r() * 0.05);
  const a0 = gx0 + ix, a1 = gx1 - ix, b0 = d0 + iz, b1 = d1 - iz;
  const h = 0.035 + r() * 0.11;
  const mid = (b0 + b1) / 2;
  const fade = Math.max(0.25, 1 - mid * 0.85); // atmospheric depth fade

  const nL = project(a0, b0), nR = project(a1, b0), fR = project(a1, b1), fL = project(a0, b1);
  const nLt = project(a0, b0, h), nRt = project(a1, b0, h), fRt = project(a1, b1, h), fLt = project(a0, b1, h);

  // window pinpricks on the front face
  const wins: React.ReactNode[] = [];
  const lit = r() > 0.45;
  if (lit && mid < 0.72) {
    const cols = 2 + Math.floor(r() * 3);
    const rows = 2 + Math.floor(r() * 2);
    for (let c = 0; c < cols; c++) for (let rw = 0; rw < rows; rw++) {
      if (r() < 0.45) continue;
      const u = (c + 0.5) / cols;
      const v = 0.2 + (rw + 0.5) / rows * 0.6;
      const p = lerp(lerp(nL, nLt, v), lerp(nR, nRt, v), u);
      const warm = r() > 0.22;
      wins.push(<rect key={`${c}-${rw}`} x={p.x - 1.1} y={p.y - 1.4} width={2.2} height={2.8} fill={warm ? T.windowWarm : T.cyan} opacity={(warm ? 0.5 : 0.4) * fade * (0.6 + r() * 0.4)} />);
    }
  }

  return (
    <g opacity={fade}>
      <polygon points={poly([nL, nR, fR, fL])} fill="#000" opacity={0.3} />
      <polygon points={poly([nL, nR, nRt, nLt])} fill={T.mapSurface} />
      {wins}
      <polygon points={poly([nR, fR, fRt, nRt])} fill="#070C11" />
      <polygon points={poly([nLt, nRt, fRt, fLt])} fill={T.raised} />
      <polyline points={poly([nLt, nRt, fRt, fLt, nLt])} fill="none" stroke={T.mapLine} strokeWidth={0.7} opacity={0.7} />
      <polyline points={poly([nLt, nRt])} fill="none" stroke={T.mapLineBright} strokeWidth={0.9} opacity={0.5 * fade} />
    </g>
  );
}

export const MapField: React.FC = () => {
  const grid: React.ReactNode[] = [];
  STREETS.forEach((d, j) => {
    const a = project(-1.5, d), b = project(1.75, d);
    grid.push(<line key={`s${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.mapLine} strokeWidth={1.2} opacity={0.85 * (1 - d * 0.6)} />);
  });
  AVENUES.forEach((gx, i) => {
    const a = project(gx, 0), b = project(gx, 0.88);
    grid.push(<line key={`a${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.mapLine} strokeWidth={1.2} opacity={0.7} />);
  });

  const glints: React.ReactNode[] = [];
  AVENUES.forEach((gx, i) => STREETS.forEach((d, j) => {
    if ((i * 3 + j * 5) % 4 !== 0) return;
    const p = project(gx, d);
    const rr = persp(d) * 2.2;
    glints.push(<circle key={`g${i}-${j}`} cx={p.x} cy={p.y} r={rr} fill={T.cyan} opacity={(0.14 * persp(d) + 0.03) * (1 - d * 0.5)} />);
    if ((i + j) % 5 === 0) glints.push(<circle key={`gg${i}-${j}`} cx={p.x} cy={p.y} r={rr * 3} fill={T.cyanGlowLow} />);
  }));

  const blocks: React.ReactNode[] = [];
  let seed = 11;
  for (let i = 0; i < AVENUES.length - 1; i++) for (let j = 0; j < STREETS.length - 1; j++) { seed += 7; blocks.push(<Block key={`b${i}-${j}`} gx0={AVENUES[i]} gx1={AVENUES[i + 1]} d0={STREETS[j]} d1={STREETS[j + 1]} seed={seed} />); }

  return (
    <g>
      <g strokeLinecap="round">{grid}</g>
      {glints}
      {blocks}
      {/* atmospheric horizon haze */}
      <rect x={0} y={280} width={1080} height={420} fill="url(#mapHaze)" opacity={0.6} />
    </g>
  );
};

export const MapDefs: React.FC = () => (
  <defs>
    <linearGradient id="mapHaze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0E1826" stopOpacity="0.5" />
      <stop offset="1" stopColor="#0E1826" stopOpacity="0" />
    </linearGradient>
  </defs>
);
