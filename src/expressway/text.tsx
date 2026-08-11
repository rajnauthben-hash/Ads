import React from "react";
import { C, F } from "./theme";
import { clamp } from "./primitives";

export interface Part {
  t: string;
  color?: string;
}
export interface Line {
  parts: Part[];
}

/**
 * Editorial headline group. Each line reveals with a bottom-up clip mask +
 * small upward drift + blur-to-sharp (never letter-by-letter). `p` is overall
 * entrance 0..1 (staggered internally per line); `ex` is exit 0..1 which slides
 * the block in `dir` and fades — so headlines physically leave, never dissolve
 * in place.
 */
export const Headline: React.FC<{
  x: number;
  y: number;
  lines: Line[];
  size: number;
  font?: string;
  weight?: number;
  lh?: number;
  p?: number;
  ex?: number;
  dir?: { x: number; y: number };
  italic?: boolean;
  tracking?: number;
}> = ({ x, y, lines, size, font = F.sans, weight = 800, lh = 0.98, p = 1, ex = 0, dir = { x: -30, y: -50 }, italic = false, tracking = -0.5 }) => {
  const exTy = ex * dir.y;
  const exTx = ex * dir.x;
  const exOp = 1 - clamp(ex * 1.1);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${exTx}px, ${exTy}px)`, opacity: exOp }}>
      {lines.map((ln, i) => {
        const lp = clamp((p - i * 0.08) / 0.5);
        const clip = 100 - lp * 100;
        const ty = (1 - lp) * 20;
        const blur = (1 - lp) * 7;
        return (
          <div
            key={i}
            style={{
              fontFamily: font,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              fontSize: size,
              lineHeight: lh,
              letterSpacing: tracking,
              color: C.white,
              clipPath: `inset(0 0 ${clip}% 0)`,
              transform: `translateY(${ty}px)`,
              filter: `blur(${blur}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {ln.parts.map((pt, j) => (
              <span key={j} style={{ color: pt.color ?? C.white }}>
                {pt.t}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Support/body copy block — slide-up mask reveal, exit slides + fades. */
export const Copy: React.FC<{
  x: number;
  y: number;
  lines: (string | Part[])[];
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  lh?: number;
  p?: number;
  ex?: number;
  dir?: { x: number; y: number };
  width?: number;
}> = ({ x, y, lines, size, color = C.muted, font = F.body, weight = 400, lh = 1.32, p = 1, ex = 0, dir = { x: -30, y: -30 }, width }) => {
  const exTy = ex * dir.y;
  const exTx = ex * dir.x;
  const op = (1 - clamp(ex * 1.15)) * clamp(p * 1.3);
  const ty = (1 - clamp(p)) * 16;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, transform: `translate(${exTx}px, ${exTy + ty}px)`, opacity: op }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: lh, color }}>
          {typeof ln === "string" ? ln : ln.map((pt, j) => <span key={j} style={{ color: pt.color ?? color, fontWeight: pt.color ? 700 : weight }}>{pt.t}</span>)}
        </div>
      ))}
    </div>
  );
};
