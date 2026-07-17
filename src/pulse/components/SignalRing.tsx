import React from "react";
import { C } from "../theme";
import { clamp01 } from "../util";

/**
 * Expanding perspective visibility rings beneath a storefront. `level`
 * (0..1) controls reach and brightness — rings grow progressively as the
 * business gains signals. Renders SVG <g>.
 */
export interface SignalRingProps {
  frame: number;
  cx: number;
  cy: number;
  rx?: number;
  squash?: number; // ry = rx * squash
  level: number;
  color?: string;
  count?: number;
  speed?: number;
  start?: number;
}

export const SignalRing: React.FC<SignalRingProps> = ({
  frame,
  cx,
  cy,
  rx = 200,
  squash = 0.4,
  level,
  color = C.cyan,
  count = 4,
  speed = 0.014,
  start = 0,
}) => {
  const lv = clamp01(level);
  if (lv <= 0.02 || frame < start) return null;
  const els: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const q = (((frame - start) * speed + i / count) % 1 + 1) % 1;
    const r = rx * (0.18 + 0.82 * q) * lv;
    els.push(
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={r}
        ry={r * squash}
        fill="none"
        stroke={color}
        strokeWidth={1.8 - q}
        opacity={(1 - q) * 0.5 * lv}
      />,
    );
  }
  // steady inner ring + soft ground glow
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx * 0.22 * lv} ry={rx * 0.22 * squash * lv} fill={color} opacity={0.10 * lv} />
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx * 0.3 * lv}
        ry={rx * 0.3 * squash * lv}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        opacity={0.5 * lv * (0.8 + 0.2 * Math.sin(frame * 0.12))}
      />
      {els}
    </g>
  );
};
