import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO, SAFE } from "../lib/constants";
import { DualStateWebsite } from "../components/DualStateWebsite";
import { ServiceChips } from "../components/ServiceChips";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 140;

// Horizontal scan line that sweeps over the website
const ScanLine: React.FC<{ delay: number; containerH: number }> = ({ delay, containerH }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const progress = interpolate(f, [0, 50], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  const y = interpolate(progress, [0, 1], [-10, containerH + 10]);
  const op = interpolate(f, [0, 6, 44, 50], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        top: y,
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${COL.cyan} 20%, rgba(34,211,238,0.9) 50%, ${COL.cyan} 80%, transparent 100%)`,
        boxShadow: `0 0 24px rgba(34,211,238,0.8), 0 0 48px rgba(34,211,238,0.3)`,
        opacity: op,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

// "ANALYSING..." / "REPAIRING..." label that shows during scan
const ScanLabel: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const phase1Op = interpolate(f, [0, 8, 30, 36], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const phase2Op = interpolate(f, [36, 44, 80, 88], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const phase3Op = interpolate(f, [88, 96], [0, 1], { extrapolateRight: "clamp" });

  const dots = ".".repeat((Math.floor(frame / 12) % 4));

  return (
    <div style={{ position: "relative", height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          opacity: phase1Op,
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 600,
          color: COL.cyan,
          letterSpacing: "0.12em",
        }}
      >
        ANALYSING{dots}
      </div>
      <div
        style={{
          position: "absolute",
          opacity: phase2Op,
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 600,
          color: COL.cyan,
          letterSpacing: "0.12em",
        }}
      >
        REPAIRING{dots}
      </div>
      <div
        style={{
          position: "absolute",
          opacity: phase3Op,
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 700,
          color: COL.cyan,
          letterSpacing: "0.12em",
        }}
      >
        ✓ COMPLETE
      </div>
    </div>
  );
};

// Brand reveal: "OmniFlow Digital" label that appears after repair
const BrandReveal: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 22], [16, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 20px",
        borderRadius: 50,
        background: "rgba(34,211,238,0.1)",
        border: "1px solid rgba(34,211,238,0.3)",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          background: COL.cyan,
          boxShadow: `0 0 12px rgba(34,211,238,0.6)`,
        }}
      />
      <span
        style={{
          fontFamily: FONT,
          fontSize: 20,
          fontWeight: 700,
          color: COL.white,
          letterSpacing: "0.01em",
        }}
      >
        <span style={{ color: COL.white }}>Omni</span>
        <span style={{ color: COL.cyan }}>Flow</span>
        <span style={{ color: COL.muted, fontWeight: 500 }}> Digital</span>
      </span>
    </div>
  );
};

export const V2S3Transform: React.FC = () => {
  const frame = useCurrentFrame();

  // repairProgress: scan starts at frame 10, completes by frame 70
  const repairProgress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const ambientOp = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const websiteH = Math.round(860 * 0.61);

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={10} fadeOut={12}>
      <AbsoluteFill>

        {/* Cyan ambient builds as repair completes */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 42%, rgba(34,211,238,${ambientOp * repairProgress * 0.1}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Website — centered, transitioning from broken to premium */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: SAFE.top + 30,
            paddingBottom: SAFE.bottom + 240,
            gap: 16,
          }}
        >
          {/* Scan label above website */}
          <ScanLabel delay={6} />

          {/* Website with scan line overlay */}
          <div style={{ position: "relative" }}>
            <DualStateWebsite
              repairProgress={repairProgress}
              delay={4}
              width={860}
            />
            <ScanLine delay={8} containerH={websiteH} />
          </div>

          {/* Brand badge appears after repair */}
          {frame > 90 && <BrandReveal delay={90} />}
        </AbsoluteFill>

        {/* Service chips — below mid-screen */}
        {frame > 95 && (
          <AbsoluteFill
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 1080,
            }}
          >
            <ServiceChips delay={96} />
          </AbsoluteFill>
        )}

        {/* Text — lower third */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: `0 ${SAFE.h}px ${SAFE.bottom + 20}px`,
          }}
        >
          <FadeUp delay={88} dur={18} style={{ marginBottom: 10 }}>
            <div style={{ ...TStyle.label }}>OmniFlow Digital</div>
          </FadeUp>
          <LineReveal delay={96} dur={22}>
            <div style={{ ...TStyle.hook }}>We repair.</div>
          </LineReveal>
          <LineReveal delay={104} dur={22} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hook,
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.teal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              We elevate.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
