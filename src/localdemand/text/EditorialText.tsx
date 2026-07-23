import React from "react";
import { FONT, COLOR } from "../theme";
import { clamp01, envelope } from "./anim";

export type Seg = { t: string; c?: string };
export type Line = Seg[];

/** Phrase-group reveal: lines sharing a group index animate together. */
function groupProgress(p: number, group: number, groupCount: number): number {
  const step = 0.16;
  const win = 0.5;
  const start = group * step;
  return clamp01((p * (1 + step * (groupCount - 1)) - start) / win);
}

export const EditorialHeadline: React.FC<{
  lines: Line[];
  groups: number[]; // group index per line
  into: number;
  out?: number;
  size?: number;
  lineHeight?: number;
  weight?: number;
}> = ({ lines, groups, into, out = 0, size = 92, lineHeight = 1.02, weight = 700 }) => {
  const groupCount = Math.max(...groups) + 1;
  return (
    <div
      style={{
        fontFamily: FONT.head,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: "-0.02em",
        color: COLOR.white,
      }}
    >
      {lines.map((line, i) => {
        const gp = groupProgress(into, groups[i], groupCount);
        return (
          <div key={i} style={{ overflow: "visible", ...envelope(gp, out, 16) }}>
            {line.map((seg, j) => (
              <span key={j} style={{ color: seg.c ?? COLOR.white }}>
                {seg.t}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const SupportingCopy: React.FC<{
  lines: Line[];
  into: number;
  out?: number;
  size?: number;
  lineHeight?: number;
  color?: string;
  weight?: number;
}> = ({ lines, into, out = 0, size = 30, lineHeight = 1.42, color = COLOR.gray, weight = 400 }) => {
  const groupCount = lines.length;
  return (
    <div style={{ fontFamily: FONT.body, fontSize: size, fontWeight: weight, lineHeight, color }}>
      {lines.map((line, i) => {
        // group every ~2 lines for phrase-group feel
        const gp = groupProgress(into, Math.floor(i / 2), Math.ceil(groupCount / 2));
        return (
          <div key={i} style={envelope(gp, out, 12)}>
            {line.map((seg, j) => (
              <span key={j} style={{ color: seg.c ?? color }}>
                {seg.t}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
