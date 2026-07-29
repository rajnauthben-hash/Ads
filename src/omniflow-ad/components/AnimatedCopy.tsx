import React from "react";
import { useCurrentFrame } from "remotion";
import { prog, premiumEase } from "../styles/geometry";

// Reveals supporting copy in phrase groups. Each group slides up 12px,
// deblurs from 6px and fades in; groups stagger by `stagger` frames.
export interface Phrase {
  content: React.ReactNode;
}

export const AnimatedCopy: React.FC<{
  phrases: Phrase[];
  start: number; // local frame first group begins
  stagger?: number;
  duration?: number;
  style?: React.CSSProperties; // applied to each phrase line container
  wrapperStyle?: React.CSSProperties;
  slide?: number;
}> = ({
  phrases,
  start,
  stagger = 4,
  duration = 14,
  style,
  wrapperStyle,
  slide = 12,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={wrapperStyle}>
      {phrases.map((ph, i) => {
        const s = start + i * stagger;
        const p = prog(frame, s, s + duration, premiumEase);
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${(1 - p) * slide}px)`,
              filter: `blur(${(1 - p) * 6}px)`,
              opacity: p,
              whiteSpace: "nowrap",
              ...style,
            }}
          >
            {ph.content}
          </div>
        );
      })}
    </div>
  );
};
