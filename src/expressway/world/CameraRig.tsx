import React from "react";
import { useCurrentFrame } from "remotion";
import { kf } from "../../road/helpers";
import { E } from "../constants";

// One shared, restrained camera. Scene reframing is carried mostly by staged
// object transforms; the camera adds a slow continuous push and drift so the
// world never resets.
const PX = 560;
const PY = 1040;
const F = [0, 120, 240, 360, 480, 600];

export const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const scale = kf(frame, F, [1.03, 1.06, 1.09, 1.04, 1.07, 1.1], E.inOut);
  const dx = kf(frame, F, [0, -8, -4, 6, 0, 10], E.inOut);
  const dy = kf(frame, F, [0, -6, -14, -6, -4, -2], E.inOut);
  const t = `translate(${PX} ${PY}) scale(${scale}) translate(${-PX} ${-PY}) translate(${dx} ${dy})`;
  return <g transform={t}>{children}</g>;
};
