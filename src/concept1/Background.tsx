import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, W, H } from "./theme";

// Persistent charcoal stage shared by every scene (never resets). Subtle grain,
// a warm corner glow, and the faint concentric arcs seen in the references.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 811], [0, -24]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 82% 8%, rgba(80,64,40,0.18) 0%, rgba(0,0,0,0) 55%)`,
        }}
      />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="c1grain" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.015)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        {/* faint concentric arcs, bottom-right */}
        <g stroke="rgba(241,235,221,0.05)" fill="none" strokeWidth={1.4} transform={`translate(${W + 60} ${H + drift})`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={0} cy={0} r={360 + i * 150} />
          ))}
        </g>
        {/* faint concentric arcs, lower-left (subtler) */}
        <g stroke="rgba(241,235,221,0.035)" fill="none" strokeWidth={1.2} transform={`translate(-120 ${H + 140 + drift})`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={0} cy={0} r={300 + i * 140} />
          ))}
        </g>
        <rect x={0} y={0} width={W} height={H} fill="url(#c1grain)" />
      </svg>
      {/* vignette */}
      <AbsoluteFill
        style={{ background: "radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }}
      />
    </AbsoluteFill>
  );
};
