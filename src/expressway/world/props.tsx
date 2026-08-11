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

// ---- Detailed night brick storefront ----------------------------------------
export const Storefront: React.FC<{
  name: string;
  w?: number;
  warm?: boolean; // warm inviting light vs cooler competitor
  glow?: number; // 0..1 interior light strength
}> = ({ name, w = 360, warm = true, glow = 1 }) => {
  const h = w * 0.78;
  const lit = warm ? T.storefront : "#B8C8D4";
  const litSoft = warm ? "rgba(233,164,81,OPA)" : "rgba(184,200,212,OPA)";
  const win = (op: number) => litSoft.replace("OPA", String(op));
  const uid = name.replace(/\s/g, "");
  // suggested interior product shelving colours
  const goods = warm
    ? ["#8A5A2A", "#B07A34", "#6B4A24", "#9C6B30", "#7A5228", "#A87038"]
    : ["#3A4A55", "#46586570", "#40505C", "#4C5E6A", "#38464F", "#42525C"];

  return (
    <svg width={w} height={h} viewBox="0 0 360 282" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`brick-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={warm ? "#33251C" : "#28313A"} />
          <stop offset="100%" stopColor={warm ? "#1A120D" : "#161C22"} />
        </linearGradient>
        <radialGradient id={`spill-${uid}`} cx="50%" cy="92%" r="72%">
          <stop offset="0%" stopColor={win(0.55 * glow)} />
          <stop offset="100%" stopColor={win(0)} />
        </radialGradient>
        <clipPath id={`win-${uid}`}>
          {[30, 137, 244].map((wx, i) => (
            <rect key={i} x={wx} y={120} width={86} height={120} rx={3} />
          ))}
        </clipPath>
      </defs>

      {/* pavement light spill */}
      <ellipse cx={180} cy={274} rx={210} ry={36} fill={`url(#spill-${uid})`} />
      <ellipse cx={180} cy={272} rx={150} ry={22} fill={lit} opacity={0.12 * glow} />

      {/* brick facade */}
      <rect x={16} y={34} width={328} height={228} rx={4} fill={`url(#brick-${uid})`} stroke="rgba(90,110,125,0.28)" strokeWidth={1.5} />
      {/* brick mortar courses */}
      <g stroke={warm ? "rgba(70,52,38,0.55)" : "rgba(60,74,84,0.5)"} strokeWidth={1}>
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={18} y1={48 + i * 12} x2={342} y2={48 + i * 12} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} x1={40 + i * 42} y1={36} x2={40 + i * 42} y2={110} />
        ))}
      </g>

      {/* sign band */}
      <rect x={16} y={78} width={328} height={40} fill={warm ? "#0E0A07" : "#0D1318"} stroke="rgba(120,140,155,0.25)" strokeWidth={1} />
      <text
        x={180}
        y={106}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight={700}
        fontSize={22}
        letterSpacing={2}
        fill={warm ? T.storefront : "#D3DEE6"}
        style={{ filter: `drop-shadow(0 0 ${4 * glow}px ${win(0.5 * glow)})` }}
      >
        {name}
      </text>

      {/* gooseneck awning lamps */}
      {[64, 148, 232, 300].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 1.5} y={118} width={3} height={7} fill="#0C0A08" />
          <ellipse cx={cx} cy={126} rx={7} ry={3} fill={lit} opacity={0.85 * glow} />
          <ellipse cx={cx} cy={130} rx={16} ry={9} fill={lit} opacity={0.16 * glow} />
        </g>
      ))}

      {/* three display windows with interior shelves */}
      <g clipPath={`url(#win-${uid})`}>
        <rect x={0} y={116} width={360} height={130} fill={warm ? "#4A3316" : "#20303A"} opacity={0.95 * glow} />
        {/* interior warm wash */}
        <rect x={0} y={116} width={360} height={130} fill={lit} opacity={0.12 * glow} />
        {/* shelving with product blocks */}
        {[0, 1, 2].map((c) =>
          [0, 1, 2, 3].map((r) => (
            <rect
              key={`${c}-${r}`}
              x={34 + c * 107 + (r % 2) * 3}
              y={128 + r * 27}
              width={78}
              height={18}
              fill={goods[(c + r) % goods.length]}
              opacity={0.9 * glow}
            />
          )),
        )}
        {/* shelf lines */}
        <g stroke="rgba(0,0,0,0.5)" strokeWidth={2}>
          {[151, 178, 205, 232].map((y, i) => (
            <line key={i} x1={20} y1={y} x2={340} y2={y} />
          ))}
        </g>
      </g>
      {/* window frames + mullions */}
      {[30, 137, 244].map((wx, i) => (
        <g key={i} fill="none" stroke="rgba(150,170,185,0.35)" strokeWidth={2}>
          <rect x={wx} y={120} width={86} height={120} rx={3} />
          <line x1={wx + 43} y1={120} x2={wx + 43} y2={240} strokeWidth={1.3} />
        </g>
      ))}

      {/* central doorway */}
      <rect x={162} y={168} width={36} height={72} rx={1} fill={warm ? "#5A3E1C" : "#243039"} opacity={glow} />
      <rect x={162} y={168} width={36} height={72} rx={1} fill="none" stroke="rgba(160,180,195,0.4)" strokeWidth={1.4} />
      <rect x={166} y={176} width={28} height={40} fill={win(0.5 * glow)} />

      {/* base / stoop */}
      <rect x={12} y={256} width={336} height={10} fill={warm ? "#0F0B08" : "#0E141A"} />
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
