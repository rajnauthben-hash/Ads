import { AbsoluteFill, useVideoConfig } from "remotion";
import { HeroDesktop } from "./HeroDesktop";

export { TOTAL_FRAMES } from "./HeroDesktop";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;

// Visible content band in the desktop scene (display coords at 1920×1080):
//   VISIBLE_LEFT  — left edge of the map-plane grid
//   VISIBLE_RIGHT — right wall of the store building
// Everything between these two x-values must fit inside the portrait canvas.
const VISIBLE_LEFT  = 600;
const VISIBLE_RIGHT = 1900;
const VISIBLE_SPAN  = VISIBLE_RIGHT - VISIBLE_LEFT; // 1300 px

export const HeroMobile: React.FC = () => {
  const { width, height } = useVideoConfig();

  const SIDE_MARGIN   = 20; // px clear on each side
  const BOTTOM_MARGIN = 24; // scene sits this far above the portrait bottom

  // Scale so the content band fits within (width - 2*SIDE_MARGIN).
  const scale = (width - 2 * SIDE_MARGIN) / VISIBLE_SPAN;

  // Center the content band horizontally in the portrait canvas.
  const contentCenterX = (VISIBLE_LEFT + VISIBLE_RIGHT) / 2;
  const offsetX = Math.round(width / 2 - contentCenterX * scale);

  // Bottom-anchor the scene; the dark space above is for hero headline text.
  const scaledH = Math.round(DESKTOP_H * scale);
  const offsetY = height - scaledH - BOTTOM_MARGIN;

  return (
    <AbsoluteFill style={{ background: "#020B14", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: DESKTOP_W,
          height: DESKTOP_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <HeroDesktop />
      </div>
    </AbsoluteFill>
  );
};
