import React from "react";
import { interpolate } from "remotion";
import { K, KF, KE } from "./theme";

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export function ip(frame: number, a: number, b: number, from: number, to: number, easing = KE.in) {
  return interpolate(frame, [a, b], [from, to], { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
export function kf(frame: number, frames: number[], vals: number[], easing = KE.move) {
  return interpolate(frame, frames, vals, { easing, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export interface Part {
  t: string;
  c?: string;
}

/**
 * A condensed uppercase kinetic line — the core building block. Handles the
 * entrance (directional slide + scale settle + tracking compression + blur→
 * sharp), the exit (slide + fade, so words physically leave), and a horizontal
 * motion-smear (repeated low-opacity echoes trailing the word). Colour is
 * per-segment via `parts`.
 */
export const Cap: React.FC<{
  x: number;
  y: number;
  size: number;
  parts: Part[];
  color?: string;
  weight?: number;
  condense?: number; // scaleX
  track?: number; // letter-spacing em (settled)
  lh?: number;
  p?: number; // entrance 0..1
  dir?: { x: number; y: number };
  scaleFrom?: number;
  ex?: number; // exit 0..1
  exDir?: { x: number; y: number };
  smear?: number; // 0..1 current smear intensity
  smearDir?: number; // +1 right, -1 left
  smearStep?: number;
  glow?: boolean;
  opacity?: number;
  caps?: boolean;
}> = ({
  x,
  y,
  size,
  parts,
  color = K.white,
  weight = 800,
  condense = 0.86,
  track = -0.02,
  lh = 0.9,
  p = 1,
  dir = { x: -28, y: 0 },
  scaleFrom = 1.06,
  ex = 0,
  exDir = { x: -30, y: -40 },
  smear = 0,
  smearDir = 1,
  smearStep = 16,
  glow = false,
  opacity = 1,
  caps = true,
}) => {
  const lp = clamp(p);
  const tx = (1 - lp) * dir.x + ex * exDir.x;
  const ty = (1 - lp) * dir.y + ex * exDir.y;
  const sc = scaleFrom + (1 - scaleFrom) * lp;
  const blur = (1 - lp) * 6;
  const trk = track + (1 - lp) * 0.03;
  const op = opacity * lp * (1 - clamp(ex * 1.15));
  const inner: React.CSSProperties = {
    fontFamily: KF.sans,
    fontWeight: weight,
    fontSize: size,
    lineHeight: lh,
    letterSpacing: `${trk}em`,
    textTransform: caps ? "uppercase" : "none",
    whiteSpace: "nowrap",
    display: "inline-block",
    transform: `scaleX(${condense})`,
    transformOrigin: "left top",
  };
  const smearN = 7;
  const smears = [];
  if (smear > 0.01) {
    for (let i = 1; i <= smearN; i++) {
      const f = i / smearN;
      smears.push(
        <div key={i} style={{ ...inner, position: "absolute", left: 0, top: 0, transform: `${inner.transform} translateX(${smearDir * f * smearStep * smear * smearN}px)`, opacity: (1 - f) * 0.22 * smear, filter: "blur(1px)" }}>
          {parts.map((pt, j) => (
            <span key={j} style={{ color: pt.c ?? color }}>{pt.t}</span>
          ))}
        </div>,
      );
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `translate(${tx}px, ${ty}px) scale(${sc})`, transformOrigin: "left top", filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "relative" }}>
        {smears}
        <div style={{ ...inner, position: "relative", textShadow: glow ? `0 0 26px rgba(234,170,47,0.55), 0 0 60px rgba(234,170,47,0.3)` : undefined }}>
          {parts.map((pt, j) => (
            <span key={j} style={{ color: pt.c ?? color }}>{pt.t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Mixed-case body copy block (sentence case), slide-up + fade reveal, exit slides. */
export const Body: React.FC<{
  x: number;
  y: number;
  size: number;
  lines: (string | Part[])[];
  color?: string;
  weight?: number;
  lh?: number;
  p?: number;
  ex?: number;
  exDir?: { x: number; y: number };
}> = ({ x, y, size, lines, color = K.muted, weight = 400, lh = 1.28, p = 1, ex = 0, exDir = { x: -24, y: -24 } }) => {
  const lp = clamp(p);
  const tx = ex * exDir.x;
  const ty = (1 - lp) * 14 + ex * exDir.y;
  const op = lp * (1 - clamp(ex * 1.15));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `translate(${tx}px, ${ty}px)` }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ fontFamily: KF.body, fontWeight: weight, fontSize: size, lineHeight: lh, color }}>
          {typeof ln === "string" ? ln : ln.map((pt, j) => <span key={j} style={{ color: pt.c ?? color, fontWeight: pt.c ? 600 : weight }}>{pt.t}</span>)}
        </div>
      ))}
    </div>
  );
};

/** Oversized faint ghost word behind the composition — atmosphere, never read. */
export const Ghost: React.FC<{ x: number; y: number; size: number; text: string; opacity?: number; condense?: number; drift?: number; rotate?: number }> = ({
  x,
  y,
  size,
  text,
  opacity = 0.05,
  condense = 0.86,
  drift = 0,
  rotate = 0,
}) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, transform: `translateX(${drift}px) rotate(${rotate}deg) scaleX(${condense})`, transformOrigin: "left top", fontFamily: KF.sans, fontWeight: 900, fontSize: size, lineHeight: 0.86, letterSpacing: "-0.03em", color: K.ghost, textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>
    {text}
  </div>
);

/** OMNIFLOW DIGITAL brand lockup (letter-spaced), centered or left. */
export const Brand: React.FC<{ x?: number; center?: boolean; y: number; size?: number; reveal?: number }> = ({ x = 0, center = true, y, size = 26, reveal = 1 }) => {
  const op = clamp(reveal);
  const ty = (1 - op) * -10;
  const common: React.CSSProperties = { fontFamily: KF.sans, fontWeight: 600, fontSize: size, letterSpacing: "0.18em", textTransform: "uppercase" };
  return (
    <div style={{ position: "absolute", top: y, left: center ? 0 : x, width: center ? 1080 : undefined, textAlign: center ? "center" : "left", opacity: op, transform: `translateY(${ty}px)`, filter: op < 1 ? `blur(${(1 - op) * 4}px)` : undefined }}>
      <span style={{ ...common, color: K.white }}>OMNIFLOW </span>
      <span style={{ ...common, color: K.gold }}>DIGITAL</span>
    </div>
  );
};
