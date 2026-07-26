import React, { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { phraseAnim } from "../timeline/framePlan";
import { phraseStyle } from "../utils/animation";

/**
 * Reveals a phrase group using the single approved text-in / text-out formula
 * (spec §8). Text reveals as whole phrase groups — never per-word. A phrase can
 * be given a masked exit via outStart/outEnd.
 */
export interface PhraseRevealProps {
  inStart: number;
  inEnd: number;
  outStart?: number;
  outEnd?: number;
  sliceDir?: 1 | -1;
  sliceAmt?: number;
  style?: CSSProperties;
  children: React.ReactNode;
}

export const PhraseReveal: React.FC<PhraseRevealProps> = ({
  inStart,
  inEnd,
  outStart,
  outEnd,
  sliceDir,
  sliceAmt,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const a = phraseAnim(frame, inStart, inEnd, { outStart, outEnd, sliceDir, sliceAmt });
  return <div style={phraseStyle(a, style)}>{children}</div>;
};
