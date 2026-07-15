import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_MONO } from "../config/fonts";

export const RankingInterface: React.FC<{
  frame: number;
  start: number;
  bracketY: number;
  bracketLeft: number;
  bracketRight: number;
  tickXs: number[];
  tickBottom: number;
  fadeXs: number[];
  fadeBottom: number;
}> = ({ frame, start, bracketY, bracketLeft, bracketRight, tickXs, tickBottom, fadeXs, fadeBottom }) => {
  const draw = interpolate(frame - start, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelOpacity = interpolate(frame - start, [8, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOpacity = interpolate(frame - (start + 30), [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bracketWidth = bracketRight - bracketLeft;
  const bracketLen = bracketWidth + 2 * (bracketY - tickBottom) * -1;

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1} height={1}>
        <path
          d={`M ${bracketLeft} ${tickBottom} L ${bracketLeft} ${bracketY} L ${bracketRight} ${bracketY} L ${bracketRight} ${tickBottom}`}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.5}
          opacity={0.75}
          strokeDasharray={Math.max(bracketLen, 10)}
          strokeDashoffset={Math.max(bracketLen, 10) * (1 - draw)}
        />
        {tickXs.map((tx, i) => (
          <line
            key={i}
            x1={tx}
            y1={bracketY}
            x2={tx}
            y2={tickBottom}
            stroke={COLORS.gold}
            strokeWidth={1.5}
            opacity={0.5 * draw}
          />
        ))}
        {fadeXs.map((fx, i) => (
          <line
            key={i}
            x1={fx}
            y1={bracketY}
            x2={fx}
            y2={fadeBottom}
            stroke="rgba(174,181,188,0.4)"
            strokeWidth={1.5}
            strokeDasharray="3 7"
            opacity={fadeOpacity}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: (bracketLeft + bracketRight) / 2,
          top: bracketY - 46,
          transform: "translateX(-50%)",
          fontFamily: FONT_MONO,
          fontSize: 22,
          letterSpacing: "0.22em",
          color: COLORS.gold,
          opacity: labelOpacity,
          whiteSpace: "nowrap",
        }}
      >
        RANKING
      </div>
      {fadeXs.map((fx, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: fx,
            top: bracketY - 20,
            transform: "translateX(-50%)",
            fontFamily: FONT_MONO,
            fontSize: 34,
            color: "rgba(174,181,188,0.45)",
            opacity: fadeOpacity,
          }}
        >
          {i === 0 ? "4" : "5"}
        </div>
      ))}
    </>
  );
};
