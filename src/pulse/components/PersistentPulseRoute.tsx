import React from "react";
import { C } from "../theme";
import { clamp01, ezInOut, prog, Route } from "../util";

/**
 * The living cyan pulse that connects the whole film. Layered SVG paths:
 * a 2px sharp core, a wide low-opacity glow, a travelling dash highlight,
 * directional arrows and small pulses moving along the path. All timing
 * is frame-driven and deterministic.
 *
 * Renders an SVG <g> — must sit inside an <svg> element.
 */
export interface PulseRouteProps {
  route: Route;
  frame: number;
  idPrefix: string;
  draw?: { start: number; dur: number };
  retract?: { start: number; dur: number }; // erases from the tail (start of path)
  core?: string;
  glow?: string;
  coreWidth?: number;
  glowWidth?: number;
  opacity?: number;
  highlight?: boolean;
  highlightSpeed?: number; // px per frame
  pulses?: { count: number; speed: number; size?: number }; // speed = loops per frame (t units)
  freezePulsesAt?: number; // frame after which pulses stop moving
  arrows?: number[]; // t positions along the route
}

export const PersistentPulseRoute: React.FC<PulseRouteProps> = ({
  route,
  frame,
  idPrefix,
  draw,
  retract,
  core = C.cyan,
  glow = C.cyan,
  coreWidth = 2.5,
  glowWidth = 11,
  opacity = 1,
  highlight = true,
  highlightSpeed = 9,
  pulses,
  freezePulsesAt,
  arrows,
}) => {
  const L = route.length;
  const dp = draw ? prog(frame, draw.start, draw.dur, ezInOut) : 1;
  const rp = retract ? prog(frame, retract.start, retract.dur, ezInOut) : 0;
  const visible = Math.max(0, dp - rp);
  if (visible <= 0.001 || opacity <= 0.004) return null;

  // travelling highlight segment
  const hlLen = L * 0.11;
  const hlPos = ((frame * highlightSpeed) % (L + hlLen)) - hlLen;
  const hlVisible = highlight && dp > 0.15 && hlPos / L < dp - 0.02 && (hlPos + hlLen) / L > rp;

  const pulseEls: React.ReactNode[] = [];
  if (pulses) {
    const pf = freezePulsesAt !== undefined ? Math.min(frame, freezePulsesAt) : frame;
    for (let i = 0; i < pulses.count; i++) {
      const t = (pf * pulses.speed + i / pulses.count) % 1;
      if (t > dp - 0.01 || t < rp + 0.01) continue;
      const p = route.pointAt(t);
      const size = pulses.size ?? 5;
      pulseEls.push(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={size * 2.4} fill={core} opacity={0.16 * opacity} />
          <circle cx={p.x} cy={p.y} r={size} fill="#DFF8FF" opacity={0.95 * opacity} />
        </g>,
      );
    }
  }

  const arrowEls: React.ReactNode[] = [];
  if (arrows) {
    for (const t of arrows) {
      if (dp < t + 0.02 || t < rp) continue;
      const p = route.pointAt(t);
      const o = clamp01((dp - t) * 14) * 0.9;
      arrowEls.push(
        <g key={t} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.angle.toFixed(1)})`}>
          <path d="M -7 -6.5 L 10 0 L -7 6.5 L -2.5 0 Z" fill={core} opacity={o * opacity} />
        </g>,
      );
    }
  }

  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`${idPrefix}-blur`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={glowWidth * 0.55} />
        </filter>
      </defs>
      {/* glow */}
      <path
        d={route.d}
        fill="none"
        stroke={glow}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        opacity={0.28}
        filter={`url(#${idPrefix}-blur)`}
        strokeDasharray={`${(visible * L).toFixed(1)} ${L.toFixed(1)}`}
        strokeDashoffset={(-rp * L).toFixed(1)}
      />
      {/* sharp core */}
      <path
        d={route.d}
        fill="none"
        stroke={core}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        strokeDasharray={`${(visible * L).toFixed(1)} ${L.toFixed(1)}`}
        strokeDashoffset={(-rp * L).toFixed(1)}
      />
      {/* inner bright line */}
      <path
        d={route.d}
        fill="none"
        stroke="#CDF3FF"
        strokeWidth={Math.max(0.8, coreWidth * 0.35)}
        strokeLinecap="round"
        opacity={0.55}
        strokeDasharray={`${(visible * L).toFixed(1)} ${L.toFixed(1)}`}
        strokeDashoffset={(-rp * L).toFixed(1)}
      />
      {hlVisible ? (
        <path
          d={route.d}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={coreWidth + 1.2}
          strokeLinecap="round"
          opacity={0.7}
          strokeDasharray={`${hlLen.toFixed(1)} ${(L + hlLen).toFixed(1)}`}
          strokeDashoffset={(-hlPos).toFixed(1)}
        />
      ) : null}
      {arrowEls}
      {pulseEls}
    </g>
  );
};
