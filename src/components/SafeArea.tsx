import React from "react";
import { LAYER, RESERVE, SAFE } from "../styles/tokens";

/**
 * Development-only overlay showing the safe zone and reserved platform areas.
 * MUST be disabled for the final render (enabled={false} in the composition).
 */
export const SafeArea: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  if (!enabled) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: LAYER.devGuides,
        pointerEvents: "none",
      }}
    >
      {/* Safe zone */}
      <div
        style={{
          position: "absolute",
          left: SAFE.x1,
          top: SAFE.y1,
          width: SAFE.x2 - SAFE.x1,
          height: SAFE.y2 - SAFE.y1,
          border: "2px dashed rgba(55,214,122,0.8)",
        }}
      />
      {/* Top reserve */}
      <Reserve top={0} height={RESERVE.topY} label="TOP PLATFORM RESERVE" />
      {/* Bottom reserve */}
      <Reserve top={RESERVE.bottomY} height={1920 - RESERVE.bottomY} label="BOTTOM PLATFORM RESERVE" />
      {/* Right controls reserve */}
      <div
        style={{
          position: "absolute",
          left: RESERVE.rightX,
          top: 170,
          width: 1080 - RESERVE.rightX,
          height: 1500 - 170,
          background: "rgba(255,82,70,0.12)",
          border: "1px solid rgba(255,82,70,0.6)",
        }}
      />
    </div>
  );
};

const Reserve: React.FC<{ top: number; height: number; label: string }> = ({
  top,
  height,
  label,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top,
      width: 1080,
      height,
      background: "rgba(255,82,70,0.12)",
      borderTop: "1px solid rgba(255,82,70,0.6)",
      borderBottom: "1px solid rgba(255,82,70,0.6)",
      color: "rgba(255,82,70,0.9)",
      fontFamily: "monospace",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {label}
  </div>
);
