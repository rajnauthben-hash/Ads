import React from "react";
import { C } from "./theme";

/**
 * Persistent vector street-grid. A faint irregular road network on a navy
 * ground, never a photographic map. Camera props (x/y/scale/rot) let one
 * continuous map drift/zoom across all five scenes.
 */
export const MapGrid: React.FC<{ x?: number; y?: number; scale?: number; rot?: number; opacity?: number }> = ({
  x = 0,
  y = 0,
  scale = 1,
  rot = 0,
  opacity = 1,
}) => {
  // deterministic pseudo-random offsets for irregular blocks
  const r = (n: number) => {
    const v = Math.sin(n * 91.17 + 12.3) * 43758.5453;
    return v - Math.floor(v);
  };
  const verticals = [];
  for (let i = 0; i < 20; i++) {
    const px = 20 + i * 58 + r(i) * 22 - 11;
    verticals.push(<line key={`v${i}`} x1={px} y1={-100} x2={px + (r(i + 9) - 0.5) * 110} y2={2020} stroke={C.map} strokeWidth={i % 4 === 0 ? 2.4 : 1.1} opacity={i % 4 === 0 ? 0.85 : 0.42} />);
  }
  const horizontals = [];
  for (let i = 0; i < 32; i++) {
    const py = 20 + i * 62 + r(i + 3) * 20 - 10;
    horizontals.push(<line key={`h${i}`} x1={-100} y1={py} x2={1180} y2={py + (r(i + 5) - 0.5) * 80} stroke={C.map} strokeWidth={i % 4 === 0 ? 2.2 : 1.0} opacity={i % 4 === 0 ? 0.8 : 0.4} />);
  }
  // short cross-streets for texture (irregular block interior lines)
  const cross = [];
  for (let i = 0; i < 40; i++) {
    const cx = r(i + 20) * 1080;
    const cy = r(i + 40) * 1920;
    const len = 24 + r(i + 60) * 46;
    const horiz = r(i + 80) > 0.5;
    cross.push(<line key={`c${i}`} x1={cx} y1={cy} x2={horiz ? cx + len : cx} y2={horiz ? cy : cy + len} stroke={C.map} strokeWidth={1} opacity={0.3} />);
  }
  // a few long diagonals for depth
  const diag = [
    "M-40 300 L 760 -80",
    "M420 2000 L 1160 860",
    "M-40 1460 L 1120 1980",
    "M1120 200 L 300 1200",
  ].map((d, i) => <path key={`d${i}`} d={d} stroke={C.map} strokeWidth={1.3} opacity={0.34} fill="none" />);

  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 30% 20%, ${C.navy} 0%, ${C.black} 75%)`, opacity }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${x} ${y}) rotate(${rot} 540 960) scale(${scale})`} style={{ transformOrigin: "540px 960px" }}>
          {verticals}
          {horizontals}
          {cross}
          {diag}
        </g>
        {/* vignette */}
        <radialGradient id="mapvig" cx="50%" cy="44%" r="75%">
          <stop offset="52%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
        </radialGradient>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#mapvig)" />
      </svg>
    </div>
  );
};
