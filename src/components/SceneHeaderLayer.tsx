import React from "react";
import { Img, staticFile, interpolate, Easing } from "remotion";
import { H, W } from "../config/design";
import { PLATE_LAYOUT } from "../config/plates.generated";
import { T } from "../config/timing";

/** The extracted "THE INVISIBLE STOREFRONT / 0X" strip, sliding in from the left. */
export const SceneHeaderLayer: React.FC<{ scene: number; frame: number }> = ({ scene, frame }) => {
  const [top, bottom] = PLATE_LAYOUT[scene].header;
  const src = staticFile(`generated/scene-${String(scene).padStart(2, "0")}/header.png`);
  const local = frame - T.headStart;
  const p = interpolate(local, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: `inset(${top - 8}px 0px ${H - bottom - 8}px 0px)`,
      }}
    >
      <Img
        src={src}
        style={{
          position: "absolute",
          inset: 0,
          width: W,
          height: H,
          opacity: p,
          translate: `${(1 - p) * -18}px 0px`,
        }}
      />
    </div>
  );
};
