import React from "react";
import { useCurrentFrame } from "remotion";
import { storefrontStateAtFrame } from "../timeline/framePlan";
import { BusinessStorefront } from "./BusinessStorefront";

/**
 * The single YOUR BUSINESS storefront for the whole ad. Its position, scale and
 * lighting are a continuous function of frame (storefrontStateAtFrame) so it
 * persists across every scene boundary without ever jumping or resetting.
 */
export const PersistentStorefront: React.FC = () => {
  const frame = useCurrentFrame();
  const s = storefrontStateAtFrame(frame);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <BusinessStorefront origin={{ x: s.x, y: s.y }} scale={s.scale} interior={s.interior} goldTrim={s.gold} />
    </svg>
  );
};
