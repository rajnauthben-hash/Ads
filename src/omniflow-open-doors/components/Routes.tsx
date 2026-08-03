import React from "react";
import { WIDTH, HEIGHT, COLORS, ROUTE } from "../constants";

/**
 * RouteDraw — draws an SVG path progressively using a normalized pathLength (1)
 * reveal mask, so it needs no runtime measurement and is fully deterministic.
 * Supports a solid glowing cyan route and a weak gray dotted route.
 */
export const RouteDraw: React.FC<{
  id: string;
  d: string;
  /** 0..1 draw progress */
  progress: number;
  variant: "solid" | "dotted";
}> = ({ id, d, progress, variant }) => {
  const maskId = `route-mask-${id}`;
  const dashed = variant === "dotted";
  const color = dashed ? COLORS.inactiveRouteGray : COLORS.electricCyan;
  const width = dashed ? ROUTE.dottedWidth : ROUTE.solidWidth;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <mask id={maskId}>
          <path
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth={dashed ? width + 6 : ROUTE.solidGlowWidth + 8}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - progress}
          />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        {!dashed && (
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={ROUTE.solidGlowWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.32}
            style={{ filter: "blur(7px)" }}
          />
        )}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dashed ? ROUTE.dottedPattern : undefined}
          opacity={dashed ? 0.85 : 1}
          style={dashed ? undefined : { filter: `drop-shadow(0 0 6px ${COLORS.cyanGlow})` }}
        />
      </g>
    </svg>
  );
};

/**
 * RoutePulse — a bright travelling segment that runs along a solid route to
 * show active signal direction (Customer -> destination).
 */
export const RoutePulse: React.FC<{ d: string; head: number; color?: string }> = ({
  d,
  head,
  color = "#BDEBFF",
}) => {
  const seg = 0.08;
  // Dash: a short lit segment followed by a long gap, offset to position head.
  const offset = 1 - head;
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={ROUTE.solidWidth + 2}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={`${seg} ${1 - seg}`}
        strokeDashoffset={offset}
        style={{ filter: "drop-shadow(0 0 10px rgba(10,184,255,0.9))" }}
      />
    </svg>
  );
};

/** DestinationRing — a dim/active anchor ring at a route destination. */
export const DestinationRing: React.FC<{
  x: number;
  y: number;
  diameter: number;
  active?: boolean;
  progress?: number;
}> = ({ x, y, diameter, active = false, progress = 1 }) => {
  const color = active ? COLORS.warmGold : COLORS.inactiveRouteGray;
  return (
    <div
      style={{
        position: "absolute",
        left: x - diameter / 2,
        top: y - diameter / 2,
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        boxShadow: active
          ? `0 0 16px ${COLORS.warmGold}, inset 0 0 8px rgba(214,163,74,0.6)`
          : "none",
        opacity: progress,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "30%",
          borderRadius: "50%",
          background: color,
          opacity: active ? 1 : 0.5,
        }}
      />
    </div>
  );
};

/** CustomerMarker — the persistent customer node / pin shared across scenes. */
export const CustomerMarker: React.FC<{
  x: number;
  y: number;
  /** "node" = small glowing dot (Scene 3), "pin" = teardrop avatar (Scene 4). */
  variant: "node" | "pin";
  scale?: number;
  opacity?: number;
}> = ({ x, y, variant, scale = 1, opacity = 1 }) => {
  if (variant === "node") {
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%,-50%) scale(${scale})`,
          opacity,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: COLORS.electricCyan,
            boxShadow: `0 0 22px ${COLORS.electricCyan}, 0 0 44px ${COLORS.cyanGlow}`,
            border: "2px solid #DFF6FF",
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-100%) scale(${scale})`,
        opacity,
      }}
    >
      <svg width={64} height={82} viewBox="0 0 64 82">
        <path
          d="M32 2C16 2 4 14 4 30c0 20 28 50 28 50s28-30 28-50C60 14 48 2 32 2z"
          fill={COLORS.electricCyan}
          stroke="#DFF6FF"
          strokeWidth={2}
          style={{ filter: "drop-shadow(0 0 14px rgba(10,184,255,0.8))" }}
        />
        {/* Person glyph. */}
        <circle cx={32} cy={24} r={9} fill="#06121A" />
        <path d="M16 44c0-9 7-15 16-15s16 6 16 15z" fill="#06121A" />
      </svg>
    </div>
  );
};
