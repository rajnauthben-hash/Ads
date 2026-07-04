import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText } from "../components/CinematicText";
import { FooterCaps } from "./GrowthActionsScene";
import { T, FONT, EO } from "../theme";

// SCENE — beat 8: "Real growth. Real impact." Full PERFORMANCE OVERVIEW
// dashboard with all figures verbatim from the reference ad.

const PANEL_W = 850;

const useReveal = (delay: number) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  return {
    f,
    op: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
    ty: interpolate(f, [0, 22], [16, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) }),
  };
};

// Overall growth block + line chart — the rising chart tells the story,
// no fabricated percentage claim.
const OverallGrowth: React.FC<{ delay: number }> = ({ delay }) => {
  const { f, op, ty } = useReveal(delay);
  const p = interpolate(f, [4, 52], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.4, 1),
  });
  const L = 1200;
  const cw = PANEL_W - 60;

  return (
    <div style={{ opacity: op, translate: `0px ${ty}px` }}>
      <div style={{ fontSize: 17, fontWeight: 600, color: T.muted, marginBottom: 8 }}>Overall Growth</div>
      <svg width={cw} height={110} viewBox={`0 0 ${cw} 110`}>
        {[0.3, 0.6, 0.9].map((r, i) => (
          <line key={i} x1={0} y1={110 * r} x2={cw} y2={110 * r} stroke="rgba(148,197,255,0.09)" strokeWidth={1} />
        ))}
        <path
          d={`M 4 96 C ${cw * 0.2} 88, ${cw * 0.3} 76, ${cw * 0.45} 64 C ${cw * 0.6} 52, ${cw * 0.75} 34, ${cw - 8} 10`}
          fill="none"
          stroke={T.cyan}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          style={{ filter: "drop-shadow(0 0 7px rgba(34,211,238,0.7))" }}
        />
        <circle cx={cw - 8} cy={10} r={4.5} fill="#CFF6FF" opacity={p > 0.97 ? 1 : 0} />
      </svg>
    </div>
  );
};

// The three metric cards — figures verbatim
const METRICS = [
  { label: "Website Visits",   value: "4,892" },
  { label: "Profile Views",    value: "1,754" },
  { label: "Customer Actions", value: "673" },
];

const MetricRow: React.FC<{ delay: number }> = ({ delay }) => {
  const { op, ty } = useReveal(delay);
  return (
    <div style={{ opacity: op, translate: `0px ${ty}px`, display: "flex", gap: 14 }}>
      {METRICS.map((m) => (
        <div
          key={m.label}
          style={{
            flex: 1,
            borderRadius: 14,
            border: "1px solid rgba(148,197,255,0.14)",
            background: "rgba(255,255,255,0.025)",
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 14.5, fontWeight: 600, color: T.muted, marginBottom: 7 }}>{m.label}</div>
          <div style={{ fontSize: 29, fontWeight: 800, color: T.white, letterSpacing: "-0.02em" }}>{m.value}</div>
        </div>
      ))}
    </div>
  );
};

// Channels + engagement ring — figures verbatim
const CHANNELS = [
  { label: "Google Search", value: "1,982", w: 1.0  },
  { label: "Google Maps",   value: "1,245", w: 0.63 },
  { label: "Direct",        value: "892",   w: 0.45 },
  { label: "Referrals",     value: "623",   w: 0.31 },
];

