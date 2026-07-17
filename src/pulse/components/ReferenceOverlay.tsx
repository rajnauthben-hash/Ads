import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { SCENES } from "../theme";

/**
 * DEVELOPMENT-ONLY reference comparison overlay. Shows the storyboard
 * JPEG for the current scene at 50% opacity, side-by-side, or in
 * difference blend mode. MUST stay disabled (ENABLE_REFERENCE_OVERLAY =
 * false) for the final render — the storyboards never appear in the
 * finished film.
 */
export const ENABLE_REFERENCE_OVERLAY: boolean = false;
export const REFERENCE_MODE = "half" as "half" | "side" | "diff";

const sceneForFrame = (f: number): number => {
  if (f < SCENES.s2.from) return 1;
  if (f < SCENES.s3.from) return 2;
  if (f < SCENES.s4.from) return 3;
  if (f < SCENES.s5.from) return 4;
  if (f < SCENES.s6.from) return 5;
  return 6;
};

export const ReferenceOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  if (!ENABLE_REFERENCE_OVERLAY) return null;
  const scene = sceneForFrame(frame);
  const src = staticFile(`refs/ref-0${scene}.png`);

  if (REFERENCE_MODE === "side") {
    return (
      <div style={{ position: "absolute", right: 0, top: 0, width: 360, height: 640, outline: "2px solid #FFC700", zIndex: 999 }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 999,
        opacity: REFERENCE_MODE === "diff" ? 1 : 0.5,
        mixBlendMode: REFERENCE_MODE === "diff" ? "difference" : "normal",
        pointerEvents: "none",
      }}
    >
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};
