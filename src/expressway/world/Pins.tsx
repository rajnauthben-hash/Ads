import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GoldPin } from "./Actors";

// Scene-2 discovery pins and Scene-3 rating-result pins, placed along the
// highway. Each fades in for its scene with a small settle.
const seg = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Placed: React.FC<{ x: number; y: number; scale?: number; label?: string; rating?: string; reveal: number; rise?: number }> = ({
  x,
  y,
  scale = 1,
  label,
  rating,
  reveal,
  rise = 14,
}) => {
  if (reveal < 0.01) return null;
  const off = (1 - reveal) * rise;
  return (
    <g transform={`translate(${x} ${y + off})`} opacity={reveal}>
      <GoldPin scale={scale} label={label} rating={rating} />
    </g>
  );
};

export const Pins: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 2 — discovery pins appearing along the search highway.
  const s2 = (d: number) =>
    interpolate(frame, [138 + d, 162 + d, 226, 240], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  // Scene 3 — rating result chips.
  const s3 = (d: number) => seg(frame, 250 + d, 276 + d, 348, 360);

  return (
    <g>
      {/* Scene 2 discovery pins */}
      <Placed x={888} y={1236} scale={0.92} reveal={s2(0)} />
      <Placed x={782} y={968} scale={0.86} reveal={s2(12)} />
      <Placed x={806} y={706} scale={0.8} reveal={s2(24)} />

      {/* Scene 3 rating chips */}
      <Placed x={858} y={640} scale={0.92} label="Top Result" rating="4.8 ★" reveal={s3(0)} />
      <Placed x={716} y={838} scale={0.88} label="Nearby" rating="4.7 ★" reveal={s3(14)} />
      <Placed x={822} y={1016} scale={0.9} label="Open Now" rating="4.9 ★" reveal={s3(28)} />
    </g>
  );
};
