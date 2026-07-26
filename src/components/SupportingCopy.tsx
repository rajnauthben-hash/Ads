import React, { CSSProperties } from "react";
import { PhraseReveal } from "./PhraseReveal";
import { body } from "../styles/typography";
import { COLORS } from "../styles/tokens";

/**
 * Readable explanation copy (Manrope). Enters as one grouped paragraph using a
 * slightly gentler variant of the text-in formula. Lines are explicit so the
 * approved line breaks are preserved exactly.
 */
export const SupportingCopy: React.FC<{
  x: number;
  y: number;
  width: number;
  lines: string[];
  inStart: number;
  inEnd: number;
  outStart?: number;
  outEnd?: number;
  size?: number;
  color?: string;
  zIndex?: number;
  style?: CSSProperties;
}> = ({ x, y, width, lines, inStart, inEnd, outStart, outEnd, size = 30, color = COLORS.grey, zIndex = 65, style }) => {
  return (
    <div style={{ position: "absolute", left: x, top: y, width, zIndex }}>
      <PhraseReveal
        inStart={inStart}
        inEnd={inEnd}
        outStart={outStart}
        outEnd={outEnd}
        style={{ ...body(size), color, width, ...style }}
      >
        {lines.map((ln, i) => (
          <div key={i}>{ln}</div>
        ))}
      </PhraseReveal>
    </div>
  );
};
