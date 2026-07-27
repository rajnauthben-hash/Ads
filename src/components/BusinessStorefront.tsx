import React from "react";
import { iso, LEVEL_H, polyPath, Pt } from "../utils/routeGeometry";
import { COLORS } from "../styles/tokens";

/**
 * YOUR BUSINESS — the persistent hero storefront. A warm, dimensional shopfront
 * matching the source renders: black scalloped awning, brightly glowing glass
 * with mullions, an illuminated gold sign, a warm double-door entrance, potted
 * shrubs, a wall lantern and a warm light-spill on the pavement. Only lighting
 * (interior / gold-trim brightness) changes over time.
 */
export interface BusinessStorefrontProps {
  origin: Pt;
  scale?: number;
  interior?: number; // 0.78..1.0 warm interior brightness
  goldTrim?: number; // 0.85..1.0
  label?: string;
  showSignText?: boolean;
}

function quadUV(p00: Pt, p10: Pt, p11: Pt, p01: Pt, u: number, v: number): Pt {
  const a = { x: p00.x + (p10.x - p00.x) * u, y: p00.y + (p10.y - p00.y) * u };
  const b = { x: p01.x + (p11.x - p01.x) * u, y: p01.y + (p11.y - p01.y) * u };
  return { x: a.x + (b.x - a.x) * v, y: a.y + (b.y - a.y) * v };
}
function q(p00: Pt, p10: Pt, p11: Pt, p01: Pt, us: number[], vs: number[]): string {
  const pts = us.map((u, i) => quadUV(p00, p10, p11, p01, u, vs[i]));
  return polyPath(pts) + " Z";
}

