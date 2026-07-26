import { CSSProperties } from "react";
import { PhraseAnim } from "../timeline/framePlan";

/**
 * Small presentational helpers that turn frame-derived values into concrete
 * CSS. Kept deterministic — no time-based state.
 */

/** Turn a PhraseAnim into inline styles for a phrase-group wrapper. */
export function phraseStyle(a: PhraseAnim, extra?: CSSProperties): CSSProperties {
  return {
    opacity: a.opacity,
    transform: `translate(${a.translateX}px, ${a.translateY}px)`,
    filter: a.blur > 0.01 ? `blur(${a.blur}px)` : "none",
    letterSpacing: `${a.tracking}em`,
    clipPath: `inset(0 ${100 - a.clip}% 0 0)`,
    willChange: "transform, opacity, filter",
    ...extra,
  };
}

/** Card-style reveal (opacity/translateY/blur/mask) shared by all cards. */
export interface CardAnim {
  opacity: number;
  translateY: number;
  blur: number;
  mask: number; // 0..100
}

export function cardStyle(a: CardAnim, extra?: CSSProperties): CSSProperties {
  return {
    opacity: a.opacity,
    transform: `translateY(${a.translateY}px)`,
    filter: a.blur > 0.01 ? `blur(${a.blur}px)` : "none",
    clipPath: `inset(0 0 ${100 - a.mask}% 0)`,
    ...extra,
  };
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Blend two hex colours (#rrggbb) by t in [0,1]. */
export function mixColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(mix(pa.r, pb.r, t));
  const g = Math.round(mix(pa.g, pb.g, t));
  const bl = Math.round(mix(pa.b, pb.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
