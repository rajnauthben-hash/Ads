import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COL, SAFE } from "../lib/constants";
import { WebsiteMockup } from "../components/WebsiteMockup";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 110;

export const S4PremiumWebsite: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera slowly pushes in on the mockup
  const camScale = interpolate(frame, [30, TOTAL], [1.0, 1.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient cyan glow that intensifies as card builds
  const ambientGlow = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Ambient glow behind card */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 38%, rgba(34,211,238,${ambientGlow * 0.1}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Website card — upper 58% of canvas */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: SAFE.top + 20,
            overflow: "hidden",
          }}
        >
          <div style={{ scale: camScale.toString(), transformOrigin: "center top" }}>
            <WebsiteMockup delay={4} width={920} />
          </div>
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
          <FadeUp delay={36} dur={20} style={{ marginBottom: 12 }}>
            <div style={{ ...TStyle.label }}>What we build</div>
          </FadeUp>
          <LineReveal delay={44} dur={24}>
            <div style={{ ...TStyle.hookLg }}>Premium</div>
          </LineReveal>
          <LineReveal delay={52} dur={24} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hookLg,
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.blue} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              websites.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
