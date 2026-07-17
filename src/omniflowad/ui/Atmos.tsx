import { useMemo } from "react";
import { AbsoluteFill } from "remotion";

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Defocused city lights for the rainy-street scenes (01 / 02 / 06). */
export const Bokeh: React.FC<{
  seed?: number;
  count?: number;
  frame: number;
  opacity?: number;
  /** region as css inset percentages */
  region?: { left: number; top: number; width: number; height: number };
  cyanRatio?: number;
}> = ({ seed = 7, count = 16, frame, opacity = 1, region = { left: 0, top: 30, width: 55, height: 60 }, cyanRatio = 0.18 }) => {
  const dots = useMemo(() => {
    const rnd = mulberry32(seed * 7919);
    return Array.from({ length: count }, () => ({
      x: region.left + rnd() * region.width,
      y: region.top + rnd() * region.height,
      r: 14 + rnd() * 60,
      cyan: rnd() < cyanRatio,
      o: 0.1 + rnd() * 0.4,
      ph: rnd() * Math.PI * 2,
      sp: 0.4 + rnd() * 0.9,
    }));
  }, [seed, count, region.left, region.top, region.width, region.height, cyanRatio]);

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.r * 2,
            height: d.r * 2,
            marginLeft: -d.r,
            marginTop: -d.r,
            borderRadius: "50%",
            background: d.cyan ? "rgba(17,217,247,0.55)" : "rgba(232,178,94,0.6)",
            opacity: d.o * (0.75 + 0.25 * Math.sin(d.ph + frame * 0.03 * d.sp)),
            filter: `blur(${d.r * 0.55}px)`,
            transform: `translateY(${Math.sin(d.ph + frame * 0.012 * d.sp) * 6}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Two layers of barely-there rain streaks, drifting down-left. */
export const Rain: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 0.05 }) => {
  const layer = (period: number, size: number, angle: number, o: number, speed: number) => (
    <div
      style={{
        position: "absolute",
        inset: "-30%",
        backgroundImage: `repeating-linear-gradient(${angle}deg, transparent 0px, transparent ${period - 1.6}px, rgba(214,226,238,${o}) ${period - 0.6}px, transparent ${period}px)`,
        backgroundSize: `${size}px ${size}px`,
        transform: `translateY(${(frame * speed) % size}px) translateX(${-((frame * speed * 0.18) % size)}px)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", pointerEvents: "none" }}>
      {layer(90, 340, 100, 0.6, 9)}
      {layer(140, 520, 99, 0.45, 14)}
    </AbsoluteFill>
  );
};

/** Wet reflective pavement band for storefront scenes. */
export const WetGround: React.FC<{ frame: number; top?: number; opacity?: number }> = ({ frame, top = 1440, opacity = 1 }) => {
  const streaks = useMemo(() => {
    const rnd = mulberry32(4242);
    return Array.from({ length: 22 }, () => ({
      x: rnd() * 100,
      y: rnd() * 100,
      w: 60 + rnd() * 260,
      h: 5 + rnd() * 14,
      cyan: rnd() < 0.22,
      o: 0.08 + rnd() * 0.3,
      ph: rnd() * 6,
    }));
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        bottom: 0,
        opacity,
        overflow: "hidden",
        background: "linear-gradient(180deg, rgba(12,10,7,0) 0%, rgba(14,11,7,0.5) 30%, rgba(8,7,5,0.85) 100%)",
        pointerEvents: "none",
      }}
    >
      {streaks.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.w,
            height: s.h,
            borderRadius: s.h,
            background: s.cyan ? "rgba(17,217,247,0.5)" : "rgba(235,182,102,0.55)",
            opacity: s.o * (0.7 + 0.3 * Math.sin(s.ph + frame * 0.05)),
            filter: `blur(${4 + s.h * 0.7}px)`,
          }}
        />
      ))}
    </div>
  );
};

/** Static vignette + top/bottom cinematic falloff shared by the whole film. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(3,4,6,0.55) 100%), linear-gradient(180deg, rgba(3,4,6,0.35) 0%, transparent 12%, transparent 90%, rgba(3,4,6,0.4) 100%)",
    }}
  />
);
