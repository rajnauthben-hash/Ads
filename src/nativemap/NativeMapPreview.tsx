import React from "react";
import { AbsoluteFill, useCurrentFrame, continueRender, delayRender } from "remotion";
import { initInterFonts } from "../omniflow/fonts";
import { Scene1 } from "./scenes/Scene1";

/** Scene-1 style proof for the native motion-design build (frames 0–134). */
export const NativeMapPreview: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    initInterFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070C" }}>
      <Scene1 f={f} />
    </AbsoluteFill>
  );
};
