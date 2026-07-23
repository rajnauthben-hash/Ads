import React from "react";
import { COLOR } from "./theme";
import { AVENUES, STREETS, project, persp, rng, Pt } from "./projection";

/**
 * The single, consistent nighttime city. Ground plane + street network +
 * procedurally extruded blocks + warm window life + wet-road reflections.
 * Rendered once; scene cameras move it via the parent <g> transform, so the
 * same world persists across all four scenes (no slideshow).
 */

const poly = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

type Cell = { gx0: number; gx1: number; d0: number; d1: number };

function Block({
  gx0,
  gx1,
  d0,
  d1,
  seed,
}: Cell & { seed: number }) {
  const r = rng(seed);
  // Inset the footprint from the surrounding roads.
  const ix = (gx1 - gx0) * (0.16 + r() * 0.06);
  const iz = (d1 - d0) * (0.16 + r() * 0.06);
  const a0 = gx0 + ix;
  const a1 = gx1 - ix;
  const b0 = d0 + iz; // near edge
  const b1 = d1 - iz; // far edge
  const h = 0.08 + r() * 0.16;

  // Ground corners (near-left, near-right, far-right, far-left)
  const nL = project(a0, b0);
  const nR = project(a1, b0);
  const fR = project(a1, b1);
  const fL = project(a0, b1);
  // Top corners
  const nLt = project(a0, b0, h);
  const nRt = project(a1, b0, h);
  const fRt = project(a1, b1, h);
  const fLt = project(a0, b1, h);

  // Warm windows on the near (front) face — brighter for closer blocks.
  const midDepth = (b0 + b1) / 2;
  const lit = midDepth < 0.62 && r() > 0.28;
  const cols = 2 + Math.floor(r() * 3);
  const rows = 1 + Math.floor(r() * 2);
  const windows: React.ReactNode[] = [];
  if (lit) {
    const lerp = (p: Pt, q: Pt, t: number): Pt => ({
      x: p.x + (q.x - p.x) * t,
      y: p.y + (q.y - p.y) * t,
    });
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        if (r() < 0.32) continue;
        const u0 = (cx + 0.28) / cols;
        const u1 = (cx + 0.72) / cols;
        const v0 = (cy + 0.25) / rows;
        const v1 = (cy + 0.7) / rows;
        // bottom edge nL->nR, top edge nLt->nRt
        const bl = lerp(lerp(nL, nLt, v1), lerp(nR, nRt, v1), u0);
        const br = lerp(lerp(nL, nLt, v1), lerp(nR, nRt, v1), u1);
        const tl = lerp(lerp(nL, nLt, v0), lerp(nR, nRt, v0), u0);
        windows.push(
          <rect
            key={`w${cx}-${cy}`}
            x={Math.min(bl.x, tl.x)}
            y={tl.y}
            width={Math.max(2, Math.abs(br.x - bl.x))}
            height={Math.max(2, bl.y - tl.y)}
            fill={COLOR.window}
            opacity={0.5 + r() * 0.4}
          />,
        );
      }
    }
  }

  const shade = 0.55 + midDepth * 0.35;
  return (
    <g>
      {/* footprint contact shadow */}
      <polygon points={poly([nL, nR, fR, fL])} fill="#000" opacity={0.5} />
      {/* front face */}
      <polygon
        points={poly([nL, nR, nRt, nLt])}
        fill={COLOR.blockSide}
        opacity={shade}
      />
      {windows}
      {/* right face for depth */}
      <polygon points={poly([nR, fR, fRt, nRt])} fill="#05080D" opacity={shade} />
      {/* top */}
      <polygon
        points={poly([nLt, nRt, fRt, fLt])}
        fill={COLOR.blockTop}
        opacity={0.85}
      />
    </g>
  );
}

function Road({ from, to }: { from: Pt; to: Pt }) {
  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={COLOR.asphaltEdge}
        strokeWidth={2}
        opacity={0.6}
      />
    </g>
  );
}

