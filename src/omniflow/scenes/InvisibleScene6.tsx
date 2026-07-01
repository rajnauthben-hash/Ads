import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, FadeIn } from "../TextReveal";
import { LogoWordmark } from "../LogoWordmark";

// Horizontal divider line that draws in
const DrawLine: React.FC<{ delay: number; color?: string }> = ({ delay, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const width = interpolate(f, [0, 24], [0, 260], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(f, [0, 12], [0, 0.45], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width,
        height: 1.5,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity,
        borderRadius: 2,
      }}
    />
  );
};

export const InvisibleScene6: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle background pulse
  const glowOpacity = interpolate(frame, [0, 30, 55], [0, 0.3, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFade totalFrames={55} fadeIn={8} fadeOut={10}>
      <AbsoluteFill
        style={{
          background: "#020710",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Center glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(107,142,255,0.06) 45%, transparent 70%)`,
            opacity: glowOpacity,
            pointerEvents: "none",
          }}
        />

        {/* Content stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <FadeIn delay={4} duration={20}>
            <LogoWordmark delay={0} size="lg" />
          </FadeIn>

          {/* Decorative lines flanking tagline */}
          <FadeIn delay={12} duration={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DrawLine delay={12} />
              <div
                style={{
                  fontFamily,
                  color: C.cyan,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  whiteSpace: "nowrap" as const,
                }}
              >
                Digital Agency
              </div>
              <DrawLine delay={12} />
            </div>
          </FadeIn>

          {/* Main CTA text */}
          <FadeIn delay={18} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.white,
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.18,
                padding: "0 60px",
              }}
            >
              Build your{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.blue} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                digital presence.
              </span>
            </div>
          </FadeIn>

          {/* URL / contact */}
          <FadeIn delay={26} duration={18}>
            <div
              style={{
                fontFamily,
                color: C.textSub,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              omniflowdigital.com.au
            </div>
          </FadeIn>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
