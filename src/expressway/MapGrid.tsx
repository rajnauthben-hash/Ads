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
  for (let i = 0; i < 12; i++) {
    const px = 40 + i * 95 + r(i) * 30 - 15;
    verticals.push(<line key={`v${i}`} x1={px} y1={-100} x2={px + (r(i + 9) - 0.5) * 120} y2={2020} stroke={C.map} strokeWidth={i % 4 === 0 ? 2.4 : 1.3} opacity={i % 4 === 0 ? 0.9 : 0.55} />);
  }
  const horizontals = [];
  for (let i = 0; i < 20; i++) {
    const py = 30 + i * 100 + r(i + 3) * 26 - 13;
    horizontals.push(<line key={`h${i}`} x1={-100} y1={py} x2={1180} y2={py + (r(i + 5) - 0.5) * 90} stroke={C.map} strokeWidth={i % 4 === 0 ? 2.2 : 1.2} opacity={i % 4 === 0 ? 0.85 : 0.5} />);
  }
  // a few diagonals for depth
  const diag = [
    "M-40 300 L 700 -60",
    "M400 2000 L 1160 900",
    "M-40 1400 L 1120 1900",
  ].map((d, i) => <path key={`d${i}`} d={d} stroke={C.map} strokeWidth={1.4} opacity={0.4} fill="none" />);

  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 30% 20%, ${C.navy} 0%, ${C.black} 75%)`, opacity }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${x} ${y}) rotate(${rot} 540 960) scale(${scale})`} style={{ transformOrigin: "540px 960px" }}>
          {verticals}
          {horizontals}
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
