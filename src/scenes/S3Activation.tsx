import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, SAFE } from "../lib/constants";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 80;

// The activation beam — a bright horizontal line sweeping L→R
const ActivationBeam: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(frame, [4, 30], [-240, 1320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const opPeak = interpolate(frame, [4, 8, 26, 32], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // A secondary softer glow that lingers
  const trailX = interpolate(frame, [8, 38], [-400, 1320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const trailOp = interpolate(frame, [8, 12, 34, 40], [0, 0.4, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Main beam */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: x,
            top: 0,
            bottom: 0,
            width: 220,
            background: [
              `linear-gradient(90deg,`,
              `transparent 0%,`,
              `rgba(34,211,238,0.06) 15%,`,
              `rgba(34,211,238,0.7) 40%,`,
              `rgba(255,255,255,0.95) 50%,`,
              `rgba(34,211,238,0.7) 60%,`,
              `rgba(34,211,238,0.06) 85%,`,
              `transparent 100%)`,
            ].join(" "),
            opacity: opPeak,
            filter: "blur(2px)",
          }}
        />
        {/* Soft trail */}
        <div
          style={{
            position: "absolute",
            left: trailX,
            top: 0,
            bottom: 0,
            width: 360,
            background: [
              `linear-gradient(90deg,`,
              `transparent 0%,`,
              `rgba(34,211,238,0.04) 20%,`,
              `rgba(34,211,238,0.18) 50%,`,
              `rgba(34,211,238,0.04) 80%,`,
              `transparent 100%)`,
            ].join(" "),
            opacity: trailOp,
            filter: "blur(8px)",
          }}
        />
      </div>
    </>
  );
};

// Background that activates cyan post-beam
const ActivationGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const intensity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(34,211,238,${intensity * 0.1}) 0%, transparent 70%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Grid becoming sharper after beam
const SharpGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [18, 48], [0, 0.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="act-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={COL.cyan} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#act-grid)" />
      </svg>
    </AbsoluteFill>
  );
};

export const S3Activation: React.FC = () => {
  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={8} fadeOut={14}>
      <AbsoluteFill>
        {/* Grid sharpens post-activation */}
        <SharpGrid />

        {/* Cyan center glow builds */}
        <ActivationGlow />

        {/* The activation beam */}
        <ActivationBeam />

        {/* Text appears after beam has passed center */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${SAFE.h}px`,
          }}
        >
          <FadeUp delay={30} dur={18} style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ ...TStyle.label }}>OmniFlow Digital</div>
          </FadeUp>
          <LineReveal delay={36} dur={22} style={{ textAlign: "center" }}>
            <div style={{ ...TStyle.hookLg, textAlign: "center" }}>
              changes
            </div>
          </LineReveal>
          <LineReveal delay={44} dur={22} style={{ textAlign: "center", marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hookLg,
                textAlign: "center",
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.teal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              that.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
