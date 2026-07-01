import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

export const LogoLockup: React.FC<{
  delay?: number;
  size?: "md" | "lg";
}> = ({ delay = 0, size = "lg" }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const sc = interpolate(f, [0, 28], [0.88, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const sizes = {
    md: { mark: 48, word: 54, sub: 22, gap: 16, trackSub: "0.22em" },
    lg: { mark: 68, word: 74, sub: 28, gap: 20, trackSub: "0.24em" },
  };
  const s = sizes[size];

  // Arc draw-in
  const arcProgress = interpolate(f, [6, 32], [0, 1], { extrapolateRight: "clamp" });
  const arcLen = 113; // circumference of r=18
  const arcDash = arcLen * arcProgress;

  return (
    <div style={{ opacity: op, scale: sc.toString() }}>
      <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
        {/* Abstract O-ring mark */}
        <svg
          width={s.mark}
          height={s.mark}
          viewBox="0 0 40 40"
          style={{ flexShrink: 0 }}
        >
          {/* Outer ring */}
          <circle
            cx={20} cy={20} r={18}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
          />
          {/* Cyan arc — draws in */}
          <circle
            cx={20} cy={20} r={18}
            fill="none"
            stroke={COL.cyan}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${arcDash} ${arcLen}`}
            strokeDashoffset={arcLen * 0.25}
            style={{ transform: "rotate(-90deg)", transformOrigin: "20px 20px" }}
          />
          {/* Center dot with glow */}
          <circle cx={20} cy={20} r={4} fill={COL.cyan} opacity="0.9" />
          <circle cx={20} cy={20} r={9} fill={COL.cyan} opacity="0.08" />
        </svg>

        {/* Wordmark */}
        <div style={{ fontFamily: FONT, lineHeight: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: s.word,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: COL.white,
              }}
            >
              Omni
            </span>
            <span
              style={{
                fontSize: s.word,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: COL.cyan,
              }}
            >
              Flow
            </span>
          </div>
          <div
            style={{
              fontSize: s.sub,
              fontWeight: 500,
              letterSpacing: s.trackSub,
              textTransform: "uppercase" as const,
              color: COL.muted,
              marginTop: 4,
            }}
          >
            Digital
          </div>
        </div>
      </div>
    </div>
  );
};
