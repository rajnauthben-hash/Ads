import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

const CHIPS = [
  { label: "Premium Websites",         color: COL.cyan   },
  { label: "Google Maps Optimization", color: COL.blue   },
  { label: "Local Visibility",         color: COL.teal   },
  { label: "Digital Growth",           color: COL.violet },
];

const Chip: React.FC<{ label: string; color: string; delay: number }> = ({
  label, color, delay,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 22], [0.88, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        scale: sc.toString(),
        padding: "14px 26px",
        borderRadius: 50,
        background: `${color}12`,
        border: `1px solid ${color}35`,
        fontFamily: FONT,
        fontSize: 22,
        fontWeight: 600,
        color: COL.white,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap" as const,
        boxShadow: `0 0 20px ${color}10`,
      }}
    >
      {label}
    </div>
  );
};

export const ServiceChips: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 12,
      justifyContent: "center",
      maxWidth: 700,
    }}
  >
    {CHIPS.map((c, i) => (
      <Chip key={i} label={c.label} color={c.color} delay={delay + i * 10} />
    ))}
  </div>
);
