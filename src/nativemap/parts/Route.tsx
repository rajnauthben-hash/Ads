import React from "react";
import { T } from "../tokens";
import { pathPointAt } from "./projection";

export const RouteDefs: React.FC = () => (
  <defs>
    <filter id="rGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="rGlowWide" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="13" /></filter>
  </defs>
);

/** Live cyan navigation route with draw-on + travelling pulse head. */
export const Route: React.FC<{
  d: string;
  reveal?: number;
  pulse?: number;
  color?: string;
  width?: number;
  emphasis?: number;
  dotted?: boolean;
  arrow?: boolean;
  breathe?: number;
}> = ({ d, reveal = 1, pulse = 0, color = T.cyan, width = 5, emphasis = 1, dotted = false, arrow = false, breathe = 0 }) => {
  const off = 1 - Math.max(0, Math.min(1, reveal));
  const br = 1 + Math.sin(breathe * Math.PI * 2) * 0.08;
  const head = Math.max(0, Math.min(reveal, pulse));
  const hp = head > 0.01 && !dotted ? pathPointAt(d, head) : null;
  const core = color === T.cyan ? T.cyanCore : "#FFE0A8";

  if (dotted) {
    return (
      <g opacity={emphasis * (0.35 + 0.65 * Math.min(1, reveal))}>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="0.006 0.018" strokeDashoffset={off * 0} opacity={0.95} filter="url(#rGlow)" />
      </g>
    );
  }

  return (
    <g opacity={emphasis}>
      <path d={d} fill="none" stroke={color} strokeWidth={width * 2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={off} opacity={0.26 * br} filter="url(#rGlowWide)" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={off} opacity={0.9 * br} filter="url(#rGlow)" />
      <path d={d} fill="none" stroke={core} strokeWidth={Math.max(1.4, width * 0.42)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={off} opacity={0.95} />
      {head > 0.01 && (
        <path d={d} fill="none" stroke={core} strokeWidth={width * 1.7} strokeLinecap="round" pathLength={1} strokeDasharray="0.04 0.96" strokeDashoffset={-head} opacity={0.9} filter="url(#rGlow)" />
      )}
      {hp && head < 0.995 && (
        <>
          <circle cx={hp.x} cy={hp.y} r={22 * br} fill={color} opacity={0.22} filter="url(#rGlowWide)" />
          <circle cx={hp.x} cy={hp.y} r={6} fill={core} filter="url(#rGlow)" />
        </>
      )}
      {arrow && reveal > 0.985 && <ArrowHead d={d} color={core} />}
    </g>
  );
};

const ArrowHead: React.FC<{ d: string; color: string }> = ({ d, color }) => {
  const tip = pathPointAt(d, 1);
  const back = pathPointAt(d, 0.975);
  const ang = Math.atan2(tip.y - back.y, tip.x - back.x);
  const w = 13;
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  return (
    <path
      d={`M ${tip.x + Math.cos(a1) * w} ${tip.y + Math.sin(a1) * w} L ${tip.x} ${tip.y} L ${tip.x + Math.cos(a2) * w} ${tip.y + Math.sin(a2) * w}`}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#rGlow)"
    />
  );
};
