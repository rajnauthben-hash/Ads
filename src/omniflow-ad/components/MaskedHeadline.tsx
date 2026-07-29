import React from "react";
import { useCurrentFrame } from "remotion";
import { prog, premiumEase } from "../styles/geometry";
import { FONTS } from "../styles/typography";
import { COLORS } from "../styles/tokens";

interface Line {
  text: string;
  start: number; // local frame reveal start
  end: number;
}

// Editorial headline with per-line rectangular clip mask, slide, deblur and
// tracking settle. Reveals by line, never per-letter.
export const MaskedHeadline: React.FC<{
  lines: Line[];
  size: number;
  weight?: number;
  color?: string;
  lineHeight?: number;
  slide?: number; // starting downward translation (px)
  letterSpacing?: string;
  scaleX?: number; // horizontal condense to mimic a condensed grotesk
  style?: React.CSSProperties;
}> = ({
  lines,
  size,
  weight = 800,
  color = COLORS.headline,
  lineHeight = 0.98,
  slide = 18,
  letterSpacing = "-0.025em",
  scaleX = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {lines.map((line, i) => {
        const p = prog(frame, line.start, line.end, premiumEase);
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              paddingBottom: "0.06em",
              // clip mask grows from left as line reveals
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.headline,
                fontWeight: weight,
                fontSize: size,
                color,
                lineHeight,
                letterSpacing,
                whiteSpace: "nowrap",
                transformOrigin: "left center",
                transform: `translateY(${(1 - p) * slide}px) scaleX(${scaleX})`,
                filter: `blur(${(1 - p) * 8}px)`,
                opacity: p,
              }}
            >
              {line.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
