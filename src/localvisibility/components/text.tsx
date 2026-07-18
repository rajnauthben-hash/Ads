import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { prog, reveal } from "../../omniflowad/ui/anim";

export type Seg = string | { t: string; c?: string; w?: number; d?: number };
export type Line = Seg | Seg[];

const segs = (line: Line): Exclude<Seg, string>[] => {
  const arr = Array.isArray(line) ? line : [line];
  return arr.map((s) => (typeof s === "string" ? { t: s } : s));
};

/** Phrase-group masked reveal: rise + blur→sharp + tracking tighten. */
export const AnimatedHeadline: React.FC<{
  lines: readonly Line[];
  delay?: number;
  stagger?: number;
  size?: number;
  lineHeight?: number;
  color?: string;
  track?: number;
  weight?: number;
  font?: string;
}> = ({ lines, delay = 0, stagger = 7, size = 80, lineHeight = 1.14, color = C.white, track = -1.5, weight = 800, font = F.headline }) => {
  const frame = useCurrentFrame();
  return (
    <div>
      {lines.map((line, i) => {
        const d = delay + i * stagger;
        const t = prog(frame, d, 24);
        return (
          <div
            key={i}
            style={{
              fontFamily: font,
              fontSize: size,
              fontWeight: weight,
              lineHeight,
              color,
              whiteSpace: "pre",
              letterSpacing: track + (1 - t) * 1.8,
              opacity: t,
              transform: `translateY(${(1 - t) * Math.min(22, size * 0.26)}px)`,
              filter: `blur(${(1 - t) * 6}px)`,
            }}
          >
            {segs(line).map((s, j) => {
              const st = s.d ? prog(frame, d + s.d, 20) : 1;
              return (
                <span key={j} style={{ color: s.c ?? color, fontWeight: s.w ?? weight, opacity: st }}>
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

/** Supporting copy in Manrope, revealed in phrase groups. */
export const BodyCopy: React.FC<{
  lines: readonly Line[];
  delay?: number;
  stagger?: number;
  size?: number;
  lineHeight?: number;
  color?: string;
  weight?: number;
}> = ({ lines, delay = 0, stagger = 5, size = 30, lineHeight = 1.5, color = C.gray, weight = 400 }) => (
  <AnimatedHeadline
    lines={lines}
    delay={delay}
    stagger={stagger}
    size={size}
    lineHeight={lineHeight}
    color={color}
    track={-0.2}
    weight={weight}
    font={F.body}
  />
);

/** Scene numeral + thin gold rule (IBM Plex Sans Medium). */
export const SceneNumber: React.FC<{ num: string; delay?: number }> = ({ num, delay = 0 }) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay, 20, 12);
  const lw = prog(frame, delay + 8, 20);
  return (
    <div style={{ position: "absolute", left: 76, top: 62 }}>
      <div style={{ fontFamily: F.label, fontSize: 36, fontWeight: 500, letterSpacing: 2, color: C.gold, ...r }}>{num}</div>
      <div
        style={{
          marginTop: 13,
          width: 78,
          height: 2.5,
          background: C.gold,
          opacity: 0.85,
          transform: `scaleX(${lw})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};
