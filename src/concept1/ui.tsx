import React from "react";
import { useCurrentFrame } from "remotion";
import { C, HEAD_FONT, BODY_FONT } from "./theme";
import { reveal, win } from "./anim";

// Phrase-group reveal line.
export const Line: React.FC<{ delay: number; dur?: number; travel?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  dur,
  travel,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return <div style={{ ...reveal(frame, delay, dur, travel), ...style }}>{children}</div>;
};

// Warm-gold gradient text (for emphasised words / headline accents).
export const Gold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: `linear-gradient(180deg, ${C.goldBright} 0%, ${C.gold} 62%, #B9822A 100%)`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: C.gold,
    }}
  >
    {children}
  </span>
);

export const Cyan: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: C.cyan }}>{children}</span>
);

// Short gold tick divider.
export const GoldTick: React.FC<{ delay: number; w?: number }> = ({ delay, w = 70 }) => {
  const frame = useCurrentFrame();
  const width = win(frame, delay, delay + 18, 0, w);
  return <div style={{ width, height: 3, background: C.gold, borderRadius: 2 }} />;
};

export const HEAD: React.CSSProperties = {
  fontFamily: HEAD_FONT,
  fontWeight: 400,
  fontSize: 104,
  lineHeight: 0.94,
  letterSpacing: 0.5,
  color: C.headline,
  textTransform: "uppercase",
};

export const EYEBROW: React.CSSProperties = {
  fontFamily: BODY_FONT,
  fontWeight: 700,
  fontSize: 28,
  letterSpacing: 3,
  lineHeight: 1.25,
  color: C.gold,
  textTransform: "uppercase",
};

export const SUP: React.CSSProperties = {
  fontFamily: BODY_FONT,
  fontWeight: 500,
  fontSize: 34,
  lineHeight: 1.28,
  color: C.support,
};

export const LABEL: React.CSSProperties = {
  fontFamily: HEAD_FONT,
  fontWeight: 400,
  fontSize: 40,
  letterSpacing: 1,
  color: C.headline,
  textTransform: "uppercase",
};

export const SMALL: React.CSSProperties = {
  fontFamily: BODY_FONT,
  fontWeight: 500,
  fontSize: 26,
  lineHeight: 1.3,
  color: C.support,
};
