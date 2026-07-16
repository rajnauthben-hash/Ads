import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "./theme";

type Props = {
  label: string;
  icon: "photos" | "reviews" | "categories" | "hours" | "updates";
  x: number;
  y: number;
  // Local frame at which this node activates.
  activateFrame: number;
  size?: number;
};

const Icon: React.FC<{ kind: Props["icon"]; a: number }> = ({ kind, a }) => {
  const c = `rgba(0, 210, 255, ${0.5 + 0.5 * a})`;
  const g = COLORS.goldWarm;
  switch (kind) {
    case "photos":
      return (
        <g>
          <rect x="-16" y="-13" width="32" height="26" rx="4" fill="none" stroke={c} strokeWidth={2.2} />
          <circle cx="-7" cy="-4" r="3" fill={g} />
          <path d="M -13 9 L -2 -2 L 5 5 L 10 0 L 15 5" fill="none" stroke={c} strokeWidth={2.2} />
        </g>
      );
    case "reviews":
      return (
        <path
          d="M 0 -15 L 4.4 -4.6 L 15.5 -4.2 L 6.8 2.8 L 9.8 13.6 L 0 7.4 L -9.8 13.6 L -6.8 2.8 L -15.5 -4.2 L -4.4 -4.6 Z"
          fill={g}
          opacity={0.35 + 0.65 * a}
        />
      );
    case "categories":
      return (
        <g stroke={c} strokeWidth={2.2} fill="none">
          <rect x="-15" y="-15" width="12" height="12" rx="3" />
          <rect x="3" y="-15" width="12" height="12" rx="3" fill={g} stroke="none" opacity={0.7} />
          <rect x="-15" y="3" width="12" height="12" rx="3" />
          <rect x="3" y="3" width="12" height="12" rx="3" />
        </g>
      );
    case "hours":
      return (
        <g>
          <circle cx="0" cy="0" r="14" fill="none" stroke={c} strokeWidth={2.2} />
          <path d="M 0 -8 L 0 0 L 7 4" fill="none" stroke={g} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g stroke={c} strokeWidth={2.2} fill="none" strokeLinecap="round">
          <path d="M -12 4 A 12 12 0 1 1 -8 10" />
          <path d="M -13 -2 L -12 5 L -5 3" fill="none" stroke={g} />
        </g>
      );
  }
};

// A large circular signal node with a mono label and gold accent. Activates
// with a ring burst, then keeps a quiet breathing glow while it feeds
// current to the storefront.
export const SignalNode: React.FC<Props> = ({
  label,
  icon,
  x,
  y,
  activateFrame,
  size = 132,
}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [activateFrame, activateFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.85, 0.3, 1),
  });
  if (a <= 0) {
    return null;
  }
  const burst = interpolate(frame, [activateFrame + 4, activateFrame + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 0.85 + 0.15 * Math.sin(frame * 0.1 + x * 0.03);
  const r = size / 2;

  return (
    <g transform={`translate(${x} ${y})`} opacity={a}>
      {burst > 0 && burst < 1 && (
        <circle
          cx={0}
          cy={0}
          r={r + burst * 46}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={1.8}
          opacity={(1 - burst) * 0.7}
        />
      )}
      <circle cx={0} cy={0} r={r} fill="rgba(18,19,20,0.94)" stroke={`rgba(0,210,255,${0.24 + 0.4 * a * breathe})`} strokeWidth={1.8} />
      <circle cx={0} cy={0} r={r - 9} fill="none" stroke="rgba(221,174,74,0.28)" strokeWidth={1} strokeDasharray="3 7" transform={`rotate(${frame * 0.6})`} />
      <g transform={`translate(0 -12) scale(${0.9 + 0.1 * a})`}>
        <Icon kind={icon} a={a} />
      </g>
      <text
        x={0}
        y={34}
        textAnchor="middle"
        fill={COLORS.text}
        fontFamily={FONTS.mono}
        fontWeight={500}
        fontSize={16}
        letterSpacing={3.4}
        opacity={a}
      >
        {label}
      </text>
    </g>
  );
};
