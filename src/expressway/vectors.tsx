import React from "react";
import { C, F } from "./theme";
import { clamp } from "./primitives";

/** blend two #rrggbb hexes by t (0..1) */
function lerpHex(a: string, b: string, t: number) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(t)));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

/**
 * ONE persistent Crown Hardware storefront — a detailed boutique shopfront in
 * clean line-art: lit marquee sign with crown, scalloped striped awning,
 * pilaster columns, tall display windows, double doors, hanging lanterns and
 * topiaries. `act` (0..1) blends the whole shop grey/dead -> gold active
 * (stroke, sign text, warm window light, lantern + topiary presence, glow).
 * Never swapped — position, scale and act animate across all five scenes.
 */
export const CrownHardware: React.FC<{
  x: number;
  y: number; // ground (baseline) y
  scale?: number;
  act?: number;
  opacity?: number;
  tools?: number; // show tool glyphs in the windows (scene 1)
}> = ({ x, y, scale = 1, act = 1, opacity = 1, tools = 0 }) => {
  const a = clamp(act);
  const stroke = lerpHex(C.gray, C.gold, a); // grey -> gold
  const signText = lerpHex(C.gray, C.white, a);
  const warm = `rgba(233,178,76,${0.12 * a})`;
  const glow = a > 0.55 ? `drop-shadow(0 0 ${14 * a}px rgba(233,178,76,0.4))` : "none";
  const sw = 3; // base stroke width (scaled by viewBox)
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${scale})`, transformOrigin: "bottom center", opacity }}>
      <svg width={320} height={344} viewBox="0 0 320 344" fill="none" style={{ filter: glow, overflow: "visible" }}>
        {/* ground */}
        <ellipse cx={160} cy={340} rx={150 * (0.55 + a * 0.45)} ry={9} fill={a > 0.55 ? "rgba(233,178,76,0.10)" : "rgba(0,0,0,0)"} />
        <line x1={26} y1={340} x2={294} y2={340} stroke={stroke} strokeWidth={2} opacity={0.5} />

        {/* marquee sign */}
        <rect x={40} y={4} width={240} height={10} rx={2} stroke={stroke} strokeWidth={sw} fill={C.navy2} />
        <rect x={34} y={14} width={252} height={84} rx={7} stroke={stroke} strokeWidth={sw} fill={C.navy2} />
        <rect x={44} y={22} width={232} height={68} rx={4} stroke={stroke} strokeWidth={1.4} opacity={0.5} fill="none" />
        {/* crown */}
        <g transform="translate(160 22)">
          <path d="M-22 20 L -16 2 L -8 14 L 0 -4 L 8 14 L 16 2 L 22 20 Z" fill={a < 0.4 ? "none" : C.gold} stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" />
          <circle cx={-16} cy={0} r={2} fill={stroke} />
          <circle cx={0} cy={-6} r={2} fill={stroke} />
          <circle cx={16} cy={0} r={2} fill={stroke} />
        </g>
        <text x={160} y={72} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={34} letterSpacing={1} fill={signText}>
          CROWN
        </text>
        <text x={160} y={90} textAnchor="middle" fontFamily={F.ui} fontWeight={500} fontSize={13} letterSpacing={5.5} fill={stroke}>
          HARDWARE
        </text>

        {/* scalloped striped awning */}
        <path d="M28 102 H292 V116 L286 132 H34 L28 116 Z" stroke={stroke} strokeWidth={sw} fill={C.navy2} strokeLinejoin="round" />
        {[...Array(11)].map((_, i) => (
          <line key={i} x1={40 + i * 24} y1={104} x2={36 + i * 24} y2={130} stroke={stroke} strokeWidth={1.5} opacity={0.55} />
        ))}
        {[...Array(11)].map((_, i) => (
          <path key={`s${i}`} d={`M${34 + i * 23.2} 132 a11.6 8 0 0 0 23.2 0`} stroke={stroke} strokeWidth={1.6} fill="none" opacity={0.7} />
        ))}

        {/* pilaster columns */}
        {[46, 254].map((cx, i) => (
          <g key={i}>
            <rect x={cx} y={134} width={20} height={200} stroke={stroke} strokeWidth={sw} fill={C.navy2} />
            <line x1={cx + 6} y1={140} x2={cx + 6} y2={330} stroke={stroke} strokeWidth={1} opacity={0.4} />
            <line x1={cx + 13} y1={140} x2={cx + 13} y2={330} stroke={stroke} strokeWidth={1} opacity={0.4} />
            <rect x={cx - 3} y={324} width={26} height={12} stroke={stroke} strokeWidth={2} fill={C.navy2} />
          </g>
        ))}

        {/* body between columns */}
        <rect x={66} y={134} width={188} height={200} stroke={stroke} strokeWidth={sw} fill={C.navy2} />

        {/* windows */}
        {[[80, 126], [194, 240]].map(([wx1, wx2], wi) => (
          <g key={wi}>
            <rect x={wx1} y={158} width={wx2 - wx1} height={112} stroke={stroke} strokeWidth={2.2} fill={warm} />
            <line x1={wx1} y1={210} x2={wx2} y2={210} stroke={stroke} strokeWidth={1.2} opacity={0.5} />
            <line x1={(wx1 + wx2) / 2} y1={158} x2={(wx1 + wx2) / 2} y2={270} stroke={stroke} strokeWidth={1.2} opacity={0.5} />
          </g>
        ))}

        {/* double door */}
        <rect x={136} y={158} width={48} height={176} stroke={stroke} strokeWidth={2.4} fill={warm} />
        <line x1={160} y1={158} x2={160} y2={334} stroke={stroke} strokeWidth={1.4} opacity={0.6} />
        <line x1={136} y1={176} x2={184} y2={176} stroke={stroke} strokeWidth={1.4} opacity={0.5} />
        <circle cx={153} cy={250} r={2.6} fill={stroke} />
        <circle cx={167} cy={250} r={2.6} fill={stroke} />

        {/* tools in windows (scene 1) */}
        {tools > 0 && (
          <g stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={tools} fill="none">
            {/* wrench (left window) */}
            <path d="M92 240 L112 214 M92 240 a7 7 0 0 1 0 -13 l5 -5 a7 7 0 0 1 13 3 l-6 6 -6 -2 -2 -6 z" transform="translate(-2 -6) scale(0.9)" />
            {/* hammer (left window) */}
            <path d="M104 196 l12 -12 8 8 -12 12 z M112 200 l-16 20" transform="translate(2 2) scale(0.72)" />
            {/* bucket (right window) */}
            <g transform="translate(198 196) scale(0.9)">
              <path d="M4 8 h30 l-4 34 h-22 z" />
              <path d="M2 8 a16 6 0 0 1 34 0" />
            </g>
          </g>
        )}

        {/* hanging lanterns (act-gated) */}
        <g opacity={a} stroke={C.gold} strokeWidth={2} fill="none">
          {[52, 268].map((lx, i) => (
            <g key={i}>
              <path d={`M${lx} 132 q -6 8 0 16`} />
              <path d={`M${lx - 7} 148 h14 l-3 16 h-8 z`} fill={`rgba(233,178,76,${0.28 * a})`} />
              <line x1={lx} y1={164} x2={lx} y2={168} />
            </g>
          ))}
        </g>

        {/* topiaries in pots (act-gated) */}
        <g opacity={a} stroke={C.gold} strokeWidth={2} fill="none">
          {[112, 208].map((tx, i) => (
            <g key={i}>
              <path d={`M${tx - 9} 334 l3 -20 h12 l3 20 z`} fill={`rgba(233,178,76,${0.12 * a})`} />
              <circle cx={tx} cy={304} r={9} />
              <circle cx={tx} cy={292} r={7} />
            </g>
          ))}
        </g>

        {/* cyan crown-of-signal glow when fully active (route lands here) */}
        {a > 0.85 && <rect x={34} y={14} width={252} height={84} rx={7} stroke={C.cyan} strokeWidth={2} opacity={(a - 0.85) * 5} fill="none" style={{ filter: "blur(3px)" }} />}
      </svg>
    </div>
  );
};

/**
 * Competitor storefront (scene 4) — a lit gold line-art shop with a scalloped
 * awning and a pin hovering above.
 */
export const Competitor: React.FC<{ x: number; y: number; scale?: number; reveal?: number }> = ({ x, y, scale = 1, reveal = 1 }) => {
  const s = C.gold;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${scale})`, transformOrigin: "bottom center", opacity: clamp(reveal * 1.2) }}>
      <svg width={230} height={210} viewBox="0 0 230 210" fill="none" style={{ filter: "drop-shadow(0 0 12px rgba(233,178,76,0.4))", overflow: "visible" }}>
        <ellipse cx={115} cy={205} rx={100} ry={9} fill="rgba(233,178,76,0.12)" />
        <g transform="translate(115 -2)">
          <path d="M0 34 C -20 6, -17 -22, 0 -22 C 17 -22, 20 6, 0 34 Z" fill={s} />
          <circle cx={0} cy={-4} r={7} fill={C.navy} />
        </g>
        {/* awning scalloped */}
        <path d="M16 62 H214 V76 L208 90 H22 L16 76 Z" stroke={s} strokeWidth={3} fill={C.navy2} strokeLinejoin="round" />
        {[...Array(9)].map((_, i) => (
          <path key={i} d={`M${22 + i * 21} 90 a10.5 7 0 0 0 21 0`} stroke={s} strokeWidth={1.6} fill="none" opacity={0.7} />
        ))}
        <rect x={28} y={90} width={174} height={112} stroke={s} strokeWidth={3} fill={C.navy2} />
        <rect x={42} y={108} width={42} height={94} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.10)" />
        <rect x={146} y={108} width={42} height={94} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.10)" />
        <rect x={96} y={112} width={38} height={90} stroke={s} strokeWidth={2.2} fill="rgba(233,178,76,0.08)" />
        <circle cx={103} cy={160} r={2.4} fill={s} />
        <circle cx={127} cy={160} r={2.4} fill={s} />
      </svg>
    </div>
  );
};

