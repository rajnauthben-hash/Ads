import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "./constants";
import { fontFamily } from "./fonts";

/**
 * OmniFlow Digital wordmark.
 * Replace this component with <Img src={staticFile("logo.png")} /> once the real logo is ready.
 * Suggested asset path: public/omniflow-logo.png or public/omniflow-logo.svg
 */
export const LogoWordmark: React.FC<{
  delay?: number;
  size?: "sm" | "md" | "lg";
}> = ({ delay = 0, size = "md" }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const scaleVal = interpolate(f, [0, 28], [0.88, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  const sizes = {
    sm: { mark: 28, omni: 28, digital: 16, gap: 10 },
    md: { mark: 40, omni: 40, digital: 22, gap: 14 },
    lg: { mark: 56, omni: 56, digital: 30, gap: 18 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        fontFamily,
        opacity,
        scale: scaleVal.toString(),
        display: "flex",
        alignItems: "center",
        gap: s.gap,
      }}
    >
      {/* Flow mark — abstract circular O with a cyan arc */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        style={{ flexShrink: 0 }}
      >
        {/* Outer ring */}
        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        {/* Cyan arc — the "flow" mark */}
        <path
          d="M 20 2 A 18 18 0 1 1 5 30"
          fill="none"
          stroke={C.cyan}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Inner dot */}
        <circle cx="20" cy="20" r="3.5" fill={C.cyan} opacity="0.9" />
        {/* Glow */}
        <circle cx="20" cy="20" r="8" fill={C.cyanGlow} />
      </svg>

      {/* Wordmark text */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              color: C.white,
              fontSize: s.omni,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Omni
          </span>
          <span
            style={{
              color: C.cyan,
              fontSize: s.omni,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Flow
          </span>
        </div>
        <div
          style={{
            color: C.textSub,
            fontSize: s.digital,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            marginTop: 2,
          }}
        >
          Digital
        </div>
      </div>
    </div>
  );
};
