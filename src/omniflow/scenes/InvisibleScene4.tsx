import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal, FadeIn } from "../TextReveal";

// A service badge card that snaps into view
const ServiceCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  delay: number;
  accentColor?: string;
  x: number;
  y: number;
}> = ({ icon, title, subtitle, delay, accentColor = C.cyan, x, y }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 22], [0.84, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const slideY = interpolate(f, [0, 22], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const floatY = interpolate(frame % 130, [0, 65, 130], [0, -6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + floatY,
        opacity,
        scale: scale.toString(),
        translate: `0px ${slideY}px`,
        width: 280,
        background: "rgba(8,15,34,0.92)",
        border: `1.5px solid ${accentColor}30`,
        borderRadius: 20,
        padding: "24px 22px",
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px ${accentColor}18, 0 12px 40px rgba(0,0,0,0.5)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <div style={{ color: accentColor, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
        {subtitle}
      </div>
      <div style={{ color: C.white, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
        {title}
      </div>
    </div>
  );
};

// Animated map pin that rises from below
const GlowPin: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(f, [0, 28], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  // Pulse ring
  const pulseScale = interpolate(f % 60, [0, 30, 60], [1, 1.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseOpacity = interpolate(f % 60, [0, 15, 60], [0.5, 0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        translate: `0px ${y}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          top: -4,
          left: "50%",
          translate: "-50% -50%",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `2px solid ${C.cyan}`,
          opacity: pulseOpacity,
          scale: pulseScale.toString(),
        }}
      />
      {/* Pin body */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: `linear-gradient(135deg, ${C.cyan} 0%, ${C.blue} 100%)`,
          boxShadow: `0 0 30px ${C.cyan}60`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: "rotate(45deg)",
            color: "#000",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          #
        </div>
      </div>
      {/* Pin stem */}
      <div
        style={{
          width: 3,
          height: 20,
          background: `linear-gradient(to bottom, ${C.cyan}, transparent)`,
          marginTop: -2,
        }}
      />
    </div>
  );
};

// Animated rank counter that steps through #7 → #3 → #1
const RankCounter: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // Step through ranks: 7 → 3 → 1
  const rank = f < 20 ? 7 : f < 40 ? 3 : 1;
  const isTop = rank === 1;

  const opacity = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // Flash on step change
  const stepFrame = f < 20 ? 0 : f < 40 ? f - 20 : f - 40;
  const flash = interpolate(stepFrame, [0, 6], [1.3, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontFamily,
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 16, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
        Google Rank
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          scale: flash.toString(),
          background: isTop
            ? `linear-gradient(135deg, ${C.cyan} 0%, #fff 100%)`
            : `linear-gradient(135deg, ${C.amber} 0%, #fff 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          textShadow: "none",
          filter: isTop ? `drop-shadow(0 0 20px ${C.cyan}80)` : "none",
        }}
      >
        #{rank}
      </div>
      {isTop && (
        <div
          style={{
            color: C.cyan,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.04em",
            opacity: interpolate(f, [40, 52], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          ✓ Top Result
        </div>
      )}
    </div>
  );
};

export const InvisibleScene4: React.FC = () => {
  return (
    <SceneFade totalFrames={115} fadeIn={10} fadeOut={12}>
      <AbsoluteFill style={{ background: "#030912" }}>

        {/* Ambient radial glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "40%",
            translate: "-50% -50%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, rgba(107,142,255,0.04) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Service cards — left and right columns */}
        <ServiceCard
          icon="🌐"
          title="Website Design"
          subtitle="Service"
          x={60}
          y={320}
          delay={8}
          accentColor={C.cyan}
        />
        <ServiceCard
          icon="📍"
          title="Google Maps Optimization"
          subtitle="Service"
          x={740}
          y={380}
          delay={18}
          accentColor={C.blue}
        />
        <ServiceCard
          icon="📡"
          title="Digital Visibility"
          subtitle="Service"
          x={60}
          y={680}
          delay={28}
          accentColor={C.cyan}
        />

        {/* Center column: map pin + rank counter */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <FadeIn delay={6} duration={20}>
            <GlowPin delay={6} />
          </FadeIn>
          <RankCounter delay={22} />
        </AbsoluteFill>

        {/* Bottom text */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px",
            paddingBottom: 160,
          }}
        >
          <TextReveal delay={62} duration={20}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.white,
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Websites.{" "}
              <span style={{ color: C.cyan }}>Maps.</span>
              {" "}Visibility.
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
