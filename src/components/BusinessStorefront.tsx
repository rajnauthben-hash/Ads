import React from "react";
import { iso, LEVEL_H, polyPath, Pt } from "../utils/routeGeometry";
import { COLORS } from "../styles/tokens";

/**
 * YOUR BUSINESS — the single persistent hero storefront used across every
 * scene. Dark rectangular architectural volume, restrained gold trim, dark
 * awning, warm interior, glass entrance, gold "YOUR BUSINESS" sign. The same
 * proportions and window/door positions are reused everywhere; only lighting
 * (interior brightness, gold trim brightness) changes over time.
 */
export interface BusinessStorefrontProps {
  origin: Pt;
  scale?: number;
  interior?: number; // 0.78..1.0 warm interior brightness
  goldTrim?: number; // 0.85..1.0
  label?: string;
  showSignText?: boolean;
}

// Bilinear point on a quad defined by its four corners.
function quadUV(p00: Pt, p10: Pt, p11: Pt, p01: Pt, u: number, v: number): Pt {
  const a = { x: p00.x + (p10.x - p00.x) * u, y: p00.y + (p10.y - p00.y) * u };
  const b = { x: p01.x + (p11.x - p01.x) * u, y: p01.y + (p11.y - p01.y) * u };
  return { x: a.x + (b.x - a.x) * v, y: a.y + (b.y - a.y) * v };
}

function q(p00: Pt, p10: Pt, p11: Pt, p01: Pt, us: number[], vs: number[]): string {
  const pts = us.map((u, i) => quadUV(p00, p10, p11, p01, u, vs[i]));
  return polyPath(pts) + " Z";
}

