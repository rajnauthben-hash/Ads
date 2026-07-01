import { useCurrentFrame, interpolate, Easing } from "remotion";
import { E } from "./constants";

interface FlowLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
  glowColor?: string;
}

export const FlowLine: React.FC<FlowLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color = "rgba(0, 212, 255, 0.5)",
  width = 1.5,
  delay = 0,
  duration = 30,
  opacity: maxOpacity = 1,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // pathLength trick: set pathLength="1" so dashoffset goes from 1→0
  const dashOffset = interpolate(f, [0, duration], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const lineOpacity = interpolate(f, [0, 8], [0, maxOpacity], {
    extrapolateRight: "clamp",
  });

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1080 1920"
      width="1080"
      height="1920"
    >
      {glowColor && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={glowColor}
          strokeWidth={width * 6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={dashOffset}
          opacity={lineOpacity * 0.3}
        />
      )}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={dashOffset}
        opacity={lineOpacity}
      />
    </svg>
  );
};

interface CurvedFlowLineProps {
  d: string;
  color?: string;
  width?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
}

export const CurvedFlowLine: React.FC<CurvedFlowLineProps> = ({
  d,
  color = "rgba(0, 212, 255, 0.5)",
  width = 1.5,
  delay = 0,
  duration = 30,
  opacity: maxOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const dashOffset = interpolate(f, [0, duration], [1, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const lineOpacity = interpolate(f, [0, 8], [0, maxOpacity], {
    extrapolateRight: "clamp",
  });

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1080 1920"
      width="1080"
      height="1920"
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={dashOffset}
        opacity={lineOpacity}
      />
    </svg>
  );
};
