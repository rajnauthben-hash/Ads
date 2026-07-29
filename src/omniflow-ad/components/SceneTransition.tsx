import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { prog, linearEase } from "../styles/geometry";
import { CANVAS } from "../styles/tokens";

// Consecutive scenes overlap by OVERLAP frames and perform a full-height
// vertical PUSH: the outgoing scene slides up and off the top while the
// incoming scene slides up from below into place. Both travel together and
// always tile the screen — there is never a blank/black frame and never a
// static opacity crossfade. The exit only begins at local frame 180 (after the
// scene's own 150–179 relocation choreography and the mandatory reading hold).
export const OVERLAP = 24;
const H = CANVAS.height;

export const SceneTransition: React.FC<{
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}> = ({ isFirst = false, isLast = false, children }) => {
  const frame = useCurrentFrame();

  // Entrance push-in (local 0..OVERLAP): rise from below into place.
  const inP = isFirst ? 1 : prog(frame, 0, OVERLAP, linearEase);
  const inY = (1 - inP) * H;

  // Exit push-out (local 180..180+OVERLAP): rise up and off the top.
  const outP = isLast ? 0 : prog(frame, 180, 180 + OVERLAP, linearEase);
  const outY = -outP * H;

  const translateY = isFirst ? outY : isLast ? inY : inY + outY;

  return (
    <AbsoluteFill style={{ transform: `translateY(${translateY}px)`, willChange: "transform" }}>
      {children}
    </AbsoluteFill>
  );
};
