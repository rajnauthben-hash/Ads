import React from "react";
import { CrownHardwareStorefront } from "./CrownHardwareStorefront";
import { CROWN } from "../styles/geometry";
import { COLORS, cyanGlow } from "../styles/tokens";
import { FONTS } from "../styles/typography";

// The single persistent Crown Hardware result card, relocated & re-scaled
// across all scenes. `variant` controls how many detail lines show; `state`
// controls the active-cyan vs dim-gray treatment (Scene 4 is dim).
export const CrownHardwareCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  variant?: "full" | "compact";
  state?: "active" | "dim";
  cyanIntensity?: number; // 0..1 border/glow strength for active state
  tagline?: string; // used in compact variant (e.g. "Weaker visibility")
  opacity?: number;
  scale?: number;
}> = ({
  x,
  y,
  width,
  height,
  variant = "full",
  state = "active",
  cyanIntensity = 1,
  tagline,
  opacity = 1,
  scale = 1,
}) => {
  const pad = height * 0.08;
  const thumbW = width * 0.3;
  const thumbH = height - pad * 2;
  const nameSize = Math.min(height * 0.125, 26);
  const metaSize = nameSize * 0.82;

  const active = state === "active";
  const borderColor = active
    ? `rgba(24,216,255,${0.35 + 0.4 * cyanIntensity})`
    : "rgba(255,255,255,0.09)";
  const glow = active ? cyanGlow(0.14 + 0.22 * cyanIntensity, 26) : "none";

  const textCol = active ? COLORS.headline : COLORS.bodyGray;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        opacity,
        borderRadius: 14,
        background: active ? "rgba(9,16,22,0.94)" : "rgba(8,12,16,0.9)",
        border: `1.5px solid ${borderColor}`,
        boxShadow: `0 18px 44px rgba(0,0,0,0.5)${glow !== "none" ? `, ${glow}` : ""}`,
        display: "flex",
        alignItems: "center",
        gap: pad,
        padding: pad,
        boxSizing: "border-box",
      }}
    >
      <div style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>
        <CrownHardwareStorefront width={thumbW} height={thumbH} radius={6} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: height * 0.028, minWidth: 0, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: nameSize, color: textCol, lineHeight: 1.05 }}>
          {CROWN.name}
        </div>
        <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: active ? COLORS.bodyGray : COLORS.mutedGray, lineHeight: 1.1 }}>
          {CROWN.meta}
        </div>
        {variant === "full" ? (
          <>
            <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: COLORS.gold, lineHeight: 1.15 }}>
              {CROWN.category}
            </div>
            <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: COLORS.bodyGray, lineHeight: 1.15 }}>
              {active ? (
                <>
                  <span style={{ color: COLORS.cyan }}>Open</span>
                  <span> · Closes 7PM</span>
                </>
              ) : (
                CROWN.hours
              )}
            </div>
            <div style={{ fontFamily: FONTS.ui, fontSize: metaSize * 0.94, color: COLORS.mutedGray, lineHeight: 1.15 }}>
              ⛬ {CROWN.shopping}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: FONTS.ui, fontSize: metaSize, color: active ? COLORS.cyan : COLORS.mutedGray, lineHeight: 1.15 }}>
            {tagline ?? CROWN.category}
          </div>
        )}
      </div>
    </div>
  );
};
