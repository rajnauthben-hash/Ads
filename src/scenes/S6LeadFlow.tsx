import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO, SAFE } from "../lib/constants";
import { LeadFlowNotifications } from "../components/LeadFlowNotifications";
import { SceneWrapper, LineReveal, TStyle } from "../components/TextReveal";

const TOTAL = 110;

// Mini analytics counter: ticks upward
const AnalyticsCounter: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 22], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  // Counter rises from 23 to 94
  const count = Math.round(interpolate(f, [0, 60], [23, 94], { extrapolateRight: "clamp" }));
  // "Visibility score" bar width
  const barW = interpolate(f, [0, 60], [18, 78], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px 0px`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "20px 24px",
        borderRadius: 18,
        background: "rgba(8,14,30,0.9)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: `0 0 40px rgba(34,211,238,0.08), 0 20px 48px rgba(0,0,0,0.5)`,
        backdropFilter: "blur(20px)",
        width: 500,
        marginBottom: 0,
      }}
    >
      {/* Bar chart icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "rgba(34,211,238,0.14)",
          border: "1px solid rgba(34,211,238,0.28)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 4,
          padding: "10px 10px 8px",
          flexShrink: 0,
        }}
      >
        {[0.4, 0.6, 1].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 2,
              background: COL.cyan,
              height: `${h * 100}%`,
              opacity: 0.7 + i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Stats */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 500,
            color: COL.muted,
            letterSpacing: "0.02em",
            marginBottom: 6,
          }}
        >
          Visibility Score
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${barW}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${COL.teal}, ${COL.cyan})`,
                boxShadow: `0 0 8px ${COL.cyan}`,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 800,
              color: COL.cyan,
              letterSpacing: "-0.02em",
              minWidth: 46,
            }}
          >
            {count}%
          </div>
        </div>
      </div>
    </div>
  );
};

export const S6LeadFlow: React.FC = () => {
  const frame = useCurrentFrame();

  const ambientGlow = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Ambient glow */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 65% 50% at 50% 45%, rgba(20,184,166,${ambientGlow * 0.08}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Lead cards — centered with some top space */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE.top + 100}px ${SAFE.h}px ${SAFE.bottom + 240}px`,
          }}
        >
          <LeadFlowNotifications delay={10} />
          <div style={{ marginTop: 14 }}>
            <AnalyticsCounter delay={52} />
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
          <LineReveal delay={68} dur={22}>
            <div style={{ ...TStyle.hook }}>More clicks.</div>
          </LineReveal>
          <LineReveal delay={76} dur={22} style={{ marginTop: 4 }}>
            <div style={{ ...TStyle.hook }}>More calls.</div>
          </LineReveal>
          <LineReveal delay={84} dur={22} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hook,
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.teal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              More customers.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
