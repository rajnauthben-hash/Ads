// ============================================================================
// Text primitives — live React text with the shared entrance/exit motion.
// EditorialHeadline, SupportingCopy, TakeawayStrip.
// ============================================================================
import React from "react";
import { COLORS, FONTS } from "../tokens";

type Anim = { opacity: number; translateY: number; blur: number };

const wrap = (a: Anim, extra?: React.CSSProperties): React.CSSProperties => ({
  opacity: a.opacity,
  transform: `translateY(${a.translateY}px)`,
  filter: a.blur > 0.05 ? `blur(${a.blur}px)` : undefined,
  willChange: "opacity, transform, filter",
  ...extra,
});

// A masked line group: bottom-to-top directional reveal via clip.
export const HeadlineBlock: React.FC<{
  lines: { text: string; color?: string }[];
  x: number;
  y: number;
  width: number;
  fontSize: number;
  lineHeight?: number;
  weight?: number;
  align?: "left" | "center";
  anim: Anim;
  letterSpacing?: number;
}> = ({ lines, x, y, width, fontSize, lineHeight = 0.96, weight = 600, align = "left", anim, letterSpacing = -0.5 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      textAlign: align,
      fontFamily: FONTS.headline,
      fontWeight: weight,
      fontSize,
      lineHeight,
      letterSpacing,
      ...wrap(anim),
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={{ color: l.color ?? COLORS.editorialWhite, whiteSpace: "nowrap" }}>
        {l.text}
      </div>
    ))}
  </div>
);

export const SupportingCopy: React.FC<{
  lines: string[];
  x: number;
  y: number;
  width: number;
  fontSize: number;
  lineHeight?: number;
  color?: string;
  anim: Anim;
  align?: "left" | "center";
}> = ({ lines, x, y, width, fontSize, lineHeight = 1.35, color = COLORS.supportGrey, anim, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      fontFamily: FONTS.body,
      fontWeight: 400,
      fontSize,
      lineHeight,
      color,
      textAlign: align,
      ...wrap(anim),
    }}
  >
    {lines.map((l, i) => (
      <div key={i} style={{ whiteSpace: "nowrap", minHeight: l === "" ? fontSize * lineHeight : undefined }}>
        {l}
      </div>
    ))}
  </div>
);

// Thin cyan-divider takeaway strip with an icon at the left.
export const TakeawayStrip: React.FC<{
  x: number;
  y: number;
  width: number;
  icon: React.ReactNode;
  lines: string[];
  anim: Anim;
  fontSize?: number;
  dividerScaleX?: number;
  iconScale?: number;
}> = ({ x, y, width, icon, lines, anim, fontSize = 30, dividerScaleX = 1, iconScale = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width, ...wrap(anim) }}>
    <div style={{ height: 1, background: COLORS.cyanGlowStrong, transformOrigin: "left", transform: `scaleX(${dividerScaleX})` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 0" }}>
      <div style={{ width: 44 * iconScale, height: 44 * iconScale, flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</div>
      <div style={{ fontFamily: FONTS.body, fontSize, lineHeight: 1.25, color: COLORS.softWhite }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
    <div style={{ height: 1, background: COLORS.cyanGlow, transformOrigin: "left", transform: `scaleX(${dividerScaleX})` }} />
  </div>
);
