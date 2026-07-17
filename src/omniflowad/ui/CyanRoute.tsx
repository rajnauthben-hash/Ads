import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { PAL } from "../theme";

/**
 * The persistent cyan signal of the film: a neon route drawn with the
 * trim-path technique, layered strokes for glow, optional tip arrow,
 * traveling pulse and start-point rings.
 */
export const CyanRoute: React.FC<{
  d: string;
  progress: number; // 0..1 drawn amount
  width?: number;
  opacity?: number;
  arrow?: boolean;
  startDot?: boolean;
  /** 0..1 — adds nervous flicker for the "failing" route of scene 07 */
  flicker?: number;
  /** loops a bright pulse along the path once fully drawn */
  travelPulse?: boolean;
}> = ({ d, progress, width = 11, opacity = 1, arrow, startDot, flicker = 0, travelPulse }) => {
  const frame = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = Math.max(0, Math.min(1, progress));

  const breathe = 0.82 + 0.18 * Math.sin(frame / 9);
  const flick = flicker > 0 ? 1 - flicker * 0.25 * (0.5 + 0.5 * Math.sin(frame * 1.7) * Math.sin(frame * 0.61)) : 1;
  const o = opacity * flick;

  const tip = p > 0.001 ? getPointAtLength(d, len * p) : null;
  const prev = p > 0.004 ? getPointAtLength(d, len * Math.max(0, p - 0.012)) : null;
  const angle = tip && prev ? (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI : 0;

  // Traveling energy pulse (post-draw)
  const pulseT = travelPulse && p >= 1 ? (frame % 90) / 90 : null;
  const pulsePt = pulseT !== null ? getPointAtLength(d, len * pulseT) : null;

  const start = useMemo(() => getPointAtLength(d, 0), [d]);

  const stroke = (color: string, w: number, op: number, blur?: number) => (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      opacity={op}
      style={blur ? { filter: `blur(${blur}px)` } : undefined}
    />
  );

  return (
    <svg
      viewBox="0 0 1080 1920"
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
    >
      {stroke(PAL.cyan, width * 4.6, 0.16 * o * breathe, 16)}
      {stroke("#2CDFF9", width * 2.1, 0.45 * o, 4)}
      {stroke("#9FF3FF", width, 0.95 * o)}
      {stroke("#EAFDFF", width * 0.38, 0.9 * o)}

      {startDot && p > 0.001 && (
        <g opacity={o}>
          <circle cx={start.x} cy={start.y} r={width * 1.7} fill="#9FF3FF" />
          <circle cx={start.x} cy={start.y} r={width * 3.2} fill="none" stroke={PAL.cyanOutline} strokeWidth={2.5} />
          <circle
            cx={start.x}
            cy={start.y}
            r={width * (3.4 + 2.4 * ((frame % 46) / 46))}
            fill="none"
            stroke={PAL.cyan}
            strokeWidth={2}
            opacity={0.5 * (1 - (frame % 46) / 46)}
          />
        </g>
      )}

      {arrow && tip && p > 0.05 && (
        <g transform={`translate(${tip.x}, ${tip.y}) rotate(${angle})`} opacity={o}>
          <path d="M-4,-16 L26,0 L-4,16 L4,0 Z" fill="#BFF7FF" style={{ filter: "blur(0.4px)" }} />
          <path d="M-4,-16 L26,0 L-4,16 L4,0 Z" fill={PAL.cyan} opacity={0.5} style={{ filter: "blur(8px)" }} />
        </g>
      )}

      {!arrow && tip && p > 0.02 && p < 1 && (
        <circle cx={tip.x} cy={tip.y} r={width * 1.25} fill="#EAFDFF" opacity={o} style={{ filter: "blur(1px)" }} />
      )}

      {pulsePt && (
        <g opacity={0.9 * o}>
          <circle cx={pulsePt.x} cy={pulsePt.y} r={width * 0.9} fill="#FFFFFF" />
          <circle cx={pulsePt.x} cy={pulsePt.y} r={width * 2.6} fill={PAL.cyan} opacity={0.35} style={{ filter: "blur(6px)" }} />
        </g>
      )}
    </svg>
  );
};
