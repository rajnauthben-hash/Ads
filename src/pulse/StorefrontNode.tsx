import React from "react";
import { useCurrentFrame } from "remotion";
import { SignalRing } from "./SignalRing";
import { COLORS } from "./theme";

type Props = {
  x: number;
  y: number;
  scale?: number;
  // 0..1 — how alive the business reads. Scene 01/04 keep it dim,
  // scene 05 charges it up, scene 06 runs it fully lit.
  brightness: number;
  // 0..1 — activity of the visibility rings underneath.
  ringActivity?: number;
  // Local frame at which the storefront starts building in.
  appearFrame?: number;
  label?: string;
};

// A dimensional storefront built from SVG: base volume, awning stripes,
// glowing sign band, doorway and a signal ring system underneath.
export const StorefrontNode: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  brightness,
  ringActivity = 0,
  appearFrame = 0,
  label,
}) => {
  const frame = useCurrentFrame();
  const build = Math.min(1, Math.max(0, (frame - appearFrame) / 12));
  if (build <= 0) {
    return null;
  }
  const b = Math.max(0.12, brightness);
  const signPulse = 0.8 + 0.2 * Math.sin(frame * 0.12);
  const w = 190;
  const h = 150;

  return (
    <g
      transform={`translate(${x - (w / 2) * scale} ${y - h * scale}) scale(${scale})`}
      opacity={build}
    >
      {ringActivity > 0 && (
        <SignalRing
          cx={w / 2}
          cy={h + 8}
          activity={ringActivity}
          maxRadius={130}
        />
      )}
      {/* Ground shadow */}
      <ellipse cx={w / 2} cy={h + 6} rx={w * 0.56} ry={14} fill="#000" opacity={0.5} />
      {/* Side volume for dimension */}
      <path
        d={`M ${w} 34 L ${w + 22} 24 L ${w + 22} ${h - 12} L ${w} ${h} Z`}
        fill={COLORS.slate}
        stroke={`rgba(0,210,255,${0.18 * b})`}
        strokeWidth={1.4}
        opacity={build}
      />
      {/* Facade */}
      <rect
        x={0}
        y={34}
        width={w}
        height={h - 34}
        rx={4}
        fill={COLORS.slate}
        stroke={`rgba(0,210,255,${0.3 * b})`}
        strokeWidth={1.6}
      />
      {/* Awning stripes */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={4 + i * (w / 6)}
          y={20}
          width={w / 6 - 5}
          height={18}
          rx={3}
          fill={i % 2 === 0 ? COLORS.goldWarm : COLORS.slate}
          opacity={(i % 2 === 0 ? 0.55 + 0.45 * b : 0.9) * build}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={0.8}
        />
      ))}
      {/* Sign band — the business's glow */}
      <rect
        x={14}
        y={46}
        width={w - 28}
        height={16}
        rx={3}
        fill={COLORS.cyan}
        opacity={0.16 + 0.7 * b * signPulse * build}
      />
      {/* Windows */}
      <rect x={14} y={76} width={64} height={44} rx={3} fill="#0D1013" stroke={`rgba(69,223,255,${0.28 * b})`} strokeWidth={1.2} />
      <rect x={112} y={76} width={64} height={44} rx={3} fill="#0D1013" stroke={`rgba(69,223,255,${0.28 * b})`} strokeWidth={1.2} />
      {/* Warm interior light scales with brightness */}
      <rect x={18} y={80} width={56} height={36} fill={COLORS.goldWarm} opacity={0.24 * b} />
      <rect x={116} y={80} width={56} height={36} fill={COLORS.goldWarm} opacity={0.24 * b} />
      {/* Door */}
      <rect x={84} y={92} width={24} height={58 - 34} rx={2} fill="#0D1013" stroke={`rgba(0,210,255,${0.32 * b})`} strokeWidth={1.2} />
      {label ? (
        <text
          x={w / 2}
          y={h + 40}
          textAnchor="middle"
          fill={COLORS.textDim}
          fontFamily="IBM Plex Mono"
          fontWeight={500}
          fontSize={17}
          letterSpacing={4}
          opacity={0.85 * build}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};
