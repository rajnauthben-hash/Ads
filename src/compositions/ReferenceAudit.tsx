import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { H, W } from "../config/design";
import { LOCK_FRAME, SCENE_LEN } from "../config/timing";
import { InvisibleStorefront30 } from "./InvisibleStorefront30";

export type AuditMode = "wipe" | "overlay" | "diff";

/**
 * Development audit: overlays each scene's supplied reference on top of the
 * live implementation.
 *
 *  - "wipe": reference occupies the left of a sweeping vertical divider,
 *    implementation the right. The divider crosses 12%→88% during each
 *    scene and passes exactly 50/50 at the reference-lock frame.
 *  - "overlay": reference at 50% opacity over the implementation.
 *  - "diff": reference in difference blend — perfect alignment reads black.
 */
export const ReferenceAudit: React.FC<{ mode?: AuditMode }> = ({ mode = "wipe" }) => {
  const frame = useCurrentFrame();
  const sceneIndex = Math.min(Math.floor(frame / SCENE_LEN), 9);
  const local = frame - sceneIndex * SCENE_LEN;
  const ref = staticFile(`references/scene-${String(sceneIndex + 1).padStart(2, "0")}.png`);

  const wipeX =
    interpolate(local, [0, LOCK_FRAME, SCENE_LEN - 1], [0.12, 0.5, 0.88], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * W;

  const label = (text: string, x: number) => (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: x,
        fontFamily: "monospace",
        fontSize: 26,
        letterSpacing: "0.1em",
        color: "#00D2FF",
        background: "rgba(0,0,0,0.65)",
        padding: "6px 14px",
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <InvisibleStorefront30 />
      {mode === "wipe" && (
        <>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${W - wipeX}px 0 0)` }}>
            <Img src={ref} style={{ position: "absolute", inset: 0, width: W, height: H }} />
          </div>
          <div
            style={{
              position: "absolute",
              left: wipeX - 1.5,
              top: 0,
              bottom: 0,
              width: 3,
              background: "#00D2FF",
              boxShadow: "0 0 14px rgba(0,210,255,0.8)",
            }}
          />
          {label("REFERENCE", 24)}
          {label("RENDER", W - 190)}
        </>
      )}
      {mode === "overlay" && (
        <Img
          src={ref}
          style={{ position: "absolute", inset: 0, width: W, height: H, opacity: 0.5 }}
        />
      )}
      {mode === "diff" && (
        <Img
          src={ref}
          style={{ position: "absolute", inset: 0, width: W, height: H, mixBlendMode: "difference" }}
        />
      )}
    </AbsoluteFill>
  );
};
