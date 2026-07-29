import React from "react";
import { COLORS } from "../styles/tokens";

// Black metallic phone shell with soft silver edge and subtle cyan reflection.
// Radius/scale/bezel are animatable so the shell can flatten into the Scene 2
// network panel during the transition.
export const PhoneShell: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  showBezel?: boolean;
  bezelOffset?: number; // px upward for the top bezel during flatten
  opacity?: number;
  blur?: number;
  scale?: number;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  width,
  height,
  radius = 62,
  showBezel = true,
  bezelOffset = 0,
  opacity = 1,
  blur = 0,
  scale = 1,
  children,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        borderRadius: radius,
        background: "linear-gradient(150deg, #0c1116, #05080b)",
        border: `2px solid rgba(190,200,210,0.28)`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 0 40px rgba(24,216,255,0.04)`,
        padding: 12,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* subtle cyan edge reflection */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          boxShadow: "inset 0 2px 24px rgba(24,216,255,0.06)",
          pointerEvents: "none",
        }}
      />
      {showBezel && (
        <div
          style={{
            position: "absolute",
            top: 10 - bezelOffset,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 7,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: radius - 10,
          background: COLORS.mapEnvironment,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
