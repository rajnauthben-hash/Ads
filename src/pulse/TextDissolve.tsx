import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { COLORS } from "./theme";

type Props = {
  children: React.ReactNode;
  // Local frame at which the dissolve begins.
  exitStart: number;
  exitDuration?: number;
  slices?: number;
  // Point (in px, relative to this element's box) the fragments are pulled
  // toward — feed it the persistent route so text becomes part of the
  // transition system.
  pullTarget?: { x: number; y: number };
  seed?: number;
  style?: React.CSSProperties;
};

// Controlled technical exit: the rendered text is split into horizontal
// masked slices; alternate slices shear 8–20px in opposite directions while
// opacity falls and blur rises, and a handful of fragments stream toward
// the persistent cyan route. No glitch chaos, no RGB split.
export const TextDissolve: React.FC<Props> = ({
  children,
  exitStart,
  exitDuration = 10,
  slices = 8,
  pullTarget = { x: 420, y: -260 },
  seed = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [exitStart, exitStart + exitDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.85, 0.4),
  });

  if (p <= 0) {
    return <div style={style}>{children}</div>;
  }
  if (p >= 1) {
    return null;
  }

  const sliceEls = Array.from({ length: slices }, (_, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const amp = 8 + noise(seed, i) * 12;
    const top = (i / slices) * 100;
    const bottom = 100 - ((i + 1) / slices) * 100;
    return (
      <div
        key={i}
        style={{
          position: i === 0 ? "relative" : "absolute",
          inset: i === 0 ? undefined : 0,
          clipPath: `inset(${top}% 0% ${bottom}% 0%)`,
          transform: `translate3d(${dir * amp * p}px, ${-3 * p}px, 0)`,
          opacity: 1 - p * p,
          filter: `blur(${p * 3}px)`,
        }}
      >
        {children}
      </div>
    );
  });

  // Fragments pulled toward the route.
  const frags = Array.from({ length: 6 }, (_, i) => {
    const fx = noise(seed + 11, i) * 90;
    const fy = noise(seed + 12, i) * 100;
    const ease = Math.min(1, p * (1 + noise(seed + 13, i)));
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${fx}%`,
          top: `${fy}%`,
          width: 10 + noise(seed + 14, i) * 26,
          height: 2,
          background: noise(seed + 15, i) > 0.75 ? COLORS.goldWarm : COLORS.cyan,
          opacity: 0.8 * (1 - ease) + 0.1,
          transform: `translate3d(${pullTarget.x * ease}px, ${
            pullTarget.y * ease
          }px, 0)`,
        }}
      />
    );
  });

  return (
    <div style={{ position: "relative", ...style }}>
      {sliceEls}
      {frags}
    </div>
  );
};