export const BusinessStorefront: React.FC<BusinessStorefrontProps> = ({
  origin,
  scale = 1,
  interior = 0.8,
  goldTrim = 0.9,
  label = "YOUR BUSINESS",
  showSignText = true,
}) => {
  const A = 2.5;
  const B_ = 1.9;
  const H = 1.75;
  const o = origin;

  const cB = iso(o, A, 0, 0);
  const cC = iso(o, A, B_, 0);
  const cD = iso(o, 0, B_, 0);
  const cAr = iso(o, 0, 0, H);
  const cBr = iso(o, A, 0, H);
  const cCr = iso(o, A, B_, H);
  const cDr = iso(o, 0, B_, H);

  // Base platform (slightly larger footprint, matte stone).
  const pA = iso(o, -0.35, -0.35, 0);
  const pB = iso(o, A + 0.35, -0.35, 0);
  const pC = iso(o, A + 0.35, B_ + 0.35, 0);
  const pD = iso(o, -0.35, B_ + 0.35, 0);

  const gold = withBrightness(COLORS.gold, goldTrim);
  const warmGlass = warmInterior(interior);

  // Faces. The main façade is the down-right-facing face (D->C edge) so all
  // signage reads left-to-right in perspective and is never mirrored.
  const roof = polyPath([cAr, cBr, cCr, cDr]) + " Z";
  const facade = [cD, cC, cCr, cDr] as const; // u: D->C (down-right), v: base->roof
  const side = [cB, cC, cCr, cBr] as const; // down-left side wall

  const [f00, f10, f11, f01] = facade;
  const [l00, l10, l11, l01] = side;

  const signAngle = Math.atan2(f10.y - f00.y, f10.x - f00.x) * (180 / Math.PI);
  const signCenter = quadUV(f00, f10, f11, f01, 0.5, 0.855);

  return (
    <g transform={`scale(${scale})`} style={{ transformBox: "fill-box" }}>
      {/* platform */}
      <path d={polyPath([pA, pB, pC, pD]) + " Z"} fill="#0a0d12" stroke="rgba(228,179,99,0.08)" />
      {/* volume */}
      <path d={polyPath([...side]) + " Z"} fill="#0b1015" stroke="rgba(0,0,0,0.4)" />
      <path d={polyPath([...facade]) + " Z"} fill="#0e141b" stroke="rgba(0,0,0,0.4)" />
      <path d={roof} fill="#151b22" stroke="rgba(228,179,99,0.10)" />

      {/* ---- main façade detail (right face) ---- */}
      {/* warm interior wash behind glass */}
      <path d={q(f00, f10, f11, f01, [0.06, 0.94, 0.94, 0.06], [0.04, 0.04, 0.6, 0.6])} fill={warmGlass.wash} />
      {/* glass window bays */}
      {[
        [0.08, 0.3],
        [0.36, 0.63],
      ].map(([u0, u1], i) => (
        <path
          key={`win${i}`}
          d={q(f00, f10, f11, f01, [u0, u1, u1, u0], [0.08, 0.08, 0.55, 0.55])}
          fill={warmGlass.glass}
          stroke={withBrightness(COLORS.gold, goldTrim * 0.5)}
          strokeWidth={1}
        />
      ))}
      {/* glass entrance door (centre-right bay) */}
      <path
        d={q(f00, f10, f11, f01, [0.68, 0.9, 0.9, 0.68], [0.05, 0.05, 0.5, 0.5])}
        fill={warmGlass.door}
        stroke={gold}
        strokeWidth={1.4}
      />
      {/* door mullion */}
      <path
        d={polyPath([quadUV(f00, f10, f11, f01, 0.79, 0.05), quadUV(f00, f10, f11, f01, 0.79, 0.5)])}
        stroke={withBrightness(COLORS.gold, goldTrim * 0.6)}
        strokeWidth={1}
      />

      {/* dark awning band */}
      <path d={q(f00, f10, f11, f01, [0.03, 0.97, 0.97, 0.03], [0.6, 0.6, 0.7, 0.7])} fill="#0a0d11" />

      {/* gold sign box */}
      <path
        d={q(f00, f10, f11, f01, [0.04, 0.96, 0.96, 0.04], [0.72, 0.72, 0.98, 0.98])}
        fill="#0b0f14"
        stroke={gold}
        strokeWidth={1.6}
      />
      {showSignText ? (
        <text
          x={signCenter.x}
          y={signCenter.y}
          fill={gold}
          fontFamily="IBM Plex Sans, sans-serif"
          fontSize={20 * (A / 2.5)}
          fontWeight={500}
          letterSpacing={1.5}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${signAngle} ${signCenter.x} ${signCenter.y})`}
          style={{ filter: `drop-shadow(0 0 ${6 * goldTrim}px rgba(228,179,99,${0.35 * goldTrim}))` }}
        >
          {label}
        </text>
      ) : null}

      {/* subtle side windows on left face */}
      {[0.2, 0.55].map((u0, i) => (
        <path
          key={`sw${i}`}
          d={q(l00, l10, l11, l01, [u0, u0 + 0.2, u0 + 0.2, u0], [0.12, 0.12, 0.5, 0.5])}
          fill={warmGlass.side}
        />
      ))}

      {/* gold roof trim edge */}
      <path
        d={polyPath([cAr, cBr, cCr])}
        fill="none"
        stroke={withBrightness(COLORS.gold, goldTrim * 0.7)}
        strokeWidth={1.4}
      />

      {/* small warm lantern by the door */}
      <circle
        cx={quadUV(f00, f10, f11, f01, 0.96, 0.34).x}
        cy={quadUV(f00, f10, f11, f01, 0.96, 0.34).y}
        r={3.2}
        fill={warmInterior(Math.min(1, interior + 0.1)).lamp}
      />
      {/* potted plants at entrance */}
      {[0.63, 0.93].map((u0, i) => {
        const p = quadUV(f00, f10, f11, f01, u0, 0.0);
        return (
          <g key={`plant${i}`}>
            <ellipse cx={p.x} cy={p.y + 3} rx={7} ry={3} fill="rgba(0,0,0,0.4)" />
            <circle cx={p.x} cy={p.y - 6} r={7} fill="#1c2a1e" />
          </g>
        );
      })}
      {/* floor shadow */}
      <ellipse
        cx={(cC.x + cD.x) / 2}
        cy={cC.y + LEVEL_H * 0.05}
        rx={90 * (A / 2.5)}
        ry={20}
        fill="rgba(0,0,0,0.35)"
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
};

function withBrightness(hex: string, b: number): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * b));
  const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * b));
  const bl = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * b));
  return `rgb(${r}, ${g}, ${bl})`;
}

function warmInterior(v: number) {
  // Warm amber glass tuned by brightness v (0.78..1.0).
  const k = (v - 0.78) / 0.22; // 0..1
  const a = 0.55 + k * 0.35;
  return {
    wash: `rgba(${Math.round(120 + k * 70)}, ${Math.round(80 + k * 55)}, ${Math.round(35 + k * 25)}, ${0.5 + k * 0.25})`,
    glass: `rgba(${Math.round(150 + k * 70)}, ${Math.round(100 + k * 55)}, ${Math.round(45 + k * 25)}, ${a})`,
    door: `rgba(${Math.round(110 + k * 60)}, ${Math.round(75 + k * 45)}, ${Math.round(35 + k * 20)}, ${a})`,
    side: `rgba(${Math.round(90 + k * 50)}, ${Math.round(60 + k * 35)}, ${Math.round(28 + k * 15)}, ${0.4 + k * 0.2})`,
    lamp: `rgba(255, ${Math.round(200 + k * 40)}, ${Math.round(140 + k * 40)}, ${0.85})`,
  };
}
