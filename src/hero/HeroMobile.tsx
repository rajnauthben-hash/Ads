import { AbsoluteFill, useVideoConfig } from "remotion";
import { HeroDesktop } from "./HeroDesktop";

export { TOTAL_FRAMES } from "./HeroDesktop";

const DESKTOP_W = 1920;
const DESKTOP_H = 1080;

// Horizontal center of the key content cluster in the desktop scene.
// Structural elements span x≈915 (store left) to x≈1420 (panel right);
// centering at 1168 gives ≈90px canvas margin on each side at 1080×1920.
const CONTENT_CENTER_X = 1168;

export const HeroMobile: React.FC = () => {
  const { width, height } = useVideoConfig();

  // Scale to fill the full portrait height — the scene occupies 100% of the
  // vertical space. The desktop scene is wider than the portrait canvas, so
  // it is cropped left and right, revealing only the content-rich center zone.
  const scale = height / DESKTOP_H;

  // Center the content cluster horizontally in the portrait canvas.
  const offsetX = Math.round(width / 2 - CONTENT_CENTER_X * scale);
  // offsetY is always 0: scale = height/DESKTOP_H means scaledH = height exactly.

  return (
    <AbsoluteFill style={{ background: "#020B14", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: 0,
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
