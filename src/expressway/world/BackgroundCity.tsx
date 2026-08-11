import React, { useMemo } from "react";
import { mulberry32 } from "../../road/helpers";
import { C, lerp } from "../constants";

// ---------------------------------------------------------------------------
// BackgroundCity — persistent night city: a distant skyline silhouette with
// lit windows near the horizon, and a dimensional aerial block grid receding
// from the foreground. Rendered once (deterministic) and parallaxed by the
// camera rig.
// ---------------------------------------------------------------------------

const HORIZON = 660;

// Aerial ground-plane projection. t in [0,1]: 0 = near/bottom, 1 = far/horizon.
function depthY(t: number) {
  return lerp(2010, HORIZON, Math.pow(t, 0.7));
}
function halfW(t: number) {
  return lerp(940, 250, t);
}
function centerX(t: number) {
  return lerp(536, 624, t);
}
function proj(u: number, t: number): [number, number] {
  return [centerX(t) + u * halfW(t), depthY(t)];
}
const pts = (q: [number, number][]) => q.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

interface Block {
  top: [number, number][];
  left: [number, number][];
  right: [number, number][];
  fill: string;
  sideL: string;
  sideR: string;
  lights: { x: number; y: number; c: string; r: number }[];
}

interface Tower {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  windows: { x: number; y: number; c: string }[];
}

function build() {
  const rnd = mulberry32(770412);

  // ---- Distant skyline silhouette -------------------------------------
  const towers: Tower[] = [];
  let tx = -40;
  while (tx < 1120) {
    const w = 26 + rnd() * 64;
    const h = 60 + rnd() * 230;
    const y = HORIZON - h;
    const shade = 0x0c + Math.floor(rnd() * 10);
    const fill = `rgb(${shade}, ${shade + 6}, ${shade + 12})`;
    const windows: { x: number; y: number; c: string }[] = [];
    const cols = Math.max(2, Math.floor(w / 12));
    const rows = Math.max(3, Math.floor(h / 16));
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (rnd() < 0.5) continue;
        const warm = rnd() < 0.82;
        windows.push({
          x: tx + 5 + c * ((w - 8) / cols),
          y: y + 8 + r * ((h - 10) / rows),
          c: warm ? "rgba(240,190,120,0.75)" : "rgba(120,200,240,0.6)",
        });
      }
    }
    towers.push({ x: tx, y, w, h, fill, windows });
    tx += w + 4 + rnd() * 10;
  }

  // ---- Aerial block grid ----------------------------------------------
  const blocks: Block[] = [];
  const COLS = 16;
  const ROWS = 18;
  const T0 = 0.02;
  const cellU = 2 / COLS;
  for (let r = 0; r < ROWS; r++) {
    const t0 = T0 + ((1 - T0) * r) / ROWS;
    const t1 = T0 + ((1 - T0) * (r + 1)) / ROWS;
    const cellT = t1 - t0;
    for (let c = 0; c < COLS; c++) {
      const u0 = -1 + cellU * c;
      if (rnd() < 0.12) continue;
      const mU = cellU * (0.18 + rnd() * 0.08);
      const mT = cellT * (0.24 + rnd() * 0.1);
      const uA = u0 + mU;
      const uB = u0 + cellU - mU;
      const gD = proj(uA, t0 + mT);
      const gC = proj(uB, t0 + mT);
      const gA = proj(uA, t1 - mT);
      const gB = proj(uB, t1 - mT);
      const tMid = (t0 + t1) / 2;
      const h = lerp(20, 3, tMid) * (0.6 + rnd() * 1.0);
      const tA: [number, number] = [gA[0], gA[1] - h];
      const tB: [number, number] = [gB[0], gB[1] - h];
      const tC: [number, number] = [gC[0], gC[1] - h];
      const tD: [number, number] = [gD[0], gD[1] - h];
      const dm = Math.pow(tMid, 0.8);
      const base = lerp(0x20, 0x0a, dm) * (0.85 + rnd() * 0.3);
      const fill = `rgb(${Math.round(base + 4)}, ${Math.round(base + 11)}, ${Math.round(base + 17)})`;
      const sideL = `rgb(${Math.round(base - 4)}, ${Math.round(base + 1)}, ${Math.round(base + 6)})`;
      const sideR = `rgb(${Math.round(base - 8)}, ${Math.round(base - 3)}, ${Math.round(base + 1)})`;

      const lights: { x: number; y: number; c: string; r: number }[] = [];
      if (tMid < 0.7) {
        const n = Math.floor(rnd() * 3);
        for (let i = 0; i < n; i++) {
          lights.push({
            x: lerp(tD[0], tC[0], 0.2 + rnd() * 0.6),
            y: lerp(tD[1], tA[1], 0.2 + rnd() * 0.6),
            c: rnd() < 0.8 ? "rgba(240,185,110,0.5)" : "rgba(120,210,255,0.45)",
            r: lerp(2.4, 1, tMid),
          });
        }
      }

      blocks.push({
        top: [tA, tB, tC, tD],
        left: [gD, gC, tC, tD],
        right: [gC, gB, tB, tC],
        fill,
        sideL,
        sideR,
        lights,
      });
    }
  }

  return { towers, blocks };
}

export const BackgroundCity: React.FC = () => {
  const { towers, blocks } = useMemo(build, []);

  return (
    <g>
      <defs>
        <linearGradient id="exSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bgDeep} />
          <stop offset="0.55" stopColor="#071018" />
          <stop offset="0.82" stopColor="#0A1622" />
          <stop offset="1" stopColor="#0B1826" />
        </linearGradient>
        <radialGradient id="exHorizonGlow" cx="0.62" cy="0.34" r="0.5">
          <stop offset="0" stopColor="#123049" stopOpacity="0.6" />
          <stop offset="1" stopColor="#123049" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="exGroundFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} stopOpacity="0.9" />
          <stop offset="0.35" stopColor={C.bg} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky + horizon glow */}
      <rect x={-60} y={-60} width={1200} height={2040} fill="url(#exSky)" />
      <rect x={-60} y={0} width={1200} height={760} fill="url(#exHorizonGlow)" />

      {/* Skyline silhouette */}
      {towers.map((t, i) => (
        <g key={`t${i}`}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={t.fill} />
          {t.windows.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={2.4} height={3} fill={w.c} />
          ))}
        </g>
      ))}
      {/* Horizon fade so grid meets skyline softly */}
      <rect x={-60} y={HORIZON - 40} width={1200} height={120} fill="url(#exGroundFade)" />

      {/* Aerial block grid */}
      {blocks.map((b, i) => (
        <g key={`b${i}`}>
          <polygon points={pts(b.left)} fill={b.sideL} />
          <polygon points={pts(b.right)} fill={b.sideR} />
          <polygon points={pts(b.top)} fill={b.fill} stroke="rgba(90,130,160,0.05)" strokeWidth={0.5} />
          {b.lights.map((l, j) => (
            <circle key={j} cx={l.x} cy={l.y} r={l.r} fill={l.c} />
          ))}
        </g>
      ))}

      {/* Vignette */}
      <defs>
        <radialGradient id="exVignette" cx="0.4" cy="0.5" r="0.85">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#exVignette)" />
    </g>
  );
};
