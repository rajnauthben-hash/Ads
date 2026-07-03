import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText } from "../components/CinematicText";
import { FooterCaps } from "./GrowthActionsScene";
import { T, FONT, EO } from "../theme";

// SCENE — beat 8: "Real growth. Real impact." with the original's
// headline stat (Overall Growth +127%) over a drawing chart.

const ChartPanel: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 30], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const W = 760;
  const H = 430;

  // Chart line draw
  const p = interpolate(f, [12, 74], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.4, 1),
  });
  const L = 1000;

  // Glow dot rides the end of the line
  const dotX = interpolate(p, [0, 1], [70, W - 66]);
  const dotY = interpolate(p, [0, 0.3, 0.6, 1], [H - 96, H - 150, H - 215, 78]);

  const pct = Math.round(interpolate(f, [16, 58], [0, 127], { extrapolateRight: "clamp" }));

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        width: W,
        borderRadius: 24,
        border: "1px solid rgba(148,197,255,0.2)",
        background: T.panel,
        backdropFilter: "blur(18px)",
        boxShadow: "0 34px 80px rgba(0,0,0,0.6), 0 0 46px rgba(34,211,238,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "26px 30px 20px",
        fontFamily: FONT,
      }}
    >
      {/* Stat header — verbatim from the original dashboard */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 600, color: T.muted, marginBottom: 4 }}>
            Overall Growth
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              color: T.cyan,
              letterSpacing: "-0.025em",
              textShadow: "0 0 30px rgba(34,211,238,0.45)",
              lineHeight: 1,
            }}
          >
            +{pct}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg width={W - 60} height={H - 190} viewBox={`0 0 ${W - 60} ${H - 190}`}>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((r, i) => (
          <line key={i} x1={0} y1={(H - 190) * r} x2={W - 60} y2={(H - 190) * r}
            stroke="rgba(148,197,255,0.09)" strokeWidth={1} />
        ))}
        {/* Area fill under line */}
        <path
          d={`M 10 ${H - 250} C 160 ${H - 275}, 240 ${H - 305}, 360 ${H - 330} C 480 ${H - 355}, 560 ${H - 395}, ${W - 126} 24 L ${W - 126} ${H - 190} L 10 ${H - 190} Z`}
          fill="url(#growthFill)"
          opacity={p * 0.5}
        />
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        {/* Line */}
        <path
          d={`M 10 ${H - 250} C 160 ${H - 275}, 240 ${H - 305}, 360 ${H - 330} C 480 ${H - 355}, 560 ${H - 395}, ${W - 126} 24`}
          fill="none"
          stroke={T.cyan}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))" }}
        />
      </svg>

      {/* Riding glow dot */}
      <div
        style={{
          position: "absolute",
          left: dotX,
          top: dotY,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#CFF6FF",
          boxShadow: "0 0 18px rgba(34,211,238,0.95), 0 0 44px rgba(34,211,238,0.5)",
          opacity: p > 0.02 ? 1 : 0,
        }}
      />
    </div>
  );
};

export const RealGrowthScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1, 1.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 46%" }}>

      {/* Chart panel — center */}
      <Parallax depth={0.55} phase={3}>
        <div style={{ position: "absolute", top: 620, left: "50%", translate: "-50% 0" }}>
          <ChartPanel delay={22} />
        </div>
      </Parallax>

      {/* Headline — top */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 240 }}>
        <CinematicText delay={12} size={80}>
          Real growth.
        </CinematicText>
        <CinematicText delay={22} size={80} gradient glow tracking>
          Real impact.
        </CinematicText>
      </AbsoluteFill>

      {/* Footer taglines — verbatim */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 226,
          gap: 10,
        }}
      >
        <FooterCaps delay={64} color="rgba(226,240,255,0.85)">Data-driven. Results-focused.</FooterCaps>
        <FooterCaps delay={74} color={T.muted}>OmniFlow Digital</FooterCaps>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
