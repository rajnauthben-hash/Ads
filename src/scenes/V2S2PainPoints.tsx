import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SAFE } from "../lib/constants";
import { DualStateWebsite } from "../components/DualStateWebsite";
import { PainPointCards } from "../components/PainPointCards";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 110;

export const V2S2PainPoints: React.FC = () => {
  const frame = useCurrentFrame();

  const ambientOp = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Warm amber ambient — "pain/cost" */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(245,158,11,${ambientOp * 0.07}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Website mini — top, dimmed, smaller */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: SAFE.top + 20,
          }}
        >
          <DualStateWebsite
            repairProgress={0}
            delay={0}
            width={640}
          />
        </AbsoluteFill>

        {/* Pain point cards — centered vertically */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 400,
            paddingBottom: SAFE.bottom + 220,
          }}
        >
          <PainPointCards delay={16} />
        </AbsoluteFill>

        {/* Text — lower third */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: `0 ${SAFE.h}px ${SAFE.bottom + 20}px`,
          }}
        >
          <FadeUp delay={70} dur={18} style={{ marginBottom: 10 }}>
            <div style={{ ...TStyle.label, color: "#F59E0B" }}>What it costs you</div>
          </FadeUp>
          <LineReveal delay={78} dur={22}>
            <div style={{ ...TStyle.hook }}>Every day costs</div>
          </LineReveal>
          <LineReveal delay={86} dur={22} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hook,
                background: `linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              real customers.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