let _uid = 0;

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
  const H = 1.78;
  const o = origin;
  const uid = React.useMemo(() => `sf${_uid++}`, []);

  const cB = iso(o, A, 0, 0);
  const cC = iso(o, A, B_, 0);
  const cD = iso(o, 0, B_, 0);
  const cAr = iso(o, 0, 0, H);
  const cBr = iso(o, A, 0, H);
  const cCr = iso(o, A, B_, H);
  const cDr = iso(o, 0, B_, H);

  const pA = iso(o, -0.4, -0.4, 0);
  const pB = iso(o, A + 0.4, -0.4, 0);
  const pC = iso(o, A + 0.5, B_ + 0.5, 0);
  const pD = iso(o, -0.4, B_ + 0.5, 0);

  const k = clamp((interior - 0.78) / 0.22); // 0..1 warmth
  const goldBright = bright(COLORS.gold, Math.min(1, goldTrim + 0.12));

  // façade = down-right face (D->C edge readable), side = down-left face
  const facade = [cD, cC, cCr, cDr] as const;
  const side = [cB, cC, cCr, cBr] as const;
  const [f00, f10, f11, f01] = facade;
  const [l00, l10, l11, l01] = side;

  const signAngle = Math.atan2(f10.y - f00.y, f10.x - f00.x) * (180 / Math.PI);
  const signCenter = quadUV(f00, f10, f11, f01, 0.5, 0.85);

  // window bays (u ranges) on the façade, leaving centre for the door
  const bays: [number, number][] = [
    [0.06, 0.29],
    [0.71, 0.94],
  ];
  const glowA = 0.6 + k * 0.35;

  // scalloped awning bottom edge (small arcs)
  const scallops: string[] = [];
  const segN = 9;
  for (let i = 0; i < segN; i++) {
    const u0 = 0.03 + (i / segN) * 0.94;
    const u1 = 0.03 + ((i + 1) / segN) * 0.94;
    const a = quadUV(f00, f10, f11, f01, u0, 0.55);
    const m = quadUV(f00, f10, f11, f01, (u0 + u1) / 2, 0.515);
    const b = quadUV(f00, f10, f11, f01, u1, 0.55);
    scallops.push(`M ${a.x} ${a.y} Q ${m.x} ${m.y} ${b.x} ${b.y}`);
  }

  const groundC = quadUV(f00, f10, f11, f01, 0.5, 0.0);

  return (
    <g transform={`scale(${scale})`} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <defs>
        <radialGradient id={`${uid}-glass`} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor={`rgba(${255},${205 + k * 20},${140 + k * 30},${glowA})`} />
          <stop offset="60%" stopColor={`rgba(${235},${165 + k * 20},${90 + k * 20},${glowA})`} />
          <stop offset="100%" stopColor={`rgba(${150},${95},${45},${0.5 + k * 0.2})`} />
        </radialGradient>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b232c" />
          <stop offset="100%" stopColor="#0f151b" />
        </linearGradient>
        <radialGradient id={`${uid}-spill`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgba(255,190,120,${0.22 + k * 0.14})`} />
          <stop offset="100%" stopColor="rgba(255,190,120,0)" />
        </radialGradient>
      </defs>

      {/* warm light-spill on the pavement in front of the door */}
      <ellipse cx={groundC.x} cy={groundC.y + 14} rx={150 * (A / 2.5)} ry={40} fill={`url(#${uid}-spill)`} />

      {/* platform / base */}
      <path d={polyPath([pA, pB, pC, pD]) + " Z"} fill="#0b0f14" stroke="rgba(228,179,99,0.10)" strokeWidth={1} />

      {/* volume */}
      <path d={polyPath([...side]) + " Z"} fill="#0a0e13" stroke="rgba(0,0,0,0.5)" />
      <path d={polyPath([...facade]) + " Z"} fill="#0d131a" stroke="rgba(0,0,0,0.5)" />
      <path d={polyPath([cAr, cBr, cCr, cDr]) + " Z"} fill={`url(#${uid}-roof)`} stroke="rgba(228,179,99,0.14)" />

      {/* interior warm wash behind glass */}
      <path d={q(f00, f10, f11, f01, [0.04, 0.96, 0.96, 0.04], [0.03, 0.03, 0.54, 0.54])} fill={`url(#${uid}-glass)`} opacity={0.9} />

      {/* glass window bays with mullions */}
      {bays.map(([u0, u1], bi) => (
        <g key={`bay${bi}`}>
          <path
            d={q(f00, f10, f11, f01, [u0, u1, u1, u0], [0.08, 0.08, 0.5, 0.5])}
            fill={`url(#${uid}-glass)`}
            stroke={bright(COLORS.gold, goldTrim * 0.55)}
            strokeWidth={1.4}
          />
          {/* vertical mullions */}
          {[0.33, 0.66].map((mu, mi) => {
            const a = quadUV(f00, f10, f11, f01, u0 + (u1 - u0) * mu, 0.08);
            const b = quadUV(f00, f10, f11, f01, u0 + (u1 - u0) * mu, 0.5);
            return <path key={mi} d={polyPath([a, b])} stroke="rgba(20,14,8,0.55)" strokeWidth={1.4} />;
          })}
          {/* horizontal transom */}
          <path
            d={polyPath([quadUV(f00, f10, f11, f01, u0, 0.34), quadUV(f00, f10, f11, f01, u1, 0.34)])}
            stroke="rgba(20,14,8,0.45)"
            strokeWidth={1.2}
          />
        </g>
      ))}

      {/* double glass entrance door (centre) */}
      <path
        d={q(f00, f10, f11, f01, [0.4, 0.6, 0.6, 0.4], [0.02, 0.02, 0.46, 0.46])}
        fill={`rgba(${210},${150 + k * 20},${80},${0.7})`}
        stroke={goldBright}
        strokeWidth={1.6}
      />
      <path
        d={polyPath([quadUV(f00, f10, f11, f01, 0.5, 0.02), quadUV(f00, f10, f11, f01, 0.5, 0.46)])}
        stroke={bright(COLORS.gold, goldTrim * 0.7)}
        strokeWidth={1.4}
      />

      {/* black awning band */}
      <path d={q(f00, f10, f11, f01, [0.02, 0.98, 0.98, 0.02], [0.55, 0.55, 0.66, 0.66])} fill="#080b0f" />
      {scallops.map((d, i) => (
        <path key={`sc${i}`} d={d} fill="none" stroke="#0a0e12" strokeWidth={6} />
      ))}
      <path
        d={polyPath([quadUV(f00, f10, f11, f01, 0.02, 0.66), quadUV(f00, f10, f11, f01, 0.98, 0.66)])}
        stroke={bright(COLORS.gold, goldTrim * 0.5)}
        strokeWidth={1}
        opacity={0.6}
      />

      {/* illuminated gold sign box */}
      <path
        d={q(f00, f10, f11, f01, [0.03, 0.97, 0.97, 0.03], [0.68, 0.68, 0.96, 0.96])}
        fill="#0a0e13"
        stroke={goldBright}
        strokeWidth={1.8}
        style={{ filter: `drop-shadow(0 0 ${5 * goldTrim}px rgba(228,179,99,${0.3 * goldTrim}))` }}
      />
      {showSignText ? (
        <text
          x={signCenter.x}
          y={signCenter.y}
          fill={goldBright}
          fontFamily="IBM Plex Sans, sans-serif"
          fontSize={21 * (A / 2.5)}
          fontWeight={600}
          letterSpacing={1.6}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${signAngle} ${signCenter.x} ${signCenter.y})`}
          style={{ filter: `drop-shadow(0 0 ${7 * goldTrim}px rgba(228,179,99,${0.5 * goldTrim}))` }}
        >
          {label}
        </text>
      ) : null}

      {/* side wall windows (dim warm) */}
      {[0.18, 0.5].map((u0, i) => (
        <path
          key={`sw${i}`}
          d={q(l00, l10, l11, l01, [u0, u0 + 0.22, u0 + 0.22, u0], [0.14, 0.14, 0.5, 0.5])}
          fill={`rgba(${140 + k * 40},${95 + k * 25},${45 + k * 15},${0.4 + k * 0.2})`}
        />
      ))}

      {/* gold roof trim (front edges) */}
      <path d={polyPath([cAr, cBr, cCr])} fill="none" stroke={bright(COLORS.gold, goldTrim * 0.75)} strokeWidth={1.6} />
      <path d={polyPath([cCr, cDr])} fill="none" stroke={bright(COLORS.gold, goldTrim * 0.6)} strokeWidth={1.4} />

      {/* wall lantern (warm) near the door-right */}
      {(() => {
        const lp = quadUV(f00, f10, f11, f01, 0.965, 0.34);
        return (
          <g>
            <circle cx={lp.x} cy={lp.y} r={7} fill={`rgba(255,205,140,${0.35 + k * 0.2})`} style={{ filter: "blur(3px)" }} />
            <circle cx={lp.x} cy={lp.y} r={3} fill={`rgb(255,${215 + k * 20},150)`} />
          </g>
        );
      })()}

      {/* potted shrubs flanking the door */}
      {[0.36, 0.64].map((u0, i) => {
        const p = quadUV(f00, f10, f11, f01, u0, 0.0);
        return (
          <g key={`plant${i}`}>
            <path d={`M ${p.x - 6} ${p.y} L ${p.x + 6} ${p.y} L ${p.x + 4} ${p.y + 12} L ${p.x - 4} ${p.y + 12} Z`} fill="#1a130c" />
            <circle cx={p.x} cy={p.y - 7} r={9} fill="#1d2c1f" />
            <circle cx={p.x - 4} cy={p.y - 11} r={6} fill="#25361f" />
            <circle cx={p.x + 4} cy={p.y - 9} r={6} fill="#22331d" />
          </g>
        );
      })}

      {/* contact shadow */}
      <ellipse cx={(cC.x + cD.x) / 2} cy={cC.y + LEVEL_H * 0.06} rx={95 * (A / 2.5)} ry={22} fill="rgba(0,0,0,0.4)" style={{ mixBlendMode: "multiply" }} />
    </g>
  );
};

function clamp(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function bright(hex: string, b: number): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * b));
  const g = Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * b));
  const bl = Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * b));
  return `rgb(${r}, ${g}, ${bl})`;
}
