import React from "react";
import { Img, staticFile, interpolate, Easing } from "remotion";
import { H, W } from "../config/design";
import { PLATE_LAYOUT } from "../config/plates.generated";

const sceneId = (scene: number) => String(scene).padStart(2, "0");

/**
 * Reveals the alpha-keyed reference typography line by line: each detected
 * text band gets a fixed clip window while the full-frame plate translates
 * up into it. The visible glyphs are the exact extracted reference pixels,
 * so there is no font substitution and no reflow.
 */
export const ReferenceTextLayer: React.FC<{
  scene: number;
  kind: "headline" | "body";
  frame: number;
  start: number;
  stagger?: number;
  /** Optional additive pulse on one line (e.g. the gold phrase igniting). */
  emphasis?: { line: number; at: number };
}> = ({ scene, kind, frame, start, stagger = 7, emphasis }) => {
  const layout = PLATE_LAYOUT[scene];
  const lines = kind === "headline" ? layout.headlineLines : layout.bodyLines;
  const src = staticFile(`generated/scene-${sceneId(scene)}/${kind}.png`);

  return (
    <>
      {lines.map(([top, bottom], i) => {
        const local = frame - (start + i * stagger);
        const p = interpolate(local, [0, 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const opacity = interpolate(local, [0, 13], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const clip = `inset(${top - 10}px 0px ${H - bottom - 10}px 0px)`;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, clipPath: clip }}>
            <Img
              src={src}
              style={{
                position: "absolute",
                inset: 0,
                width: W,
                height: H,
                opacity,
                translate: `0px ${(1 - p) * 26}px`,
              }}
            />
          </div>
        );
      })}
      {emphasis &&
        (() => {
          const [top, bottom] = lines[emphasis.line];
          const e = interpolate(frame - emphasis.at, [0, 10, 34], [0, 0.55, 0.28], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (e <= 0.01) return null;
          const clip = `inset(${top - 10}px 0px ${H - bottom - 10}px 0px)`;
          return (
            <div style={{ position: "absolute", inset: 0, clipPath: clip, mixBlendMode: "screen" }}>
              <Img
                src={src}
                style={{ position: "absolute", inset: 0, width: W, height: H, opacity: e }}
              />
            </div>
          );
        })()}
    </>
  );
};
