import { interpolate } from "remotion";
import { SCENE_FADE } from "../config/timing";

/** Cross-fade opacity for a scene's foreground content: fades in at the cut
 * (unless it's the first scene) and fades out before the cut (unless it's the last). */
export const sceneFadeOpacity = (
  frame: number,
  durationInFrames: number,
  sceneId: number,
  totalScenes: number,
): number => {
  const fadeIn =
    sceneId === 1
      ? 1
      : interpolate(frame, [0, SCENE_FADE], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const fadeOut =
    sceneId === totalScenes
      ? 1
      : interpolate(frame, [durationInFrames - SCENE_FADE, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return Math.min(fadeIn, fadeOut);
};
