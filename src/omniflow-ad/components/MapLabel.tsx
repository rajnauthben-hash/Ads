import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { PinIcon } from "./Icons";

// Small business label pinned on a map (name + distance/rating).
export const MapLabel: React.FC<{
  x: number; // px within map container
  y: number;
  name: string;
  meta: string;
  color?: string;
  size?: number;
  opacity?: number;
}> = ({ x, y, name, meta, color = COLORS.mutedGray, size = 20, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "flex-start", gap: 6, opacity }}>
    <PinIcon size={size} color={color} strokeWidth={1.8} />
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: size * 0.92, color: COLORS.headline, lineHeight: 1.1 }}>{name}</div>
      <div style={{ fontFamily: FONTS.ui, fontSize: size * 0.76, color: COLORS.bodyGray, lineHeight: 1.15 }}>{meta}</div>
    </div>
  </div>
);
