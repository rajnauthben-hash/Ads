import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { COLORS, FONTS } from "./theme";

export type TextSegment = { text: string; color?: string };
export type TextLine = TextSegment[];

type Props = {
  lines: TextLine[];
  // Local frame at which the first line begins materializing.
  startFrame: number;
  // Frames each line takes to lock into place.
  lineDuration?: number;
  // Frame offset between successive lines.
  lineStagger?: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number;
  color?: string;
  // Final letter spacing in em (headlines are slightly negative).
  letterSpacing?: number;
  // Direction of the settling movement.
  drift?: { x: number; y: number };
  // Accent color of the construction fragments around the text.
  fragmentColor?: string;
  textAlign?: "left" | "center";
  seed?: number;
  style?: React.CSSProperties;
};

// Typography that condenses out of the interface: a clipping mask opens,
// blur collapses 14px -> 0, the line drifts ~18px into place, tracking
// tightens, thin cyan/gold fragments flicker around the glyphs and a
// one-frame highlight marks the lock. Whole lines animate as units —
// no per-letter animation, no typewriter, no bounce.
export const MaterializedText: React.FC<Props> = ({
  lines,
  startFrame,
  lineDuration = 16,
  lineStagger = 5,
  fontSize,
  fontFamily = FONTS.headline,
  fontWeight = 560,
  lineHeight = 1.14,
  color = COLORS.text,
  letterSpacing = -0.022,
  drift = { x: 0, y: 18 },
  fragmentColor = COLORS.cyan,
  textAlign = "left",
  seed = 7,
  style,
}) => {
  const frame = useCurrentFrame();

  const fragments = useMemo(() => {
    return lines.map((_, li) =>
      Array.from({ length: 3 }, (__, fi) => ({
        // Thin construction slivers scattered around each line.
        x: noise(seed + li * 13, fi * 3) * 90 - 20,
        y: noise(seed + li * 13, fi * 3 + 1) * 100 - 30,
        w: 14 + noise(seed + li * 13, fi * 3 + 2) * 42,
        gold: noise(seed + li * 17, fi) > 0.72,
      })),
    );
  }, [lines, seed]);

  return (
    <div style={{ textAlign, ...style }}>
      {lines.map((segments, li) => {
        const s = startFrame + li * lineStagger;
        const t = interpolate(frame, [s, s + lineDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 0.75, 0.25, 1),
        });
        if (t <= 0) {
          return (
            <div key={li} style={{ height: fontSize * lineHeight }} />
          );
        }
        const blur = 14 * (1 - t);
        const clip = 108 * (1 - t);
        const dx = drift.x * (1 - t);
        const dy = drift.y * (1 - t);
        const tracking = letterSpacing + 0.07 * (1 - t);
        // One restrained bright frame exactly when the phrase locks.
        const lockFrame = s + lineDuration;
        const lockGlow =
          frame >= lockFrame - 1 && frame <= lockFrame + 1
            ? 1 - Math.abs(frame - lockFrame)
            : 0;
        const fragVis = interpolate(t, [0.1, 0.55, 0.85], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div key={li} style={{ position: "relative" }}>
            {fragVis > 0.01 &&
              fragments[li].map((f, fi) => (
                <div
                  key={fi}
                  style={{
                    position: "absolute",
                    left: `${f.x}%`,
                    top: f.y,
                    width: f.w * fragVis,
                    height: 2,
                    background: f.gold ? COLORS.goldWarm : fragmentColor,
                    opacity: 0.65 * fragVis,
                    transform: `translate3d(${(1 - t) * -30}px, 0, 0)`,
                  }}
                />
              ))}
            <div
              style={{
                fontFamily,
                fontWeight,
                fontSize,
                lineHeight,
                letterSpacing: `${tracking}em`,
                color,
                opacity: t,
                filter: `blur(${blur}px) ${
                  lockGlow > 0
                    ? `brightness(${1 + 0.35 * lockGlow})`
                    : ""
                }`,
                clipPath: `inset(-2% ${clip}% -6% -2%)`,
                transform: `translate3d(${dx}px, ${dy}px, 0)`,
                whiteSpace: "pre-wrap",
              }}
            >
              {segments.map((seg, si) => (
                <span key={si} style={seg.color ? { color: seg.color } : undefined}>
                  {seg.text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
