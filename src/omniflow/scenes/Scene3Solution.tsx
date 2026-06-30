import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal, FadeIn } from "../TextReveal";
import { WebsiteMockup } from "../cards/WebsiteMockup";
import { FlowLine } from "../FlowLine";
import { LogoWordmark } from "../LogoWordmark";

// Small pill-shaped service badge that snaps into place
const ServiceBadge: React.FC<{
  label: string;
  icon: string;
  x: number;
  y: number;
  delay: number;
  accentColor?: string;
}> = ({ label, icon, x, y, delay, accentColor = C.cyan }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 20], [0.82, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        scale: scale.toString(),
        fontFamily,
        background: C.cardBg,
        border: `1px solid ${accentColor}35`,
        borderRadius: 14,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        backdropFilter: "blur(16px)",
        boxShadow: `0 0 24px ${accentColor}10, 0 6px 20px rgba(0,0,0,0.4)`,
        whiteSpace: "nowrap" as const,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: C.offWhite, fontSize: 20, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

export const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();

  // Center glow that expands as system "comes together"
  const glowScale = interpolate(frame, [20, 70], [0.6, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const glowOpacity = interpolate(frame, [10, 40], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFade totalFrames={130} fadeIn={10} fadeOut={14}>
      <AbsoluteFill>

        {/* Center connection glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "46%",
            translate: "-50% -50%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(0,212,255,0.14) 0%, rgba(107,142,255,0.08) 50%, transparent 70%)`,
            opacity: glowOpacity,
            scale: glowScale.toString(),
          }}
        />

        {/* Flow lines — from center mockup outward to badges */}
        <FlowLine x1={540} y1={820} x2={180} y2={620} delay={35} duration={28} color="rgba(0,212,255,0.35)" glowColor={C.cyanGlow} />
        <FlowLine x1={540} y1={820} x2={900} y2={640} delay={40} duration={28} color="rgba(107,142,255,0.35)" glowColor={C.blueGlow} />
        <FlowLine x1={540} y1={1060} x2={180} y2={1220} delay={45} duration={28} color="rgba(0,212,255,0.35)" glowColor={C.cyanGlow} />
        <FlowLine x1={540} y1={1060} x2={900} y2={1200} delay={50} duration={28} color="rgba(107,142,255,0.35)" glowColor={C.blueGlow} />

        {/* Service badges — positioned around the mockup */}
        <ServiceBadge label="Website"    icon="🌐" x={36}  y={570}  delay={36} accentColor={C.cyan} />
        <ServiceBadge label="Analytics"  icon="📈" x={640} y={570}  delay={42} accentColor={C.blue} />
        <ServiceBadge label="Automation" icon="⚡" x={36}  y={1180} delay={48} accentColor={C.blue} />
        <ServiceBadge label="Leads"      icon="✉" x={640} y={1180} delay={54} accentColor={C.cyan} />

        {/* Central layout column */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
          }}
        >
          {/* Logo */}
          <FadeIn delay={4} duration={20}>
            <LogoWordmark delay={0} size="md" />
          </FadeIn>

          {/* Website mockup */}
          <WebsiteMockup delay={18} width={540} height={360} />

          {/* Text block */}
          <div style={{ textAlign: "center", padding: "0 80px" }}>
            <TextReveal delay={28} duration={20}>
              <div
                style={{
                  fontFamily,
                  color: C.white,
                  fontSize: 72,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Websites.{" "}
                <span style={{ color: C.cyan }}>Automation.</span>
                {" "}Digital systems.
              </div>
            </TextReveal>
            <TextReveal delay={44} duration={20}>
              <div
                style={{
                  fontFamily,
                  color: C.textSub,
                  fontSize: 40,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                Built to work together.
              </div>
            </TextReveal>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
