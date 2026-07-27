import React from "react";
import { iso, polyPath, Pt } from "../utils/routeGeometry";
import { COLORS } from "../styles/tokens";

/**
 * The competitor storefront (Scene 4). Same isometric grammar as YOUR BUSINESS
 * but wrapped in a restrained cyan neon edge — it is the option customers were
 * routed to. `light` controls its interior warmth (0.78..0.9).
 */
export const CompetitorStore: React.FC<{
  origin: Pt;
  light?: number;
  glow?: number; // 0..1 cyan edge glow strength
  scale?: number;
}> = ({ origin, light = 0.8, glow = 1, scale = 1 }) => {
  const A = 2.1;
  const B_ = 1.6;
  const H = 1.7;
  const o = origin;
  const cB = iso(o, A, 0, 0);
  const cC = iso(o, A, B_, 0);
  const cD = iso(o, 0, B_, 0);
  const cAr = iso(o, 0, 0, H);
  const cBr = iso(o, A, 0, H);
  const cCr = iso(o, A, B_, H);
  const cDr = iso(o, 0, B_, H);
  const k = (light - 0.78) / 0.22;
  const warm = `rgba(${Math.round(190 + k * 45)},${Math.round(135 + k * 40)},${Math.round(70 + k * 25)},${0.7 + k * 0.2})`;
  // ground base outline (footprint on the pavement)
  const pB = iso(o, A + 0.3, -0.3, 0);
  const pC = iso(o, A + 0.3, B_ + 0.3, 0);
  const pD = iso(o, -0.3, B_ + 0.3, 0);
  const pA = iso(o, -0.3, -0.3, 0);

  const edge = (a: Pt, b: Pt, w = 3) => (
    <path
      d={polyPath([a, b])}
      stroke={COLORS.cyan}
      strokeWidth={w}
      strokeLinecap="round"
      opacity={0.95 * glow}
      style={{ filter: `drop-shadow(0 0 ${10 * glow}px rgba(18,211,238,${0.6 * glow}))` }}
    />
  );

  return (
    <g transform={`scale(${scale})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {/* cyan ground base outline */}
      <path
        d={polyPath([pA, pB, pC, pD]) + " Z"}
        fill="none"
        stroke={COLORS.cyan}
        strokeWidth={2.4}
        opacity={0.7 * glow}
        style={{ filter: `drop-shadow(0 0 ${8 * glow}px rgba(18,211,238,${0.5 * glow}))` }}
      />
      <path d={polyPath([cD, cC, cCr, cDr]) + " Z"} fill="#0c1017" />
      <path d={polyPath([cB, cC, cCr, cBr]) + " Z"} fill="#0e131b" />
      <path d={polyPath([cAr, cBr, cCr, cDr]) + " Z"} fill="#151c25" />
      {/* warm lit windows */}
      {[0.14, 0.44, 0.72].map((u0, i) => (
        <path
          key={i}
          d={polyPath([lerp(cB, cC, u0), lerp(cB, cC, u0 + 0.18), lerp(cBr, cCr, u0 + 0.18), lerp(cBr, cCr, u0)]) + " Z"}
          fill={warm}
        />
      ))}
      {/* striped awning hint */}
      <path
        d={polyPath([lerp(cB, cC, 0.05), lerp(cB, cC, 0.95), lerp(cBr, cCr, 0.95), lerp(cBr, cCr, 0.05)]) + " Z"}
        fill="rgba(10,13,17,0.5)"
      />
      {/* neon cyan edges (full silhouette) */}
      {edge(cAr, cBr)}
      {edge(cBr, cCr)}
      {edge(cCr, cDr)}
      {edge(cDr, cAr)}
      {edge(cBr, cB)}
      {edge(cCr, cC)}
      {edge(cDr, cD)}
    </g>
  );
};

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
