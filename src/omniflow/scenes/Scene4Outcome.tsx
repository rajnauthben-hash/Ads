import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal } from "../TextReveal";
import { LeadNotificationCard } from "../cards/LeadNotificationCard";
import { MapVisibilityCard } from "../cards/MapVisibilityCard";
import { AutomationFlowCard } from "../cards/AutomationFlowCard";

// Minimal growth line drawn over time
const GrowthLine: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const progress = interpolate(f, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const opacity = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const W = 220;
  const H = 64;

  // Rising line path — simple smooth upward curve
  const pts: [number, number][] = [
    [0, 0.88],
    [0.2, 0.78],
    [0.4, 0.62],
    [0.6, 0.42],
    [0.78, 0.24],
    [1, 0.06],
  ];

  const visible = pts.filter((p) => p[0] <= progress);
  if (progress < 1 && visible.length < pts.length) {
    const next = pts[visible.length];
    const prev = pts[visible.length - 1] ?? [0, 0.88];
    const t = (progress - prev[0]) / (next[0] - prev[0]);
    visible.push([progress, prev[1] + (next[1] - prev[1]) * t]);
  }

  const svgPath = visible.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0] * W} ${p[1] * H}`).join(" ");
  const areaPath = visible.length > 0
    ? `${svgPath} L ${visible[visible.length - 1][0] * W} ${H} L 0 ${H} Z`
    : "";

  return (
    <div style={{ opacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.2} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#growth-fill)" />}
        {svgPath && (
          <path
            d={svgPath}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* End dot */}
        {visible.length > 0 && (
          <circle
            cx={visible[visible.length - 1][0] * W}
            cy={visible[visible.length - 1][1] * H}
            r={4}
            fill={C.cyan}
            opacity={progress > 0.1 ? 1 : 0}
          />
        )}
      </svg>
    </div>
  );
};

export const Scene4Outcome: React.FC = () => {
  return (
    <SceneFade totalFrames={100} fadeIn={10} fadeOut={12}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
          gap: 48,
        }}
      >
        {/* Headline */}
        <TextReveal delay={6} duration={22}>
          <div
            style={{
              fontFamily,
              textAlign: "center",
              lineHeight: 1.18,
            }}
          >
            <div style={{ color: C.white, fontSize: 76, fontWeight: 800, letterSpacing: "-0.03em" }}>
              Look professional.
            </div>
            <div
              style={{
                color: C.cyan,
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Capture leads.
            </div>
            <div style={{ color: C.white, fontSize: 76, fontWeight: 800, letterSpacing: "-0.03em" }}>
              Scale smoother.
            </div>
          </div>
        </TextReveal>

        {/* Cards */}
        <LeadNotificationCard delay={24} />
        <MapVisibilityCard delay={36} />
        <AutomationFlowCard delay={48} />

        {/* Growth line */}
        <div
          style={{
            fontFamily,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: C.cardBg,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 20,
            padding: "22px 28px",
            width: "100%",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ color: C.textSub, fontSize: 18, fontWeight: 500, marginBottom: 14 }}>
            Growth trajectory
          </div>
          <GrowthLine delay={56} />
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
