import React from "react";
import { ezIn, ezOut, prog } from "../util";

/**
 * Object-based transition wrapper. Never a full-screen crossfade: it
 * moves/compresses/collapses a specific group of scene objects on enter
 * and/or exit, driven by transforms only.
 */
export interface TransitionSpec {
  x?: number;
  y?: number;
  scale?: number;
  scaleY?: number;
  opacity?: number;
  blur?: number;
  rotate?: number;
}

export interface SceneTransitionProps {
  frame: number;
  enter?: { start: number; dur: number; from: TransitionSpec };
  exit?: { start: number; dur: number; to: TransitionSpec };
  origin?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  frame,
  enter,
  exit,
  origin = "50% 50%",
  style,
  children,
}) => {
  let x = 0;
  let y = 0;
  let scale = 1;
  let scaleY = 1;
  let opacity = 1;
  let blur = 0;
  let rotate = 0;

  if (enter) {
    const q = 1 - prog(frame, enter.start, enter.dur, ezOut);
    const f = enter.from;
    x += (f.x ?? 0) * q;
    y += (f.y ?? 0) * q;
    scale *= 1 + ((f.scale ?? 1) - 1) * q;
    scaleY *= 1 + ((f.scaleY ?? 1) - 1) * q;
    opacity *= 1 + ((f.opacity ?? 1) - 1) * q;
    blur += (f.blur ?? 0) * q;
    rotate += (f.rotate ?? 0) * q;
  }
  if (exit) {
    const q = prog(frame, exit.start, exit.dur, ezIn);
    const t = exit.to;
    x += (t.x ?? 0) * q;
    y += (t.y ?? 0) * q;
    scale *= 1 + ((t.scale ?? 1) - 1) * q;
    scaleY *= 1 + ((t.scaleY ?? 1) - 1) * q;
    opacity *= 1 + ((t.opacity ?? 1) - 1) * q;
    blur += (t.blur ?? 0) * q;
    rotate += (t.rotate ?? 0) * q;
  }

  if (opacity <= 0.003) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}, ${(scale * scaleY).toFixed(4)}) rotate(${rotate.toFixed(2)}deg)`,
        transformOrigin: origin,
        opacity,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
