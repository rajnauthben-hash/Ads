import { useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { prog, reveal } from "./anim";

/**
 * Copy segments: plain string = default color; object allows accent color,
 * weight override and an extra per-segment delay (accents land 2–4f late).
 */
export type Seg = string | { t: string; c?: string; w?: number; d?: number };
export type Line = Seg | Seg[];

const segs = (line: Line): Exclude<Seg, string>[] => {
  const arr = Array.isArray(line) ? line : [line];
  return arr.map((s) => (typeof s === "string" ? { t: s } : s));
};

/**
 * The core typographic reveal: per-line masked rise, blur→sharp,
 * slight tracking tighten, staggered by line.
 */
export const Lines: React.FC<{
  lines: readonly Line[];
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  lineHeight?: number;
  color?: string;
  track?: number;
  style?: React.CSSProperties;
}> = ({
  lines,
  delay = 0,
  stagger = 6,
  size = 30,
  weight = 400,
  lineHeight = 1.42,
  color = PAL.gray,
  track = -0.3,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", ...style }}>
      {lines.map((line, i) => {
        const d = delay + i * stagger;
        const t = prog(frame, d, 24);
        return (
          <div
            key={i}
            style={{
              fontSize: size,
              fontWeight: weight,
              lineHeight,
              color,
              whiteSpace: "pre",
              letterSpacing: track + (1 - t) * 1.6,
              opacity: t,
              transform: `translateY(${(1 - t) * Math.min(22, size * 0.28)}px)`,
              filter: `blur(${(1 - t) * 7}px)`,
            }}
          >
            {segs(line).map((s, j) => {
              const st = s.d ? prog(frame, d + s.d, 20) : 1;
              return (
                <span
                  key={j}
                  style={{
                    color: s.c ?? color,
                    fontWeight: s.w ?? weight,
                    opacity: st,
                  }}
                >
                  {s.t}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Scene index numeral + underline, upper-left. */
export const SceneNumber: React.FC<{
  num: string;
  color?: string;
  lineColor?: string;
  delay?: number;
}> = ({ num, color = PAL.gold, lineColor = PAL.gold, delay = 0 }) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay, 20, 14);
  const lw = prog(frame, delay + 8, 20);
  return (
    <div style={{ position: "absolute", left: 76, top: 68 }}>
      <div
        style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: 2,
          color,
          ...r,
        }}
      >
        {num}
      </div>
      <div
        style={{
          marginTop: 14,
          width: 78,
          height: 2.5,
          background: lineColor,
          opacity: 0.85,
          transform: `scaleX(${lw})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
