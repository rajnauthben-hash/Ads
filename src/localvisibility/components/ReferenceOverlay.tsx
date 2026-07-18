import { AbsoluteFill, Img, staticFile } from "remotion";
import { SHOW_REFERENCE } from "../styles/tokens";

/**
 * Development-only alignment aid: the supplied keyframe at 30% opacity over
 * the full 1080x1920 canvas. Controlled by SHOW_REFERENCE in tokens.ts and
 * must stay disabled for the final render.
 */
export const ReferenceOverlay: React.FC<{ scene: 1 | 2 | 3 | 4 }> = ({ scene }) => {
  if (!SHOW_REFERENCE) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
      <Img
        src={staticFile(`refs/lv-0${scene}.png`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
      />
    </AbsoluteFill>
  );
};
