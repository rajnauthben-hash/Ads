import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_MONO } from "../config/fonts";
import { Icon, type IconName } from "./Icons";
import { smoothPath, polylineLength, pointAtFraction, type Pt } from "./pathMath";

export interface Callout {
  icon: IconName;
  label: string;
  value: string;
  pointIndex: number;
  calloutY: number;
}

export const MetricsGraph: React.FC<{
  frame: number;
  start: number;
  points: Pt[];
  callouts: Callout[];
  duration?: number;
}> = ({ frame, start, points, callouts, duration = 80 }) => {
  const local = frame - start;
  const progress = interpolate(local, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  const d = smoothPath(points);
  const secondary = smoothPath(points.map((p, i) => ({ x: p.x, y: p.y + 34 + i * 1.4 })));
  const length = polylineLength(points) * 1.1 + 20;
  const dashOffset = length * (1 - progress);
  const tip = pointAtFraction(points, progress);

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1} height={1}>
        <path
          d={secondary}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={1.4}
          strokeDasharray="2 8"
          opacity={0.28 * progress}
        />
        <path
          d={d}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.14}
          style={{ filter: "blur(6px)" }}
          strokeDasharray={length}
          strokeDashoffset={dashOffset}
        />
        <path
          d={d}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={dashOffset}
        />
        {points.map((p, i) => {
          const pointProgress = i / (points.length - 1);
          const shown = progress >= pointProgress - 0.02;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={COLORS.cyan}
              opacity={shown ? 0.9 : 0}
              style={{ filter: `drop-shadow(0 0 5px ${COLORS.cyan})` }}
            />
          );
        })}
        {progress > 0.03 && (
          <polygon
            points="0,-7 12,0 0,7"
            fill={COLORS.cyan}
            transform={`translate(${tip.x}, ${tip.y}) rotate(${tip.angle})`}
            style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyan})` }}
          />
        )}
        {callouts.map((c, i) => {
          const pt = points[c.pointIndex];
          const pointProgress = c.pointIndex / (points.length - 1);
          const shown = progress >= pointProgress;
          const guideOpacity = shown ? 0.3 : 0;
          return (
            <line
              key={i}
              x1={pt.x}
              y1={c.calloutY + 70}
              x2={pt.x}
              y2={pt.y}
              stroke={COLORS.cyan}
              strokeWidth={1.2}
              strokeDasharray="2 6"
              opacity={guideOpacity}
            />
          );
        })}
      </svg>
      {callouts.map((c, i) => {
        const pt = points[c.pointIndex];
        const pointProgress = c.pointIndex / (points.length - 1);
        const revealStart = start + pointProgress * duration;
        const localReveal = frame - revealStart;
        const p = interpolate(localReveal, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pt.x,
              top: c.calloutY,
              transform: "translateX(-50%)",
              opacity: p,
              translate: `0px ${(1 - p) * 12}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                border: `1.5px solid ${COLORS.cyan}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,210,255,0.05)",
              }}
            >
              <Icon name={c.icon} size={26} color={COLORS.cyan} />
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 16,
                letterSpacing: "0.1em",
                color: COLORS.textSecondary,
                whiteSpace: "nowrap",
              }}
            >
              {c.label}
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 28, fontWeight: 500, color: COLORS.cyan }}>
              {c.value}
            </div>
          </div>
        );
      })}
    </>
  );
};
