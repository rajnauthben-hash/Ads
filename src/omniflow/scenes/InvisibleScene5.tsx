import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";

// Hub node at center
const HubNode: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 24], [0.7, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  // Slow pulse
  const pulse = interpolate(frame % 90, [0, 45, 90], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        scale: scale.toString(),
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${C.cyan}CC 0%, ${C.blue}88 60%, rgba(8,15,34,0.9) 100%)`,
        boxShadow: `0 0 60px ${C.cyan}50, 0 0 120px ${C.cyan}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Outer pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: -16,
          borderRadius: "50%",
          border: `1.5px solid ${C.cyan}40`,
          scale: pulse.toString(),
        }}
      />
      <div style={{ fontSize: 36 }}>⚡</div>
    </div>
  );
};

// Orbit node (smaller satellite around hub)
const OrbitNode: React.FC<{
  icon: string;
  label: string;
  angle: number; // degrees
  radius: number;
  delay: number;
  accentColor?: string;
}> = ({ icon, label, angle, radius, delay, accentColor = C.cyan }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 22], [0.5, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  // Slow orbit drift
  const orbitDrift = interpolate(frame, [0, 300], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentAngle = (angle + orbitDrift) * (Math.PI / 180);
  const x = Math.cos(currentAngle) * radius;
  const y = Math.sin(currentAngle) * radius;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        translate: `calc(-50% + ${x}px) calc(-50% + ${y}px)`,
        opacity,
        scale: scale.toString(),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        fontFamily,
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 18,
          background: "rgba(8,15,34,0.92)",
          border: `1.5px solid ${accentColor}40`,
          boxShadow: `0 0 24px ${accentColor}20, 0 8px 24px rgba(0,0,0,0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          backdropFilter: "blur(16px)",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          color: C.offWhite,
          fontSize: 15,
          fontWeight: 600,
          whiteSpace: "nowrap" as const,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// SVG orbit line from center to node
const OrbitLine: React.FC<{
  angle: number;
  radius: number;
  delay: number;
  color: string;
}> = ({ angle, radius, delay, color }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const progress = interpolate(f, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const opacity = interpolate(f, [0, 12], [0, 0.55], { extrapolateRight: "clamp" });

  const currentAngle = angle * (Math.PI / 180);
  const x2 = Math.cos(currentAngle) * radius * progress;
  const y2 = Math.sin(currentAngle) * radius * progress;

  const cx = 540; // center x of 1080
  const cy = 860; // center y of hub in 1920

  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      width={1080}
      height={1920}
    >
      <defs>
        <linearGradient id={`grad-${angle}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <line
        x1={cx}
        y1={cy}
        x2={cx + x2}
        y2={cy + y2}
        stroke={color}
        strokeWidth="1.5"
        opacity={opacity}
        strokeDasharray="6 4"
      />
    </svg>
  );
};

export const InvisibleScene5: React.FC = () => {
  // Hub sits at ~y=860 in the 1920 canvas (slightly above center)
  const HUB_Y_OFFSET = -100; // relative to AbsoluteFill center

  return (
    <SceneFade totalFrames={100} fadeIn={10} fadeOut={12}>
      <AbsoluteFill style={{ background: "#030912" }}>

        {/* Ambient center glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "44%",
            translate: "-50% -50%",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(107,142,255,0.05) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Orbit lines — drawn from hub center to each node */}
        <OrbitLine angle={-90} radius={240} delay={10} color={C.cyan} />
        <OrbitLine angle={-30} radius={260} delay={14} color={C.blue} />
        <OrbitLine angle={30} radius={260} delay={18} color={C.cyan} />
        <OrbitLine angle={90} radius={240} delay={22} color={C.blue} />
        <OrbitLine angle={150} radius={260} delay={26} color={C.cyan} />
        <OrbitLine angle={210} radius={260} delay={30} color={C.blue} />

        {/* Satellite orbit nodes */}
        <OrbitNode icon="🌐" label="Website"     angle={-90}  radius={240} delay={12} accentColor={C.cyan} />
        <OrbitNode icon="📍" label="Google Maps"  angle={-30}  radius={260} delay={16} accentColor={C.blue} />
        <OrbitNode icon="📈" label="Analytics"   angle={30}   radius={260} delay={20} accentColor={C.cyan} />
        <OrbitNode icon="✉"  label="Leads"       angle={90}   radius={240} delay={24} accentColor={C.blue} />
        <OrbitNode icon="⚙️" label="Automation"  angle={150}  radius={260} delay={28} accentColor={C.cyan} />
        <OrbitNode icon="📡" label="Visibility"  angle={210}  radius={260} delay={32} accentColor={C.blue} />

        {/* Center hub */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginTop: HUB_Y_OFFSET * 2, position: "relative", zIndex: 3 }}>
            <HubNode delay={4} />
          </div>
        </AbsoluteFill>

        {/* Text block — bottom */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px",
            paddingBottom: 180,
          }}
        >
          <TextReveal delay={40} duration={20}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.white,
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                marginBottom: 14,
              }}
            >
              Turn your business into a{" "}
              <span style={{ color: C.cyan }}>digital powerhouse.</span>
            </div>
          </TextReveal>
          <TextReveal delay={58} duration={20}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.textSub,
                fontSize: 42,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.45,
              }}
            >
              Built to impress. Designed to convert.
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
