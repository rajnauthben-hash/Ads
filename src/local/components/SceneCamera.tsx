import React, { createContext, useContext } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// A subtle, continuous camera that pushes and drifts across the whole film.
// The global push (scale 1.00 -> ~1.055) is applied once at the master
// level; each scene adds a small lateral drift. Depth layers consume the
// drift vector scaled by their own factor for parallax.
type CamVec = { driftX: number; driftY: number };
const Ctx = createContext<CamVec>({ driftX: 0, driftY: 0 });

const EASE = Easing.inOut(Easing.quad);

type Props = {
  duration: number;
  // Peak lateral drift for this scene (px), reached mid-scene.
  driftX?: number;
  driftY?: number;
  children: React.ReactNode;
};

export const SceneCamera: React.FC<Props> = ({ duration, driftX = 14, driftY = -10, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return <Ctx.Provider value={{ driftX: driftX * t, driftY: driftY * t }}>{children}</Ctx.Provider>;
};

type LayerProps = {
  // 0 = static/far, 1 = full drift/near.
  depth: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const ParallaxLayer: React.FC<LayerProps> = ({ depth, children, style }) => {
  const v = useContext(Ctx);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${v.driftX * depth}px, ${v.driftY * depth}px, 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
