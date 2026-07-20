import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

/**
 * Copy segment: string = default color, or an object for accent color /
 * weight / a small per-word arrival offset (words land at slightly
 * different speeds, per the spec).
 */
export type Seg = string | { t: string; c?: string; w?: number; d?: number };
export type Line = Seg | Seg[];

const toSegs = (line: Line): Exclude<Seg, string>[] => {
  const arr = Array.isArray(line) ? line : [line];
  return arr.map((s) => (typeof s === "string" ? { t: s } : s));
};

/**
 * Premium kinetic type: per-line directional mask reveal, blur 8→0,
 * 12–24px rise, tracking tighten, gentle scale 0.985→1. Phrase groups,
 * never individual letters.
 */
export const KineticHeadline: React.FC<{
  lines: readonly Line[];
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  lineHeight?: number;
  color?: string;
  track?: number;
  font?: string;
  rise?: number;
  style?: React.CSSProperties;
}> = ({
  lines,
  delay = 0,
  stagger = 7,
  size = 96,
  weight = 800,
  lineHeight = 1.05,
  color = C.white,
  track: tracking = -1.5,
  font = F.head,
  rise,
  style,
}) => {
  const frame = useCurrentFrame();
  const riseBy = rise ?? Math.min(24, size * 0.22);
  return (
    <div style={style}>
      {lines.map((line, i) => {
        const d = delay + i * stagger;
        const t = prog(frame, d, 24);
        return (
          <div
            key={i}
            style={{
              // directional mask reveal (bands slide up from a clip)
              overflow: "hidden",
              paddingBottom: "0.08em",
              marginBottom: "-0.08em",
            }}
          >
            <div
              style={{
                fontFamily: font,
                fontSize: size,
                fontWeight: weight,
                lineHeight,
                color,
                whiteSpace: "pre",
                letterSpacing: tracking + (1 - t) * 2,
                opacity: t,
                transform: `translateY(${(1 - t) * riseBy}px) scale(${0.985 + 0.015 * t})`,
                transformOrigin: "left bottom",
                filter: `blur(${(1 - t) * 8}px)`,
              }}
            >
              {toSegs(line).map((s, j) => {
                const st = s.d ? prog(frame, d + s.d, 20) : 1;
                return (
                  <span key={j} style={{ color: s.c ?? color, fontWeight: s.w ?? weight, opacity: st }}>
                    {s.t}
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

/** Supporting editorial copy in Manrope. */
export const BodyCopy: React.FC<{
  lines: readonly Line[];
  delay?: number;
  stagger?: number;
  size?: number;
  lineHeight?: number;
  color?: string;
  weight?: number;
  font?: string;
  style?: React.CSSProperties;
}> = ({ lines, delay = 0, stagger = 5, size = 38, lineHeight = 1.42, color = C.gray, weight = 400, font = F.body, style }) => (
  <KineticHeadline
    lines={lines}
    delay={delay}
    stagger={stagger}
    size={size}
    weight={weight}
    lineHeight={lineHeight}
    color={color}
    track={-0.2}
    font={font}
    rise={12}
    style={style}
  />
);
