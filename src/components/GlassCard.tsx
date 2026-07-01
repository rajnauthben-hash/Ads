import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, EO, ES } from "../lib/constants";

interface GlassCardProps {
  children: React.ReactNode;
  delay?: number;
  width?: number | string;
  style?: React.CSSProperties;
  glowColor?: string;
  glowStrength?: number;
  slideFrom?: "bottom" | "left" | "right" | "none";
  slideDist?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  delay = 0,
  width,
  style,
  glowColor = COL.cyan,
  glowStrength = 0.25,
  slideFrom = "bottom",
  slideDist = 44,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const tx = slideFrom === "left"  ? interpolate(f, [0, 28], [-slideDist, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...ES) })
            : slideFrom === "right" ? interpolate(f, [0, 28], [slideDist, 0],  { extrapolateRight: "clamp", easing: Easing.bezier(...ES) })
            : 0;
  const ty = slideFrom === "bottom" ? interpolate(f, [0, 28], [slideDist, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...ES) })
            : 0;

  const sc = interpolate(f, [0, 28], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const glowAlpha = Math.round(glowStrength * 255).toString(16).padStart(2, "0");

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px ${ty}px`,
        scale: sc.toString(),
        width,
        borderRadius: 28,
        background: `rgba(11, 18, 32, 0.88)`,
        border: `1px solid rgba(255,255,255,0.11)`,
        boxShadow: [
          `0 0 60px ${glowColor}${glowAlpha}`,
          `0 32px 64px rgba(0,0,0,0.65)`,
          `inset 0 1px 0 rgba(255,255,255,0.07)`,
        ].join(", "),
        backdropFilter: "blur(24px)",
        ...style,
      }}
    >
      {/* Inner top highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};
