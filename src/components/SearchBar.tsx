import React from "react";
import { FONT_UI } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

/**
 * Google-style search bar. The outline draws left→right (outlineProgress) and
 * the query is revealed by substring (visibleChars) — no endless blinking
 * cursor. Refined vector UI, restrained cyan.
 */
export const SearchBar: React.FC<{
  x: number;
  y: number;
  width: number;
  query: string;
  visibleChars: number;
  outlineProgress: number;
  showCaret?: boolean;
  zIndex?: number;
}> = ({ x, y, width, query, visibleChars, outlineProgress, showCaret = false, zIndex = 55 }) => {
  const height = 84;
  const text = query.slice(0, Math.max(0, Math.floor(visibleChars)));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
        clipPath: `inset(0 ${(1 - outlineProgress) * 100}% 0 0)`,
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: height / 2,
          background: "rgba(13,15,18,0.92)",
          border: `2px solid ${COLORS.cyan}`,
          boxShadow: "0 0 14px rgba(18,211,238,0.28)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          boxSizing: "border-box",
        }}
      >
        {/* magnifier */}
        <svg width={30} height={30} viewBox="0 0 30 30" style={{ flexShrink: 0 }}>
          <circle cx={12} cy={12} r={9} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} />
          <line x1={19} y1={19} x2={26} y2={26} stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: FONT_UI,
            fontSize: 30,
            color: COLORS.white,
            marginLeft: 20,
            flex: 1,
            whiteSpace: "nowrap",
          }}
        >
          {text}
          {showCaret && text.length < query.length ? (
            <span style={{ color: COLORS.cyan }}>|</span>
          ) : null}
        </span>
        {/* mic */}
        <svg width={26} height={30} viewBox="0 0 26 30" style={{ flexShrink: 0 }}>
          <rect x={9} y={3} width={8} height={15} rx={4} fill={COLORS.grey} />
          <path d="M5 14 a8 8 0 0 0 16 0" fill="none" stroke={COLORS.grey} strokeWidth={2} />
          <line x1={13} y1={22} x2={13} y2={27} stroke={COLORS.grey} strokeWidth={2} />
        </svg>
      </div>
    </div>
  );
};
