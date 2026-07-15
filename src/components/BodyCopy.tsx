import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS, TYPE } from "../config/design";
import { FONT_BODY } from "../config/fonts";
import { LINE_STAGGER } from "../config/timing";
import type { BodyBlock } from "../config/timing";

const segmentColor = (color: "gold" | "cyan" | undefined): string =>
  color === "gold" ? COLORS.gold : color === "cyan" ? COLORS.cyan : COLORS.textSecondary;

const REVEAL_DURATION = 22;

export const BodyCopy: React.FC<{
  frame: number;
  start: number;
  block: BodyBlock;
}> = ({ frame, start, block }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y,
        width: block.width,
        fontFamily: FONT_BODY,
        fontWeight: TYPE.bodyWeight,
        fontSize: block.fontSize ?? 31,
        lineHeight: TYPE.bodyLineHeight,
        color: COLORS.textSecondary,
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
        const translateY = interpolate(progress, [0, 1], [16, 0]);
        const opacity = interpolate(local, [0, REVEAL_DURATION * 0.6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const clipBottom = interpolate(progress, [0, 1], [100, 0]);

        return (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              style={{
                translate: `0px ${translateY}px`,
                opacity,
                clipPath: `inset(0 0 ${clipBottom}% 0)`,
              }}
            >
              {segments.map((seg, j) => (
                <span key={j} style={{ color: segmentColor(seg.color) }}>
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
