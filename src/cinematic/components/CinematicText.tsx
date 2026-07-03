import { useCurrentFrame, interpolate, Easing } from "remotion";
import { T, FONT, EO } from "../theme";

// Masked line reveal with tracking settle and optional cyan gradient/glow.
export const CinematicText: React.FC<{
  delay?: number;
  dur?: number;
  size?: number;
  weight?: number;
  gradient?: boolean;
  glow?: boolean;
  color?: string;
  tracking?: boolean;   // animate letter-spacing wide → tight
  align?: "center" | "left";
  maxWidth?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  delay = 0,
  dur = 26,
  size = 62,
  weight = 800,
  gradient = false,
  glow = false,
  color = T.white,
  tracking = false,
  align = "center",
  maxWidth,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const ty = interpolate(f, [0, dur], [size * 1.15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const op = interpolate(f, [0, dur * 0.7], [0, 1], { extrapolateRight: "clamp" });
  const ls = tracking
    ? interpolate(f, [0, dur + 14], [0.09, -0.02], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(...EO),
      })
    : -0.025;

  const gradStyle: React.CSSProperties = gradient
    ? {
        background: `linear-gradient(92deg, ${T.cyan} 0%, #7DD3FC 55%, ${T.blue} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color };

  return (
    <div style={{ overflow: "hidden", padding: "0.08em 0", ...style }}>
      <div
        style={{
          translate: `0px ${ty}px`,
          opacity: op,
          fontFamily: FONT,
          fontSize: size,
          fontWeight: weight,
          letterSpacing: `${ls}em`,
          lineHeight: 1.08,
          textAlign: align,
          maxWidth,
          marginLeft: align === "center" ? "auto" : undefined,
          marginRight: align === "center" ? "auto" : undefined,
          textShadow: glow ? `0 0 34px rgba(34,211,238,0.45)` : undefined,
          ...gradStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Small uppercase kicker label with expanding tracking.
// `pill` renders the reference's bordered badge treatment.
export const Kicker: React.FC<{
  delay?: number;
  color?: string;
  pill?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, color = T.cyan, pill = false, children, style }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ls = interpolate(f, [0, 34], [0.5, 0.3], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  return (
    <div
      style={{
        opacity: op,
        fontFamily: FONT,
        fontSize: 23,
        fontWeight: 600,
        letterSpacing: `${ls}em`,
        textTransform: "uppercase",
        color,
        textAlign: "center",
        ...(pill
          ? {
              padding: "12px 30px 12px 36px",
              borderRadius: 12,
              border: "1px solid rgba(34,211,238,0.45)",
              background: "rgba(34,211,238,0.06)",
              boxShadow: "0 0 24px rgba(34,211,238,0.15)",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
