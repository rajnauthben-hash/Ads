import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";

export const LeadNotificationCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const slideY = interpolate(f, [0, 24], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const opacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const dotPulse = interpolate(
    Math.sin(((frame - delay) / 20) * Math.PI),
    [-1, 1],
    [0.5, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        fontFamily,
        opacity,
        translate: `0px ${slideY}px`,
        background: C.cardBg,
        border: `1px solid ${C.cardBorderAccent}`,
        borderRadius: 20,
        padding: "28px 32px",
        width: 360,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 40px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: C.cyan,
            opacity: dotPulse,
            boxShadow: `0 0 12px ${C.cyan}`,
            flexShrink: 0,
          }}
        />
        <span style={{ color: C.cyan, fontSize: 22, fontWeight: 600, letterSpacing: "0.04em" }}>
          New inquiry
        </span>
      </div>
      <div style={{ color: C.offWhite, fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
        Website lead captured
      </div>
      <div style={{ color: C.textSub, fontSize: 20, fontWeight: 400 }}>
        Contact form · Just now
      </div>
    </div>
  );
};
