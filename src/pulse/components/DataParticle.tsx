import React from "react";
import { C } from "../theme";
import { rand, Route } from "../util";

/**
 * A small deterministic particle travelling along a route. Renders an SVG
 * <g>; timing is a pure function of frame + seed.
 */
export interface DataParticleProps {
  route: Route;
  frame: number;
  seed: number;
  speed?: number; // route traversals per frame
  color?: string;
  size?: number;
  opacity?: number;
  window?: [number, number]; // restrict travel to a sub-range of t
}

export const DataParticle: React.FC<DataParticleProps> = ({
  route,
  frame,
  seed,
  speed = 0.011,
  color = C.cyan2,
  size = 3,
  opacity = 0.9,
  window: win = [0, 1],
}) => {
  const raw = (frame * speed + rand(seed)) % 1;
  const t = win[0] + raw * (win[1] - win[0]);
  const p = route.pointAt(t);
  // fade near ends of the travel window
  const edge = Math.min(raw, 1 - raw) * 8;
  const o = opacity * Math.min(1, edge);
  if (o <= 0.01) return null;
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={size * 2.2} fill={color} opacity={o * 0.18} />
      <circle cx={p.x} cy={p.y} r={size} fill={color} opacity={o} />
    </g>
  );
};