export const MasterCityMap: React.FC<{ litBoost?: number }> = ({ litBoost = 0 }) => {
  const avenues = AVENUES;
  const streets = STREETS;

  // Building cells
  const blocks: React.ReactNode[] = [];
  let seed = 7;
  for (let i = 0; i < avenues.length - 1; i++) {
    for (let j = 0; j < streets.length - 1; j++) {
      seed += 13;
      blocks.push(
        <Block
          key={`b${i}-${j}`}
          gx0={avenues[i]}
          gx1={avenues[i + 1]}
          d0={streets[j]}
          d1={streets[j + 1]}
          seed={seed}
        />,
      );
    }
  }

  // Warm bokeh scattered on the far ground
  const bokeh: React.ReactNode[] = [];
  const br = rng(991);
  for (let k = 0; k < 40; k++) {
    const gx = -1.1 + br() * 2.2;
    const d = 0.5 + br() * 0.5;
    const p = project(gx, d);
    const s = (0.4 + br() * 0.9) * persp(d) * 22;
    bokeh.push(
      <circle
        key={`bk${k}`}
        cx={p.x}
        cy={p.y - s * 0.5}
        r={s}
        fill={COLOR.window}
        opacity={0.1 + br() * 0.16}
      />,
    );
  }

  return (
    <g>
      {/* Ground base + sky — full-frame, blended (no hard seam) */}
      <rect x={-400} y={-400} width={1880} height={2720} fill={COLOR.bgDeep} />
      <rect x={-400} y={-400} width={1880} height={2720} fill="url(#skyGrad)" />
      <rect x={-400} y={-400} width={1880} height={2720} fill="url(#groundGrad)" />

      {/* Street network (draw far→near) */}
      <g strokeLinecap="round">
        {streets.map((d, j) => (
          <Road key={`s${j}`} from={project(-1.1, d)} to={project(1.14, d)} />
        ))}
        {avenues.map((gx, i) => (
          <Road key={`a${i}`} from={project(gx, 0)} to={project(gx, 1)} />
        ))}
      </g>

      {/* Intersection warm glints */}
      <g>
        {avenues.map((gx, i) =>
          streets.map((d, j) => {
            const p = project(gx, d);
            const r = persp(d) * 3.2;
            if ((i + j) % 2 !== 0) return null;
            return (
              <circle
                key={`x${i}-${j}`}
                cx={p.x}
                cy={p.y}
                r={r}
                fill={COLOR.window}
                opacity={0.35 * persp(d) + 0.05}
              />
            );
          }),
        )}
      </g>

      {bokeh}
      {blocks}

      {/* Wet-road reflection sheen + vignette */}
      <rect
        x={-200}
        y={900}
        width={1480}
        height={1220}
        fill="url(#wetSheen)"
        opacity={0.6 + litBoost * 0.2}
      />
      <rect x={-200} y={-200} width={1480} height={2320} fill="url(#vignette)" />
    </g>
  );
};

/** Gradient/filter defs shared by the whole composition. */
export const MapDefs: React.FC = () => (
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={COLOR.bgTop} />
      <stop offset="1" stopColor={COLOR.bgDeep} />
    </linearGradient>
    <radialGradient id="groundGrad" cx="0.5" cy="0.34" r="0.95">
      <stop offset="0" stopColor="rgba(16,24,38,0.55)" />
      <stop offset="0.55" stopColor="rgba(8,13,22,0.30)" />
      <stop offset="1" stopColor="rgba(2,4,10,0)" />
    </radialGradient>
    <radialGradient id="wetSheen" cx="0.5" cy="1" r="0.9">
      <stop offset="0" stopColor="rgba(57,198,255,0.05)" />
      <stop offset="0.6" stopColor="rgba(20,40,70,0.04)" />
      <stop offset="1" stopColor="rgba(0,0,0,0)" />
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.42" r="0.85">
      <stop offset="0" stopColor="rgba(0,0,0,0)" />
      <stop offset="0.72" stopColor="rgba(0,0,0,0)" />
      <stop offset="1" stopColor="rgba(0,0,0,0.72)" />
    </radialGradient>
    {/* Cyan route glow */}
    <filter id="cyanGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="7" result="b1" />
      <feMerge>
        <feMergeNode in="b1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="cyanGlowWide" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <filter id="warmGlow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
  </defs>
);
