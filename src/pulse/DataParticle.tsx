import React from "react";
import { useCurrentFrame } from "remotion";
import { noise, splinePoint, type Pt } from "./helpers";
import { COLORS } from "./theme";

type FieldProps = {
  // Bounding box of the drift field.
  x: number;
  y: number;
  width: number;
  height: number;
  count?: number;
  seed?: number;
  color?: string;
  opacity?: number;
};

// Ambient deterministic particle drift — keeps dark regions of the frame
// alive without drawing attention.
export const DataParticleField: React.FC<FieldProps> = ({
  x,
  y,
  width,
  height,
  count = 14,
  seed = 5,
  color = COLORS.cyan,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const speed = 0.15 + noise(seed, i) * 0.4;
        const px = x + noise(seed + 1, i) * width;
        const py = y + ((noise(seed + 2, i) * height + frame * speed) % height);
        const tw = 0.25 + 0.55 * noise(seed + 3, i + Math.floor(frame / 20));
        return (
          <circle
            key={i}
            cx={px}
            cy={y + height - (py - y)}
            r={1 + noise(seed + 4, i) * 1.6}
            fill={noise(seed + 5, i) > 0.85 ? COLORS.goldWarm : color}
            opacity={tw}
          />
        );
      })}
    </g>
  );
};

type StreamProps = {
  // Particles flowing along a path — used for data streams and traffic.
  points: Pt[];
  count?: number;
  // 0..1 portion of the path in use.
  progress: number;
  seed?: number;
  color?: string;
  size?: number;
  speed?: number;
};

export const DataParticleStream: React.FC<StreamProps> = ({
  points,
  count = 5,
  progress,
  seed = 9,
  color = COLORS.cyan,
  size = 3,
  speed = 0.012,
}) => {
  const frame = useCurrentFrame();
  if (progress <= 0.02) {
    return null;
  }
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = ((frame * speed + noise(seed, i)) % 1) * progress;
        const p = splinePoint(points, t);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={size * (0.6 + 0.4 * noise(seed + 2, i))}
            fill={color}
            opacity={0.35 + 0.5 * noise(seed + 1, i)}
          />
        );
      })}
    </g>
  );
};
