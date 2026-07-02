import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COL, SAFE } from "../lib/constants";
import { DualStateWebsite } from "../components/DualStateWebsite";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 90;

// Dim scattered fragments — signal noise / lost online
const Fragments: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { x: 160, y: 280, w: 60, h: 6,  op: 0.08 },
    { x: 820, y: 340, w: 44, h: 6,  op: 0.06 },
    { x: 120, y: 520, w: 80, h: 6,  op: 0.07 },
    { x: 870, y: 480, w: 52, h: 6,  op: 0.05 },
    { x: 200, y: 720, w: 36, h: 6,  op: 0.06 },
    { x: 840, y: 660, w: 64, h: 6,  op: 0.07 },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((item, i) => {
        const drift = interpolate(frame, [0, TOTAL], [0, -8 + i * 2], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y + drift,
              width: item.w,
              height: item.h,
              borderRadius: 3,
              background: "rgba(255,255,255,0.4)",
              opacity: item.op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const V2S1Problem: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera: slight push-in
  const camScale = interpolate(frame, [0, TOTAL], [1.0, 1.025], { extrapolateRight: "clamp" });

  const ambientOp = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill style={{ scale: camScale.toString() }}>

        {/* Dim red ambient — "danger/problem" tone */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 65% 50% at 50% 42%, rgba(239,68,68,${ambientOp * 0.06}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        <Fragments />

        {/* Website — centered, broken state */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: SAFE.top + 20,
            paddingBottom: SAFE.bottom + 180,
          }}
        >
          <DualStateWebsite
            repairProgress={0}
            delay={6}
            width={860}
          />
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
          <FadeUp delay={22} dur={18} style={{ marginBottom: 10 }}>
            <div style={{ ...TStyle.label, color: "#EF4444" }}>The problem</div>
          </FadeUp>
          <LineReveal delay={30} dur={22}>
            <div style={{ ...TStyle.hook }}>Your business</div>
          </LineReveal>
          <LineReveal delay={38} dur={22} style={{ marginTop: 4 }}>
            <div style={{ ...TStyle.hook }}>exists online.</div>
          </LineReveal>
          <LineReveal delay={50} dur={22} style={{ marginTop: 4 }}>
            <div style={{ ...TStyle.hook, color: COL.muted, fontSize: 68 }}>
              But looks invisible.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
