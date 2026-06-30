import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";
import { LogoWordmark } from "../LogoWordmark";

const FloatingMiniCard: React.FC<{
  label: string;
  icon: string;
  x: number;
  y: number;
  delay: number;
  driftX?: number;
  driftY?: number;
}> = ({ label, icon, x, y, delay, driftX = 0, driftY = -6 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 20], [0, 0.72], { extrapolateRight: "clamp" });

  // Gentle float
  const floatY = interpolate(frame % 120, [0, 60, 120], [0, driftY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const floatX = interpolate(frame % 160, [0, 80, 160], [0, driftX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        translate: `${floatX}px ${floatY}px`,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 14,
        padding: "12px 16px",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily,
        whiteSpace: "nowrap" as const,
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ color: C.offWhite, fontSize: 17, fontWeight: 500 }}>{label}</span>
    </div>
  );
};

// Slow push-in scale for camera feel
const useCameraPush = (startFrame: number, endFrame: number, fromScale: number, toScale: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, endFrame], [fromScale, toScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0, 0, 0.2, 1),
  });
};

export const Scene1Hook: React.FC = () => {
  const cameraScale = useCameraPush(0, 90, 1.04, 1.0);

  return (
    <SceneFade totalFrames={95} fadeIn={10} fadeOut={12}>
      <AbsoluteFill
        style={{
          scale: cameraScale.toString(),
          transformOrigin: "center center",
        }}
      >
        {/* Floating mini cards — decorative depth layer */}
        <FloatingMiniCard label="Website" icon="🌐" x={72} y={360} delay={8} driftX={3} driftY={-5} />
        <FloatingMiniCard label="Lead form" icon="✉" x={660} y={290} delay={14} driftX={-4} driftY={-8} />
        <FloatingMiniCard label="Automation" icon="⚡" x={88} y={1420} delay={20} driftX={5} driftY={6} />
        <FloatingMiniCard label="Analytics" icon="📈" x={628} y={1460} delay={12} driftX={-3} driftY={5} />
        <FloatingMiniCard label="Visibility" icon="📍" x={340} y={220} delay={18} driftX={2} driftY={-6} />

        {/* Center hero text */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 96px",
            gap: 0,
          }}
        >
          {/* Logo at top of text block */}
          <div style={{ marginBottom: 56 }}>
            <LogoWordmark delay={4} size="sm" />
          </div>

          {/* Main headline */}
          <TextReveal delay={10} duration={24}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                lineHeight: 1.18,
              }}
            >
              <span
                style={{
                  display: "block",
                  color: C.white,
                  fontSize: 96,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                Your business
              </span>
              <span
                style={{
                  display: "block",
                  color: C.white,
                  fontSize: 96,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 4,
                }}
              >
                deserves
              </span>
              <span
                style={{
                  display: "block",
                  color: C.white,
                  fontSize: 96,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                }}
              >
                more than
              </span>
            </div>
          </TextReveal>
          <TextReveal delay={22} duration={24}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.blue} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.18,
              }}
            >
              just a website.
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
