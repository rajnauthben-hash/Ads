import React from "react";
import { FONT_UI } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

/**
 * A visibility-factor card (Scene 5). Numbered cyan badge, a two-tone title
 * (white top line, cyan bottom line) and factor-specific content passed as
 * children. Reveal drives opacity/translateY/blur/mask.
 */
export const FactorCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  n: number;
  titleTop: string;
  titleBottom: string;
  reveal: number;
  children?: React.ReactNode;
  zIndex?: number;
}> = ({ x, y, width, height, n, titleTop, titleBottom, reveal, children, zIndex = 55 }) => {
  const r = Math.max(0, Math.min(1, reveal));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
        opacity: r,
        transform: `translateY(${(1 - r) * 12}px)`,
        filter: r < 0.99 ? `blur(${(1 - r) * 5}px)` : "none",
        clipPath: `inset(0 0 ${(1 - r) * 100}% 0)`,
      }}
    >
      <div
        style={{
          width,
          minHeight: height,
          borderRadius: 16,
          background: "rgba(11,16,22,0.85)",
          border: "1.5px solid rgba(18,211,238,0.5)",
          boxShadow: "0 0 12px rgba(18,211,238,0.14)",
          boxSizing: "border-box",
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              border: `1.6px solid ${COLORS.cyan}`,
              color: COLORS.cyan,
              fontFamily: FONT_UI,
              fontSize: 18,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {n}
          </div>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 21, color: COLORS.white, letterSpacing: 1 }}>
              {titleTop}
            </div>
            <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 21, color: COLORS.cyan, letterSpacing: 1 }}>
              {titleBottom}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

/** A small labelled row inside a factor card. */
export const FactorRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      marginTop: 6,
      borderRadius: 8,
      background: "rgba(18,211,238,0.06)",
      border: "1px solid rgba(18,211,238,0.14)",
      fontFamily: FONT_UI,
      fontSize: 18,
      color: COLORS.white,
    }}
  >
    {children}
  </div>
);
