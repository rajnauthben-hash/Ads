import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";

const ProblemCard: React.FC<{
  label: string;
  detail: string;
  delay: number;
  driftX?: number;
}> = ({ label, detail, delay, driftX = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const slideY = interpolate(f, [0, 22], [32, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  // Subtle ambient drift — cards feel disconnected
  const drift = interpolate(frame % 200, [0, 100, 200], [0, driftX, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily,
        opacity,
        translate: `${drift}px ${slideY}px`,
        background: "rgba(10, 16, 36, 0.82)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderLeft: `3px solid rgba(244,165,53,0.55)`,
        borderRadius: 18,
        padding: "22px 28px",
        width: "100%",
        backdropFilter: "blur(20px)",
        boxShadow: "0 6px 28px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.amber,
            opacity: 0.7,
            flexShrink: 0,
          }}
        />
        <span style={{ color: C.offWhite, fontSize: 34, fontWeight: 700 }}>
          {label}
        </span>
      </div>
      <div style={{ color: C.textSub, fontSize: 24, fontWeight: 400, marginTop: 6, paddingLeft: 20 }}>
        {detail}
      </div>
    </div>
  );
};

export const Scene2Problem: React.FC = () => {
  return (
    <SceneFade totalFrames={100} fadeIn={10} fadeOut={12}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 88px",
        }}
      >
        {/* Headline */}
        <TextReveal delay={6} duration={20}>
          <div
            style={{
              fontFamily,
              color: C.textSub,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            Sound familiar?
          </div>
        </TextReveal>

        {/* Problem copy */}
        <TextReveal delay={2} duration={22}>
          <div
            style={{
              fontFamily,
              textAlign: "center",
              marginBottom: 72,
            }}
          >
            <div style={{ color: C.white, fontSize: 80, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Outdated design.
            </div>
            <div style={{ color: C.white, fontSize: 80, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Missed leads.
            </div>
            <div style={{ color: C.white, fontSize: 80, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Manual processes.
            </div>
          </div>
        </TextReveal>

        {/* Three problem cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <ProblemCard
            label="Outdated site"
            detail="First impressions are costing you"
            delay={20}
            driftX={-4}
          />
          <ProblemCard
            label="Missed leads"
            detail="No system to capture enquiries"
            delay={30}
            driftX={4}
          />
          <ProblemCard
            label="Low visibility"
            detail="Not showing up where it matters"
            delay={40}
            driftX={-3}
          />
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
