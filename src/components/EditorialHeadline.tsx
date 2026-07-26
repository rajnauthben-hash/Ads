import React, { CSSProperties } from "react";
import { PhraseReveal } from "./PhraseReveal";
import { headline } from "../styles/typography";
import { COLORS } from "../styles/tokens";

/**
 * Editorial headline made of one or more phrase groups. Each group is a block
 * of lines with its own colour and entrance timing. Positioned absolutely by
 * the caller within the safe zone.
 */
export interface HeadlineGroup {
  lines: string[];
  color?: string;
  inStart: number;
  inEnd: number;
  outStart?: number;
  outEnd?: number;
  sliceDir?: 1 | -1;
  sliceAmt?: number;
}

export const EditorialHeadline: React.FC<{
  x: number;
  y: number;
  width: number;
  size?: number;
  groups: HeadlineGroup[];
  gap?: number;
  zIndex?: number;
}> = ({ x, y, width, size = 60, groups, gap = 10, zIndex = 65 }) => {
  const style: CSSProperties = { ...headline(size), width };
  return (
    <div style={{ position: "absolute", left: x, top: y, width, zIndex }}>
      {groups.map((g, i) => (
        <PhraseReveal
          key={i}
          inStart={g.inStart}
          inEnd={g.inEnd}
          outStart={g.outStart}
          outEnd={g.outEnd}
          sliceDir={g.sliceDir}
          sliceAmt={g.sliceAmt}
          style={{ ...style, color: g.color ?? COLORS.white, marginBottom: gap }}
        >
          {g.lines.map((ln, j) => (
            <div key={j} style={{ whiteSpace: "nowrap" }}>
              {ln}
            </div>
          ))}
        </PhraseReveal>
      ))}
    </div>
  );
};
