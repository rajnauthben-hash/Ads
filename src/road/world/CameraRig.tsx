import React from "react";
import { useCurrentFrame } from "remotion";
import { kf } from "../helpers";
import { E } from "../constants";

// ---------------------------------------------------------------------------
// CameraRig — one shared, restrained camera across the whole ad. Slow push
// with subtle lateral drift; never resets between scenes. Applied as an SVG
// transform about a pivot near the storefront/road area.
// ---------------------------------------------------------------------------

const PIVOT_X = 640;
const PIVOT_Y = 1120;

const F = [0, 120, 240, 360, 480, 600];

export const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();

  const scale = kf(frame, F, [1.02, 1.05, 1.09, 1.11, 1.08, 1.11], E.inOutSoft);
  const dx = kf(frame, F, [0, -6, -14, -6, 2, 16], E.inOutSoft);
  const dy = kf(frame, F, [0, -10, -22, -8, -4, -2], E.inOutSoft);

  const t = `translate(${PIVOT_X} ${PIVOT_Y}) scale(${scale}) translate(${-PIVOT_X} ${-PIVOT_Y}) translate(${dx} ${dy})`;

  return <g transform={t}>{children}</g>;
};
