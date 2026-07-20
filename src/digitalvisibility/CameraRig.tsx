import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { CAMERA } from "./timeline";
import { bez } from "./anim";
import { EASE } from "./styles";
import { interpolate } from "remotion";

export type Cam = { x: number; y: number; scale: number };

const CamCtx = createContext<Cam>({ x: 0, y: 0, scale: 1 });

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const fs = CAMERA.keys.map((k) => k.f);
  const cam: Cam = {
    x: interpolate(frame, fs, CAMERA.keys.map((k) => k.x), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: bez(EASE.inOut) }),
    y: interpolate(frame, fs, CAMERA.keys.map((k) => k.y), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: bez(EASE.inOut) }),
    scale: interpolate(frame, fs, CAMERA.keys.map((k) => k.s), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: bez(EASE.inOut) }),
  };
  return <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>;
};

export const useCam = () => useContext(CamCtx);

/** Wraps content in a parallax transform driven by the master camera. */
export const ParallaxLayer: React.FC<{
  depth: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ depth, children, style }) => {
  const cam = useCam();
  // scale drift toward 1 by depth so nearer layers move/zoom more
  const s = 1 + (cam.scale - 1) * depth;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${cam.x * depth}px, ${cam.y * depth}px, 0) scale(${s})`,
        transformOrigin: "50% 46%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
