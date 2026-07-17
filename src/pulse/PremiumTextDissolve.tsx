import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { EASE_EXIT } from "./motion";
import { COLORS } from "./theme";

type Props = {
  children: React.ReactNode;
  // Local frame at which the dissolve begins — callers schedule this after
  // the copy's mandated readability hold.
  exitStart: number;
  exitDuration?: number;
  slices?: number;
  // Point (px, relative to this element's box) the fragments stretch toward
  // — feed it the route so text becomes part of the transition system.
  pullTarget?: { x: number; y: number };
  seed?: number;
  style?: React.CSSProperties;
};

// Premium text exit: 10 horizontal masked slices shear apart in alternating
// directions with rising blur; a deterministic few slices flatten into thin
// line fragments and stretch toward the cyan route, becoming part of the
// transition. No glitch noise, no channel splitting.
export const PremiumTextDissolve: React.FC<Props> = ({
  children,
  exitStart,
  exitDuration = 10,
  slices = 10,
  pullTarget = { x: 420, y: -260 },
  seed = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [exitStart, exitStart + exitDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_EXIT,
  });

  if (p <= 0) {
    return <div style={style}>{children}</div>;
  }
  if (p >= 1) {
    return null;
  }

  const mag = Math.hypot(pullTarget.x, pullTarget.y) || 1;
  const dirX = pullTarget.x / mag;
  const dirY = pullTarget.y / mag;

  const sliceEls = Array.from({ length: slices }, (_, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const amp = 8 + noise(seed, i) * 10;
    const top = (i / slices) * 100;
    const bottom = 100 - ((i + 1) / slices) * 100;
    // A deterministic subset of slices becomes line fragments that stretch
    // toward the route instead of merely shearing.
    const toLine = noise(seed + 7, i) > 0.68;
    const linePull = toLine ? p * p : 0;

    return (
      <div
        key={i}
        style={{
          position: i === 0 ? "relative" : "absolute",
          inset: i === 0 ? undefined : 0,
          clipPath: `inset(${top}% 0% ${bottom}% 0%)`,
          transform: toLine
            ? `translate3d(${dirX * 140 * linePull + dir * amp * p}px, ${dirY * 120 * linePull}px, 0) scaleY(${1 - 0.9 * linePull})`
            : `translate3d(${dir * amp * p}px, ${-3 * p}px, 0)`,
          opacity: toLine ? 1 - p * 0.9 : 1 - p * p,
          filter: `blur(${p * 4}px)`,
        }}
      >
        {children}
      </div>
    );
  });

  // A handful of pure line fragments carried into the transition system.
  const frags = Array.from({ length: 5 }, (_, i) => {
    const fx = noise(seed + 11, i) * 88;
    const fy = noise(seed + 12, i) * 100;
    const ease = Math.min(1, p * (1 + noise(seed + 13, i)));
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${fx}%`,
          top: `${fy}%`,
          width: 12 + noise(seed + 14, i) * 26,
          height: 2,
          background: noise(seed + 15, i) > 0.72 ? COLORS.gold : COLORS.cyan,
          opacity: 0.8 * (1 - ease) + 0.1,
          transform: `translate3d(${pullTarget.x * ease}px, ${pullTarget.y * ease}px, 0)`,
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
