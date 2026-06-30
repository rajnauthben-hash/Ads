import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal, FadeIn } from "../TextReveal";
import { LogoWordmark } from "../LogoWordmark";
import { CurvedFlowLine } from "../FlowLine";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Glow pulse
  const glowScale = interpolate(
    Math.sin((frame / 35) * Math.PI),
    [-1, 1],
    [0.9, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const glowOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CTA button slide up
  const btnSlide = interpolate(frame, [28, 52], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const btnOpacity = interpolate(frame, [28, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFade totalFrames={65} fadeIn={10} fadeOut={8}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(0,100,220,0.22) 0%, rgba(0,212,255,0.06) 45%, transparent 70%)`,
            scale: glowScale.toString(),
            opacity: glowOpacity,
          }}
        />

        {/* Flowing arc line behind logo */}
        <CurvedFlowLine
          d="M 160 1040 Q 540 880 920 1040"
          color="rgba(0,212,255,0.2)"
          width={1.5}
          delay={6}
          duration={30}
        />
        <CurvedFlowLine
          d="M 200 880 Q 540 760 880 880"
          color="rgba(107,142,255,0.15)"
          width={1}
          delay={12}
          duration={30}
        />

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
        >
          {/* Logo */}
          <FadeIn delay={4} duration={22}>
            <LogoWordmark delay={0} size="lg" />
          </FadeIn>

          {/* Divider line */}
          <FadeIn delay={14} duration={18}>
            <div
              style={{
                width: 64,
                height: 1.5,
                background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
                borderRadius: 1,
              }}
            />
          </FadeIn>

          {/* Headline */}
          <TextReveal delay={16} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.white,
                fontSize: 88,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
              }}
            >
              Build your
              <br />
              <span
                style={{
                  background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.blue} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                digital flow.
              </span>
            </div>
          </TextReveal>

          {/* CTA button */}
          <div
            style={{
              opacity: btnOpacity,
              translate: `0px ${btnSlide}px`,
              fontFamily,
              background: C.cyan,
              borderRadius: 18,
              padding: "24px 52px",
              color: "#020710",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "0.01em",
              textAlign: "center",
              boxShadow: `0 0 40px rgba(0,212,255,0.35), 0 12px 32px rgba(0,0,0,0.4)`,
            }}
          >
            Message OmniFlow Digital
          </div>

          {/* Subtle supporting line */}
          <FadeIn delay={50} duration={16}>
            <div
              style={{
                fontFamily,
                color: C.textSub,
                fontSize: 26,
                fontWeight: 400,
                letterSpacing: "0.02em",
                textAlign: "center",
              }}
            >
              omniflowdigital.com
            </div>
          </FadeIn>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
