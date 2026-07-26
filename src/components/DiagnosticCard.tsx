import React from "react";
import { FONT_UI } from "../styles/fonts";
import { COLORS } from "../styles/tokens";

export type DiagStatus = "INCOMPLETE" | "WEAK" | "MISSING" | "UNCLEAR";

/**
 * A digital-profile diagnostic row (Scene 3). Icon + title/subtitle on the
 * left, a restrained warning marker + status word on the right. MISSING is red;
 * the rest are warm gold — never a full-screen red flash.
 */
export const DiagnosticCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  icon: "hours" | "reviews" | "services" | "website" | "profile" | "category" | "photos";
  title: string;
  subtitle?: string;
  status: DiagStatus;
  reveal: number;
  zIndex?: number;
}> = ({ x, y, width, height, icon, title, subtitle, status, reveal, zIndex = 55 }) => {
  const r = Math.max(0, Math.min(1, reveal));
  const statusColor = status === "MISSING" ? COLORS.red : COLORS.gold;
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
          position: "relative",
          width,
          height,
          borderRadius: 14,
          background: "rgba(13,17,23,0.82)",
          border: "1.5px solid rgba(18,211,238,0.45)",
          boxSizing: "border-box",
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ flexShrink: 0, width: 30, display: "flex", justifyContent: "center" }}>
          <DiagIcon type={icon} />
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 74 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 17, color: COLORS.white, letterSpacing: 0.4, lineHeight: 1.1 }}>
            {title}
          </div>
          {icon === "reviews" ? (
            <div style={{ fontSize: 14, color: COLORS.cyan, marginTop: 2 }}>
              ★★<span style={{ color: COLORS.grey }}>★★★</span>{" "}
              <span style={{ fontFamily: FONT_UI, fontSize: 14, color: COLORS.grey }}>{subtitle}</span>
            </div>
          ) : subtitle ? (
            <div style={{ fontFamily: FONT_UI, fontSize: 14, color: COLORS.grey, marginTop: 2, whiteSpace: "nowrap" }}>
              {subtitle}
            </div>
          ) : null}
          {icon === "profile" ? (
            <div style={{ marginTop: 5, width: 90, height: 5, borderRadius: 3, background: "rgba(139,148,158,0.25)" }}>
              <div style={{ width: 36, height: 5, borderRadius: 3, background: COLORS.cyan }} />
            </div>
          ) : null}
        </div>
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 0,
            bottom: 0,
            width: 66,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <WarnMark color={statusColor} missing={status === "MISSING"} />
          <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 11, letterSpacing: 0.8, color: statusColor }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

const WarnMark: React.FC<{ color: string; missing: boolean }> = ({ color, missing }) => (
  <svg width={24} height={24} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={10} fill="none" stroke={color} strokeWidth={1.8} />
    {missing ? (
      <g stroke={color} strokeWidth={2} strokeLinecap="round">
        <line x1={8} y1={8} x2={16} y2={16} />
        <line x1={16} y1={8} x2={8} y2={16} />
      </g>
    ) : (
      <g stroke={color} strokeWidth={2} strokeLinecap="round">
        <line x1={12} y1={7} x2={12} y2={13} />
        <circle cx={12} cy={16.5} r={0.6} fill={color} stroke="none" />
      </g>
    )}
  </svg>
);

const DiagIcon: React.FC<{ type: string }> = ({ type }) => {
  const c = COLORS.cyan;
  switch (type) {
    case "hours":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <circle cx={12} cy={12} r={9} />
          <path d="M12 7v5l3 2" strokeLinecap="round" />
        </svg>
      );
    case "reviews":
      return <svg width={26} height={26} viewBox="0 0 24 24"><path d="M12 3l2.5 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z" fill={c} /></svg>;
    case "services":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <rect x={3} y={7} width={18} height={13} rx={2} />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      );
    case "website":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <circle cx={12} cy={12} r={9} />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
      );
    case "profile":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <circle cx={12} cy={8} r={4} />
          <path d="M5 20c0-4 3.5-6 7-6s7 2 7 6" />
        </svg>
      );
    case "category":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <path d="M3 12l8-8 9 1 1 9-8 8z" strokeLinejoin="round" />
          <circle cx={15} cy={9} r={1.4} fill={c} />
        </svg>
      );
    case "photos":
      return (
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}>
          <rect x={3} y={5} width={18} height={14} rx={2} />
          <circle cx={8.5} cy={10} r={1.6} />
          <path d="M4 18l5-5 4 4 3-3 4 4" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};
