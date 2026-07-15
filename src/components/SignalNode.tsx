import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_MONO } from "../config/fonts";
import { Icon, type IconName } from "./Icons";
import { RoutePath } from "./RoutePath";
import type { Pt } from "./pathMath";

export const SignalNode: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  bendX: number;
  bendY: number;
  storeX: number;
  storeY: number;
  icon: IconName;
  label: string;
  gold?: boolean;
  showStars?: boolean;
}> = ({ frame, start, x, y, bendX, bendY, storeX, storeY, icon, label, gold = false, showStars = false }) => {
  const local = frame - start;
  const pathProgress = interpolate(local, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });
  const nodeIn = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.bezier(0.34, 1.4, 0.64, 1)),
  });
  const pulse = interpolate(local, [16, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const points: Pt[] = [
    { x: storeX, y: storeY },
    { x: bendX, y: bendY },
    { x, y },
  ];

  return (
    <>
      <RoutePath
        points={points}
        frame={frame}
        progress={pathProgress}
        opacity={0.9}
        particleCount={1}
        particleSpeed={0.006}
        strokeWidth={2}
        arrow={false}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) scale(${0.7 + nodeIn * 0.3})`,
          opacity: nodeIn,
        }}
      >
        <svg width={128} height={128} style={{ position: "absolute", left: -10, top: -10, overflow: "visible" }}>
          <circle cx={64} cy={64} r={54} fill="rgba(0,210,255,0.04)" stroke={COLORS.cyan} strokeWidth={1.5} opacity={0.7} />
          <circle
            cx={64}
            cy={64}
            r={54 + pulse * 16}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={1.2}
            opacity={(1 - pulse) * 0.4}
          />
        </svg>
        <div
          style={{
            width: 108,
            height: 108,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showStars ? (
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={16} filled color={COLORS.gold} />
              ))}
            </div>
          ) : (
            <Icon name={icon} size={34} color={gold ? COLORS.gold : COLORS.cyan} filled={gold} />
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: 118,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: FONT_MONO,
            fontSize: 17,
            letterSpacing: "0.12em",
            color: COLORS.textPrimary,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};
