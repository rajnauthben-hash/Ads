import React, { useMemo } from "react";
import { COLORS } from "../styles/tokens";

// Persistent cyan search-pulse route. Draws along an SVG path via dashoffset,
// carries one moving pulse node (positioned with CSS offset-path so no runtime
// path measurement is needed), and can show a destination ring. The same
// visual language is reused in every scene; only geometry changes.
export const SearchPulseRoute: React.FC<{
  d: string;
  width: number; // svg viewport width (1 unit === 1px)
  height: number;
  progress: number; // 0..1 draw
  pulsePos?: number; // 0..1 position of moving node along the whole path
  showPulse?: boolean;
  intensity?: number; // 0..1 core brightness
  core?: number;
  glow?: number;
  color?: string;
  dashed?: boolean;
  destination?: { x: number; y: number; ring?: number } | null;
  style?: React.CSSProperties;
}> = ({
  d,
  width,
  height,
  progress,
  pulsePos,
  showPulse = true,
  intensity = 1,
  core = 5,
  glow = 15,
  color = COLORS.cyan,
  dashed = false,
  destination = null,
  style,
}) => {
  const id = useMemo(() => Math.random().toString(36).slice(2), []);
  const nodeSize = core * 3.4;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, ...style }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <filter id={`blur-${id}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        {/* outer glow */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={glow}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.18 * intensity}
          pathLength={1}
          strokeDasharray={dashed ? "0.012 0.02" : 1}
          strokeDashoffset={dashed ? 0 : 1 - progress}
          filter={`url(#blur-${id})`}
        />
        {/* core */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={core}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55 + 0.45 * intensity}
          pathLength={1}
          strokeDasharray={dashed ? "0.01 0.018" : 1}
          strokeDashoffset={dashed ? 0 : 1 - progress}
        />
        {/* destination ring */}
        {destination && (
          <>
            <circle cx={destination.x} cy={destination.y} r={core * 1.3} fill={color} opacity={0.9 * intensity} />
            {destination.ring != null && destination.ring > 0 && (
              <circle
                cx={destination.x}
                cy={destination.y}
                r={core * 1.3 + destination.ring * 26}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={(1 - destination.ring) * 0.7 * intensity}
              />
            )}
          </>
        )}
      </svg>
      {/* moving pulse node via offset-path */}
      {showPulse && pulsePos != null && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: nodeSize,
            height: nodeSize,
            marginLeft: -nodeSize / 2,
            marginTop: -nodeSize / 2,
            borderRadius: "50%",
            background: "#EAFBFF",
            boxShadow: `0 0 ${core * 3}px ${core}px ${color}`,
            opacity: intensity,
            offsetPath: `path("${d}")`,
            offsetDistance: `${Math.max(0, Math.min(1, pulsePos)) * 100}%`,
            offsetRotate: "0deg",
          } as React.CSSProperties}
        />
      )}
    </div>
  );
};
