import React from "react";
import { T } from "../tokens";
import { project, persp, poly, rng, Pt } from "./projection";

/**
 * Stylised 2.5D vector map plane — receding street grid + dark modular blocks
 * with restrained warm window dots. Decorative backdrop; scene objects are
 * placed in screen coordinates on top (spec gives exact coords).
 */
const AVENUES = [-1.35, -1.0, -0.65, -0.3, 0.05, 0.4, 0.75, 1.1, 1.45];
const STREETS = [0.0, 0.09, 0.2, 0.33, 0.48, 0.66, 0.86];

function Block({ gx0, gx1, d0, d1, seed }: { gx0: number; gx1: number; d0: number; d1: number; seed: number }) {
  const r = rng(seed);
  const ix = (gx1 - gx0) * 0.17;
  const iz = (d1 - d0) * 0.17;
  const a0 = gx0 + ix, a1 = gx1 - ix, b0 = d0 + iz, b1 = d1 - iz;
  const h = 0.04 + r() * 0.1;
  const nL = project(a0, b0), nR = project(a1, b0), fR = project(a1, b1);
  const nLt = project(a0, b0, h), nRt = project(a1, b0, h), fRt = project(a1, b1, h), fLt = project(a0, b1, h);
  const mid = (b0 + b1) / 2;
  const lit = mid < 0.55 && r() > 0.5;
  const wins: React.ReactNode[] = [];
  if (lit) {
    const lerp = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
    const cols = 2 + Math.floor(r() * 2);
    for (let c = 0; c < cols; c++) {
      if (r() < 0.5) continue;
      const u0 = (c + 0.32) / cols, u1 = (c + 0.68) / cols, v = 0.55;
      const bl = lerp(lerp(nL, nLt, v), lerp(nR, nRt, v), u0);
      const tl = lerp(lerp(nL, nLt, 0.18), lerp(nR, nRt, 0.18), u0);
      const br = lerp(lerp(nL, nLt, v), lerp(nR, nRt, v), u1);
      wins.push(<rect key={c} x={Math.min(bl.x, tl.x)} y={tl.y} width={Math.max(1.4, Math.abs(br.x - bl.x))} height={Math.max(1.4, bl.y - tl.y)} fill={T.windowWarm} opacity={0.28 + r() * 0.28} />);
    }
  }
  return (
    <g>
      <polygon points={poly([nL, nR, nRt, nLt])} fill={T.mapSurface} />
      {wins}
      <polygon points={poly([nR, fR, fRt, nRt])} fill="#070C11" />
      <polygon points={poly([nLt, nRt, fRt, fLt])} fill={T.raised} opacity={0.85} />
      <polyline points={poly([nLt, nRt, fRt, fLt, nLt])} fill="none" stroke={T.mapLine} strokeWidth={0.7} opacity={0.7} />
    </g>
  );
}

export const MapField: React.FC = () => {
  const grid: React.ReactNode[] = [];
  STREETS.forEach((d, j) => {
    const a = project(-1.45, d), b = project(1.55, d);
    grid.push(<line key={`s${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.mapLine} strokeWidth={1.3} opacity={0.8} />);
  });
  AVENUES.forEach((gx, i) => {
    const a = project(gx, 0), b = project(gx, 0.86);
    grid.push(<line key={`a${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.mapLine} strokeWidth={1.3} opacity={0.8} />);
  });
  const glints: React.ReactNode[] = [];
  AVENUES.forEach((gx, i) => STREETS.forEach((d, j) => {
    if ((i + j) % 3 !== 0) return;
    const p = project(gx, d);
    glints.push(<circle key={`g${i}-${j}`} cx={p.x} cy={p.y} r={persp(d) * 2.2} fill={T.cyan} opacity={0.1 * persp(d) + 0.03} />);
  }));
  const blocks: React.ReactNode[] = [];
  let seed = 11;
  for (let i = 0; i < AVENUES.length - 1; i++) for (let j = 0; j < STREETS.length - 1; j++) { seed += 7; blocks.push(<Block key={`b${i}-${j}`} gx0={AVENUES[i]} gx1={AVENUES[i + 1]} d0={STREETS[j]} d1={STREETS[j + 1]} seed={seed} />); }
  return (<g><g strokeLinecap="round">{grid}</g>{glints}{blocks}</g>);
};
