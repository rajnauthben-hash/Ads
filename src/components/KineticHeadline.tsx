import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS, TYPE } from "../config/design";
import { FONT_HEADLINE } from "../config/fonts";
import { LINE_STAGGER } from "../config/timing";
import type { HeadlineBlock } from "../config/timing";
import { blendHex } from "./colorBlend";

const segmentColor = (color: "gold" | "cyan" | undefined): string =>
  color === "gold" ? COLORS.gold : color === "cyan" ? COLORS.cyan : COLORS.textPrimary;

const REVEAL_DURATION = 26;

export const KineticHeadline: React.FC<{
  frame: number;
  start: number;
  block: HeadlineBlock;
}> = ({ frame, start, block }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y,
        width: block.width,
        fontFamily: FONT_HEADLINE,
        fontWeight: TYPE.headlineWeight,
        fontSize: block.fontSize,
        lineHeight: TYPE.headlineLineHeight,
        letterSpacing: TYPE.headlineLetterSpacing,
        color: COLORS.textPrimary,
      }}
    >
      {block.lines.map((segments, i) => {
        const lineStart = start + i * LINE_STAGGER;
        const local = frame - lineStart;
        const progress = interpolate(local, [0, REVEAL_DURATION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const translateY = interpolate(progress, [0, 1], [24, 0]);
        const opacity = interpolate(local, [0, REVEAL_DURATION * 0.55], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const clipBottom = interpolate(progress, [0, 1], [100, 0]);
        const tracking = interpolate(progress, [0, 1], [0.01, 0]);

        return (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              style={{
                translate: `0px ${translateY}px`,
                opacity,
                clipPath: `inset(0 0 ${clipBottom}% 0)`,
                letterSpacing: `calc(${TYPE.headlineLetterSpacing} + ${tracking}em)`,
              }}
            >
              {segments.map((seg, j) => {
                let color = segmentColor(seg.color);
                if (seg.color && seg.colorAt !== undefined) {
                  const t = interpolate(local, [seg.colorAt, seg.colorAt + 16], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  });
                  color = blendHex(COLORS.textPrimary, segmentColor(seg.color), t);
                }
                return (
                  <span key={j} style={{ color }}>
                    {seg.text}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
