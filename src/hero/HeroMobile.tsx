import { AbsoluteFill, useVideoConfig } from "remotion";
import { HeroDesktop } from "./HeroDesktop";

export { TOTAL_FRAMES } from "./HeroDesktop";

// Desktop scene dimensions (fixed)
const DESKTOP_W = 1920;
const DESKTOP_H = 1080;

// Fraction of each side reserved as safe margin.
// 2.5% covers mobile browser chrome (address bar / nav bar) at the
// smallest target size (360×800) while leaving visible margin on all sides.
const SAFE_MARGIN_FRAC = 0.025;

export const HeroMobile: React.FC = () => {
  const { width, height } = useVideoConfig();

  const marginX = Math.round(width  * SAFE_MARGIN_FRAC);
  const marginY = Math.round(height * SAFE_MARGIN_FRAC);

  const availW = width  - marginX * 2;
  const availH = height - marginY * 2;

  // Scale the entire desktop scene to fit the available area, preserving
  // the original 16:9 aspect ratio. Width is always the limiting axis when
  // fitting landscape (16:9) into portrait (9:16+), but we use Math.min to
  // be safe across all viewport ratios.
  const scale = Math.min(availW / DESKTOP_W, availH / DESKTOP_H);

  const scaledW = Math.round(DESKTOP_W * scale);
  const scaledH = Math.round(DESKTOP_H * scale);

  // Center the scaled scene in the mobile canvas
  const offsetX = Math.round((width  - scaledW) / 2);
  const offsetY = Math.round((height - scaledH) / 2);

  return (
    <AbsoluteFill style={{ background: "#020B14" }}>
      {/*
        Outer wrapper: clips any sub-pixel overflow from the scale transform
        and defines the visible region of the scene.
      */}
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: scaledW,
          height: scaledH,
          overflow: "hidden",
        }}
      >
        {/*
          Inner wrapper: 1920×1080 in layout space so HeroDesktop's
          AbsoluteFill fills the correct canvas. CSS transform scales the
          entire painted layer down to scaledW×scaledH visually — no
          individual element positions change, all animation timing is
          preserved via the shared Remotion frame context.
        */}
        <div
          style={{
            position: "absolute",
            width: DESKTOP_W,
            height: DESKTOP_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <HeroDesktop />
        </div>
      </div>
    </AbsoluteFill>
  );
};