/**
 * Vector freeway interchange (scene 1, upper-right) — a clean glowing cyan
 * cloverleaf: a trunk sweeping in from the top that forks into two carriageways
 * heading down toward the store, a loop ramp, an exit to the top-right, dashed
 * lane markers and up-arrows. Drawn-in by `draw`.
 */
export const Interchange: React.FC<{ draw?: number }> = ({ draw = 1 }) => {
  const d = clamp(draw);
  const dash = `${d} ${1 - d + 0.0001}`;
  const ramp = (path: string, w: number, o = 1) => (
    <>
      <path d={path} fill="none" stroke={C.cyan} strokeWidth={w + 20} opacity={0.09 * o} pathLength={1} strokeDasharray={dash} style={{ filter: "blur(10px)" }} strokeLinecap="round" />
      <path d={path} fill="none" stroke={C.cyan} strokeWidth={w} opacity={0.5 * o} pathLength={1} strokeDasharray={dash} strokeLinecap="round" />
      <path d={path} fill="none" stroke={C.cyanHi} strokeWidth={w * 0.34} opacity={0.9 * o} pathLength={1} strokeDasharray={dash} strokeLinecap="round" />
    </>
  );
  const laneDash = (path: string) => (
    <path d={path} fill="none" stroke={C.white} strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.012} ${0.02}`} opacity={0.55 * clamp(d * 1.4)} />
  );
  const TRUNK = "M905 52 C 858 150, 812 240, 812 330";
  const FORK_L = "M812 330 C 808 420, 812 490, 832 556";
  const FORK_R = "M812 330 C 852 398, 884 466, 892 556";
  const LOOP = "M812 246 C 694 258, 690 384, 812 392 C 918 399, 952 320, 900 272";
  const EXIT = "M900 272 C 958 232, 1006 198, 1052 172";
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {ramp(LOOP, 15, 0.85)}
      {ramp(EXIT, 22, 0.85)}
      {ramp(TRUNK, 28)}
      {ramp(FORK_L, 24)}
      {ramp(FORK_R, 24)}
      {laneDash(TRUNK)}
      {laneDash(FORK_L)}
      {laneDash(FORK_R)}
      {/* up-arrows on the two carriageways heading to the store */}
      {d > 0.7 &&
        [["824 512", "832 556"], ["888 512", "892 556"]].map(([a1], i) => (
          <path key={i} d={`M ${Number(a1.split(" ")[0]) - 12} ${Number(a1.split(" ")[1]) + 16} L ${a1.split(" ")[0]} ${a1.split(" ")[1]} L ${Number(a1.split(" ")[0]) + 12} ${Number(a1.split(" ")[1]) + 16}`} fill="none" stroke={C.cyanHi} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" opacity={clamp((d - 0.7) * 3)} />
        ))}
    </g>
  );
};
