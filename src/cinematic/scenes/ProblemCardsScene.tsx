import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Parallax } from "../components/CameraRig";
import { FloatingProblemCard, LeavingCustomer, ProblemCardSpec } from "../components/FloatingProblemCard";
import { CinematicText, Kicker } from "../components/CinematicText";

// SCENE 2 — floating problem field. Card copy is verbatim from the
// original ad (beats 2–3 of omniflowv3).
const CARDS: ProblemCardSpec[] = [
  {
    icon: "monitor", title: "Outdated Website",
    desc: "Old design builds distrust and drives visitors away.",
    x: -85, y: -500, depth: 0.88, rot: -2.4, delay: 10, accent: "#F59E0B",
  },
  {
    icon: "search", title: "Weak Google Visibility",
    desc: "Low rankings mean customers choose your competitors.",
    x: 95, y: -255, depth: 1.07, rot: 1.8, delay: 26, accent: "#EF4444",
  },
  {
    icon: "phone", title: "Missed Calls & Leads",
    desc: "Every missed inquiry is revenue you’ll never get back.",
    x: -80, y: 12, depth: 0.96, rot: -1.3, delay: 42, accent: "#F97316",
  },
];

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
        <Kicker delay={74} style={{ marginBottom: 6 }}>The Problem</Kicker>
        <CinematicText delay={82} size={56} weight={700} color="rgba(235,244,255,0.92)">
          A weak digital presence
        </CinematicText>
        <CinematicText delay={92} size={56} weight={700} color="rgba(235,244,255,0.92)" style={{ marginTop: -6 }}>
          costs attention.
        </CinematicText>
        <Kicker delay={108} style={{ marginTop: 16, marginBottom: 6 }}>What It Costs You</Kicker>
        <CinematicText delay={116} size={52} gradient glow tracking>
          Every day costs real customers.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
