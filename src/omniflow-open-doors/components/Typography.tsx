import React from "react";
import { COLORS, FONTS, TYPO } from "../constants";
import { revealIn } from "../anim";

/**
 * EditorialHeadline — uppercase Inter-Tight heavy headline, revealed as phrase
 * groups (never per-word bouncing). Each line rises with blur-to-sharp.
 */
export const EditorialHeadline: React.FC<{
  lines: string[];
  frame: number;
  start: number;
  /** frames between successive line reveals */
  stagger?: number;
  fontSize: number;
  color?: string;
  width?: number;
  /** horizontal condense factor toward the reference's heavy-condensed face */
  condense?: number;
}> = ({ lines, frame, start, stagger = 6, fontSize, color = COLORS.white, width, condense = 0.92 }) => {
  return (
    <div style={{ width }}>
      {lines.map((line, i) => {
        const r = revealIn(frame, start + i * stagger);
        return (
          <div
            key={i}
            style={{
              ...r,
              fontFamily: FONTS.headline,
              fontWeight: TYPO.headlineWeight,
              fontSize,
              lineHeight: TYPO.lineHeightHeadline,
              letterSpacing: TYPO.trackingHeadline,
              textTransform: "uppercase",
              color,
              // Condense toward the reference's heavy-condensed headline face.
              transform: `${r.transform} scaleX(${condense})`,
              transformOrigin: "left center",
              whiteSpace: "pre",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/**
 * SupportingCopy — a block of Geist support lines revealed together as one
 * phrase group with a vertical clip mask.
 */
export const SupportingCopy: React.FC<{
  lines: string[];
  frame: number;
  start: number;
  fontSize: number;
  color?: string;
  width?: number;
  weight?: number;
  lineHeight?: number;
}> = ({
  lines,
  frame,
  start,
  fontSize,
  color = COLORS.mutedText,
  width,
  weight = TYPO.supportWeight,
  lineHeight = TYPO.lineHeightSupport,
}) => {
  const r = revealIn(frame, start);
  return (
    <div
      style={{
        ...r,
        width,
        fontFamily: FONTS.support,
        fontWeight: weight,
        fontSize,
        lineHeight,
        letterSpacing: TYPO.trackingSupport,
        color,
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {line}
        </div>
      ))}
    </div>
  );
};

/** Two-line gold landing statement. */
export const GoldLanding: React.FC<{
  lines: string[];
  frame: number;
  start: number;
  fontSize: number;
  width?: number;
}> = ({ lines, frame, start, fontSize, width }) => {
  const r = revealIn(frame, start);
  return (
    <div
      style={{
        ...r,
        width,
        fontFamily: FONTS.support,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.24,
        letterSpacing: TYPO.trackingSupport,
        color: COLORS.warmGold,
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {line}
        </div>
      ))}
    </div>
  );
};
