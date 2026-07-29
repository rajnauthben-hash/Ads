import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { SearchIcon, MicIcon } from "./Icons";
import { SEARCH_QUERY } from "../styles/geometry";

// Phone search bar + tabs + location row (Scene 1). Query reveal is masked
// left-to-right via queryProgress.
export const SearchInterface: React.FC<{
  width: number;
  barScaleX?: number;
  barOpacity?: number;
  queryProgress?: number;
  tabsProgress?: number; // 0..1 overall; individual tabs stagger internally
}> = ({ width, barScaleX = 1, barOpacity = 1, queryProgress = 1, tabsProgress = 1 }) => {
  const tabs = ["All", "Maps", "Shopping", "Images", "News"];
  return (
    <div style={{ width }}>
      {/* search bar */}
      <div
        style={{
          height: 72,
          borderRadius: 36,
          background: COLORS.panelActive,
          border: `1px solid ${COLORS.darkBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 14,
          transform: `scaleX(${barScaleX})`,
          transformOrigin: "left center",
          opacity: barOpacity,
        }}
      >
        <SearchIcon size={26} color={COLORS.bodyGray} strokeWidth={2} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: FONTS.body,
              fontSize: 27,
              color: COLORS.headline,
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${(1 - queryProgress) * 100}% 0 0)`,
            }}
          >
            {SEARCH_QUERY}
          </span>
        </div>
        <MicIcon size={26} color={COLORS.cyan} strokeWidth={2} />
      </div>
      {/* tabs */}
      <div style={{ display: "flex", gap: 30, marginTop: 22, paddingLeft: 4 }}>
        {tabs.map((t, i) => {
          const tp = Math.max(0, Math.min(1, tabsProgress * tabs.length - i));
          const activeAll = t === "All";
          return (
            <div key={t} style={{ opacity: tp, transform: `translateX(${(1 - tp) * -10}px)` }}>
              <span
                style={{
                  fontFamily: FONTS.ui,
                  fontSize: 25,
                  color: activeAll ? COLORS.cyan : COLORS.bodyGray,
                  fontWeight: activeAll ? 600 : 400,
                }}
              >
                {t}
              </span>
              {activeAll && <div style={{ height: 2, background: COLORS.cyan, marginTop: 8, borderRadius: 2 }} />}
            </div>
          );
        })}
      </div>
      {/* location row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingLeft: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={COLORS.bodyGray} strokeWidth={2}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
          <span style={{ fontFamily: FONTS.ui, fontSize: 22, color: COLORS.bodyGray }}>Results for your area</span>
          <span style={{ color: COLORS.mutedGray, margin: "0 2px" }}>·</span>
        </div>
        <span style={{ fontFamily: FONTS.ui, fontSize: 22, color: COLORS.cyan }}>Use precise location</span>
      </div>
    </div>
  );
};
