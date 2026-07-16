import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { SCENES } from "./theme";

// ---------------------------------------------------------------------------
// DEVELOPMENT-ONLY reference comparison overlay.
//
// Drop the six storyboard JPEGs into public/refs/ as ref-01.jpg … ref-06.jpg,
// flip ENABLE_REFERENCE_OVERLAY to true and pick a MODE, then compare the
// live frame against the reference at ~65% of each scene's duration.
//
// This must stay disabled (false) for the final render — when disabled the
// component renders nothing and no JPEG ever reaches the output.
// ---------------------------------------------------------------------------
export const ENABLE_REFERENCE_OVERLAY = false as boolean;

type Mode = "half" | "side-by-side" | "difference";
const MODE = "half" as Mode;

export const ReferenceOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  if (!ENABLE_REFERENCE_OVERLAY) {
    return null;
  }
  const idx = SCENES.findIndex((s) => frame >= s.start && frame < s.end);
  if (idx < 0) {
    return null;
  }
  const src = staticFile(`refs/ref-0${idx + 1}.jpg`);

  if (MODE === "side-by-side") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Img
          src={src}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "38%",
            border: "2px solid #FF4D6D",
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: MODE === "difference" ? 1 : 0.5,
          mixBlendMode: MODE === "difference" ? "difference" : "normal",
        }}
      />
    </AbsoluteFill>
  );
};
