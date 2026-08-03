import React from "react";
import { Img, staticFile } from "remotion";
import { WIDTH, HEIGHT, SAFE, SCENES } from "../constants";

/**
 * ReferenceOverlay — development-only. Fades the assigned approved reference on
 * top of the current scene at ~40% so settled keyframes can be checked against
 * composition, hierarchy, palette, and route logic. Disabled by default.
 */
export const ReferenceOverlay: React.FC<{ enabled?: boolean; frame: number; opacity?: number }> = ({
  enabled = false,
  frame,
  opacity = 0.4,
}) => {
  if (!enabled) return null;
  const ref =
    frame <= SCENES.scene_01.end
      ? "references/scene-01-opened-on-time.jpg"
      : frame <= SCENES.scene_02.end
        ? "references/scene-02-visibility-problem.jpg"
        : frame <= SCENES.scene_03.end
          ? "references/scene-03-demand-diverted.jpg"
          : "references/scene-04-omniflow-solution.jpg";
  return (
    <Img
      src={staticFile(ref)}
      style={{ position: "absolute", inset: 0, width: WIDTH, height: HEIGHT, opacity, pointerEvents: "none" }}
    />
  );
};

/**
 * SafeZoneOverlay — development-only. Draws the critical-content rectangle and
 * the platform-overlay exclusion (rightmost 100px / bottommost 180px).
 */
export const SafeZoneOverlay: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  if (!enabled) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          width: WIDTH - SAFE.left - SAFE.right,
          height: HEIGHT - SAFE.top - SAFE.bottom,
          border: "2px dashed rgba(52,201,120,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: SAFE.right,
          height: HEIGHT,
          background: "rgba(255,0,0,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: WIDTH,
          height: SAFE.bottom,
          background: "rgba(255,0,0,0.12)",
        }}
      />
    </div>
  );
};
