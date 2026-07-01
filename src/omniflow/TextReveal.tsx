import { useCurrentFrame, interpolate, Easing } from "remotion";
import { E } from "./constants";

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  duration = 22,
  style,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const translateY = interpolate(f, [0, duration], [28, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        opacity,
        translate: `0px ${translateY}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, duration = 18, style }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  return <div style={{ opacity, ...style }}>{children}</div>;
};

export const SceneFade: React.FC<{
  children: React.ReactNode;
  totalFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ children, totalFrames, fadeIn = 12, fadeOut = 12 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeIn, totalFrames - fadeOut, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <div style={{ opacity, position: "absolute", inset: 0 }}>{children}</div>;
};
