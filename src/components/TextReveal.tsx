import { useCurrentFrame, interpolate, Easing } from "remotion";
import { FONT, EO } from "../lib/constants";
import { sceneOpacity } from "../lib/animations";
import { AbsoluteFill } from "remotion";

/**
 * Line reveal — text slides up from below a hidden overflow container.
 * Creates the premium masked-text entrance used by Apple, Vercel, Linear.
 */
export const LineReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  dur?: number;
  dist?: number;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, delay = 0, dur = 22, dist = 48, style, className }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const ty = interpolate(f, [0, dur], [dist, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const op = interpolate(f, [0, Math.round(dur * 0.45)], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ overflow: "hidden", ...style }} className={className}>
      <div style={{ translate: `0px ${ty}px`, opacity: op }}>
        {children}
      </div>
    </div>
  );
};

/** Simple fade + slight upward drift for supporting copy. */
export const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, dur = 20, style }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, dur], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const ty = interpolate(f, [0, dur], [24, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div style={{ opacity: op, translate: `0px ${ty}px`, ...style }}>
      {children}
    </div>
  );
};

/** Scene wrapper — handles fade-in and fade-out for a scene's totalFrames. */
export const SceneWrapper: React.FC<{
  totalFrames: number;
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ totalFrames, children, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, totalFrames, fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

/** Preset text styles for reuse across scenes. */
export const TStyle = {
  hook: {
    fontFamily: FONT,
    fontSize: 88,
    fontWeight: 800,
    letterSpacing: "-0.028em",
    lineHeight: 1.1,
    color: "#F8FAFC",
  } as React.CSSProperties,

  hookLg: {
    fontFamily: FONT,
    fontSize: 96,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.08,
    color: "#F8FAFC",
  } as React.CSSProperties,

  sub: {
    fontFamily: FONT,
    fontSize: 42,
    fontWeight: 500,
    letterSpacing: "-0.015em",
    lineHeight: 1.35,
    color: "#94A3B8",
  } as React.CSSProperties,

  cta: {
    fontFamily: FONT,
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#F8FAFC",
  } as React.CSSProperties,

  label: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#22D3EE",
  } as React.CSSProperties,
} as const;
