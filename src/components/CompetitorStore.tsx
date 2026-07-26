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
}> = ({ origin, light = 0.8, glow = 1 }) => {
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
  const warm = `rgba(${Math.round(150 + k * 50)},${Math.round(105 + k * 35)},${Math.round(55 + k * 20)},${0.55 + k * 0.2})`;

  const edge = (a: Pt, b: Pt) => (
    <path
      d={polyPath([a, b])}
      stroke={COLORS.cyan}
      strokeWidth={2.4}
      strokeLinecap="round"
      opacity={0.9 * glow}
      style={{ filter: `drop-shadow(0 0 ${6 * glow}px rgba(18,211,238,${0.5 * glow}))` }}
    />
  );

  return (
    <g>
      <path d={polyPath([cD, cC, cCr, cDr]) + " Z"} fill="#0c1017" />
      <path d={polyPath([cB, cC, cCr, cBr]) + " Z"} fill="#0e131b" />
      <path d={polyPath([cAr, cBr, cCr, cDr]) + " Z"} fill="#141a22" />
      {/* warm interior glimpse */}
      <path
        d={polyPath([
          lerp(cB, cC, 0.12),
          lerp(cB, cC, 0.6),
          lerp(cBr, cCr, 0.6),
          lerp(cBr, cCr, 0.12),
        ]) + " Z"}
        fill={warm}
      />
      {/* striped awning hint */}
      <path
        d={polyPath([lerp(cB, cC, 0.05), lerp(cB, cC, 0.95), lerp(cBr, cCr, 0.95), lerp(cBr, cCr, 0.05)]) + " Z"}
        fill="rgba(10,13,17,0.6)"
        transform="translate(0,0)"
      />
      {/* neon cyan edges */}
      {edge(cAr, cBr)}
      {edge(cBr, cCr)}
      {edge(cCr, cDr)}
      {edge(cBr, cB)}
      {edge(cCr, cC)}
    </g>
  );
};

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
