import React from "react";
import { C, F } from "./theme";
import { clamp } from "./primitives";

/**
 * ONE persistent Crown Hardware storefront, drawn as clean editable line-art.
 * `act` (activation 0..1) blends the whole shop between a dead grey state (0)
 * and a fully-lit gold + cyan state (1). It is never swapped for another SVG —
 * position, scale and act are animated across all five scenes.
 */
export const CrownHardware: React.FC<{
  x: number;
  y: number; // baseline (ground) y
  scale?: number;
  act?: number; // 0 grey/dead .. 1 gold active
  opacity?: number;
  tools?: number; // 0..1 show tool glyphs in the windows (scene 1)
}> = ({ x, y, scale = 1, act = 1, opacity = 1, tools = 0 }) => {
  const a = clamp(act);
  const stroke = a < 0.5 ? C.gray : C.gold;
  const signText = a < 0.5 ? C.gray : C.white;
  const glow = a > 0.6 ? `drop-shadow(0 0 ${10 * a}px rgba(233,178,76,0.45))` : "none";
  const win = a > 0.6 ? `rgba(233,178,76,${0.10 * a})` : "rgba(0,0,0,0)";
  const W = 300;
  const H = 300;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${scale})`, transformOrigin: "bottom center", opacity }}>
      <svg width={W} height={H} viewBox="0 0 300 300" fill="none" style={{ filter: glow, overflow: "visible" }}>
        {/* ground shadow */}
        <ellipse cx={150} cy={296} rx={140 * (0.5 + a * 0.5)} ry={10} fill={a > 0.6 ? "rgba(233,178,76,0.10)" : "rgba(0,0,0,0)"} />
        {/* sign board */}
        <rect x={40} y={20} width={220} height={70} rx={6} stroke={stroke} strokeWidth={3} fill={C.navy2} />
        {/* crown */}
        <path d="M132 40 l6 12 8 -16 8 16 6 -12 v18 h-28 z" fill={a < 0.5 ? "none" : C.gold} stroke={stroke} strokeWidth={2.4} strokeLinejoin="round" transform="translate(0 -4)" />
        <text x={150} y={70} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={26} letterSpacing={1} fill={signText}>
          CROWN
        </text>
        <text x={150} y={86} textAnchor="middle" fontFamily={F.ui} fontWeight={500} fontSize={11} letterSpacing={4} fill={stroke}>
          HARDWARE
        </text>
        {/* awning */}
        <path d="M40 96 h220 l-14 26 h-192 z" stroke={stroke} strokeWidth={3} fill={C.navy2} strokeLinejoin="round" />
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={54 + i * 27} y1={96} x2={48 + i * 27} y2={122} stroke={stroke} strokeWidth={1.6} opacity={0.6} />
        ))}
        {/* body */}
        <rect x={52} y={122} width={196} height={168} stroke={stroke} strokeWidth={3} fill={C.navy2} />
        {/* left window */}
        <rect x={66} y={140} width={52} height={78} stroke={stroke} strokeWidth={2.4} fill={win} />
        {/* door */}
        <rect x={128} y={140} width={44} height={150} stroke={stroke} strokeWidth={2.4} fill={win} />
        <line x1={150} y1={140} x2={150} y2={290} stroke={stroke} strokeWidth={1.4} opacity={0.7} />
        <circle cx={140} cy={215} r={2.6} fill={stroke} />
        <circle cx={160} cy={215} r={2.6} fill={stroke} />
        {/* right window */}
        <rect x={182} y={140} width={52} height={78} stroke={stroke} strokeWidth={2.4} fill={win} />
        {/* tool glyphs (scene 1) */}
        {tools > 0 && (
          <g stroke={stroke} strokeWidth={2} strokeLinecap="round" opacity={tools} fill="none">
            {/* wrench + hammer in left window */}
            <path d="M78 196 l16 -16 m-16 16 a5 5 0 0 1 0 -10 l4 -4 a5 5 0 0 1 10 0 l-4 4" transform="translate(-4 -8) scale(0.9)" />
            <path d="M96 158 l10 10 -6 6 -10 -10 z m10 10 l6 14" transform="translate(2 4) scale(0.8)" />
            {/* bucket in right window */}
            <path d="M196 168 h26 l-4 40 h-18 z m-2 0 a15 6 0 0 1 30 0" transform="translate(-2 6) scale(0.85)" />
          </g>
        )}
        {/* lanterns (active) */}
        <g opacity={a} stroke={C.gold} strokeWidth={2} fill="none">
          <line x1={48} y1={128} x2={48} y2={150} />
          <path d="M42 150 h12 l-2 14 h-8 z" fill={`rgba(233,178,76,${0.25 * a})`} />
          <line x1={252} y1={128} x2={252} y2={150} />
          <path d="M246 150 h12 l-2 14 h-8 z" fill={`rgba(233,178,76,${0.25 * a})`} />
        </g>
        {/* planters (active) */}
        <g opacity={a} stroke={C.gold} strokeWidth={2} fill="none">
          <path d="M60 290 c 0 -20 14 -20 14 0 z" transform="translate(-6 0)" />
          <path d="M226 290 c 0 -20 14 -20 14 0 z" transform="translate(6 0)" />
        </g>
      </svg>
    </div>
  );
};

/**
 * The competitor storefront (scene 4) — a lit gold line-art shop with a pin
 * hovering above. Simpler than Crown; used only where the customer is
 * redirected.
 */
export const Competitor: React.FC<{ x: number; y: number; scale?: number; reveal?: number }> = ({ x, y, scale = 1, reveal = 1 }) => {
  const s = C.gold;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${scale})`, transformOrigin: "bottom center", opacity: clamp(reveal * 1.2) }}>
      <svg width={220} height={200} viewBox="0 0 220 200" fill="none" style={{ filter: "drop-shadow(0 0 12px rgba(233,178,76,0.4))", overflow: "visible" }}>
        <ellipse cx={110} cy={196} rx={96} ry={9} fill="rgba(233,178,76,0.12)" />
        {/* pin above */}
        <g transform="translate(110 -6)">
          <path d="M0 34 C -20 6, -17 -22, 0 -22 C 17 -22, 20 6, 0 34 Z" fill={s} />
          <circle cx={0} cy={-4} r={7} fill={C.navy} />
        </g>
        {/* awning */}
        <path d="M18 60 h184 l-12 24 h-160 z" stroke={s} strokeWidth={3} fill={C.navy2} strokeLinejoin="round" />
        {[...Array(9)].map((_, i) => (
          <path key={i} d={`M${28 + i * 20} 84 a10 10 0 0 0 20 0`} stroke={s} strokeWidth={1.6} fill="none" opacity={0.7} />
        ))}
        {/* body */}
        <rect x={30} y={84} width={160} height={110} stroke={s} strokeWidth={3} fill={C.navy2} />
        <rect x={44} y={104} width={40} height={90} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.10)" />
        <rect x={136} y={104} width={40} height={90} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.10)" />
        <rect x={92} y={110} width={36} height={84} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.08)" />
      </svg>
    </div>
  );
};

