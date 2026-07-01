import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";

// Dull, outdated website card — grey, desaturated, flat
const OldSiteCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 30], [0.88, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  // subtle pulse/float
  const floatY = interpolate(frame % 150, [0, 75, 150], [0, -8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        scale: scale.toString(),
        translate: `0px ${floatY}px`,
        width: 480,
        height: 320,
        borderRadius: 14,
        border: "1.5px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        background: "#0D1020",
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
      }}
    >
      {/* Browser chrome — flat, dated */}
      <div
        style={{
          height: 32,
          background: "#141820",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 7,
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            height: 16,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 4,
          }}
        />
      </div>
      {/* Page — flat, grey, no hierarchy */}
      <div style={{ padding: "20px 22px" }}>
        {/* Nav bar — just grey blocks */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
          <div style={{ width: 80, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.07)" }} />
          <div style={{ display: "flex", gap: 8 }}>
            {[40, 36, 44].map((w, i) => (
              <div key={i} style={{ width: w, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        </div>
        {/* Hero area — flat colour, no gradient */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 8,
            padding: "18px 20px",
            border: "1px solid rgba(255,255,255,0.04)",
            marginBottom: 16,
          }}
        >
          <div style={{ width: "65%", height: 11, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
          <div style={{ width: "45%", height: 7, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 5 }} />
          <div style={{ width: "35%", height: 7, borderRadius: 2, background: "rgba(255,255,255,0.04)", marginBottom: 16 }} />
          {/* CTA — flat button, no colour */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.07)",
              borderRadius: 5,
              padding: "6px 14px",
            }}
          >
            <div style={{ width: 55, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
          </div>
        </div>
        {/* Content rows — homogeneous grey */}
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 6,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.04)",
                padding: "10px 10px",
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 6 }} />
              <div style={{ width: "80%", height: 6, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 4 }} />
              <div style={{ width: "55%", height: 5, borderRadius: 2, background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dim particle dot that floats in place
const DimDot: React.FC<{ x: number; y: number; size: number; delay: number }> = ({ x, y, size, delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 30], [0, 0.18], { extrapolateRight: "clamp" });
  const drift = interpolate(frame % 200, [0, 100, 200], [0, -4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + drift,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(0,212,255,0.35)",
        opacity,
        filter: "blur(1px)",
      }}
    />
  );
};

export const InvisibleScene1: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = interpolate(frame, [0, 90], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0, 0, 0.2, 1),
  });

  return (
    <SceneFade totalFrames={100} fadeIn={10} fadeOut={12}>
      <AbsoluteFill
        style={{
          background: "#020710",
          scale: cameraScale.toString(),
          transformOrigin: "center center",
        }}
      >
        {/* Dim ambient dots */}
        <DimDot x={80} y={400} size={6} delay={5} />
        <DimDot x={950} y={320} size={4} delay={8} />
        <DimDot x={120} y={1500} size={5} delay={12} />
        <DimDot x={920} y={1580} size={4} delay={7} />
        <DimDot x={500} y={200} size={3} delay={15} />
        <DimDot x={60} y={900} size={5} delay={10} />
        <DimDot x={980} y={1100} size={4} delay={6} />

        {/* Dim vignette ring around old card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "48%",
            translate: "-50% -50%",
            width: 640,
            height: 440,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(8,14,32,0) 30%, rgba(2,7,16,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* The old site card — center stage */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Push card slightly above center so text fits below */}
          <div style={{ marginTop: -180 }}>
            <OldSiteCard delay={6} />
          </div>
        </AbsoluteFill>

        {/* Text block — bottom half */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px 220px",
          }}
        >
          <TextReveal delay={14} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.offWhite,
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: 20,
              }}
            >
              Your business exists…
            </div>
          </TextReveal>
          <TextReveal delay={34} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.textSub,
                fontSize: 52,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              But does it{" "}
              <span style={{ color: C.cyan }}>stand out</span>
              {" "}online?
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
