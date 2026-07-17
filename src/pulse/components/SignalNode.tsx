import React from "react";
import { interpolate } from "remotion";
import { C, FONT_MONO } from "../theme";
import { prog } from "../util";
import { Glyph, IconName } from "./icons";

/**
 * A circular visibility-signal node (PHOTOS / REVIEWS / ...) with a gold
 * glyph, cyan ring, rotating tick ring and an activation pulse.
 */
export interface SignalNodeProps {
  frame: number;
  x: number;
  y: number;
  r?: number;
  label: string;
  icon: IconName;
  appear?: number;
  activate: number;
  exit?: { start: number; dur: number; toX: number; toY: number };
}

export const SignalNode: React.FC<SignalNodeProps> = ({
  frame,
  x,
  y,
  r = 66,
  label,
  icon,
  appear = 0,
  activate,
  exit,
}) => {
  const p = prog(frame, appear, 12);
  if (p <= 0) return null;
  const active = frame >= activate;
  const aLocal = frame - activate;
  const pulse = active
    ? interpolate(aLocal, [0, 4, 14], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const level = active ? 1 : 0.32;

  let ex = 0;
  let ey = 0;
  let eScale = 1;
  let eO = 1;
  if (exit) {
    const q = prog(frame, exit.start, exit.dur);
    ex = (exit.toX - x) * q;
    ey = (exit.toY - y) * q;
    eScale = 1 - q * 0.85;
    eO = 1 - q * 0.95;
  }
  if (eO <= 0.02) return null;

  const ringDash = (frame * 0.9) % 40;
  const breathe = 1 + 0.02 * Math.sin(frame * 0.09 + x * 0.02);

  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        opacity: p * eO,
        transform: `translate3d(${ex.toFixed(1)}px, ${ey.toFixed(1)}px, 0) scale(${(p * eScale * breathe).toFixed(3)})`,
      }}
    >
      <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{ overflow: "visible" }}>
        {/* activation pulse rings */}
        {pulse > 0.01 ? (
          <>
            <circle cx={0} cy={0} r={r * (1 + (1 - pulse) * 0.8)} fill="none" stroke={C.cyan} strokeWidth={2} opacity={pulse * 0.7} />
            <circle cx={0} cy={0} r={r * (1 + (1 - pulse) * 1.3)} fill="none" stroke={C.cyan} strokeWidth={1.2} opacity={pulse * 0.4} />
          </>
        ) : null}
        {/* halo */}
        <circle cx={0} cy={0} r={r * 1.18} fill={C.cyan} opacity={0.05 * level} />
        {/* body */}
        <circle cx={0} cy={0} r={r * 0.82} fill="rgba(14,16,18,0.92)" stroke={`rgba(0,210,255,${0.22 + level * 0.45})`} strokeWidth={2} />
        {/* rotating tick ring */}
        <circle
          cx={0}
          cy={0}
          r={r * 0.97}
          fill="none"
          stroke={active ? C.cyan : "#2A343A"}
          strokeWidth={1.4}
          strokeDasharray="3 17"
          strokeDashoffset={-ringDash}
          opacity={0.35 + level * 0.3}
        />
        {/* glyph */}
        <g opacity={0.35 + level * 0.65}>
          <Glyph name={icon} color={active ? C.gold : C.goldWarm} scale={r / 24} strokeWidth={1.8} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: r * 2 + 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: FONT_MONO,
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: 5,
          color: active ? C.text : C.text2,
          opacity: 0.35 + level * 0.6,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      {/* small connection status dot */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: active ? C.cyan : "#2A343A",
          boxShadow: active ? `0 0 8px ${C.cyan}` : "none",
          opacity: active ? 0.6 + 0.4 * Math.sin(frame * 0.25) : 0.5,
        }}
      />
    </div>
  );
};
