import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type CameraProps = {
  // Continuous camera life for the whole scene, plus object-based
  // enter/exit ramps that overlap the neighboring scenes. All values are
  // restrained by design: <=4% scale, <=20px drift, <=1.5deg rotation.
  duration: number;
  scaleFrom?: number;
  scaleTo?: number;
  driftX?: number;
  driftY?: number;
  rotate?: number;
  // Frames of incoming/outgoing overlap handled by this scene.
  enterFrames?: number;
  exitFrames?: number;
  // How the scene content enters/leaves — a subtle push along the axis the
  // transition object travels, never a full-screen crossfade.
  enterFrom?: { x: number; y: number; scale?: number };
  exitTo?: { x: number; y: number; scale?: number };
  children: React.ReactNode;
};

export const SceneTransition: React.FC<CameraProps> = ({
  duration,
  scaleFrom = 1,
  scaleTo = 1.03,
  driftX = 10,
  driftY = -12,
  rotate = 0.7,
  enterFrames = 0,
  exitFrames = 0,
  enterFrom = { x: 0, y: 60, scale: 0.985 },
  exitTo = { x: 0, y: -70, scale: 1.02 },
  children,
}) => {
  const frame = useCurrentFrame();
  const life = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous camera drive.
  const scale = scaleFrom + (scaleTo - scaleFrom) * life;
  const dx = driftX * life;
  const dy = driftY * life;
  const rot = rotate * (life - 0.5);

  // Object-based enter: content assembles slightly displaced, pulled by the
  // incoming transition object.
  const enterT =
    enterFrames > 0
      ? interpolate(frame, [0, enterFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 0.8, 0.3, 1),
        })
      : 1;
  const exitT =
    exitFrames > 0
      ? interpolate(frame, [duration - exitFrames, duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.6, 0, 0.9, 0.5),
        })
      : 0;

  const ex = enterFrom.x * (1 - enterT) + (exitTo.x ?? 0) * exitT;
  const ey = enterFrom.y * (1 - enterT) + (exitTo.y ?? 0) * exitT;
  const enterScale =
    (enterFrom.scale ?? 1) + (1 - (enterFrom.scale ?? 1)) * enterT;
  const exitScale = 1 + ((exitTo.scale ?? 1) - 1) * exitT;

  const opacity = Math.min(enterT * 2.4, 1) * (1 - Math.max(0, exitT - 0.55) / 0.45);

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${dx + ex}px, ${dy + ey}px, 0) scale(${
          scale * enterScale * exitScale
        }) rotate(${rot}deg)`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
