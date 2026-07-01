import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "./constants";

const GridPattern: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.035 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="omni-grid" width="72" height="72" patternUnits="userSpaceOnUse">
          <path
            d="M 72 0 L 0 0 0 72"
            fill="none"
            stroke="rgba(100, 160, 255, 1)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#omni-grid)" />
    </svg>
  </AbsoluteFill>
);

const LightStreak: React.FC<{ startY: number; speed: number; opacity: number }> = ({
  startY,
  speed,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const y = (startY + frame * speed) % 1920;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: 1,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(0,212,255,1) 20%, rgba(107,142,255,1) 50%, rgba(0,212,255,1) 80%, transparent 100%)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const glowPulse = interpolate(
    Math.sin((frame / 180) * Math.PI),
    [-1, 1],
    [0.55, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* Primary glow — large soft upper-center */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, rgba(0, 50, 110, ${glowPulse}) 0%, transparent 70%)`,
        }}
      />
      {/* Tight inner glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 35% 28% at 50% 36%, rgba(0, 120, 220, ${glowPulse * 0.14}) 0%, transparent 100%)`,
        }}
      />
      {/* Bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, transparent 60%, rgba(2, 7, 16, 0.7) 100%)",
        }}
      />
      {/* Subtle grid */}
      <GridPattern />
      {/* Light streaks */}
      <LightStreak startY={200} speed={0.4} opacity={0.06} />
      <LightStreak startY={900} speed={0.25} opacity={0.04} />
      <LightStreak startY={1500} speed={0.5} opacity={0.05} />
    </AbsoluteFill>
  );
};
