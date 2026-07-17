import React, { useMemo } from "react";
import { clamp01, smoothPath, splinePoint, type Pt } from "./helpers";
import { ReactiveMapGlow } from "./ReactiveMapGlow";
import { pulsePhase, TravellingPulse } from "./TravellingPulse";
import { COLORS } from "./theme";

// The route as a layered energy system:
//   1. very soft atmospheric bloom (14–22px)
//   2. medium glow (5–8px)
//   3. sharp cyan core (2–5px)
//   4. optional white-hot filament
//   5. travelling highlight segment
//   6. eased data packets (TravellingPulse)
//   7. directional chevrons that creep forward
//   8. a reactive pool of light under the lead packet + a destination
//      reaction as packets arrive
type Props = {
  points: Pt[];
  // 0..1 — how much of the path has been drawn.
  progress: number;
  color?: string;
  coreWidth?: number;
  glowWidth?: number;
  glowOpacity?: number;
  pulses?: number;
  frame: number;
  arrows?: boolean;
  chevrons?: number;
  hot?: boolean;
  // Illumination response on nearby map geometry.
  mapGlow?: boolean;
  opacity?: number;
  seed?: number;
};

export const EnergyRoute: React.FC<Props> = ({
  points,
  progress,
  color = COLORS.cyan,
  coreWidth = 2,
  glowWidth = 10,
  glowOpacity = 0.16,
  pulses = 2,
  frame,
  arrows = false,
  chevrons = 0,
  hot = false,
  mapGlow = true,
  opacity = 1,
  seed = 1,
}) => {
  const d = useMemo(() => smoothPath(points), [points]);
  const p = clamp01(progress);
  if (p <= 0.003) {
    return null;
  }
  const dashOffset = 100 * (1 - p);
  const highlightOffset = 100 - ((frame * 1.7 + seed * 23) % 130);

  // Lead packet drives the reactive map illumination.
  const leadT = pulses > 0 ? pulsePhase(frame, 0, pulses, seed, 0.013) * p : 0;
  const leadPos = splinePoint(points, leadT);
  const end = points[points.length - 1];
  // Destination reacts as the lead packet closes in.
  const arrival = p >= 0.98 && leadT > 0.84 * p ? (leadT / p - 0.84) / 0.16 : 0;

  const chevronCount = chevrons > 0 ? chevrons : arrows ? 3 : 0;

  return (
    <g opacity={opacity}>
      {/* Reactive light pooling beneath the energy */}
      {mapGlow && <ReactiveMapGlow x={leadPos.x} y={leadPos.y} r={glowWidth * 7} color={color} strength={p} />}
      {arrival > 0 && <ReactiveMapGlow x={end.x} y={end.y} r={glowWidth * 5} color={color} strength={arrival * 0.9} />}

      {/* 1 — atmospheric bloom */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={glowWidth * 2.1}
        strokeLinecap="round"
        opacity={glowOpacity * (hot ? 0.5 : 0.32)}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
      />
      {/* 2 — medium glow */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={glowWidth}
        strokeLinecap="round"
        opacity={glowOpacity}
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
      />
      {/* 3 — sharp core */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
      />
      {/* 4 — white-hot filament */}
      {hot && (
        <path
          d={d}
          fill="none"
          stroke="#E9FCFF"
          strokeWidth={Math.max(1.4, coreWidth * 0.42)}
          strokeLinecap="round"
          opacity={0.85}
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={dashOffset}
        />
      )}
      {/* 5 — travelling highlight segment */}
      <path
        d={d}
        fill="none"
        stroke="#DFFBFF"
        strokeWidth={coreWidth + 0.6}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="7 93"
        strokeDashoffset={highlightOffset}
        opacity={0.8 * p}
      />
      {/* 6 — chevrons creeping forward */}
      {chevronCount > 0 &&
        Array.from({ length: chevronCount }, (_, i) => {
          const t = (((i + 0.55) / chevronCount + frame * 0.0011) % 1) * p;
          if (t < 0.05) {
            return null;
          }
          const a = splinePoint(points, Math.max(0, t - 0.015));
          const b = splinePoint(points, Math.min(1, t + 0.015));
          const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          const s = 0.8 + coreWidth * 0.16;
          return (
            <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${ang}) scale(${s})`}>
              <path d="M -8 -7 L 6 0 L -8 7" fill="none" stroke="#DFFBFF" strokeWidth={3} opacity={0.95} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      {/* 7 — eased data packets */}
      <TravellingPulse points={points} progress={p} frame={frame} count={pulses} seed={seed} color={color} speed={0.013} />
    </g>
  );
};
