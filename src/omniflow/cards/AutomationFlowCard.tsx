import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";

const Node: React.FC<{
  label: string;
  icon: string;
  delay: number;
  accentColor?: string;
}> = ({ label, icon, delay, accentColor = C.cyan }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 18], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        opacity,
        scale: scale.toString(),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `rgba(${accentColor === C.cyan ? "0,212,255" : "107,142,255"}, 0.1)`,
          border: `1.5px solid ${accentColor}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          boxShadow: `0 0 20px ${accentColor}20`,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          color: C.offWhite,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const ConnectorLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const progress = interpolate(f, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        paddingBottom: 24,
        flexShrink: 0,
      }}
    >
      {/* Animated line */}
      <div
        style={{
          height: 1.5,
          width: 40,
          background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.blue} 100%)`,
          opacity: progress,
          borderRadius: 1,
          boxShadow: `0 0 6px ${C.cyan}60`,
        }}
      />
      {/* Arrow head */}
      <div
        style={{
          opacity: progress,
          color: C.cyan,
          fontSize: 14,
          lineHeight: 1,
          marginLeft: -1,
          paddingBottom: 1,
        }}
      >
        ▶
      </div>
    </div>
  );
};

export const AutomationFlowCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        fontFamily,
        opacity,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "24px 28px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: C.textSub, fontSize: 18, fontWeight: 500, marginBottom: 20 }}>
        Automation flow
      </div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Node label="Website" icon="🌐" delay={delay + 8} accentColor={C.blue} />
        <ConnectorLine delay={delay + 18} />
        <Node label="Lead" icon="✉" delay={delay + 24} />
        <ConnectorLine delay={delay + 34} />
        <Node label="Follow-up" icon="⚡" delay={delay + 40} accentColor={C.blue} />
      </div>
    </div>
  );
};
