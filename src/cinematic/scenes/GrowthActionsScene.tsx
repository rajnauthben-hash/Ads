import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText } from "../components/CinematicText";
import { T, FONT, EO } from "../theme";

// SCENE — beat 7: "More actions. More customers." Action tiles verbatim
// from the original (Calls / Messages / Bookings / Leads).

type ActionKind = "calls" | "messages" | "bookings" | "leads";

const ActionIcon: React.FC<{ kind: ActionKind }> = ({ kind }) => {
  const s = { stroke: T.cyan, strokeWidth: 1.9, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "calls":
      return (
        <svg width={34} height={34} viewBox="0 0 24 24">
          <path d="M5 3 h4 l1.5 5 -2.5 2 c1 2.5 3 4.5 5.5 5.5 l2 -2.5 5 1.5 v4 c0 1 -1 2 -2 2 C10 21 3 14 3 5 c0 -1 1 -2 2 -2 Z" {...s} />
        </svg>
      );
    case "messages":
      return (
        <svg width={34} height={34} viewBox="0 0 24 24">
          <path d="M21 12 c0 4.4 -4 8 -9 8 c-1.2 0 -2.4 -0.2 -3.4 -0.6 L3 21 l1.7 -4.3 C3.6 15.4 3 13.8 3 12 c0 -4.4 4 -8 9 -8 s9 3.6 9 8 Z" {...s} />
          <circle cx={8.5} cy={12} r={0.8} fill={T.cyan} />
          <circle cx={12} cy={12} r={0.8} fill={T.cyan} />
          <circle cx={15.5} cy={12} r={0.8} fill={T.cyan} />
        </svg>
      );
    case "bookings":
      return (
        <svg width={34} height={34} viewBox="0 0 24 24">
          <rect x={3} y={5} width={18} height={16} rx={2.5} {...s} />
          <line x1={3} y1={10} x2={21} y2={10} {...s} />
          <line x1={8} y1={2.5} x2={8} y2={7} {...s} />
          <line x1={16} y1={2.5} x2={16} y2={7} {...s} />
          <path d="M9 15 l2 2 4 -4" {...s} />
        </svg>
      );
    case "leads":
      return (
        <svg width={34} height={34} viewBox="0 0 24 24">
          <circle cx={12} cy={8} r={4} {...s} />
          <path d="M4.5 21 c0 -4.2 3.3 -6.5 7.5 -6.5 s7.5 2.3 7.5 6.5" {...s} />
        </svg>
      );
  }
};

const ActionTile: React.FC<{ kind: ActionKind; label: string; delay: number; x: number }> = ({
  kind, label, delay, x,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 26], [0.82, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.03 + delay) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: "50%",
        translate: `-50% calc(-50% + ${bob}px)`,
        opacity: op,
        scale: sc.toString(),
        width: 218,
        borderRadius: 22,
        border: "1px solid rgba(34,211,238,0.28)",
        background: T.panel,
        backdropFilter: "blur(16px)",
        boxShadow: "0 26px 60px rgba(0,0,0,0.55), 0 0 34px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "30px 0 26px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 18,
          background: "rgba(34,211,238,0.10)",
          border: "1px solid rgba(34,211,238,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActionIcon kind={kind} />
      </div>
      <div style={{ fontSize: 25, fontWeight: 700, color: T.white, letterSpacing: "-0.01em" }}>
        {label}
      </div>
    </div>
  );
};

// Rising arrow curve behind the tiles.
const GrowthArc: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const op = interpolate(f, [0, 20], [0, 0.4], { extrapolateRight: "clamp" });
  const L = 1300;

  return (
    <svg width={1080} height={700} style={{ opacity: op }}>
      <path
        d="M 40 620 Q 400 590 620 420 T 1010 110"
        fill="none"
        stroke={T.cyan}
        strokeWidth={2.5}
        strokeDasharray={L}
        strokeDashoffset={L * (1 - p)}
        style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.6))" }}
      />
      {p > 0.96 && (
        <path d="M 1010 110 l -26 2 M 1010 110 l -6 25" stroke={T.cyan} strokeWidth={2.5} strokeLinecap="round" />
      )}
    </svg>
  );
};

export const GrowthActionsScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1, 1.07], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 48%" }}>

      {/* Rising arc behind everything */}
      <Parallax depth={0.25} phase={2}>
        <div style={{ position: "absolute", top: 560, left: "50%", translate: "-50% 0" }}>
          <GrowthArc delay={26} />
        </div>
      </Parallax>

      {/* +28% stat pill riding the arc (verbatim from the reference) */}
      <Parallax depth={0.5} phase={6}>
        <StatPill delay={64} x={352} y={-372} />
      </Parallax>

      {/* Action tiles — 2×2 in depth */}
      <Parallax depth={0.7} phase={3}>
        <AbsoluteFill style={{ translate: "0px -105px" }}>
          <ActionTile kind="calls"    label="Calls"    delay={34} x={-136} />
        </AbsoluteFill>
        <AbsoluteFill style={{ translate: "0px -105px" }}>
          <ActionTile kind="messages" label="Messages" delay={42} x={136} />
        </AbsoluteFill>
        <AbsoluteFill style={{ translate: "0px 160px" }}>
          <ActionTile kind="bookings" label="Bookings" delay={50} x={-136} />
        </AbsoluteFill>
        <AbsoluteFill style={{ translate: "0px 160px" }}>
          <ActionTile kind="leads"    label="Leads"    delay={58} x={136} />
        </AbsoluteFill>
      </Parallax>

      {/* Headline — top */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 224 }}>
        <CinematicText delay={14} size={76}>
          More actions.
        </CinematicText>
        <CinematicText delay={24} size={76} gradient glow tracking>
          More customers.
        </CinematicText>
      </AbsoluteFill>

      {/* Footer taglines — verbatim */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 216,
          gap: 10,
        }}
      >
        <FooterCaps delay={74} color="rgba(226,240,255,0.85)">Real actions. Real results.</FooterCaps>
        <FooterCaps delay={84} color={T.cyan}>Grow with OmniFlow.</FooterCaps>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

const StatPill: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 22], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.032 + 2) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y + bob}px)`,
        translate: "-50% -50%",
        opacity: op,
        scale: sc.toString(),
        padding: "10px 20px",
        borderRadius: 30,
        border: "1px solid rgba(34,211,238,0.4)",
        background: "rgba(34,211,238,0.1)",
        boxShadow: "0 0 26px rgba(34,211,238,0.2)",
        fontFamily: FONT,
        fontSize: 26,
        fontWeight: 800,
        color: T.cyan,
        letterSpacing: "-0.01em",
      }}
    >
      +28%
    </div>
  );
};

export const FooterCaps: React.FC<{ delay: number; color: string; children: React.ReactNode }> = ({
  delay, color, children,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ls = interpolate(f, [0, 36], [0.42, 0.26], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  return (
    <div
      style={{
        opacity: op,
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: `${ls}em`,
        textTransform: "uppercase",
        color,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};
