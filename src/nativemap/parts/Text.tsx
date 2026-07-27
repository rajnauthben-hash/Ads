import React from "react";
import { T, FONT_HEAD, FONT_BODY, HEAD_W, BODY_W } from "../tokens";
import { headIn, bodyIn, clamp01 } from "./motion";

type Seg = { t: string; c?: string };

export const EditorialHeadline: React.FC<{
  x: number; y: number; width: number; size: number; lineHeight: number;
  lines: Seg[][]; lineP: number[];
}> = ({ x, y, width, size, lineHeight, lines, lineP }) => (
  <div style={{ position: "absolute", left: x, top: y, width, fontFamily: FONT_HEAD, fontWeight: HEAD_W, fontSize: size, lineHeight: `${lineHeight}px`, letterSpacing: "-0.01em", color: T.white }}>
    {lines.map((line, i) => (
      <div key={i} style={{ ...headIn(lineP[i] ?? 0) }}>
        {line.map((s, j) => <span key={j} style={{ color: s.c ?? T.white }}>{s.t}</span>)}
      </div>
    ))}
  </div>
);

export const SupportingCopy: React.FC<{
  x: number; y: number; width: number; size: number; lineHeight: number;
  color?: string; weight?: number; lines: string[]; lineP: number[];
}> = ({ x, y, width, size, lineHeight, color = T.gray, weight = BODY_W, lines, lineP }) => (
  <div style={{ position: "absolute", left: x, top: y, width, fontFamily: FONT_BODY, fontWeight: weight, fontSize: size, lineHeight: `${lineHeight}px`, color }}>
    {lines.map((l, i) => (
      <div key={i} style={{ ...bodyIn(lineP[i] ?? 0) }}>{l}</div>
    ))}
  </div>
);

/** Map pill label (Scene 3) — rounded panel + border draw + live text. */
export const PillLabel: React.FC<{
  x: number; y: number; width: number; height: number; text: string;
  borderP: number; textP: number; person?: boolean; size?: number;
}> = ({ x, y, width, height, text, borderP, textP, person = false, size = 27 }) => (
  <div style={{ position: "absolute", left: x, top: y, width, height }}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(9,17,26,0.9)", opacity: clamp01(borderP), borderRadius: 10 }} />
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <rect x={1} y={1} width={width - 2} height={height - 2} rx={10} fill="none" stroke={T.gray} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(borderP)} opacity={0.7} />
    </svg>
    <div style={{ position: "absolute", left: 18, top: 0, height, display: "flex", alignItems: "center", gap: 12, ...bodyIn(textP, 6) }}>
      {person && (
        <svg width={26} height={26} viewBox="0 0 26 26"><circle cx={13} cy={9} r={5} fill={T.gold} /><path d="M4 24 C4 15 22 15 22 24 Z" fill={T.gold} /></svg>
      )}
      <span style={{ fontFamily: FONT_BODY, fontWeight: BODY_W, fontSize: size, color: T.white, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  </div>
);

export const MotionCallout: React.FC<{
  x: number; y: number; width: number; height: number; size: number; lineHeight: number;
  borderP: number; bgP: number; lines: Seg[]; lineP: number[];
}> = ({ x, y, width, height, size, lineHeight, borderP, bgP, lines, lineP }) => {
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(9,17,26,0.92)", opacity: bgP, borderRadius: 6 }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={1} y={1} width={width - 2} height={height - 2} rx={6} fill="none" stroke={T.cyan} strokeWidth={1.6}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(borderP)} opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", left: 28, top: 24, right: 20, fontFamily: FONT_BODY, fontWeight: BODY_W, fontSize: size, lineHeight: `${lineHeight}px` }}>
        {lines.map((s, i) => (
          <div key={i} style={{ color: s.c ?? T.white, ...bodyIn(lineP[i] ?? 0, 8) }}>{s.t}</div>
        ))}
      </div>
    </div>
  );
};
