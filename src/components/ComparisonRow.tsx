import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_MONO } from "../config/fonts";
import { Icon } from "./Icons";

export const ComparisonRow: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rating: number; // 0-5
  distance: string;
  hours: string;
  selected?: boolean;
}> = ({ frame, start, x, y, width, height, rating, distance, hours, selected = false }) => {
  const local = frame - start;
  const p = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const translateX = interpolate(p, [0, 1], [-24, 0]);
  const glow = selected
    ? interpolate(local, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const borderColor = selected ? `rgba(255,199,0,${0.35 + glow * 0.45})` : "rgba(0,210,255,0.2)";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity: p,
        translate: `${translateX}px 0px`,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        background: selected ? `rgba(255,199,0,${glow * 0.05})` : "rgba(0,210,255,0.03)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 22px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 66,
          height: 66,
          borderRadius: 8,
          border: "1.5px solid rgba(0,210,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name="photo" size={26} color="rgba(0,210,255,0.5)" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flexGrow: 1 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon
              key={i}
              name="star"
              size={19}
              filled={i < rating}
              color={i < rating ? COLORS.cyan : "rgba(174,181,188,0.3)"}
            />
          ))}
        </div>
        <div style={{ width: "70%", height: 4, background: "rgba(174,181,188,0.22)" }} />
        <div style={{ width: "44%", height: 4, background: "rgba(174,181,188,0.14)" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: FONT_MONO,
          fontSize: 17,
          color: COLORS.cyan,
          flexShrink: 0,
        }}
      >
        <Icon name="pin" size={16} color={COLORS.cyan} />
        {distance}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          fontFamily: FONT_MONO,
          fontSize: 15,
          color: COLORS.cyan,
          flexShrink: 0,
        }}
      >
        <Icon name="clock" size={16} color={COLORS.cyan} />
        {hours}
      </div>
    </div>
  );
};
