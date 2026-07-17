import React from "react";
import { interpolate } from "remotion";
import { C, FONT_HEAD } from "../theme";
import { clamp01, ezOut, rand } from "../util";

/**
 * Typography that condenses out of the interface: a horizontal clipping
 * mask, blur 14px→0, opacity 0→1, a small positional settle, letter
 * spacing tightening into place, thin cyan/gold fragments during the
 * reveal, and a restrained one-frame highlight at lock-in.
 *
 * Whole lines / phrase groups animate — never individual letters.
 */
export interface MaterializedTextProps {
  frame: number;
  start: number;
  lines: React.ReactNode[];
  lineStagger?: number;
  revealDur?: number;
  fontSize: number;
  lineHeight?: number;
  weight?: number;
  color?: string;
  font?: string;
  letterSpacing?: number; // final value, em
  fragments?: "cyan" | "gold" | "mixed" | "none";
  quiet?: boolean;
  seed?: number;
  style?: React.CSSProperties;
}

const FRAG_COLORS: Record<string, string[]> = {
  cyan: [C.cyan, C.cyan2, C.cyan],
  gold: [C.gold, C.goldWarm, C.gold],
  mixed: [C.cyan, C.gold, C.cyan2],
};

export const MaterializedText: React.FC<MaterializedTextProps> = ({
  frame,
  start,
  lines,
  lineStagger = 5,
  revealDur = 16,
  fontSize,
  lineHeight = 1.14,
  weight = 600,
  color = C.text,
  font = FONT_HEAD,
  letterSpacing = -0.02,
  fragments = "mixed",
  quiet = false,
  seed = 1,
  style,
}) => {
  return (
    <div style={{ ...style }}>
      {lines.map((line, i) => {
        const local = frame - (start + i * lineStagger);
        const p = clamp01(local / revealDur);
        if (p <= 0) {
          return <div key={i} style={{ height: fontSize * lineHeight }} />;
        }
        const e = ezOut(p);
        const wipe = ezOut(clamp01(local / (revealDur * 0.8)));
        const move = quiet ? 12 : 22;
        const blur = (1 - e) * 14;
        // One-frame lock-in highlight.
        const lock = interpolate(local, [revealDur - 2, revealDur, revealDur + 3], [0, 0.35, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ls = letterSpacing + (1 - e) * 0.09;

        const frags: React.ReactNode[] = [];
        if (fragments !== "none" && p > 0.02 && p < 0.95) {
          const palette = FRAG_COLORS[fragments];
          for (let k = 0; k < 3; k++) {
            const s = seed * 17.3 + i * 7.7 + k * 3.1;
            const fo = interpolate(p, [0.05, 0.4, 0.85], [0, 0.85, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (fo <= 0.01) continue;
            frags.push(
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: `${(rand(s) * 82 + 4).toFixed(1)}%`,
                  top: `${(rand(s + 1) * 90).toFixed(1)}%`,
                  width: 12 + rand(s + 2) * 30,
                  height: 2,
                  background: palette[k % palette.length],
                  opacity: fo,
                  transform: `translate3d(${((1 - e) * -34 - k * 6).toFixed(1)}px, ${((rand(s + 3) - 0.5) * 10).toFixed(1)}px, 0)`,
                  boxShadow: `0 0 6px ${palette[k % palette.length]}`,
                }}
              />,
            );
          }
        }

        return (
          <div key={i} style={{ position: "relative" }}>
            <div
              style={{
                fontFamily: font,
                fontWeight: weight,
                fontSize,
                lineHeight,
                color,
                letterSpacing: `${ls.toFixed(3)}em`,
                whiteSpace: "nowrap",
                opacity: e,
                transform: `translate3d(0, ${((1 - e) * move).toFixed(2)}px, 0)`,
                filter: `blur(${blur.toFixed(2)}px) brightness(${(1 + lock).toFixed(3)})`,
                clipPath: `inset(-18% ${((1 - wipe) * 103).toFixed(1)}% -18% -6%)`,
              }}
            >
              {line}
            </div>
            {frags}
          </div>
        );
      })}
    </div>
  );
};
