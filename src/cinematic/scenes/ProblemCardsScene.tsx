import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { FloatingProblemCard, LeavingCustomer, ProblemCardSpec } from "../components/FloatingProblemCard";
import { CinematicText, Kicker } from "../components/CinematicText";
import { GhostMapCard } from "../components/HologramPanel";
import { T, FONT, EO } from "../theme";

// SCENE 2 — floating problem field. Card copy is verbatim from the
// original ad (beats 2–3 of omniflowv3).
// Cyan/blue accents — matches the reference's all-blue problem cards.
const CARDS: ProblemCardSpec[] = [
  {
    icon: "monitor", title: "Outdated Website",
    desc: "Old design builds distrust and drives visitors away.",
    x: -85, y: -500, depth: 0.88, rot: -2.4, delay: 10, accent: "#38BDF8",
  },
  {
    icon: "search", title: "Weak Google Visibility",
    desc: "Low rankings mean customers choose your competitors.",
    x: 95, y: -255, depth: 1.07, rot: 1.8, delay: 26, accent: "#22D3EE",
  },
  {
    icon: "phone", title: "Missed Calls & Leads",
    desc: "Every missed inquiry is revenue you’ll never get back.",
    x: -80, y: 12, depth: 0.96, rot: -1.3, delay: 42, accent: "#3B82F6",
  },
];

// Cost-beat evidence cards — labels verbatim from the reference.
const MiniEvidenceCard: React.FC<{
  delay: number; x: number; y: number; title: string; kind: "traffic" | "activity";
}> = ({ delay, x, y, title, kind }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 0.85], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 24], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.027 + delay) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y + bob}px)`,
        translate: `-50% ${ty}px`,
        opacity: op,
        width: 268,
        borderRadius: 15,
        border: "1px solid rgba(148,197,255,0.2)",
        background: T.panel,
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 46px rgba(0,0,0,0.5)",
        padding: "15px 18px",
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 16.5, fontWeight: 600, color: "rgba(226,240,255,0.85)", marginBottom: 10 }}>
        {title}
      </div>
      {kind === "traffic" ? (
        <svg width={230} height={62} viewBox="0 0 230 62">
          {[0, 1, 2].map((i) => (
            <line key={i} x1={0} y1={10 + i * 20} x2={230} y2={10 + i * 20} stroke="rgba(148,197,255,0.09)" strokeWidth={1} />
          ))}
          <path
            d="M 6 12 L 44 20 L 82 18 L 120 32 L 158 40 L 196 46 L 224 54"
            fill="none"
            stroke="#F87171"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.75}
          />
          <path d="M 224 54 l -9 -4 M 224 54 l -4 -9" stroke="#F87171" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
        </svg>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[0.5, 0.35].map((o, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `rgba(148,197,255,${o * 0.5})` }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: `${68 - i * 14}%`, height: 6, borderRadius: 2, background: `rgba(148,197,255,${o})`, marginBottom: 4 }} />
                <div style={{ width: `${44 - i * 8}%`, height: 5, borderRadius: 2, background: `rgba(148,197,255,${o * 0.6})` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProblemCardsScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // Lateral dolly with a slow push — flying past the field
  const tx = interpolate(frame, [0, dur], [30, -30], { extrapolateRight: "clamp" });
  const push = interpolate(frame, [0, dur], [1, 1.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ translate: `${tx}px 0px`, scale: push.toString() }}>

      {/* Cards distributed across three parallax depths */}
      {CARDS.map((c) => (
        <Parallax key={c.title} depth={c.depth > 1 ? 0.9 : c.depth < 0.9 ? 0.3 : 0.6} phase={c.delay}>
          <FloatingProblemCard {...c} />
        </Parallax>
      ))}

      {/* Customers drifting away toward competitors */}
      <Parallax depth={0.75} phase={9}>
        <LeavingCustomer x={-330} y={-330} delay={46} dir={-1} />
        <LeavingCustomer x={330}  y={-90}  delay={62} dir={1} />
        <LeavingCustomer x={-310} y={130}  delay={78} dir={-1} />
        <LeavingCustomer x={300}  y={230}  delay={94} dir={1} />
      </Parallax>

      {/* Cost-beat evidence — appears as the "what it costs you" line lands */}
      <Parallax depth={0.45} phase={11}>
        <MiniEvidenceCard delay={84} x={322}  y={-460} title="Traffic Over Time" kind="traffic" />
        <MiniEvidenceCard delay={92} x={-282} y={228}  title="Customer Activity" kind="activity" />
      </Parallax>
      <Parallax depth={0.55} phase={13}>
        <div style={{ position: "absolute", left: "50%", top: "50%", translate: "calc(-50% + 310px) 120px", scale: "0.86" }}>
          <GhostMapCard delay={98} width={300} />
        </div>
      </Parallax>

      {/* Copy — lower third; kicker → headline, kicker → headline */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 240,
          gap: 8,
        }}
      >
        <Kicker delay={62} pill style={{ marginBottom: 10 }}>The Problem</Kicker>
        <CinematicText delay={70} size={56} weight={700} color="rgba(240,247,255,0.95)">
          A weak digital presence
        </CinematicText>
        <CinematicText delay={80} size={56} weight={700} gradient glow style={{ marginTop: -6 }}>
          costs attention.
        </CinematicText>
        <Kicker delay={96} style={{ marginTop: 16, marginBottom: 6 }}>What It Costs You</Kicker>
        <CinematicText delay={104} size={54} weight={700} color="rgba(240,247,255,0.95)">
          Every day costs
        </CinematicText>
        <CinematicText delay={112} size={54} gradient glow tracking style={{ marginTop: -4 }}>
          real customers.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
