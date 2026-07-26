import React from "react";
import { useCurrentFrame } from "remotion";
import { cameraStateAtFrame, PARALLAX } from "../timeline/framePlan";

/**
 * One continuous camera. It never resets between scenes. Children opt into a
 * parallax depth via ParallaxLayer; the rig applies the shared camera
 * transform, and each layer scales the translation by its parallax factor.
 */

const CameraContext = React.createContext(cameraStateAtFrame(0));

export const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const cam = cameraStateAtFrame(frame);
  return (
    <CameraContext.Provider value={cam}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </CameraContext.Provider>
  );
};

export type ParallaxDepth = keyof typeof PARALLAX;

/**
 * A depth layer that moves with the camera scaled by its parallax factor.
 * `worldScale` lets a layer also share the camera zoom (storefront/roads do).
 */
export const ParallaxLayer: React.FC<{
  depth: ParallaxDepth;
  zIndex: number;
  children: React.ReactNode;
  shareScale?: boolean;
}> = ({ depth, zIndex, children, shareScale = true }) => {
  const cam = React.useContext(CameraContext);
  const f = PARALLAX[depth];
  const scale = shareScale ? 1 + (cam.cameraScale - 1) * f : 1;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        transformOrigin: "540px 980px",
        transform: [
          `translate(${cam.cameraX * f}px, ${cam.cameraY * f}px)`,
          `perspective(2200px)`,
          `rotateX(${cam.cameraRotateX * f}deg)`,
          `rotateZ(${cam.cameraRotateZ * f}deg)`,
          `scale(${scale})`,
        ].join(" "),
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

export function useCamera() {
  return React.useContext(CameraContext);
}
