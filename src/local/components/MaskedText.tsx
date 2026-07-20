import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../theme";

export type TextSeg = { text: string; color?: string };
export type Line = TextSeg[];

type Props = {
  lines: Line[];
  start: number;
  // Frames per line reveal + stagger between lines.
  dur?: number;
  stagger?: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number;
  color?: string;
  letterSpacing?: number;
  // Direction the line travels in from (px).
  from?: { x: number; y: number };
  // Horizontal condense (scaleX) for display headlines.
  condense?: number;
  // When set, the block dissolves into 4 slices starting here.
  exitStart?: number;
  exitDur?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
};

const ENTER = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT = Easing.bezier(0.5, 0, 0.85, 0.4);

// Directional masked reveal: each phrase group begins 14–24px away, blurred,
// with slightly wider tracking, then moves into place and sharpens. On exit
// the block splits into horizontal slices that drift apart and blur — never
// a plain fade. Whole lines animate as units (no per-letter animation).
export const MaskedText: React.FC<Props> = ({
  lines,
  start,
  dur = 16,
  stagger = 6,
  fontSize,
  fontFamily = FONTS.head,
  fontWeight = 850,
  lineHeight = 0.96,
  color = "#F4F6F8",
  letterSpacing = -0.01,
  from = { x: 0, y: 20 },
  condense = 1,
  exitStart,
  exitDur = 12,
  align = "left",
  style,
}) => {
  const frame = useCurrentFrame();

  const exitP =
    exitStart !== undefined
      ? interpolate(frame, [exitStart, exitStart + exitDur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EXIT,
        })
      : 0;

  // Exit: 4 horizontal masked slices drift in alternating directions.
  if (exitP > 0) {
    if (exitP >= 1) {
      return null;
    }
    const slices = 4;
    return (
      <div style={{ position: "relative", textAlign: align, ...style }}>
        {Array.from({ length: slices }, (_, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const top = (i / slices) * 100;
          const bottom = 100 - ((i + 1) / slices) * 100;
          return (
            <div
              key={i}
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                clipPath: `inset(${top}% 0% ${bottom}% 0%)`,
                transform: `translate3d(${dir * (10 + i * 3) * exitP}px, ${-4 * exitP}px, 0)`,
                opacity: 1 - exitP,
                filter: `blur(${exitP * 3}px)`,
              }}
            >
              <TextBody lines={lines} fontSize={fontSize} fontFamily={fontFamily} fontWeight={fontWeight} lineHeight={lineHeight} color={color} letterSpacing={letterSpacing} condense={condense} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ textAlign: align, ...style }}>
      {lines.map((segs, li) => {
        const s = start + li * stagger;
        const t = interpolate(frame, [s, s + dur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ENTER,
        });
        if (t <= 0) {
          return <div key={li} style={{ height: fontSize * lineHeight }} />;
        }
        const blur = 12 * (1 - t);
        const dx = from.x * (1 - t);
        const dy = from.y * (1 - t);
        // Right inset drives the wipe. At rest it settles NEGATIVE so nowrap
        // text overflowing the container box is never clipped; during the
        // reveal it rises past 100% to fully hide the line.
        const clip = 112 * (1 - t) - 10;
        const tracking = letterSpacing + 0.05 * (1 - t);
        return (
          <div
            key={li}
            style={{
              fontFamily,
              fontWeight,
              fontSize,
              lineHeight,
              color,
              letterSpacing: `${tracking}em`,
              opacity: Math.min(1, t * 1.4),
              filter: `blur(${blur}px)`,
              clipPath: `inset(-8% ${clip}% -14% -4%)`,
              transform: `translate3d(${dx}px, ${dy}px, 0) scaleX(${condense})`,
              transformOrigin: "left top",
              whiteSpace: "nowrap",
              // Box hugs the text so the clip wipe is relative to the actual
              // glyph width, never cutting settled nowrap lines.
              width: "max-content",
            }}
          >
            {segs.map((seg, si) => (
              <span key={si} style={seg.color ? { color: seg.color } : undefined}>
                {seg.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const TextBody: React.FC<{
  lines: Line[];
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  lineHeight: number;
  color: string;
  letterSpacing: number;
  condense: number;
}> = ({ lines, fontSize, fontFamily, fontWeight, lineHeight, color, letterSpacing, condense }) => (
  <div style={{ fontFamily, fontWeight, fontSize, lineHeight, color, letterSpacing: `${letterSpacing}em`, whiteSpace: "nowrap", transform: `scaleX(${condense})`, transformOrigin: "left top" }}>
    {lines.map((segs, li) => (
      <div key={li}>
        {segs.map((seg, si) => (
          <span key={si} style={seg.color ? { color: seg.color } : undefined}>
            {seg.text}
          </span>
        ))}
      </div>
    ))}
  </div>
);
