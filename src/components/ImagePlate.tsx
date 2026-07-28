import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

/**
 * Renders an approved source render full-frame (9:16, scales to fill exactly),
 * with a subtle frame-driven push so the plate feels alive rather than static.
 * The image IS the environment — live overlays (text reveals, travelling route
 * pulses) are composited on top by the scene.
 */
export const ImagePlate: React.FC<{
  src: string; // e.g. "reference/scene1.png"
  scale?: number; // 1.0..~1.05 subtle zoom
  x?: number; // px drift
  y?: number;
  opacity?: number;
}> = ({ src, scale = 1, x = 0, y = 0, opacity = 1 }) => {
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          objectFit: "cover",
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
    </AbsoluteFill>
  );
};
