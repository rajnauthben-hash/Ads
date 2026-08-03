import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS } from "../constants";

/**
 * StorefrontPlate — the Crown Hardware storefront. The brief permits the
 * approved reference to be used as a *masked environment plate* (never a
 * full-screen slide), so the photographed storefront is used as a clipped
 * texture layer while all readable typography and UI stay native elsewhere.
 *
 * Only the text-free right ~55% of the reference (the lit sign + doorway +
 * interior) is ever shown — the reference's own baked headline lives in the
 * left third and is always cropped out, at any plate aspect ratio.
 *
 * This is the persistent object that scales/slides from the Scene 1 hero, into
 * the Scene 2 card thumbnails, and back into the Scene 4 hero.
 */
const REF_ASPECT = 1920 / 1080; // 1.7778 (h/w)
const REGION = 0.55; // rightmost fraction of the reference that is text-free

export const StorefrontPlate: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  /** 0..1 interior/sign lighting level (Scene 1 lamps rising). */
  lightLevel?: number;
  /** vertical framing 0 (top/sign) .. 1 (floor). */
  focusY?: number;
  opacity?: number;
  /** darker "closed / uncertain" grade for the Scene 2 weak thumbnail. */
  dim?: boolean;
}> = ({ x, y, width, height, radius = 0, lightLevel = 1, focusY = 0.42, opacity = 1, dim = false }) => {
  // Cover the container with just the right-side (text-free) storefront region.
  const dw = Math.max(width / REGION, height / REF_ASPECT);
  const imgW = dw;
  const imgH = dw * REF_ASPECT;
  const left = -(1 - REGION) * dw - (REGION * dw - width) / 2;
  const top = -(imgH - height) * focusY;

  const brightness = (dim ? 0.4 : 0.68) + 0.44 * lightLevel;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        opacity,
        boxShadow: dim ? "inset 0 0 60px rgba(0,0,0,0.7)" : "0 24px 80px rgba(0,0,0,0.55)",
      }}
    >
      <Img
        src={staticFile("references/scene-01-opened-on-time.jpg")}
        style={{
          position: "absolute",
          left,
          top,
          width: imgW,
          height: imgH,
          maxWidth: "none",
          filter: `brightness(${brightness}) saturate(${dim ? 0.75 : 1.05}) contrast(1.03)`,
        }}
      />

      {/* Soft vignette to seat the plate into the night background. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(135% 100% at 50% 42%, rgba(6,9,13,0) 55%, rgba(6,9,13,0.7) 100%)`,
          pointerEvents: "none",
        }}
      />
      {dim && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: COLORS.bgBase,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
