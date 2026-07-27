import React from "react";
import { staticFile } from "remotion";
import { LAYER } from "../styles/tokens";

/**
 * Development-only comparison overlay. Lays the approved reference plate over
 * the live render so layout, scale, copy and colour can be checked against the
 * target. MUST be disabled for the final render (enabled defaults to false).
 *
 * Modes:
 *   - "opacity"      : reference at `opacity` on top of the render
 *   - "sideBySide"   : reference shown at half width beside the render
 *   - "difference"   : reference blended with mix-blend-mode difference
 *
 * Reference images are expected in public/reference/<name>.
 */
export const ReferenceOverlay: React.FC<{
  enabled?: boolean;
  src?: string; // e.g. "reference/7769.png"
  mode?: "opacity" | "sideBySide" | "difference";
  opacity?: number;
}> = ({ enabled = false, src, mode = "opacity", opacity = 0.5 }) => {
  if (!enabled || !src) return null;
  const url = staticFile(src);
  if (mode === "sideBySide") {
    return (
      <img
        alt="reference"
        src={url}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 540,
          height: 1920,
          objectFit: "cover",
          objectPosition: "left top",
          zIndex: LAYER.devGuides,
          pointerEvents: "none",
        }}
      />
    );
  }
  return (
    <img
      alt="reference"
      src={url}
      style={{
        position: "absolute",
        inset: 0,
        width: 1080,
        height: 1920,
        zIndex: LAYER.devGuides,
        opacity: mode === "difference" ? 1 : opacity,
        mixBlendMode: mode === "difference" ? "difference" : "normal",
        pointerEvents: "none",
      }}
    />
  );
};