const ChannelsRow: React.FC<{ delay: number }> = ({ delay }) => {
  const { f, op, ty } = useReveal(delay);
  const grow = interpolate(f, [4, 34], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  const R = 42;
  const C = 2 * Math.PI * R;
  const ringP = interpolate(f, [8, 48], [0, 0.92], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  return (
    <div style={{ opacity: op, translate: `0px ${ty}px`, display: "flex", gap: 14 }}>
      {/* Top Performing Channels */}
      <div
        style={{
          flex: 1.5,
          borderRadius: 14,
          border: "1px solid rgba(148,197,255,0.14)",
          background: "rgba(255,255,255,0.025)",
          padding: "14px 18px",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(226,240,255,0.9)", marginBottom: 11 }}>
          Top Performing Channels
        </div>
        {CHANNELS.map((c) => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 13.5, color: T.muted, width: 108, flexShrink: 0 }}>{c.label}</div>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${c.w * grow * 100}%`,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${T.blue}, ${T.cyan})`,
                }}
              />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(226,240,255,0.9)", width: 46, textAlign: "right", flexShrink: 0 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Rate */}
      <div
        style={{
          flex: 1,
          borderRadius: 14,
          border: "1px solid rgba(148,197,255,0.14)",
          background: "rgba(255,255,255,0.025)",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg width={104} height={104} viewBox="0 0 104 104">
          <circle cx={52} cy={52} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={9} />
          <circle
            cx={52} cy={52} r={R} fill="none"
            stroke={T.cyan} strokeWidth={9} strokeLinecap="round"
            strokeDasharray={`${C * ringP} ${C}`}
            style={{ transform: "rotate(-90deg)", transformOrigin: "52px 52px" }}
          />
          <text x={52} y={59} textAnchor="middle" fontFamily={FONT} fontSize={24} fontWeight={800} fill={T.white}>
            92%
          </text>
        </svg>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: "rgba(226,240,255,0.9)" }}>Engagement Rate</div>
      </div>
    </div>
  );
};

// Bottom stat strip — plausible state metrics only (no fabricated
// growth-delta claims). Star rating kept: it is a rating, not a delta.
const BOTTOM: { label: string; value: string; delta?: string; deltaColor?: string }[] = [
  { label: "Avg. Time on Site", value: "02:48" },
  { label: "Bounce Rate",       value: "28%" },
  { label: "Review Rating",     value: "4.9", delta: "★★★★★", deltaColor: "#F5B942" },
  { label: "Ranking Keywords",  value: "156" },
];

const BottomStrip: React.FC<{ delay: number }> = ({ delay }) => {
  const { op, ty } = useReveal(delay);
  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        display: "flex",
        gap: 0,
        borderRadius: 14,
        border: "1px solid rgba(148,197,255,0.14)",
        background: "rgba(255,255,255,0.02)",
        padding: "13px 6px",
      }}
    >
      {BOTTOM.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            textAlign: "center",
            borderLeft: i > 0 ? "1px solid rgba(148,197,255,0.1)" : "none",
            padding: "0 8px",
          }}
        >
          <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 5, whiteSpace: "nowrap" }}>{s.label}</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: T.white, letterSpacing: "-0.02em", marginBottom: 3 }}>
            {s.value}
          </div>
          {s.delta && (
            <div style={{ fontSize: 13.5, fontWeight: 700, color: s.deltaColor }}>{s.delta}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const DashboardPanel: React.FC<{ delay: number }> = ({ delay }) => {
  const { f, op, ty } = useReveal(delay);
  const sc = interpolate(f, [0, 28], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        scale: sc.toString(),
        width: PANEL_W,
        borderRadius: 24,
        border: "1px solid rgba(148,197,255,0.2)",
        background: T.panel,
        backdropFilter: "blur(18px)",
        boxShadow: "0 34px 80px rgba(0,0,0,0.6), 0 0 46px rgba(34,211,238,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: FONT,
      }}
    >
      {/* Header — verbatim */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(226,240,255,0.92)" }}>
          PERFORMANCE OVERVIEW
        </div>
        <div
          style={{
            padding: "7px 14px",
            borderRadius: 9,
            border: "1px solid rgba(148,197,255,0.2)",
            fontSize: 13.5,
            color: T.muted,
          }}
        >
          Apr 1 – Apr 30, 2025 ▾
        </div>
      </div>

      <OverallGrowth delay={delay + 10} />
      <MetricRow delay={delay + 22} />
      <ChannelsRow delay={delay + 32} />
      <BottomStrip delay={delay + 42} />
    </div>
  );
};

export const RealGrowthScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1, 1.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 46%" }}>

      {/* Dashboard — center */}
      <Parallax depth={0.55} phase={3}>
        <div style={{ position: "absolute", top: 486, left: "50%", translate: "-50% 0" }}>
          <DashboardPanel delay={16} />
        </div>
      </Parallax>

      {/* Headline — top */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 196 }}>
        <CinematicText delay={10} size={72}>
          Real growth.
        </CinematicText>
        <CinematicText delay={20} size={72} gradient glow tracking>
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
          paddingBottom: 200,
          gap: 10,
        }}
      >
        <FooterCaps delay={64} color="rgba(226,240,255,0.85)">Data-driven. Results-focused.</FooterCaps>
        <FooterCaps delay={74} color={T.muted}>OmniFlow Digital</FooterCaps>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