/**
 * Vector highway interchange (scene 1, upper-right) — glowing cyan overpass
 * ribbons with dashed lane markers. Pure decorative SVG, drawn-in by `draw`.
 */
export const Interchange: React.FC<{ draw?: number }> = ({ draw = 1 }) => {
  const dash = `${clamp(draw)} ${1 - clamp(draw) + 0.0001}`;
  const ramp = (d: string, w: number, o = 1) => (
    <>
      <path d={d} fill="none" stroke={C.cyan} strokeWidth={w + 16} opacity={0.1 * o} pathLength={1} strokeDasharray={dash} style={{ filter: "blur(8px)" }} strokeLinecap="round" />
      <path d={d} fill="none" stroke={C.cyan} strokeWidth={w} opacity={0.85 * o} pathLength={1} strokeDasharray={dash} strokeLinecap="round" />
      <path d={d} fill="none" stroke={C.cyanHi} strokeWidth={w * 0.28} opacity={0.9 * o} pathLength={1} strokeDasharray={dash} strokeLinecap="round" />
    </>
  );
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {/* main highway sweeping in from the top-right toward the scene */}
      {ramp("M905 70 C 872 250, 792 340, 700 500", 30)}
      {/* exit ramp peeling off to the right */}
      {ramp("M812 300 C 890 322, 958 372, 1010 300", 18, 0.85)}
      {/* a second inbound lane */}
      {ramp("M1010 150 C 940 300, 900 420, 918 560", 20, 0.7)}
      {/* white dashed lane markers on the main */}
      <path d="M905 70 C 872 250, 792 340, 700 500" fill="none" stroke={C.white} strokeWidth={2.2} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.01} ${0.02}`} opacity={0.5 * clamp(draw * 1.4)} />
    </g>
  );
};
