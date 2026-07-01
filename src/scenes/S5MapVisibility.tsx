import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, EO, SAFE } from "../lib/constants";
import { MapVisibilitySystem } from "../components/MapVisibilitySystem";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 110;

export const S5MapVisibility: React.FC = () => {
  const frame = useCurrentFrame();

  // Rank counter animation: cycles through #7 → #3 → #1 visually
  // (This happens inside MapVisibilitySystem via delay-staggered cards)

  // Subtle 3D rotation on map: slight rotateX gives depth feel
  // Using CSS transform on wrapper since it's a render-time transform
  const tiltX = interpolate(frame, [0, 40], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const mapScale = interpolate(frame, [0, 36], [0.92, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const ambientGlow = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Ambient blue glow */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 70% 45% at 50% 40%, rgba(59,130,246,${ambientGlow * 0.09}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Map system — upper two-thirds */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: SAFE.top + 60,
            overflow: "visible",
          }}
        >
          <div
            style={{
              scale: mapScale.toString(),
              transform: `perspective(1200px) rotateX(${tiltX}deg)`,
              transformOrigin: "center top",
            }}
          >
            <MapVisibilitySystem delay={4} width={880} />
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
          <FadeUp delay={30} dur={20} style={{ marginBottom: 12 }}>
            <div style={{ ...TStyle.label }}>Local visibility</div>
          </FadeUp>
          <LineReveal delay={38} dur={24}>
            <div style={{ ...TStyle.hook }}>Local search.</div>
          </LineReveal>
          <LineReveal delay={46} dur={24} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hook,
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.teal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Top of the map.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
