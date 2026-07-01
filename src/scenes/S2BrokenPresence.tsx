import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO, SAFE } from "../lib/constants";
import { OldWebsiteMockup } from "../components/OldWebsiteMockup";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 80;

// A search ranking stack — shows position buried at #7, #8
const BuriedStack: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  // Slowly drifts downward
  const drift = interpolate(frame, [0, TOTAL], [0, 14], { extrapolateRight: "clamp" });

  const rows = [
    { rank: 7, w1: 180, w2: 130, isUs: false },
    { rank: 8, w1: 160, w2: 110, isUs: false },
    { rank: 9, w1: 190, w2: 140, isUs: false },
  ];

  return (
    <div
      style={{
        opacity: op * 0.6,
        translate: `0px ${drift}px`,
        position: "absolute",
        left: SAFE.h,
        bottom: 260,
        right: SAFE.h,
      }}
    >
      {rows.map(({ rank, w1, w2 }, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 0",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: COL.muted, width: 30, opacity: 0.5 }}>
            #{rank}
          </div>
          <div>
            <div style={{ width: w1, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.2)", marginBottom: 5 }} />
            <div style={{ width: w2, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// Weak blinking map pin
const WeakMapPin: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 0.45], { extrapolateRight: "clamp" });
  // Slow weak blink
  const blink = 0.5 + Math.sin((frame * 0.05) * Math.PI) * 0.5;
  // Signal ring that barely expands
  const ringR  = interpolate(frame % 60, [0, 60], [8, 36]);
  const ringOp = interpolate(frame % 60, [0, 30, 60], [0, 0.3, 0]);

  return (
    <div style={{ position: "absolute", right: 130, top: 820, opacity: op * blink }}>
      <svg width={80} height={80} viewBox="-40 -40 80 80" style={{ overflow: "visible" }}>
        {/* Weak signal ring */}
        <circle cx={0} cy={0} r={ringR} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" opacity={ringOp} />
        {/* Pin */}
        <path
          d="M0 -26 C-12 -26 -20 -17 -20 -8 C-20 5 0 24 0 24 C0 24 20 5 20 -8 C20 -17 12 -26 0 -26Z"
          fill="rgba(255,255,255,0.22)"
        />
        <circle cx={0} cy={-8} r={6} fill="rgba(0,0,0,0.5)" />
      </svg>
    </div>
  );
};

export const S2BrokenPresence: React.FC = () => {
  const frame = useCurrentFrame();

  // Website card slight instability tilt
  const instability = Math.sin((frame * 0.08) * Math.PI) * 0.6;

  const cardOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const cardTy = interpolate(frame, [0, 22], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Old website card — upper center */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: SAFE.top + 40,
          }}
        >
          <div
            style={{
              opacity: cardOp,
              translate: `0px ${cardTy}px`,
              rotate: `${instability}deg`,
            }}
          >
            <OldWebsiteMockup delay={0} width={820} />
          </div>
        </AbsoluteFill>

        {/* Weak map pin */}
        <WeakMapPin delay={14} />

        {/* Buried search results */}
        <BuriedStack delay={18} />

        {/* Text — lower third */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: `0 ${SAFE.h}px ${SAFE.bottom + 40}px`,
          }}
        >
          <FadeUp delay={22} dur={20} style={{ marginBottom: 10 }}>
            <div style={{ ...TStyle.label }}>The problem</div>
          </FadeUp>
          <LineReveal delay={28} dur={24}>
            <div style={{ ...TStyle.hook }}>But customers</div>
          </LineReveal>
          <LineReveal delay={36} dur={24} style={{ marginTop: 4 }}>
            <div style={{ ...TStyle.hook }}>
              can't{" "}
              <span style={{ color: COL.muted, fontStyle: "italic" }}>find it.</span>
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
