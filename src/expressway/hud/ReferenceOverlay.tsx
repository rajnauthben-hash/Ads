import React from "react";
import { AbsoluteFill, Img, staticFile, getInputProps } from "remotion";

// DEV-ONLY alignment overlay. Loads the matching 1080x1920 reference PNG so a
// still can be compared against the rebuilt composition (opacity blend or
// mixBlendMode:"difference"). It is completely inert for the final render:
// with no `overlay` input prop supplied, nothing is drawn.
//
// Enable from the CLI, e.g.:
//   npx remotion still LocalSearchExpressway out/cmp.png --frame=450 \
//     --props='{"overlay":{"scene":4,"opacity":0.5,"mode":"difference"}}'

const REFS: Record<number, string> = {
  1: "references/01_quieter_reference.png",
  2: "references/02_highway_reference.png",
  3: "references/03_passed_over_reference.png",
  4: "references/04_bypassed_incomplete_info_reference.png",
  5: "references/05_get_on_road_reference.png",
};

export const ReferenceOverlay: React.FC = () => {
  const props = getInputProps() as {
    overlay?: { scene?: number; opacity?: number; mode?: "normal" | "difference" };
  };
  const ov = props.overlay;
  if (!ov || !ov.scene || !REFS[ov.scene]) return null;
  return (
    <AbsoluteFill style={{ zIndex: 9999, pointerEvents: "none" }}>
      <Img
        src={staticFile(REFS[ov.scene])}
        style={{
          width: 1080,
          height: 1920,
          opacity: ov.opacity ?? 0.5,
          mixBlendMode: ov.mode === "difference" ? "difference" : "normal",
        }}
      />
    </AbsoluteFill>
  );
};
