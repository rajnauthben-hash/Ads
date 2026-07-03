import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { EO } from "../theme";

// ————— Fake cinematic camera —————
// A handheld micro-drift applied to the whole world, plus per-layer
// parallax so foreground/midground/background separate as it moves.

export function useHandheld() {
  const frame = useCurrentFrame();
  return {
    x: Math.sin(frame * 0.021) * 7 + Math.sin(frame * 0.0127) * 4,
    y: Math.cos(frame * 0.017) * 6 + Math.sin(frame * 0.0093) * 3,
    rot: Math.sin(frame * 0.0081) * 0.35,
  };
}

// World container — one global drift, never cuts.
export const WorldRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const h = useHandheld();
  return (
    <AbsoluteFill
      style={{
        translate: `${h.x * 0.5}px ${h.y * 0.5}px`,
        rotate: `${h.rot}deg`,
        scale: "1.02", // overscan hides drift edges
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Parallax layer — depth 0 (locked to horizon) … 1 (right at the lens).
// Deeper layers move less; near layers move more and bob slightly.
export const Parallax: React.FC<{
  depth: number;
  phase?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ depth, phase = 0, children, style }) => {
  const frame = useCurrentFrame();
  const h = useHandheld();
  const bob = Math.sin(frame * 0.024 + phase) * (2 + depth * 6);
  return (
    <AbsoluteFill
      style={{
        translate: `${h.x * depth * 0.9}px ${h.y * depth * 0.9 + bob}px`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ————— Fly-through scene envelope —————
// The camera flies FORWARD through outgoing content (scales past the lens,
// defocuses) while incoming content resolves from ahead. "pullback" enters
// oversized and settles — used for the final reveal.

interface FlyProps {
  dur: number;
  enter?: number;        // frames
  exit?: number;         // frames
  enterMode?: "ahead" | "pullback" | "none";
  exitMode?: "through" | "none";
  origin?: string;       // transform-origin for the exit move
  children: React.ReactNode;
}

export const FlyThrough: React.FC<FlyProps> = ({
  dur,
  enter = 22,
  exit = 22,
  enterMode = "ahead",
  exitMode = "through",
  origin = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();

  // Entry — content approaches from ahead (small → 1) or pulls back (big → 1)
  let inScale = 1;
  let inOp = 1;
  let inBlur = 0;
  if (enterMode !== "none") {
    const from = enterMode === "ahead" ? 0.86 : 1.16;
    inScale = interpolate(frame, [0, enter + 10], [from, 1], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EO),
    });
    inOp = interpolate(frame, [0, enter], [0, 1], { extrapolateRight: "clamp" });
    inBlur = interpolate(frame, [0, enter], [4, 0], { extrapolateRight: "clamp" });
  }

  // Exit — camera passes through: scale up past the lens, defocus, fade
  let outScale = 1;
  let outOp = 1;
  let outBlur = 0;
  if (exitMode === "through") {
    outScale = interpolate(frame, [dur - exit, dur], [1, 1.9], {
      extrapolateLeft: "clamp",
      easing: Easing.in(Easing.quad),
    });
    outOp = interpolate(frame, [dur - exit + 4, dur - 2], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    outBlur = interpolate(frame, [dur - exit, dur], [0, 8], { extrapolateLeft: "clamp" });
  }

  const blur = Math.max(inBlur, outBlur);

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inOp, outOp),
        scale: (inScale * outScale).toString(),
        transformOrigin: origin,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
