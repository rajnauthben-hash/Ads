import { COLOR } from "../theme";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * Required "text in" motion language:
 *  - directional mask reveal (clip from the left)
 *  - 10–18px controlled movement
 *  - light blur resolving to sharp
 *  - slight tracking tightening
 */
export function revealIn(p: number, move = 14): React.CSSProperties {
  const t = clamp01(p);
  const inv = 1 - t;
  return {
    clipPath: `inset(-0.25em ${inv * 100}% -0.25em -0.05em)`,
    WebkitClipPath: `inset(-0.25em ${inv * 100}% -0.25em -0.05em)`,
    transform: `translateY(${inv * move}px)`,
    filter: `blur(${inv * 5}px)`,
    opacity: clamp01(t * 1.5),
    letterSpacing: `${inv * 1.5 - 0.4}px`,
  };
}

/**
 * "Text out": masked removal via a horizontal slice closing to the right,
 * fragments pulled toward the route — never a full-screen opacity fade.
 */
export function revealOut(p: number): React.CSSProperties {
  const t = clamp01(p); // 0 = fully present, 1 = fully gone
  return {
    clipPath: `inset(-0.25em -0.05em -0.25em ${t * 100}%)`,
    WebkitClipPath: `inset(-0.25em -0.05em -0.25em ${t * 100}%)`,
    transform: `translateX(${t * 30}px)`,
    filter: `blur(${t * 4}px)`,
    opacity: 1 - clamp01((t - 0.15) / 0.5),
  };
}

/** Combined in/out envelope. `into` 0..1 (reveal), `out` 0..1 (remove). */
export function envelope(into: number, out: number, move = 14): React.CSSProperties {
  if (out > 0) return revealOut(out);
  return revealIn(into, move);
}

export const GOLD = COLOR.gold;
export const WHITE = COLOR.white;
export const GRAY = COLOR.gray;
export const CYAN = COLOR.cyan;
