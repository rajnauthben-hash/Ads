import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { clamp01, smoothPath, splinePoint, type Pt } from "../helpers";
import { COLORS } from "../theme";

// ---------------------------------------------------------------------------
// EnergyLine — the layered cyan route treatment reused everywhere:
//   soft glow (10-18px) + core (3-5px) + a brighter travelling pulse segment
//   moving forward + optional directional arrowhead at the drawn tip.
// Drawn via strokeDashoffset so it grows from origin toward destination.
// ---------------------------------------------------------------------------
type LineProps = {
  points: Pt[];
  // 0..1 portion drawn.
  progress: number;
  frame: number;
  color?: string;
  coreWidth?: number;
  glowWidth?: number;
  glowOpacity?: number;
  arrow?: boolean;
  // Breaks the line at this t (0..1) — used for the "signal loss" beat.
  breakAt?: number;
  travellingPulse?: boolean;
  opacity?: number;
  seed?: number;
};

export const EnergyLine: React.FC<LineProps> = ({
  points,
  progress,
  frame,
  color = COLORS.cyan,
  coreWidth = 4,
  glowWidth = 14,
  glowOpacity = 0.22,
  arrow = false,
  breakAt,
  travellingPulse = true,
  opacity = 1,
  seed = 1,
}) => {
  const d = useMemo(() => smoothPath(points), [points]);
  const p = clamp01(progress);
  if (p <= 0.003) {
    return null;
  }
  // Optional break: draw only up to just before breakAt.
  const drawn = breakAt !== undefined ? Math.min(p, breakAt - 0.03) : p;
  const dashOffset = 100 * (1 - drawn);
  const pulseOffset = 100 - ((frame * 1.8 + seed * 20) % 128);

  const tip = splinePoint(points, drawn);
  const tipPrev = splinePoint(points, Math.max(0, drawn - 0.02));
  const ang = (Math.atan2(tip.y - tipPrev.y, tip.x - tipPrev.x) * 180) / Math.PI;

  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={glowWidth} strokeLinecap="round" opacity={glowOpacity} pathLength={100} strokeDasharray={100} strokeDashoffset={dashOffset} style={{ filter: "blur(3px)" }} />
      <path d={d} fill="none" stroke={color} strokeWidth={coreWidth} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={dashOffset} />
      {travellingPulse && (
        <path d={d} fill="none" stroke="#DFFBFF" strokeWidth={coreWidth + 1} strokeLinecap="round" pathLength={100} strokeDasharray="6 94" strokeDashoffset={pulseOffset} opacity={0.85 * drawn} />
      )}
      {arrow && drawn > 0.04 && (
        <g transform={`translate(${tip.x} ${tip.y}) rotate(${ang})`}>
          <path d="M -11 -9 L 7 0 L -11 9" fill="none" stroke="#EAFCFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// PersistentPulseRoute — the one signal that travels the ENTIRE 450 frames.
// Its head position is a continuous function of the global frame, so the
// heartbeat never resets between scenes. Rendered above the scenes as a thin
// comet so continuity reads even where scenes draw their own local routes.
// ---------------------------------------------------------------------------
const WAY: { f: number; p: Pt }[] = [
  { f: 0, p: { x: 185, y: 1330 } }, // S1 customer node
  { f: 40, p: { x: 640, y: 470 } }, // rises into phone search bar
  { f: 74, p: { x: 760, y: 250 } }, // search bar heartbeat
  { f: 100, p: { x: 620, y: 330 } }, // S2 network
  { f: 130, p: { x: 300, y: 1080 } }, // hardware node
  { f: 158, p: { x: 220, y: 1360 } }, // S3 customer origin
  { f: 196, p: { x: 840, y: 720 } }, // toward storefront
  { f: 230, p: { x: 470, y: 950 } }, // S4 route mid
  { f: 262, p: { x: 800, y: 360 } }, // diverts to competitor
  { f: 300, p: { x: 250, y: 1300 } }, // S5 spine base
  { f: 340, p: { x: 470, y: 640 } }, // up the diagnostic spine
  { f: 378, p: { x: 185, y: 1390 } }, // S6 customer node
  { f: 418, p: { x: 620, y: 900 } }, // completed route
  { f: 450, p: { x: 730, y: 545 } }, // storefront entrance
];

const posAt = (frame: number): Pt => {
  const f = Math.max(0, Math.min(450, frame));
  let i = 0;
  while (i < WAY.length - 2 && WAY[i + 1].f < f) {
    i++;
  }
  const a = WAY[i];
  const b = WAY[i + 1];
  const local = (f - a.f) / Math.max(1, b.f - a.f);
  const globalT = (i + clamp01(local)) / (WAY.length - 1);
  return splinePoint(
    WAY.map((w) => w.p),
    globalT,
  );
};

export const PersistentPulseRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const head = posAt(frame);
  const trail = Array.from({ length: 8 }, (_, i) => posAt(frame - (i + 1) * 1.7));
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {trail.map((pt, i) => {
        const k = 1 - i / trail.length;
        return <circle key={i} cx={pt.x} cy={pt.y} r={3 * k + 1} fill={COLORS.cyan} opacity={0.3 * k} />;
      })}
      <circle cx={head.x} cy={head.y} r={13} fill={COLORS.cyan} opacity={0.12} />
      <circle cx={head.x} cy={head.y} r={7} fill={COLORS.cyan} opacity={0.24} />
      <circle cx={head.x} cy={head.y} r={3} fill="#DFFBFF" />
    </svg>
  );
};
