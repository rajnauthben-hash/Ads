import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

type Props = {
  // Same anchor as the StorefrontNode it decorates.
  x: number;
  y: number;
  scale?: number;
  // 0..1 — digital strength of the business. Weak: faint contracted ring.
  // Strong: cyan edge light, expanded rings, reflected light on the map.
  strength: number;
  // Warm gold treatment (reputation glow) mixed in on top of the cyan.
  goldAccent?: number;
};

// Illumination state of a storefront, rendered as independent layers over
// the building: cyan edge light along the cornice and sides, a ground
// signal wash, and reflected cyan light on the neighboring map geometry.
// Never a whole-building opacity change.
export const StorefrontIllumination: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  strength,
  goldAccent = 0,
}) => {
  const frame = useCurrentFrame();
  if (strength <= 0.02 && goldAccent <= 0.02) {
    return null;
  }
  const w = 232;
  const h = 196;
  const shimmer = 0.82 + 0.18 * Math.sin(frame * 0.075 + x * 0.01);
  const s = strength * shimmer;

  return (
    <g transform={`translate(${x - (w / 2) * scale} ${y - h * scale}) scale(${scale})`} style={{ pointerEvents: "none" }}>
      {/* Cyan edge light — cornice and flanks */}
      <path
        d={`M -8 15 L ${w + 8} 15`}
        stroke={COLORS.cyan}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
        opacity={0.55 * s}
      />
      <line x1={0} y1={31} x2={0} y2={h - 4} stroke={COLORS.cyan} strokeWidth={1.6} opacity={0.35 * s} />
      <line x1={w} y1={31} x2={w} y2={h - 4} stroke={COLORS.cyan} strokeWidth={1.6} opacity={0.35 * s} />
      {/* Soft bloom above the cornice */}
      <rect x={-10} y={4} width={w + 20} height={12} fill={COLORS.cyan} opacity={0.09 * s} />

      {/* Gold reputation glow around the sign board */}
      {goldAccent > 0.02 && (
        <rect
          x={12}
          y={40}
          width={w - 24}
          height={38}
          rx={5}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={1.6}
          opacity={0.55 * goldAccent * shimmer}
        />
      )}

      {/* Ground signal wash */}
      <ellipse cx={w / 2} cy={h + 8} rx={w * (0.4 + 0.35 * strength)} ry={16 + 10 * strength} fill={COLORS.cyan} opacity={0.07 * s} />

      {/* Reflected cyan light on neighboring map blocks */}
      <ellipse cx={-70} cy={h + 16} rx={54} ry={16} fill={COLORS.cyan} opacity={0.05 * s} />
      <ellipse cx={w + 80} cy={h + 20} rx={62} ry={18} fill={COLORS.cyan} opacity={0.05 * s} />
    </g>
  );
};
