import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { EASE_CAMERA } from "./motion";

export type CameraMode = "push" | "lateral" | "narrow" | "track" | "orbit" | "follow";

type CamVector = { x: number; y: number };

const CameraContext = createContext<CamVector>({ x: 0, y: 0 });

// Each scene declares a camera intention; layers consume the resulting
// vector scaled by their depth factor, so movement is distributed across
// planes instead of animating one wrapper. Foreground max ≈ 24px.
const vectorFor = (mode: CameraMode, t: number): CamVector => {
  const e = EASE_CAMERA(t);
  switch (mode) {
    case "push": // slow push toward the route field
      return { x: -16 * e, y: -13 * e };
    case "lateral": // interface -> map
      return { x: -24 * e, y: -5 * e };
    case "narrow": // attention tightens on the top results
      return { x: -6 * e, y: -17 * e };
    case "track": // travel with the bypassing route
      return { x: -24 * e, y: -9 * e };
    case "orbit": // subtle arc around the storefront
      return { x: 12 * Math.sin(t * Math.PI), y: -10 * e };
    case "follow": {
      // chase the route, then settle for the final hold
      const chase = Math.min(1, t * 1.5);
      const ec = EASE_CAMERA(chase);
      return { x: -20 * ec, y: -12 * ec };
    }
  }
};

type CameraProps = {
  mode: CameraMode;
  // Scene duration in frames.
  duration: number;
  children: React.ReactNode;
};

export const DepthCamera: React.FC<CameraProps> = ({ mode, duration, children }) => {
  const frame = useCurrentFrame();
  const t = Math.min(1, Math.max(0, frame / duration));
  return <CameraContext.Provider value={vectorFor(mode, t)}>{children}</CameraContext.Provider>;
};

type LayerProps = {
  // 0 = infinitely far (static), 1 = foreground (full camera vector).
  factor: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

// A depth plane: applies the camera vector scaled by its depth factor.
export const DepthLayer: React.FC<LayerProps> = ({ factor, children, style }) => {
  const v = useContext(CameraContext);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${v.x * factor}px, ${v.y * factor}px, 0)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
