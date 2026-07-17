import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import { clamp01, ezIn, rand } from "../util";

/**
 * Controlled, technical text exit: the rendered block is split into
 * horizontal masked slices; alternate slices shear apart, blur slightly
 * and fade while thin fragments are pulled toward the persistent cyan
 * route — feeding the transition into the next scene. No glitch, no RGB
 * distortion.
 */
export interface TextDissolveProps {
  frame: number;
  start: number;
  dur?: number;
  slices?: number;
  drift?: number;
  pull?: { x: number; y: number }; // px, direction fragments are pulled
  seed?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const TextDissolve: React.FC<TextDissolveProps> = ({
  frame,
  start,
  dur = 11,
  slices = 8,
  drift = 15,
  pull = { x: 60, y: -40 },
  seed = 5,
  style,
  children,
}) => {
  const p = clamp01((frame - start) / dur);
  if (p <= 0) {
    return <div style={style}>{children}</div>;
  }
  if (p >= 1) return null;
  const e = ezIn(p);

  const sliceEls: React.ReactNode[] = [];
  for (let i = 0; i < slices; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    const top = (i / slices) * 100;
    const bottom = (1 - (i + 1) / slices) * 100;
    const o = clamp01(1 - (p * 1.35 - i * 0.035));
    sliceEls.push(
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(${top.toFixed(2)}% -6% ${bottom.toFixed(2)}% -6%)`,
          opacity: o,
          transform: `translate3d(${(dir * e * drift + pull.x * e * 0.4).toFixed(2)}px, ${(
            pull.y * e * (0.35 + rand(seed + i) * 0.5)
          ).toFixed(2)}px, 0)`,
          filter: `blur(${(e * 3.5).toFixed(2)}px)`,
        }}
      >
        {children}
      </div>,
    );
  }

  // Fragments pulled toward the route.
  const frags: React.ReactNode[] = [];
  for (let k = 0; k < 6; k++) {
    const s = seed * 31.7 + k * 5.3;
    const fo = interpolate(p, [0.1, 0.45, 0.95], [0, 0.8, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    if (fo <= 0.01) continue;
    frags.push(
      <div
        key={`f${k}`}
        style={{
          position: "absolute",
          left: `${(rand(s) * 85 + 5).toFixed(1)}%`,
          top: `${(rand(s + 1) * 90).toFixed(1)}%`,
          width: 10 + rand(s + 2) * 26,
          height: 2,
          background: k % 3 === 0 ? C.gold : C.cyan,
          opacity: fo,
          transform: `translate3d(${(pull.x * e * (0.8 + rand(s + 3))).toFixed(1)}px, ${(
            pull.y * e * (0.8 + rand(s + 4))
          ).toFixed(1)}px, 0)`,
          boxShadow: `0 0 6px ${k % 3 === 0 ? C.gold : C.cyan}`,
        }}
      />,
    );
  }

  return (
    <div style={{ position: "relative", ...style }}>
      {/* invisible copy keeps intrinsic layout size for absolute slices */}
      <div style={{ visibility: "hidden" }}>{children}</div>
      {sliceEls}
      {frags}
    </div>
  );
};
