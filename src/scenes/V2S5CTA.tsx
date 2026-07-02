import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COL, FONT, SAFE } from "../lib/constants";
import { LogoLockup } from "../components/LogoLockup";
import { ServiceChips } from "../components/ServiceChips";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 110;

// Breathing background glow
const HeroGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin((frame / 80) * Math.PI), [-1, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const baseOp = 0.16 + pulse * 0.07;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 72% 55% at 50% 36%, rgba(34,211,238,${baseOp}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 72%, rgba(59,130,246,${baseOp * 0.55}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// Ecosystem connector lines — draws outward from center
const ConnectorLines: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const op = interpolate(f, [0, 20], [0, 0.3], { extrapolateRight: "clamp" });

  const lineW = interpolate(p, [0, 1], [0, 320]);
  const lineH = interpolate(p, [0, 1], [0, 52]);

  return (
    <svg width={740} height={140} style={{ opacity: op }}>
      <line x1={370 - lineW} y1={70} x2={370 + lineW} y2={70} stroke={COL.cyan} strokeWidth="1" />
      <line x1={50}  y1={70 - lineH} x2={50}  y2={70 + lineH} stroke={COL.cyan}   strokeWidth="1" />
      <line x1={690} y1={70 - lineH} x2={690} y2={70 + lineH} stroke={COL.violet} strokeWidth="1" />
      <circle cx={370} cy={70} r={4 * p}  fill={COL.cyan}   opacity={p} />
      <circle cx={50}  cy={70} r={3 * p}  fill={COL.teal}   opacity={p} />
      <circle cx={690} cy={70} r={3 * p}  fill={COL.violet} opacity={p} />
    </svg>
  );
};

export const V2S5CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // CTA button pulse
  const ctaPulse = 0.5 + Math.sin((frame / 70) * Math.PI) * 0.12;

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={14} fadeOut={10}>
      <AbsoluteFill>

        <HeroGlow />

        {/* Full centered stack */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `${SAFE.top}px ${SAFE.h}px ${SAFE.bottom}px`,
            gap: 0,
          }}
        >
          {/* Logo */}
          <FadeUp delay={8} dur={24} style={{ marginBottom: 44 }}>
            <LogoLockup delay={8} size="lg" />
          </FadeUp>

          {/* Connector lines */}
          <FadeUp
            delay={22}
            dur={18}
            style={{ marginBottom: 40, width: "100%", display: "flex", justifyContent: "center" }}
          >
            <ConnectorLines delay={22} />
          </FadeUp>

          {/* Headline */}
          <LineReveal delay={30} dur={24} style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ ...TStyle.hookLg, textAlign: "center" }}>
              Build your
            </div>
          </LineReveal>
          <LineReveal delay={38} dur={24} style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                ...TStyle.hookLg,
                textAlign: "center",
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.blue} 55%, ${COL.violet} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              digital presence.
            </div>
          </LineReveal>

          {/* Service chips */}
          <FadeUp
            delay={46}
            dur={20}
            style={{ marginBottom: 44 }}
          >
            <ServiceChips delay={46} />
          </FadeUp>

          {/* CTA button */}
          <FadeUp delay={66} dur={22}>
            <div
              style={{
                padding: "22px 54px",
                borderRadius: 50,
                background: COL.cyan,
                fontFamily: FONT,
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#04060E",
                boxShadow: [
                  `0 0 ${60 * ctaPulse}px rgba(34,211,238,${0.55 * ctaPulse})`,
                  `0 16px 48px rgba(0,0,0,0.4)`,
                ].join(", "),
                whiteSpace: "nowrap" as const,
              }}
            >
              DM 'FLOW' to start
            </div>
          </FadeUp>

          {/* Domain */}
          <FadeUp delay={80} dur={20} style={{ marginTop: 26 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 500,
                color: COL.muted,
                letterSpacing: "0.02em",
              }}
            >
              omniflowdigital.com.au
            </div>
          </FadeUp>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
