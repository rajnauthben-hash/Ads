import React from "react";
import { useCurrentFrame } from "remotion";
import { getFrameEntry } from "../../framePlan";

// Wraps the whole scene in a single perspective transform driven only by
// FRAME_PLAN's camera values. Motion stays inside the locked limits.
export const VirtualCamera: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const { camera } = getFrameEntry(frame);
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        perspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transformOrigin: "50% 50%",
          transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale}) rotateX(${camera.rotateX}deg) rotateY(${camera.rotateY}deg) rotateZ(${camera.rotateZ}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
