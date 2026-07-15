import React from "react";
import { COLORS } from "../config/design";
import { Icon, type IconName } from "./Icons";

const PIN_PATH =
  "M28 70 C28 70 6 41 6 26 A22 22 0 1 1 50 26 C50 41 28 70 28 70 Z";

const toneColor = (tone: "gold" | "cyan" | "dim"): string =>
  tone === "gold" ? COLORS.gold : tone === "cyan" ? COLORS.cyan : "rgba(174,181,188,0.55)";

export const SignalRings: React.FC<{
  x: number;
  y: number;
  frame: number;
  color: string;
  strength: number; // 0-1
  seed?: number;
  maxRadius?: number;
  ringCount?: number;
}> = ({ x, y, frame, color, strength, seed = 0, maxRadius = 56, ringCount = 3 }) => {
  if (strength <= 0.02) return null;
  const period = 58;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      {Array.from({ length: ringCount }).map((_, i) => {
        const phase = ((frame + seed * 17 + i * (period / ringCount)) % period) / period;
        const radius = 8 + phase * maxRadius;
        const opacity = (1 - phase) * 0.5 * strength;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            opacity={opacity}
          />
        );
      })}
      <circle cx={x} cy={y} r={3.2} fill={color} opacity={0.55 * strength + 0.2} />
    </svg>
  );
};

export const LocationPin: React.FC<{
  x: number;
  y: number;
  icon: IconName;
  tone: "gold" | "cyan" | "dim";
  frame: number;
  active?: boolean;
  scale?: number;
  seed?: number;
  showRings?: boolean;
  entrance?: number; // 0-1 pop-in progress
  label?: string;
  labelColor?: string;
}> = ({
  x,
  y,
  icon,
  tone,
  frame,
  active = true,
  scale = 1,
  seed = 0,
  showRings = true,
  entrance = 1,
  label,
  labelColor,
}) => {
  const color = toneColor(tone);
  const pop = 0.7 + 0.3 * Math.min(1, entrance);
  return (
    <>
      {showRings && entrance > 0.05 && (
        <SignalRings
          x={x}
          y={y}
          frame={frame}
          color={color}
          strength={(active ? 0.85 : 0.25) * entrance}
          seed={seed}
          maxRadius={40 * scale}
          ringCount={active ? 3 : 1}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -100%) scale(${pop * scale})`,
          transformOrigin: "50% 100%",
          opacity: entrance,
        }}
      >
        {label && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: -34,
              transform: "translateX(-50%)",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 26,
              fontWeight: 500,
              color: labelColor ?? color,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        )}
        <svg
          width={56}
          height={72}
          viewBox="0 0 56 72"
          style={{ filter: active ? `drop-shadow(0 0 8px ${color})` : "none" }}
        >
          <path
            d={PIN_PATH}
            fill={active ? `${color}1f` : "rgba(174,181,188,0.06)"}
            stroke={color}
            strokeWidth={2}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 26,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Icon name={icon} size={22} color={color} filled={tone === "gold"} />
        </div>
      </div>
    </>
  );
};
