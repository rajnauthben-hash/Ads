import React from "react";
import { noise, splinePoint, type Pt } from "./helpers";
import { packetEase } from "./motion";
import { COLORS } from "./theme";

// Deterministic phase of packet i at the given frame: staggered starts, each
// cycle eased so packets accelerate through curves and decelerate into the
// destination.
export const pulsePhase = (
  frame: number,
  i: number,
  count: number,
  seed: number,
  speed: number,
): number => {
  const raw = (frame * speed + i / count + noise(seed, i) * 0.5) % 1;
  return packetEase(raw);
};

type Props = {
  points: Pt[];
  // 0..1 portion of the path currently drawn.
  progress: number;
  frame: number;
  count?: number;
  seed?: number;
  color?: string;
  size?: number;
  speed?: number;
};

// Small energy packets riding a route. Each carries a bright core and a soft
// halo; sizes and phases are seeded so no two packets move in lockstep.
export const TravellingPulse: React.FC<Props> = ({
  points,
  progress,
  frame,
  count = 3,
  seed = 9,
  color = COLORS.cyan,
  size = 3,
  speed = 0.012,
}) => {
  if (progress <= 0.02) {
    return null;
  }
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = pulsePhase(frame, i, count, seed, speed) * progress;
        const p = splinePoint(points, t);
        const s = size * (0.7 + 0.5 * noise(seed + 2, i));
        // Packets glow brighter as they decelerate into the destination.
        const arrive = t > 0.82 * progress ? 1.4 : 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={s * 2.6} fill={color} opacity={0.14 * arrive} />
            <circle cx={p.x} cy={p.y} r={s} fill="#E9FCFF" opacity={(0.5 + 0.4 * noise(seed + 1, i)) * arrive} />
          </g>
        );
      })}
    </g>
  );
};
