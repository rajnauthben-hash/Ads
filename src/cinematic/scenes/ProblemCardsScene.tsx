import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Parallax } from "../components/CameraRig";
import { FloatingProblemCard, LeavingCustomer, ProblemCardSpec } from "../components/FloatingProblemCard";
import { CinematicText } from "../components/CinematicText";

// SCENE 2 — a field of floating problems at different depths.
const CARDS: ProblemCardSpec[] = [
  { icon: "monitor", title: "Outdated Website",       desc: "Old design drives visitors away",   x: -95,  y: -520, depth: 0.86, rot: -2.5, delay: 8,   accent: "#F59E0B" },
  { icon: "search",  title: "Weak Google Visibility", desc: "Customers choose competitors",       x: 100,  y: -320, depth: 1.06, rot: 1.8,  delay: 22,  accent: "#EF4444" },
  { icon: "phone",   title: "Missed Calls & Leads",   desc: "Revenue you never get back",         x: -110, y: -110, depth: 0.95, rot: -1.2, delay: 36,  accent: "#F97316" },
  { icon: "shield",  title: "Low Trust",              desc: "First impressions decide fast",      x: 115,  y: 95,   depth: 0.84, rot: 2.2,  delay: 50,  accent: "#EAB308" },
  { icon: "mobile",  title: "Poor Mobile Experience", desc: "Visitors leave within seconds",      x: -80,  y: 290,  depth: 1.09, rot: -2,   delay: 64,  accent: "#F43F5E" },
];

export const ProblemCardsScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // Lateral dolly with a slow push — flying past the field
  const tx = interpolate(frame, [0, dur], [34, -34], { extrapolateRight: "clamp" });
  const push = interpolate(frame, [0, dur], [1, 1.09], { extrapolateRight: "clamp" });

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
        <LeavingCustomer x={-330} y={-240} delay={46} dir={-1} />
        <LeavingCustomer x={320}  y={-40}  delay={62} dir={1} />
        <LeavingCustomer x={-300} y={170}  delay={78} dir={-1} />
        <LeavingCustomer x={300}  y={330}  delay={94} dir={1} />
      </Parallax>

      {/* Copy — lower third */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 268,
          gap: 8,
        }}
      >
        <CinematicText delay={82} size={56} weight={700} color="rgba(235,244,255,0.92)">
          A weak digital presence
        </CinematicText>
        <CinematicText delay={92} size={56} weight={700} color="rgba(235,244,255,0.92)" style={{ marginTop: -6 }}>
          costs attention.
        </CinematicText>
        <CinematicText delay={116} size={52} gradient glow tracking>
          Every day costs real customers.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
