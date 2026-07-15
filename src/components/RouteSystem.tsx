import React from "react";
import { interpolate, Easing } from "remotion";
import { WorldMap } from "./WorldMap";
import { RoutePath } from "./RoutePath";
import { SCENES } from "../config/timing";
import { SPINE_PATHS } from "../config/routes";

const findScene = (frame: number) => SCENES.find((s) => frame >= s.start && frame <= s.end) ?? SCENES[SCENES.length - 1];

/**
 * Mounted once for the full 900 frames. Owns the background world and a
 * faint, always-present cyan "spine" — the single route that threads through
 * every scene at low weight, so the map never resets to blank between cuts.
 * Each scene layers its own brighter, scene-specific route on top of this.
 */
export const RouteSystem: React.FC<{ frame: number }> = ({ frame }) => {
  const scene = findScene(frame);
  const local = frame - scene.start;

  const drawProgress = interpolate(local, [0, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  return (
    <>
      <WorldMap frame={frame} />
      {SPINE_PATHS[scene.id] && (
        <RoutePath
          points={SPINE_PATHS[scene.id]}
          frame={frame}
          progress={drawProgress}
          opacity={0.32}
          strokeWidth={1.5}
          particleCount={0}
          arrow={false}
        />
      )}
    </>
  );
};
