import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, GRAIN_OPACITY } from "../styles/tokens";

// Fixed matte background + subtle static map-grid + monochrome grain.
// Grid drifts a maximum of 2px (parallax) but is otherwise static.
export const Background: React.FC<{ driftSeed?: number }> = ({ driftSeed = 0 }) => {
  const frame = useCurrentFrame();
  // A gentle, bounded 2px drift derived deterministically from the frame.
  const drift = interpolate(
    Math.sin((frame + driftSeed) / 60),
    [-1, 1],
    [-2, 2],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.canvas }}>
      {/* faint street grid */}
      <AbsoluteFill
        style={{
          transform: `translate(${drift}px, ${drift * 0.6}px)`,
          opacity: 0.5,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "220px 220px, 220px 220px, 44px 44px, 44px 44px",
        }}
      />
      {/* diagonal faint arterial streets */}
      <AbsoluteFill
        style={{
          transform: `translate(${drift}px, 0) rotate(-18deg) scale(1.4)`,
          opacity: 0.35,
          backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 160px)`,
        }}
      />
      {/* monochrome grain */}
      <AbsoluteFill
        style={{
          opacity: GRAIN_OPACITY,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </AbsoluteFill>
  );
};
