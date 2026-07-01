import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";
import { WebsiteMockup } from "../cards/WebsiteMockup";

// Cyan light streak that sweeps left-to-right across the screen
const LightStreak: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const x = interpolate(f, [0, 22], [-200, 1280], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const opacity = interpolate(f, [0, 3, 18, 22], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        bottom: 0,
        width: 180,
        background: `linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.6) 40%, rgba(0,212,255,0.9) 50%, rgba(0,212,255,0.6) 60%, transparent 100%)`,
        opacity,
        filter: "blur(4px)",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

// The old site card — grey, desaturated
const OldCardFading: React.FC<{ fadeOutStart: number }> = ({ fadeOutStart }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [fadeOutStart, fadeOutStart + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        width: 520,
        height: 340,
        borderRadius: 14,
        border: "1.5px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        background: "#0D1020",
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
        position: "absolute",
      }}
    >
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
        {[0.07, 0.05, 0.04].map((op, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: `rgba(255,255,255,${op})` }} />
        ))}
        <div style={{ flex: 1, marginLeft: 10, height: 16, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
      </div>
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ width: 80, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.07)" }} />
          <div style={{ display: "flex", gap: 8 }}>
            {[40, 36, 44].map((w, i) => (
              <div key={i} style={{ width: w, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.04)", marginBottom: 14 }}>
          <div style={{ width: "65%", height: 11, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
          <div style={{ width: "45%", height: 7, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.07)", borderRadius: 5, padding: "6px 14px" }}>
            <div style={{ width: 55, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3].map((_, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 6, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", padding: "10px" }}>
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

// Cyan glow ring that expands around the card during transformation
const TransformGlow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const scale = interpolate(f, [0, 30], [0.6, 1.4], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const opacity = interpolate(f, [0, 8, 22, 32], [0, 0.6, 0.4, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        width: 640,
        height: 440,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,212,255,0.1) 40%, transparent 70%)",
        opacity,
        scale: scale.toString(),
        pointerEvents: "none",
      }}
    />
  );
};

export const InvisibleScene3: React.FC = () => {
  const frame = useCurrentFrame();

  // Streak hits at frame 20, card transforms at frame 30, new card appears at 32
  const STREAK_START = 14;
  const TRANSFORM_AT = STREAK_START + 18;
  const NEW_CARD_DELAY = TRANSFORM_AT + 4;

  return (
    <SceneFade totalFrames={115} fadeIn={10} fadeOut={12}>
      <AbsoluteFill style={{ background: "#030912" }}>

        {/* Light streak sweeps across */}
        <LightStreak delay={STREAK_START} />

        {/* Card swap area — centered, pushed above center */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", marginTop: -140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TransformGlow delay={STREAK_START + 10} />
            {/* Old card fades out as streak passes */}
            <OldCardFading fadeOutStart={TRANSFORM_AT} />
            {/* New premium card fades in after transform */}
            <div
              style={{
                position: "absolute",
                opacity: interpolate(frame, [NEW_CARD_DELAY, NEW_CARD_DELAY + 14], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <WebsiteMockup delay={NEW_CARD_DELAY} width={520} height={340} />
            </div>
          </div>
        </AbsoluteFill>

        {/* Subtle glow beneath new card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "46%",
            translate: "-50% -50%",
            width: 500,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,212,255,0.1) 0%, transparent 70%)",
            opacity: interpolate(frame, [NEW_CARD_DELAY + 8, NEW_CARD_DELAY + 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        {/* Bottom text */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px 180px",
          }}
        >
          <TextReveal delay={46} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.white,
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              OmniFlow Digital
            </div>
          </TextReveal>
          <TextReveal delay={60} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.textSub,
                fontSize: 46,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
              }}
            >
              builds your online presence{" "}
              <span style={{ color: C.cyan }}>properly.</span>
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
