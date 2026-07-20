import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";

export type ResultData = {
  rank: number;
  name: string;
  rating: string;
  reviews: string;
  distance: string;
  status: string; // "Open"
  hours: string; // "Closes 8 PM"
  extra?: string; // "In stock  •  Curbside pickup"
  note?: string; // "Limited visibility in local results"
  highlight?: boolean; // gold — Brightview
  dim?: boolean; // Your Business
};

const Stars: React.FC<{ rating: number; color: string }> = ({ rating, color }) => (
  <span style={{ display: "inline-flex", gap: 2, verticalAlign: "middle" }}>
    {Array.from({ length: 5 }, (_, i) => {
      const fill = i + 1 <= Math.round(rating);
      return (
        <svg key={i} width="17" height="17" viewBox="0 0 17 17">
          <path d="M8.5 1.3 L10.4 6 L15.4 6.3 L11.5 9.5 L12.8 14.4 L8.5 11.6 L4.2 14.4 L5.5 9.5 L1.6 6.3 L6.6 6 Z" fill={fill ? color : "none"} stroke={fill ? "none" : "rgba(167,175,185,0.4)"} strokeWidth={1.2} />
        </svg>
      );
    })}
  </span>
);

// A native search result card matching the reference: rank chip, name,
// stars, distance, meta, optional gold highlight or dim state. Reveals with
// a short mask + rise (no bounce).
export const SearchResultCard: React.FC<{ data: ResultData; appear: number; width: number }> = ({ data, appear, width }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  if (t <= 0) {
    return <div style={{ height: data.extra || data.note ? 150 : 118, marginBottom: 14 }} />;
  }
  const gold = data.highlight;
  const nameColor = gold ? COLORS.gold : data.dim ? COLORS.gray : COLORS.white;
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        padding: "18px 20px",
        marginBottom: 14,
        background: gold ? "rgba(243,188,66,0.07)" : "rgba(12,20,30,0.72)",
        border: gold ? "1.5px solid rgba(243,188,66,0.55)" : "1px solid rgba(85,188,235,0.14)",
        boxShadow: gold ? "0 0 26px rgba(243,188,66,0.16)" : "none",
        opacity: (data.dim ? 0.62 : 1) * t,
        transform: `translate3d(0, ${(1 - t) * 16}px, 0)`,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Rank chip / storefront glyph for Your Business */}
        {data.dim ? (
          <svg width="30" height="30" viewBox="0 0 30 30" style={{ marginTop: 2 }}>
            <path d="M4 12 L6 7 L24 7 L26 12 Z" fill="none" stroke={COLORS.gray} strokeWidth={1.6} />
            <rect x="6" y="12" width="18" height="11" fill="none" stroke={COLORS.gray} strokeWidth={1.6} />
          </svg>
        ) : (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: gold ? COLORS.gold : "rgba(98,108,119,0.3)",
              color: gold ? "#1A1206" : COLORS.white,
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {data.rank}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: nameColor }}>{data.name}</span>
            <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 22, color: gold ? COLORS.gold : COLORS.gray }}>{data.distance}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
            <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 21, color: gold ? COLORS.gold : COLORS.gray }}>{data.rating}</span>
            <Stars rating={parseFloat(data.rating)} color={gold ? COLORS.gold : COLORS.gray} />
            <span style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 20, color: COLORS.grayMuted }}>({data.reviews})</span>
          </div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 20, color: COLORS.gray, marginTop: 7 }}>
            {data.distance} • <span style={{ color: COLORS.green }}>{data.status}</span> • {data.hours}
          </div>
          {data.extra && (
            <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 20, color: gold ? COLORS.gold : COLORS.gray, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.4" fill="none" stroke={gold ? COLORS.gold : COLORS.gray} strokeWidth="1.4" /><path d="M5 8 L7 10 L11 5.5" fill="none" stroke={gold ? COLORS.gold : COLORS.gray} strokeWidth="1.4" /></svg>
              {data.extra}
            </div>
          )}
          {data.note && <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 19, color: COLORS.grayMuted, marginTop: 6 }}>{data.note}</div>}
        </div>
        {/* Right pin */}
        {!data.dim && (
          <svg width="26" height="26" viewBox="0 0 26 26" style={{ marginTop: 2 }}>
            <path d="M13 24 C 7 16 5 13 5 9 A 8 8 0 1 1 21 9 C 21 13 19 16 13 24 Z" fill={gold ? COLORS.gold : "none"} stroke={gold ? "none" : COLORS.grayMuted} strokeWidth={1.5} />
            {gold && <circle cx="13" cy="9" r="3" fill={COLORS.bg} />}
          </svg>
        )}
      </div>
    </div>
  );
};
