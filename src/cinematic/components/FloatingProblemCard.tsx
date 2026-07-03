import { useCurrentFrame, interpolate, Easing } from "remotion";
import { T, FONT, EO } from "../theme";

type IconKind = "monitor" | "search" | "phone" | "shield" | "mobile";

const Icon: React.FC<{ kind: IconKind; color: string }> = ({ kind, color }) => {
  const s = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "monitor":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24">
          <rect x={2.5} y={4} width={19} height={13} rx={2} {...s} />
          <line x1={8.5} y1={21} x2={15.5} y2={21} {...s} />
          <line x1={12} y1={17} x2={12} y2={21} {...s} />
        </svg>
      );
    case "search":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24">
          <circle cx={10.5} cy={10.5} r={6.5} {...s} />
          <line x1={15.5} y1={15.5} x2={21} y2={21} {...s} />
        </svg>
      );
    case "phone":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24">
          <path d="M5 3 h4 l1.5 5 -2.5 2 c1 2.5 3 4.5 5.5 5.5 l2 -2.5 5 1.5 v4 c0 1 -1 2 -2 2 C10 21 3 14 3 5 c0 -1 1 -2 2 -2 Z" {...s} />
        </svg>
      );
    case "shield":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24">
          <path d="M12 2.5 L20 6 v6 c0 5 -3.5 8 -8 9.5 C7.5 20 4 17 4 12 V6 Z" {...s} />
          <line x1={9} y1={11.5} x2={15} y2={11.5} {...s} />
        </svg>
      );
    case "mobile":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24">
          <rect x={7} y={2.5} width={10} height={19} rx={2.5} {...s} />
          <line x1={10.5} y1={18} x2={13.5} y2={18} {...s} />
        </svg>
      );
  }
};

export interface ProblemCardSpec {
  icon: IconKind;
  title: string;
  desc: string;
  x: number;       // offset from canvas center
  y: number;
  depth: number;   // 0.8 far … 1.15 near (drives scale/blur/parallax feel)
  rot: number;     // resting rotation deg
  delay: number;
  accent?: string;
}

export const FloatingProblemCard: React.FC<ProblemCardSpec> = ({
  icon, title, desc, x, y, depth, rot, delay, accent = "#F59E0B",
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const settle = interpolate(f, [0, 34], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Emerge from darkness ahead, rotate slightly, drift toward the camera.
  const driftScale = 1 + Math.min(1, f / 150) * 0.05;
  const bob = Math.sin(frame * 0.03 + delay) * 5;
  const isNear = depth > 1.02;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y + bob}px)`,
        translate: "-50% -50%",
        opacity: op * (isNear ? 0.96 : 0.88),
        scale: (depth * driftScale * (1 - settle * 0.12)).toString(),
        rotate: `${rot + settle * 6}deg`,
        filter: isNear ? "blur(1.1px)" : depth < 0.9 ? "blur(0.6px)" : undefined,
        width: 430,
        borderRadius: 20,
        border: `1px solid rgba(148,197,255,0.18)`,
        background: T.panel,
        backdropFilter: "blur(18px)",
        boxShadow: `0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 40px ${accent}0f`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 15,
          background: `${accent}14`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={icon} color={accent} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 23, fontWeight: 700, color: T.white, letterSpacing: "-0.01em", marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 17, fontWeight: 400, color: T.muted, lineHeight: 1.35 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

// A customer avatar dot that gives up and drifts away toward competitors.
export const LeavingCustomer: React.FC<{
  x: number; y: number; delay: number; dir?: 1 | -1;
}> = ({ x, y, delay, dir = 1 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const op = interpolate(p, [0, 0.15, 0.6, 1], [0, 0.7, 0.45, 0]);
  const tx = p * 190 * dir;
  const ty = p * 55;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x + tx}px)`,
        top: `calc(50% + ${y + ty}px)`,
        translate: "-50% -50%",
        opacity: op,
      }}
    >
      <svg width={30} height={30} viewBox="0 0 24 24">
        <circle cx={12} cy={8} r={4} fill="rgba(148,197,255,0.55)" />
        <path d="M4 21 c0 -4.5 3.5 -7 8 -7 s8 2.5 8 7" fill="rgba(148,197,255,0.4)" />
      </svg>
    </div>
  );
};
