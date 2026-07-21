import React, { createContext, useContext } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// A restrained camera that settles once, early, then HOLDS still. The drift
// eases out over the first ~40% of the scene and plateaus, so each scene
// comes to rest on its reference composition instead of sliding throughout.
// The global 1.00->~1.03 push lives at the master level.
type CamVec = { driftX: number; driftY: number };
const Ctx = createContext<CamVec>({ driftX: 0, driftY: 0 });

// Ease-out cubic — fast settle, long hold.
const EASE = Easing.out(Easing.cubic);
// Global damping so per-scene drift stays gentle (max ~7px foreground).
const DAMP = 0.45;

type Props = {
  duration: number;
  // Peak lateral drift for this scene (px), reached early then held.
  driftX?: number;
  driftY?: number;
  children: React.ReactNode;
};

export const SceneCamera: React.FC<Props> = ({ duration, driftX = 14, driftY = -10, children }) => {
  const frame = useCurrentFrame();
  // Reach full drift by ~45% of the scene, then hold.
  const t = interpolate(frame, [0, duration * 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return <Ctx.Provider value={{ driftX: driftX * DAMP * t, driftY: driftY * DAMP * t }}>{children}</Ctx.Provider>;
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
