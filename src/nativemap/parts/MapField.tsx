import React from "react";
import { T } from "../tokens";
import { project, persp, poly, rng, Pt } from "./projection";

const AVENUES = [-1.3, -0.95, -0.6, -0.25, 0.1, 0.45, 0.8, 1.15, 1.5];
const STREETS = [0.0, 0.1, 0.22, 0.36, 0.52, 0.7, 0.9];

function Block({ gx0, gx1, d0, d1, seed }: { gx0: number; gx1: number; d0: number; d1: number; seed: number }) {
  const r = rng(seed);
  const ix = (gx1 - gx0) * 0.16;
  const iz = (d1 - d0) * 0.16;
  const a0 = gx0 + ix;
  const a1 = gx1 - ix;
  const b0 = d0 + iz;
  const b1 = d1 - iz;
  const h = 0.05 + r() * 0.13;

  const nL = project(a0, b0);
  const nR = project(a1, b0);
  const fR = project(a1, b1);
  const fL = project(a0, b1);
  const nLt = project(a0, b0, h);
  const nRt = project(a1, b0, h);
  const fRt = project(a1, b1, h);
  const fLt = project(a0, b1, h);

  const mid = (b0 + b1) / 2;
  const lit = mid < 0.6 && r() > 0.4;
  const wins: React.ReactNode[] = [];
  if (lit) {
    const lerp = (p: Pt, q: Pt, t: number): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });
    const cols = 2 + Math.floor(r() * 2);
    for (let cx = 0; cx < cols; cx++) {
      if (r() < 0.4) continue;
      const u0 = (cx + 0.3) / cols;
      const u1 = (cx + 0.7) / cols;
      const v = 0.55;
      const bl = lerp(lerp(nL, nLt, v), lerp(nR, nRt, v), u0);
      const tl = lerp(lerp(nL, nLt, 0.15), lerp(nR, nRt, 0.15), u0);
      const br = lerp(lerp(nL, nLt, v), lerp(nR, nRt, v), u1);
      wins.push(
        <rect key={cx} x={Math.min(bl.x, tl.x)} y={tl.y} width={Math.max(1.5, Math.abs(br.x - bl.x))} height={Math.max(1.5, bl.y - tl.y)} fill={T.windowWarm} opacity={0.35 + r() * 0.35} />,
      );
    }
  }

  return (
    <g>
      <polygon points={poly([nL, nR, fR, fL])} fill="#000" opacity={0.35} />
      <polygon points={poly([nL, nR, nRt, nLt])} fill={T.block} />
      {wins}
      <polygon points={poly([nR, fR, fRt, nRt])} fill="#06090F" />
      <polygon points={poly([nLt, nRt, fRt, fLt])} fill={T.blockTop} opacity={0.9} />
      <polyline points={poly([nLt, nRt, fRt, fLt, nLt])} fill="none" stroke={T.blockEdge} strokeWidth={0.7} opacity={0.6} />
    </g>
  );
}

/** Streets + modular blocks filling the whole ground plane. */
export const MapField: React.FC = () => {
  const streets: React.ReactNode[] = [];
  STREETS.forEach((d, j) => {
    const a = project(-1.4, d);
    const b = project(1.6, d);
    streets.push(<line key={`s${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.street} strokeWidth={1.4} />);
  });
  AVENUES.forEach((gx, i) => {
    const a = project(gx, 0);
    const b = project(gx, 0.9);
    streets.push(<line key={`a${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.street} strokeWidth={1.4} />);
  });

  // intersection glints
  const glints: React.ReactNode[] = [];
  AVENUES.forEach((gx, i) =>
    STREETS.forEach((d, j) => {
      if ((i + j) % 3 !== 0) return;
      const p = project(gx, d);
      glints.push(<circle key={`g${i}-${j}`} cx={p.x} cy={p.y} r={persp(d) * 2.4} fill={T.cyan} opacity={0.12 * persp(d) + 0.03} />);
    }),
  );

  const blocks: React.ReactNode[] = [];
  let seed = 11;
  for (let i = 0; i < AVENUES.length - 1; i++) {
    for (let j = 0; j < STREETS.length - 1; j++) {
      seed += 7;
      blocks.push(<Block key={`b${i}-${j}`} gx0={AVENUES[i]} gx1={AVENUES[i + 1]} d0={STREETS[j]} d1={STREETS[j + 1]} seed={seed} />);
    }
  }

  return (
    <g>
      <g strokeLinecap="round">{streets}</g>
      {glints}
      {blocks}
    </g>
  );
};
