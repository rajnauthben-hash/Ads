import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, W } from "../config/design";
import { SCENE_LEN, SCENES } from "../config/timing";

const STREAK_Y = 655;

/**
 * The one persistent cyan energy streak that lives above the artwork layers
 * for the entire film. Between scenes it is a faint horizon line; around
 * every cut a bright comet crosses the frame, visually bridging the
 * transition so no cut reads as a slide change.
 */
export const EnergyStreak: React.FC = () => {
  const frame = useCurrentFrame();
  const y = STREAK_Y + Math.sin(frame / 120) * 9;
  const baseOpacity = 0.07 + 0.03 * Math.sin(frame / 40);

  // Comet crossing around each interior cut (frames b-16 .. b+14).
  const comets = SCENES.slice(1).map((s) => s.start);

  return (
    <svg
      viewBox={`0 0 ${W} 1920`}
      width={W}
      height={1920}
      style={{ position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none" }}
    >
      <line
        x1={-20}
        y1={y}
        x2={W + 20}
        y2={y}
        stroke={COLORS.cyan}
        strokeWidth={1.4}
        opacity={baseOpacity}
      />
      {comets.map((b) => {
        const local = frame - (b - 16);
        if (local < 0 || local > 30) return null;
        const x = interpolate(local, [0, 30], [-140, W + 140]);
        const intensity = interpolate(local, [0, 6, 24, 30], [0, 1, 1, 0]);
        return (
          <g key={b} opacity={intensity}>
            <line
              x1={x - 160}
              y1={y}
              x2={x}
              y2={y}
              stroke={COLORS.cyan}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.5}
              style={{ filter: "blur(2px)" }}
            />
            <circle
              cx={x}
              cy={y}
              r={5}
              fill={COLORS.cyan}
              style={{ filter: `drop-shadow(0 0 10px ${COLORS.cyan})` }}
            />
          </g>
        );
      })}
      {/* subtle rising sparks along the streak (deterministic) */}
      {[0.18, 0.44, 0.71, 0.9].map((fx, i) => {
        const phase = ((frame + i * 37) % 150) / 150;
        const sy = y - phase * 60;
        return (
          <circle
            key={i}
            cx={fx * W + Math.sin(frame / 60 + i * 2.1) * 14}
            cy={sy}
            r={1.6}
            fill={COLORS.cyan}
            opacity={(1 - phase) * 0.28}
          />
        );
      })}
    </svg>
  );
};

export const STREAK_BASE_Y = STREAK_Y;
export const STREAK_PERIOD = SCENE_LEN;
