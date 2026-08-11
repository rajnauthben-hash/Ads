import React from "react";
import { AbsoluteFill, Img, staticFile, getInputProps } from "remotion";

// DEV-ONLY alignment overlay (inert unless an `overlay` input prop is passed).
//   --props='{"overlay":{"scene":1,"opacity":0.5,"mode":"difference"}}'
const REFS: Record<number, string> = {
  1: "concept1_refs/s1.png",
  2: "concept1_refs/s2.png",
  3: "concept1_refs/s3.png",
  4: "concept1_refs/s4.png",
  5: "concept1_refs/s5.png",
  6: "concept1_refs/s6.png",
};

export const ReferenceOverlay: React.FC = () => {
  const props = getInputProps() as { overlay?: { scene?: number; opacity?: number; mode?: "normal" | "difference" } };
  const ov = props.overlay;
  if (!ov || !ov.scene || !REFS[ov.scene]) return null;
  return (
    <AbsoluteFill style={{ zIndex: 9999, pointerEvents: "none" }}>
      <Img src={staticFile(REFS[ov.scene])} style={{ width: 1080, height: 1920, opacity: ov.opacity ?? 0.5, mixBlendMode: ov.mode === "difference" ? "difference" : "normal" }} />
    </AbsoluteFill>
  );
};
