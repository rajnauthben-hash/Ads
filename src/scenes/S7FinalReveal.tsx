import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO, SAFE } from "../lib/constants";
import { LogoLockup } from "../components/LogoLockup";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 100;

// Animated SVG connecting ecosystem lines
const EcosystemLines: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const op = interpolate(f, [0, 20], [0, 0.35], { extrapolateRight: "clamp" });

  // Horizontal line: draws from center outward
  const lineW = interpolate(progress, [0, 1], [0, 340]);
  // Vertical lines
  const lineH = interpolate(progress, [0, 1], [0, 60]);

  return (
    <svg
      width={780}
      height={160}
      style={{ opacity: op }}
    >
      {/* Center horizontal */}
      <line x1={390 - lineW} y1={80} x2={390 + lineW} y2={80} stroke={COL.cyan} strokeWidth="1" />
      {/* Left vertical */}
      <line x1={50} y1={80 - lineH} x2={50} y2={80 + lineH} stroke={COL.cyan} strokeWidth="1" />
      {/* Right vertical */}
      <line x1={730} y1={80 - lineH} x2={730} y2={80 + lineH} stroke={COL.cyan} strokeWidth="1" />
      {/* Center node dot */}
      <circle cx={390} cy={80} r={4 * progress} fill={COL.cyan} opacity={progress} />
      <circle cx={50}  cy={80} r={3 * progress} fill={COL.teal} opacity={progress} />
      <circle cx={730} cy={80} r={3 * progress} fill={COL.blue} opacity={progress} />
    </svg>
  );
};

// Three service mini-pills
const ServicePill: React.FC<{ label: string; delay: number; color: string }> = ({ label, delay, color }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 22], [16, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        padding: "14px 24px",
        borderRadius: 50,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 600,
        color: COL.white,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </div>
  );
};

// Breathing background glow for the hero final frame
const HeroGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin((frame / 80) * Math.PI), [-1, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const baseOp = 0.18 + pulse * 0.06;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 38%, rgba(34,211,238,${baseOp}) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 72%, rgba(59,130,246,${baseOp * 0.6}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export const S7FinalReveal: React.FC = () => {
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
          <FadeUp delay={8} dur={24} style={{ marginBottom: 52 }}>
            <LogoLockup delay={8} size="lg" />
          </FadeUp>

          {/* Thin divider line that draws outward */}
          <FadeUp delay={24} dur={18} style={{ marginBottom: 48, width: "100%", display: "flex", justifyContent: "center" }}>
            <EcosystemLines delay={24} />
          </FadeUp>

          {/* Main headline */}
          <LineReveal delay={32} dur={26} style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ ...TStyle.hookLg, textAlign: "center" }}>
              Build your
            </div>
          </LineReveal>
          <LineReveal delay={40} dur={26} style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                ...TStyle.hookLg,
                textAlign: "center",
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.blue} 60%, ${COL.violet} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              digital presence.
            </div>
          </LineReveal>

          {/* Service pills */}
          <FadeUp delay={50} dur={20} style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 48 }}>
            <ServicePill label="Websites"     delay={50} color={COL.cyan}   />
            <ServicePill label="Google Maps"  delay={58} color={COL.blue}   />
            <ServicePill label="Local Growth" delay={66} color={COL.teal}   />
          </FadeUp>

          {/* CTA — premium pill button */}
          <FadeUp delay={74} dur={22}>
            <div
              style={{
                padding: "22px 52px",
                borderRadius: 50,
                background: COL.cyan,
                fontFamily: FONT,
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#04060E",
                boxShadow: [
                  `0 0 60px rgba(34,211,238,0.5)`,
                  `0 16px 48px rgba(0,0,0,0.4)`,
                ].join(", "),
                whiteSpace: "nowrap" as const,
              }}
            >
              DM 'FLOW' to start
            </div>
          </FadeUp>

          {/* Domain */}
          <FadeUp delay={82} dur={20} style={{ marginTop: 28 }}>
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
