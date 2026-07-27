import React from "react";
import { T, FONT_HEAD, FONT_BODY, HEAD_W } from "../tokens";
import { clamp01 } from "./motion";

/** OmniFlow swirl symbol drawn with SVG arc strokes. */
export const OmniFlowLogo: React.FC<{ x: number; y: number; s?: number; draw?: number }> = ({ x, y, s = 1, draw = 1 }) => {
  const arcs = [0, 1, 2];
  return (
    <svg width={80 * s} height={80 * s} viewBox="0 0 80 80" style={{ position: "absolute", left: x, top: y }}>
      <defs><filter id="logoGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.4" /></filter></defs>
      <g transform="translate(40,40)">
        {arcs.map((i) => {
          const r = 13 + i * 8;
          const a0 = (i * 50) * (Math.PI / 180);
          const a1 = a0 + Math.PI * 1.4;
          const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
          const dp = clamp01(draw * 3 - i);
          return <path key={i} d={`M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`} fill="none" stroke={i % 2 === 0 ? T.cyan : T.cyanCore} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dp} filter="url(#logoGlow)" />;
        })}
        <circle r={4} fill={T.cyanCore} opacity={clamp01(draw * 3 - 2)} />
      </g>
    </svg>
  );
};

export const OmniFlowBrandLockup: React.FC<{
  x: number; y: number; logoDraw: number; nameP: number; tagWhiteP: number; tagCyanP: number;
}> = ({ x, y, logoDraw, nameP, tagWhiteP, tagCyanP }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 650, height: 165 }}>
    <OmniFlowLogo x={0} y={2} s={1.05} draw={logoDraw} />
    <div style={{ position: "absolute", left: 100, top: 6, fontFamily: FONT_HEAD, fontWeight: HEAD_W, fontSize: 52, color: T.white, clipPath: `inset(0 ${(1 - clamp01(nameP)) * 100}% 0 0)`, WebkitClipPath: `inset(0 ${(1 - clamp01(nameP)) * 100}% 0 0)` }}>
      OmniFlow Digital
    </div>
    <div style={{ position: "absolute", left: 4, top: 96, fontFamily: FONT_BODY, fontSize: 21, fontWeight: 500, letterSpacing: "0.12em" }}>
      <span style={{ color: T.gray, opacity: clamp01(tagWhiteP) }}>GET FOUND. LOOK PROFESSIONAL. </span>
      <span style={{ color: T.cyan, opacity: clamp01(tagCyanP) }}>GROW ONLINE.</span>
    </div>
  </div>
);
