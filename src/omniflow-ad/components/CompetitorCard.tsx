import React from "react";
import { CrownHardwareStorefront } from "./CrownHardwareStorefront";
import { CheckCircleIcon, PinIcon } from "./Icons";
import { COLORS, cyanGlow } from "../styles/tokens";
import { FONTS } from "../styles/typography";

// Competitor result card. Scene 4 style: storefront thumbnail + name + meta +
// cyan advantage + cyan check. Scene 3 style: compact pin + name + meta + tagline.
export const CompetitorCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  meta: string;
  advantage?: string;
  variant?: "thumb" | "compact";
  active?: boolean;
  opacity?: number;
}> = ({
  x,
  y,
  width,
  height,
  name,
  meta,
  advantage,
  variant = "thumb",
  active = true,
  opacity = 1,
}) => {
  const pad = height * 0.1;
  const nameSize = Math.min(height * 0.2, variant === "thumb" ? 30 : 24);
  const metaSize = nameSize * 0.72;
  const border = active ? COLORS.cyanActiveBorder : COLORS.darkBorder;

  if (variant === "compact") {
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          opacity,
          borderRadius: 12,
          background: "rgba(9,14,19,0.92)",
          border: `1.25px solid ${border}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
          padding: pad,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: height * 0.04,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PinIcon size={nameSize * 0.8} color={COLORS.mutedGray} strokeWidth={1.8} />
          <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: nameSize, color: COLORS.headline }}>
            {name}
          </span>
        </div>
        <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: COLORS.bodyGray }}>{meta}</div>
        {advantage && (
          <div style={{ fontFamily: FONTS.ui, fontSize: metaSize * 0.96, color: COLORS.mutedGray }}>{advantage}</div>
        )}
      </div>
    );
  }

  const thumbW = width * 0.28;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        borderRadius: 14,
        background: "rgba(9,15,20,0.94)",
        border: `1.5px solid ${border}`,
        boxShadow: active
          ? `0 16px 40px rgba(0,0,0,0.5), ${cyanGlow(0.12, 22)}`
          : "0 16px 40px rgba(0,0,0,0.5)",
        padding: pad,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: pad,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <CrownHardwareStorefront width={thumbW} height={height - pad * 2} radius={6} signText={name.toUpperCase()} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: height * 0.05, minWidth: 0 }}>
        <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: nameSize, color: COLORS.headline, lineHeight: 1.05 }}>
          {name}
        </div>
        <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: COLORS.bodyGray }}>{meta}</div>
        {advantage && (
          <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: COLORS.cyan }}>{advantage}</div>
        )}
      </div>
      <div style={{ flexShrink: 0, alignSelf: "flex-start" }}>
        <CheckCircleIcon size={nameSize * 1.05} color={COLORS.cyan} strokeWidth={1.8} />
      </div>
    </div>
  );
};
