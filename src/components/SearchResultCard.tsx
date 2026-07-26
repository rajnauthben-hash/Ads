import React from "react";
import { FONT_UI } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

/**
 * A search-result card in the customer's shortlist. Refined vector UI with a
 * category icon, business name, rating with stars, distance and open status.
 * `reveal` (0..1) drives the expand-in (height/opacity/translateY/blur).
 */
export const SearchResultCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  name: string[]; // up to 2 lines
  rating: string;
  distance: string;
  reveal: number;
  zIndex?: number;
}> = ({ x, y, width, height, name, rating, distance, reveal, zIndex = 55 }) => {
  const r = Math.max(0, Math.min(1, reveal));
  const stars = ratingStars(parseFloat(rating));
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
          height,
          borderRadius: 16,
          background: "rgba(17,24,32,0.9)",
          border: "1.5px solid rgba(18,211,238,0.55)",
          boxShadow: "0 0 12px rgba(18,211,238,0.18)",
          boxSizing: "border-box",
          padding: "16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: "rgba(18,211,238,0.14)",
              border: `1.5px solid ${COLORS.cyan}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ToothIcon />
          </div>
          <div style={{ fontFamily: FONT_UI, fontSize: 22, fontWeight: 500, color: COLORS.white, lineHeight: 1.15 }}>
            {name.map((n, i) => (
              <div key={i}>{n}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 22, color: COLORS.white }}>{rating}</span>
          <span style={{ fontSize: 18, letterSpacing: 1 }}>{stars}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 20, color: COLORS.grey }}>{distance}</span>
          <span style={{ color: COLORS.grey }}>·</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 20, color: COLORS.green }}>Open</span>
        </div>
      </div>
    </div>
  );
};

function ratingStars(rating: number): React.ReactNode {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3 && rating - full < 0.8;
  const items = [];
  for (let i = 0; i < 5; i++) {
    let color: string = COLORS.grey;
    if (i < full) color = COLORS.gold;
    else if (i === full && half) color = COLORS.gold;
    items.push(
      <span key={i} style={{ color, opacity: i === full && half ? 0.6 : 1 }}>
        ★
      </span>,
    );
  }
  return <span>{items}</span>;
}

const ToothIcon: React.FC = () => (
  <svg width={22} height={22} viewBox="0 0 24 24">
    <path
      d="M7 3c-2 0-3.5 1.6-3.5 3.8 0 1.6.6 2.6.9 4 .3 1.4.2 3 .6 4.7.3 1.3.7 3.5 1.6 3.5.9 0 1-1.8 1.3-3.1.2-1 .5-1.8 1.1-1.8s.9.8 1.1 1.8c.3 1.3.4 3.1 1.3 3.1.9 0 1.3-2.2 1.6-3.5.4-1.7.3-3.3.6-4.7.3-1.4.9-2.4.9-4C16.5 4.6 15 3 13 3c-1.2 0-1.8.6-3 .6S8.2 3 7 3z"
      fill={COLORS.cyan}
    />
  </svg>
);
