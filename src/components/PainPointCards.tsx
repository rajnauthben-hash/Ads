import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

interface PainCardProps {
  icon: string;
  title: string;
  sub: string;
  delay: number;
  color: string;
}

const PainCard: React.FC<PainCardProps> = ({ icon, title, sub, delay, color }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 24], [28, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Pulse glow on icon
  const pulse = 0.7 + Math.sin(((frame - delay) / 44) * Math.PI) * 0.3;

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 28px",
        borderRadius: 20,
        background: "rgba(8,12,28,0.92)",
        border: `1px solid ${color}28`,
        boxShadow: `0 0 32px ${color}0d, 0 20px 48px rgba(0,0,0,0.45)`,
        backdropFilter: "blur(20px)",
        width: 560,
      }}
    >
      {/* Icon block */}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: `${color}14`,
          border: `1px solid ${color}38`,
          boxShadow: `0 0 18px ${color}${Math.round(pulse * 0.25 * 255).toString(16).padStart(2, "0")}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            color: COL.white,
            letterSpacing: "-0.01em",
            marginBottom: 5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 19,
            fontWeight: 400,
            color: COL.muted,
            letterSpacing: "0.01em",
          }}
        >
          {sub}
        </div>
      </div>

      {/* Warning indicator */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}`,
          opacity: pulse,
          flexShrink: 0,
        }}
      />
    </div>
  );
};

export const PainPointCards: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const cards = [
    {
      icon: "🌐",
      title: "Outdated Website",
      sub: "Loses trust before they call",
      color: "#F59E0B",
      delay: delay,
    },
    {
      icon: "📍",
      title: "Weak Google Visibility",
      sub: "Buried under competitors",
      color: "#EF4444",
      delay: delay + 14,
    },
    {
      icon: "📵",
      title: "Missed Calls & Leads",
      sub: "Revenue walking out the door",
      color: "#F97316",
      delay: delay + 28,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      {cards.map((c, i) => (
        <PainCard key={i} {...c} />
      ))}
    </div>
  );
};
