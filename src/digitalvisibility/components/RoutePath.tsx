import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { C } from "../styles";

/**
 * The persistent electric-cyan route — the visual spine of the whole film.
 * One SVG in the shared 1080×1920 map coordinate space, supporting: draw
 * progress, a moving pulse, an arrowhead, a start node, a destination ring,
 * a red break point, and a dim dotted "unresolved" alternative path.
 */
export const RoutePath: React.FC<{
  d: string;
  progress: number; // 0..1 active draw amount
  width?: number;
  color?: string;
  glow?: number; // glow intensity multiplier
  startNode?: boolean;
  arrow?: boolean;
  pulse?: boolean; // travelling energy pulse once drawn
  /** Dim dashed alternative path (the failed/unresolved route). */
  dotted?: string;
  dottedProgress?: number;
  /** Red break marker at this 0..1 position along the path (scene 2). */
  breakAt?: number;
  /** Expanding destination ring at this point when the pulse arrives. */
  destination?: { x: number; y: number };
  destinationActive?: number; // 0..1
  flicker?: number;
}> = ({
  d,
  progress,
  width = 8,
  color = C.cyan,
  glow = 1,
  startNode,
  arrow,
  pulse,
  dotted,
  dottedProgress = 1,
  breakAt,
  destination,
  destinationActive = 0,
  flicker = 0,
}) => {
  const frame = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = Math.max(0, Math.min(1, progress));

  const breathe = 0.85 + 0.15 * Math.sin(frame / 10);
  const flick = flicker > 0 ? 1 - flicker * 0.3 * (0.5 + 0.5 * Math.sin(frame * 1.6) * Math.sin(frame * 0.57)) : 1;

  const tip = p > 0.001 ? getPointAtLength(d, len * p) : null;
  const prev = p > 0.006 ? getPointAtLength(d, len * Math.max(0, p - 0.01)) : null;
  const angle = tip && prev ? (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI : 0;

  const start = useMemo(() => getPointAtLength(d, 0), [d]);
  const brk = breakAt != null ? getPointAtLength(d, len * breakAt) : null;

  // travelling pulse
  const pulseT = pulse && p >= 0.6 ? (frame % 70) / 70 : null;
  const pulsePt = pulseT !== null ? getPointAtLength(d, len * Math.min(p, pulseT)) : null;

  const stroke = (col: string, w: number, op: number, blur?: number, prg = p) => (
    <path
      d={d}
      fill="none"
      stroke={col}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - prg}
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
      {/* dim dotted unresolved alternative */}
      {dotted && (
        <path
          d={dotted}
          fill="none"
          stroke="rgba(155,165,171,0.5)"
          strokeWidth={width * 0.55}
          strokeLinecap="round"
          strokeDasharray="2 12"
          pathLength={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, dottedProgress))}
          opacity={0.7}
        />
      )}

      {/* glow + core layers */}
      {stroke(color, width * 4.4, 0.16 * glow * flick * breathe, 15)}
      {stroke(C.cyan2, width * 2.0, 0.4 * glow * flick, 4)}
      {stroke(C.cyanSoft, width, 0.95 * flick)}
      {stroke("#EAFDFF", width * 0.36, 0.9 * flick)}

      {startNode && p > 0.001 && (
        <g opacity={flick}>
          <circle cx={start.x} cy={start.y} r={width * 1.7} fill="#EAFDFF" />
          <circle cx={start.x} cy={start.y} r={width * 3.2} fill="none" stroke={C.panelOutline} strokeWidth={2.4} />
          <circle
            cx={start.x}
            cy={start.y}
            r={width * (3.4 + 2.6 * ((frame % 48) / 48))}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.5 * (1 - (frame % 48) / 48)}
          />
        </g>
      )}

      {arrow && tip && p > 0.05 && p < 0.999 && (
        <g transform={`translate(${tip.x}, ${tip.y}) rotate(${angle})`} opacity={flick}>
          <path d="M-3,-13 L22,0 L-3,13 L3,0 Z" fill="#DFFBFF" />
          <path d="M-3,-13 L22,0 L-3,13 L3,0 Z" fill={color} opacity={0.5} style={{ filter: "blur(7px)" }} />
        </g>
      )}

      {!arrow && tip && p > 0.02 && p < 0.999 && (
        <circle cx={tip.x} cy={tip.y} r={width * 1.2} fill="#EAFDFF" opacity={flick} style={{ filter: "blur(1px)" }} />
      )}

      {pulsePt && (
        <g opacity={0.9 * flick}>
          <circle cx={pulsePt.x} cy={pulsePt.y} r={width * 0.85} fill="#FFFFFF" />
          <circle cx={pulsePt.x} cy={pulsePt.y} r={width * 2.4} fill={color} opacity={0.35} style={{ filter: "blur(6px)" }} />
        </g>
      )}

      {/* red break marker */}
      {brk && (
        <g opacity={Math.min(1, (breakAt != null ? 1 : 0))}>
          <circle cx={brk.x} cy={brk.y} r={width * 2.2} fill="rgba(255,87,77,0.18)" style={{ filter: "blur(4px)" }} />
          <path
            d={`M${brk.x - 14},${brk.y - 14} L${brk.x + 14},${brk.y + 14} M${brk.x + 14},${brk.y - 14} L${brk.x - 14},${brk.y + 14}`}
            stroke={C.red}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* destination ring */}
      {destination && destinationActive > 0.01 && (
        <g>
          <circle
            cx={destination.x}
            cy={destination.y}
            r={width * (2 + 3 * ((frame % 44) / 44))}
            fill="none"
            stroke={color}
            strokeWidth={2.4}
            opacity={destinationActive * 0.6 * (1 - (frame % 44) / 44)}
          />
          <circle cx={destination.x} cy={destination.y} r={width * 1.4} fill={color} opacity={destinationActive * 0.9} />
          <circle cx={destination.x} cy={destination.y} r={width * 3} fill={color} opacity={destinationActive * 0.3} style={{ filter: "blur(6px)" }} />
        </g>
      )}
    </svg>
  );
};
