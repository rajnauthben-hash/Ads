import React from "react";
import { T } from "../theme";

// Place a child at world coordinates with an anchor point.
export const WorldItem: React.FC<{
  x: number;
  y: number;
  anchor?: "center" | "bottom" | "top";
  z?: number;
  children: React.ReactNode;
}> = ({ x, y, anchor = "center", z = 0, children }) => {
  const tf =
    anchor === "bottom"
      ? "translate(-50%,-100%)"
      : anchor === "top"
        ? "translate(-50%,0)"
        : "translate(-50%,-50%)";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: tf, zIndex: z }}>{children}</div>
  );
};

// ---- Stylised night storefront ----------------------------------------------
export const Storefront: React.FC<{
  name: string;
  w?: number;
  warm?: boolean; // warm inviting light vs cool competitor
  glow?: number; // 0..1 interior light strength
}> = ({ name, w = 360, warm = true, glow = 1 }) => {
  const h = w * 0.72;
  const lit = warm ? T.storefront : "#9FB6C4";
  const litSoft = warm ? "rgba(233,164,81,OPA)" : "rgba(159,182,196,OPA)";
  const win = (op: number) => litSoft.replace("OPA", String(op));
  return (
    <svg width={w} height={h} viewBox="0 0 360 260" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`brick-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={warm ? "#2A211C" : "#232B31"} />
          <stop offset="100%" stopColor={warm ? "#181210" : "#161C21"} />
        </linearGradient>
        <radialGradient id={`spill-${name}`} cx="50%" cy="90%" r="70%">
          <stop offset="0%" stopColor={win(0.5 * glow)} />
          <stop offset="100%" stopColor={win(0)} />
        </radialGradient>
      </defs>

      {/* warm light spill on the pavement */}
      <ellipse cx={180} cy={252} rx={205} ry={34} fill={`url(#spill-${name})`} />
      <ellipse cx={180} cy={250} rx={150} ry={22} fill={lit} opacity={0.1 * glow} />

      {/* facade */}
      <rect x={22} y={40} width={316} height={200} rx={5} fill={`url(#brick-${name})`} stroke="rgba(90,110,125,0.25)" strokeWidth={1.5} />

      {/* sign band */}
      <rect x={22} y={40} width={316} height={44} rx={4} fill={warm ? "#120D0A" : "#0F1519"} stroke="rgba(120,140,155,0.2)" strokeWidth={1} />
      <text
        x={180}
        y={70}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={22}
        letterSpacing={1.5}
        fill={warm ? T.storefront : "#C9D6DE"}
      >
        {name}
      </text>

      {/* awning lamps */}
      {[70, 145, 220, 290].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={92} r={4} fill={lit} opacity={0.9 * glow} />
          <circle cx={cx} cy={92} r={11} fill={lit} opacity={0.25 * glow} />
        </g>
      ))}

      {/* three lit display windows */}
      {[36, 138, 240].map((wx, i) => (
        <g key={i}>
          <rect x={wx} y={104} width={84} height={110} rx={3} fill={warm ? "#6B4A24" : "#2A3A45"} opacity={0.95 * glow} />
          <rect x={wx} y={104} width={84} height={110} rx={3} fill="none" stroke="rgba(160,180,195,0.3)" strokeWidth={1.5} />
          {/* interior warm glow */}
          <rect x={wx + 5} y={109} width={74} height={100} rx={2} fill={win(0.6 * glow)} />
          {/* warm bloom */}
          <rect x={wx + 5} y={109} width={74} height={100} rx={2} fill={lit} opacity={0.14 * glow} />
        </g>
      ))}

      {/* doorway */}
      <rect x={158} y={150} width={44} height={90} rx={2} fill={warm ? "#4A3316" : "#26333C"} opacity={glow} />
      <rect x={158} y={150} width={44} height={90} rx={2} fill="none" stroke="rgba(150,170,185,0.3)" strokeWidth={1.2} />
    </svg>
  );
};

// ---- Gold location pin (teardrop) -------------------------------------------
export const LocationPin: React.FC<{ size?: number; color?: string; pulse?: number }> = ({
  size = 46,
  color = T.gold,
  pulse = 0,
}) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 40 54" style={{ display: "block", overflow: "visible" }}>
    <ellipse cx={20} cy={50} rx={9 + pulse * 4} ry={3} fill={color} opacity={0.35} />
    <path
      d="M20 2 C10 2 3 9 3 19 C3 31 20 50 20 50 C20 50 37 31 37 19 C37 9 30 2 20 2 Z"
      fill={color}
      stroke="rgba(0,0,0,0.25)"
      strokeWidth={1}
    />
    <circle cx={20} cy={19} r={6.5} fill="#1A130A" />
  </svg>
);

// ---- Business result label (map chip: "Top Result  4.8 ★") ------------------
export const ResultLabel: React.FC<{ title: string; rating?: string }> = ({ title, rating }) => (
  <div
    style={{
      display: "inline-block",
      padding: "8px 12px",
      background: "rgba(10,17,22,0.9)",
      border: `1.5px solid ${T.gold}`,
      borderRadius: 8,
      fontFamily: "Inter, sans-serif",
      color: "#EAF1F5",
      whiteSpace: "nowrap",
      boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    }}
  >
    <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.1 }}>{title}</div>
    {rating ? (
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>
        {rating} <span style={{ color: T.gold }}>★</span>
      </div>
    ) : null}
  </div>
);

// ---- Customer search marker (glowing person node) ---------------------------
export const CustomerMarker: React.FC<{ size?: number }> = ({ size = 70 }) => (
  <svg width={size} height={size} viewBox="0 0 70 70" style={{ display: "block", overflow: "visible" }}>
    <circle cx={35} cy={35} r={33} fill={T.cyan} opacity={0.12} />
    <circle cx={35} cy={35} r={22} fill={T.cyan} opacity={0.18} />
    <circle cx={35} cy={35} r={14} fill="#08131A" stroke={T.cyan} strokeWidth={2.5} />
    {/* person glyph */}
    <circle cx={35} cy={30} r={4.5} fill={T.cyanHi} />
    <path d="M27 43 C27 36 43 36 43 43 Z" fill={T.cyanHi} />
  </svg>
);
