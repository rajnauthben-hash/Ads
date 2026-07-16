import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { COLORS } from "./theme";

export type PinIcon = "none" | "star" | "fork" | "coffee" | "bag" | "dumbbell";

type Props = {
  x: number;
  y: number;
  // Local frame at which the pin drops in.
  appearFrame: number;
  scale?: number;
  color?: string;
  // 0..1 — glow strength once landed.
  glow?: number;
  // If set, the pin emits a single stronger pulse at this local frame.
  pulseAt?: number;
  dim?: boolean;
  icon?: PinIcon;
  // 0..2 — richness of the ground ring system.
  ringRichness?: number;
  // Flat body fill overriding the gold gradient (e.g. cyan business pin).
  flatBody?: string;
  seed?: number;
};

export const IconGlyph: React.FC<{ icon: PinIcon; c: string }> = ({ icon, c }) => {
  switch (icon) {
    case "star":
      return (
        <path
          d="M 0 -9 L 2.7 -2.9 L 9.4 -2.6 L 4.2 1.7 L 6 8.2 L 0 4.5 L -6 8.2 L -4.2 1.7 L -9.4 -2.6 L -2.7 -2.9 Z"
          fill={c}
          transform="translate(0 -30)"
        />
      );
    case "fork":
      return (
        <g transform="translate(0 -31)" stroke={c} strokeWidth={1.8} strokeLinecap="round">
          <line x1={-4} y1={-7} x2={-4} y2={7} />
          <line x1={-6.5} y1={-7} x2={-6.5} y2={-2} />
          <line x1={-1.5} y1={-7} x2={-1.5} y2={-2} />
          <path d="M 4.5 7 L 4.5 -1 C 2.5 -2 2.5 -7 4.5 -7 C 6.5 -7 6.5 -2 4.5 -1" fill="none" />
        </g>
      );
    case "coffee":
      return (
        <g transform="translate(0 -31)" stroke={c} strokeWidth={1.8} fill="none" strokeLinecap="round">
          <path d="M -6 -3 L -6 4 A 3 3 0 0 0 -3 7 L 2 7 A 3 3 0 0 0 5 4 L 5 -3 Z" />
          <path d="M 5 -1 A 3 3 0 0 1 5 3.4" />
          <line x1={-3} y1={-6} x2={-3} y2={-4.5} />
          <line x1={0} y1={-7} x2={0} y2={-4.5} />
        </g>
      );
    case "bag":
      return (
        <g transform="translate(0 -31)" stroke={c} strokeWidth={1.8} fill="none">
          <rect x={-6} y={-3} width={12} height={10} rx={2} />
          <path d="M -3 -3 A 3 3.4 0 0 1 3 -3" />
        </g>
      );
    case "dumbbell":
      return (
        <g transform="translate(0 -31)" stroke={c} strokeWidth={1.8} strokeLinecap="round">
          <line x1={-4} y1={0} x2={4} y2={0} />
          <line x1={-5.5} y1={-4} x2={-5.5} y2={4} />
          <line x1={5.5} y1={-4} x2={5.5} y2={4} />
        </g>
      );
    default:
      return <circle cx={0} cy={-31} r={5.4} fill={c} />;
  }
};

// A premium gold map pin: gradient body, glyph, layered ground-ring system
// (solid + dashed + rotating), heartbeat glow and a few rising gold dust
// motes. Drops in with a soft landing pulse.
export const DestinationPin: React.FC<Props> = ({
  x,
  y,
  appearFrame,
  scale = 1,
  color = COLORS.gold,
  glow = 1,
  pulseAt,
  dim = false,
  icon = "none",
  ringRichness = 1,
  flatBody,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.3, 1),
  });
  if (drop <= 0) {
    return null;
  }
  const rise = (1 - drop) * -46;
  const heartbeat = 0.75 + 0.25 * Math.sin(frame * 0.13 + x * 0.05);
  const baseOpacity = dim ? 0.35 : 1;
  const gradId = `pinG${Math.round(x)}${Math.round(y)}`;

  const extraPulse =
    pulseAt !== undefined
      ? interpolate(frame, [pulseAt, pulseAt + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.01;

  // Rising gold dust motes.
  const dust = dim
    ? []
    : Array.from({ length: 3 }, (_, i) => {
        const cyc = ((frame * 0.014 + noise(seed, i)) % 1 + 1) % 1;
        return {
          dx: (noise(seed + 1, i) - 0.5) * 56,
          dy: -8 - cyc * 60,
          o: (1 - cyc) * 0.5 * drop,
          r: 1.2 + noise(seed + 2, i) * 1.4,
        };
      });

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={drop * baseOpacity}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2D48A" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#9E7B2E" />
        </linearGradient>
      </defs>

      {/* Ground ring system */}
      <g opacity={(dim ? 0.4 : 1) * drop}>
        <ellipse cx={0} cy={2} rx={26 * ringRichness} ry={9 * ringRichness} fill="none" stroke={color} strokeWidth={1.4} opacity={0.55 * heartbeat} />
        <ellipse cx={0} cy={2} rx={40 * ringRichness} ry={14 * ringRichness} fill="none" stroke={color} strokeWidth={1} opacity={0.3 * heartbeat} strokeDasharray="5 7" transform={`rotate(${frame * 0.5})`} style={{ transformOrigin: "0px 2px" }} />
        <ellipse cx={0} cy={2} rx={56 * ringRichness} ry={20 * ringRichness} fill="none" stroke={color} strokeWidth={0.8} opacity={0.16} />
        <ellipse cx={0} cy={2} rx={16} ry={5.5} fill={color} opacity={0.22 * heartbeat} />
      </g>

      {/* One stronger premium pulse */}
      {extraPulse < 1 && (
        <ellipse cx={0} cy={2} rx={20 + extraPulse * 90} ry={7 + extraPulse * 32} fill="none" stroke={color} strokeWidth={2} opacity={(1 - extraPulse) * 0.85} />
      )}

      {dust.map((d, i) => (
        <circle key={i} cx={d.dx} cy={d.dy} r={d.r} fill={color} opacity={d.o} />
      ))}

      <g transform={`translate(0 ${rise})`}>
        {/* Halo */}
        <circle cx={0} cy={-30} r={30} fill={color} opacity={0.13 * glow * heartbeat * (dim ? 0.3 : 1)} />
        <circle cx={0} cy={-30} r={18} fill={color} opacity={0.1 * glow * heartbeat * (dim ? 0.3 : 1)} />
        {/* Teardrop */}
        <path
          d="M 0 0 C -15 -18 -18 -25 -18 -34 A 18 18 0 1 1 18 -34 C 18 -25 15 -18 0 0 Z"
          fill={dim ? COLORS.slate : flatBody ?? `url(#${gradId})`}
          stroke={dim ? color : "rgba(0,0,0,0.35)"}
          strokeWidth={dim ? 1.5 : 1}
        />
        {dim ? (
          <circle cx={0} cy={-33} r={6} fill="rgba(224,184,91,0.4)" />
        ) : icon === "none" ? (
          <circle cx={0} cy={-33} r={6.4} fill={COLORS.bg} />
        ) : (
          <IconGlyph icon={icon} c="#141009" />
        )}
      </g>
    </g>
  );
};
