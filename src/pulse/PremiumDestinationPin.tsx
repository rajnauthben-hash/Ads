import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { dampedSpring } from "./motion";
import { COLORS } from "./theme";

export type PinIcon = "none" | "star" | "fork" | "coffee" | "bag" | "dumbbell";

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

type Props = {
  x: number;
  y: number;
  // Local frame at which the pin activates.
  appearFrame: number;
  scale?: number;
  color?: string;
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

// Premium destination activation: a thin vertical light beam, a core flash,
// three ground rings expanding at different speeds and phase offsets, gold
// dust rise, a soft map reflection — then a seeded breathing settle with
// 1–2% scale variation so no two pins ever pulse in sync.
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
  const since = frame - appearFrame;
  if (since <= 0) {
    return null;
  }
  // Critically damped drop — settles without wobble.
  const drop = dampedSpring(since, 130, 0.9);
  const rise = (1 - drop) * -44;

  // Activation beam: rises and fades within the first ~16 frames.
  const beam = interpolate(since, [0, 5, 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Core flash follows the beam by a beat.
  const flash = interpolate(since, [4, 9, 20], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Seeded breathing — desynchronized per pin, 1.5% scale, small luminance.
  const breathePeriod = 0.09 + noise(seed, 1) * 0.05;
  const breathePhase = noise(seed, 2) * Math.PI * 2;
  const breathe = Math.sin(frame * breathePeriod + breathePhase);
  const settleScale = 1 + 0.015 * breathe * drop;
  const lum = 0.82 + 0.18 * (0.5 + 0.5 * breathe);

  const baseOpacity = dim ? 0.35 : 1;
  const gradId = `pinG${Math.round(x)}${Math.round(y)}`;
  const beamId = `beam${Math.round(x)}${Math.round(y)}`;

  const extraPulse =
    pulseAt !== undefined
      ? interpolate(frame, [pulseAt, pulseAt + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.01;

  // Three ground rings — different speeds, offset phases.
  const rings = [
    { speed: 0.011, off: 0, w: 1.4, o: 0.5 },
    { speed: 0.008, off: 0.37 + noise(seed, 3) * 0.2, w: 1.1, o: 0.32 },
    { speed: 0.0135, off: 0.68 + noise(seed, 4) * 0.2, w: 0.8, o: 0.2 },
  ];

  // Rising gold dust motes.
  const dust = dim
    ? []
    : Array.from({ length: 3 }, (_, i) => {
        const cyc = (((frame * 0.014 + noise(seed, i)) % 1) + 1) % 1;
        return {
          dx: (noise(seed + 1, i) - 0.5) * 56,
          dy: -8 - cyc * 60,
          o: (1 - cyc) * 0.5 * drop,
          r: 1.2 + noise(seed + 2, i) * 1.4,
        };
      });

  return (
    <g transform={`translate(${x} ${y}) scale(${scale * settleScale})`} opacity={drop * baseOpacity}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2D48A" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#9E7B2E" />
        </linearGradient>
        <linearGradient id={beamId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Soft map reflection beneath the node */}
      <ellipse cx={0} cy={4} rx={44 * ringRichness} ry={13 * ringRichness} fill={color} opacity={(dim ? 0.03 : 0.07) * lum * drop} />
      <ellipse cx={0} cy={4} rx={24 * ringRichness} ry={7 * ringRichness} fill={color} opacity={(dim ? 0.04 : 0.1) * lum * drop} />

      {/* Activation light beam */}
      {beam > 0.01 && (
        <rect x={-2.2} y={-190 * beam - 40} width={4.4} height={190 * beam} fill={`url(#${beamId})`} opacity={0.85 * beam * (dim ? 0.3 : 1)} />
      )}

      {/* Ground rings — expanding at three different rates */}
      <g opacity={(dim ? 0.4 : 1) * drop}>
        {rings.map((r, i) => {
          const ph = (frame * r.speed + r.off) % 1;
          const rr = (14 + ph * 46 * ringRichness) * (1 + 0.06 * i);
          return (
            <ellipse
              key={i}
              cx={0}
              cy={2}
              rx={rr}
              ry={rr * 0.36}
              fill="none"
              stroke={color}
              strokeWidth={r.w}
              opacity={r.o * (1 - ph) * lum}
            />
          );
        })}
        <ellipse cx={0} cy={2} rx={40 * ringRichness} ry={14 * ringRichness} fill="none" stroke={color} strokeWidth={1} opacity={0.24 * lum} strokeDasharray="5 7" transform={`rotate(${frame * 0.5})`} />
        <ellipse cx={0} cy={2} rx={16} ry={5.5} fill={color} opacity={0.22 * lum} />
      </g>

      {/* One stronger premium pulse */}
      {extraPulse < 1 && (
        <ellipse cx={0} cy={2} rx={20 + extraPulse * 90} ry={7 + extraPulse * 32} fill="none" stroke={color} strokeWidth={2} opacity={(1 - extraPulse) * 0.85} />
      )}

      {dust.map((d, i) => (
        <circle key={i} cx={d.dx} cy={d.dy} r={d.r} fill={color} opacity={d.o} />
      ))}

      <g transform={`translate(0 ${rise})`}>
        {/* Halo with breathing luminance */}
        <circle cx={0} cy={-30} r={30} fill={color} opacity={0.13 * glow * lum * (dim ? 0.3 : 1)} />
        <circle cx={0} cy={-30} r={18} fill={color} opacity={0.1 * glow * lum * (dim ? 0.3 : 1)} />
        {/* Core illumination flash on activation */}
        {flash > 0.01 && <circle cx={0} cy={-33} r={10 + 8 * flash} fill="#FFF3D6" opacity={0.7 * flash * (dim ? 0.3 : 1)} />}
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
