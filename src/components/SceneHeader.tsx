import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS, HEADER } from "../config/design";
import { FONT_MONO } from "../config/fonts";

export const SceneHeader: React.FC<{ frame: number; sceneNumber: number }> = ({
  frame,
  sceneNumber,
}) => {
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const translateY = interpolate(frame, [0, 12], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const label = String(sceneNumber).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        left: HEADER.x,
        top: HEADER.y,
        opacity,
        translate: `0px ${translateY}px`,
        fontFamily: FONT_MONO,
        fontSize: HEADER.fontSize,
        fontWeight: HEADER.fontWeight,
        letterSpacing: HEADER.letterSpacing,
        textTransform: "uppercase",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "rgba(244,246,247,0.72)" }}>THE INVISIBLE STOREFRONT</span>
      <span style={{ color: COLORS.cyan }}> / {label}</span>
    </div>
  );
};
