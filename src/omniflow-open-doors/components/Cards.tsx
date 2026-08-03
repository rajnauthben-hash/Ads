import React from "react";
import { COLORS, FONTS } from "../constants";
import { StorefrontPlate } from "./StorefrontPlate";
import {
  IconCamera,
  IconChat,
  IconClock,
  IconGlobe,
  IconPhone,
  IconPin,
  IconShield,
  StarRow,
} from "./icons";

/**
 * BusinessProfileCard — the Scene 2 comparison card. "weak" is the muted
 * Your Business card, "strong" is the gold-bordered competitor. `borderDraw`
 * (0..1) traces the competitor's gold border.
 */
export const BusinessProfileCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  variant: "weak" | "strong";
  topLabel: string;
  businessName: string;
  addressLines: string[];
  status: string;
  rating: string;
  reviewCount: string;
  details: string[];
  opacity?: number;
  scale?: number;
  borderDraw?: number;
}> = ({
  x,
  y,
  width,
  height,
  variant,
  topLabel,
  businessName,
  addressLines,
  status,
  rating,
  reviewCount,
  details,
  opacity = 1,
  scale = 1,
  borderDraw = 1,
}) => {
  const strong = variant === "strong";
  const detailColor = strong ? COLORS.mutedText : COLORS.dimText;
  const iconC = strong ? COLORS.warmGold : COLORS.dimText;
  const detailIcons = [IconClock, IconCamera, IconGlobe, IconChat];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        background: COLORS.cardFill,
        borderRadius: 16,
        border: `1px solid ${strong ? "transparent" : COLORS.cardBorder}`,
        boxShadow: strong
          ? "0 24px 60px rgba(0,0,0,0.55)"
          : "0 18px 46px rgba(0,0,0,0.5)",
        overflow: "hidden",
        padding: 18,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Traced gold border for the competitor card. */}
      {strong && (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <rect
            x={1}
            y={1}
            width={width - 2}
            height={height - 2}
            rx={15}
            fill="none"
            stroke={COLORS.warmGold}
            strokeWidth={2}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - borderDraw}
            style={{ filter: "drop-shadow(0 0 6px rgba(214,163,74,0.5))" }}
          />
        </svg>
      )}

      {/* Top label pill. */}
      <div
        style={{
          alignSelf: "center",
          padding: "7px 16px",
          borderRadius: 8,
          background: strong ? COLORS.warmGold : "rgba(255,255,255,0.08)",
          color: strong ? "#1a1206" : COLORS.mutedText,
          fontFamily: FONTS.interface,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.08em",
          marginBottom: 14,
        }}
      >
        {topLabel}
      </div>

      {/* Thumbnail (storefront plate). */}
      <div style={{ position: "relative", height: 150, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        <StorefrontPlate
          x={0}
          y={0}
          width={width - 36}
          height={150}
          radius={10}
          dim={!strong}
          lightLevel={strong ? 1 : 0.7}
        />
      </div>

      <div
        style={{
          fontFamily: FONTS.interface,
          fontWeight: 700,
          fontSize: 27,
          color: COLORS.white,
          marginBottom: 4,
        }}
      >
        {businessName}
      </div>
      <div style={{ fontFamily: FONTS.support, fontSize: 20, color: COLORS.dimText, lineHeight: 1.3 }}>
        {addressLines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>

      {/* Status pill. */}
      <div
        style={{
          marginTop: 12,
          alignSelf: "flex-start",
          padding: "8px 14px",
          borderRadius: 8,
          border: `1px solid ${strong ? "rgba(214,163,74,0.6)" : "rgba(255,255,255,0.14)"}`,
          color: strong ? COLORS.warmGold : COLORS.dimText,
          fontFamily: FONTS.interface,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        {status}
      </div>

      {/* Rating. */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontFamily: FONTS.interface, fontWeight: 700, fontSize: 22, color: strong ? COLORS.warmGold : COLORS.dimText }}>
          {rating}
        </span>
        <StarRow rating={parseFloat(rating)} color={strong ? COLORS.warmGold : COLORS.dimText} size={18} />
        <span style={{ fontFamily: FONTS.support, fontSize: 18, color: COLORS.dimText }}>{reviewCount}</span>
      </div>

      {/* Detail rows. */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {details.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {detailIcons[i % detailIcons.length](19, iconC)}
            <span style={{ fontFamily: FONTS.support, fontSize: 19, color: detailColor }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BusinessInfoCard — the Scene 4 "Active" Crown Hardware card that the Weak
 * digital presence bubble expands into.
 */
export const BusinessInfoCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  contentReveal?: number;
  businessName: string;
  status: string;
  addressLines: string[];
  hoursLines: string[];
  phone: string;
  website: string;
  rating: string;
  reviewCount: string;
  proof: string;
}> = ({
  x,
  y,
  width,
  height,
  opacity = 1,
  contentReveal = 1,
  businessName,
  status,
  addressLines,
  hoursLines,
  phone,
  website,
  rating,
  reviewCount,
  proof,
}) => {
  const row = (icon: React.ReactNode, content: React.ReactNode, i: number) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        opacity: Math.max(0, Math.min(1, contentReveal * 6 - i)),
      }}
    >
      <div style={{ marginTop: 2 }}>{icon}</div>
      <div style={{ fontFamily: FONTS.support, fontSize: 21, color: COLORS.mutedText, lineHeight: 1.3 }}>
        {content}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        background: "rgba(10,12,16,0.97)",
        borderRadius: 16,
        border: `1px solid ${COLORS.warmGold}`,
        boxShadow: "0 24px 70px rgba(0,0,0,0.6), 0 0 40px rgba(214,163,74,0.12)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header: name + Active. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: FONTS.headline,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.01em",
            color: COLORS.warmGold,
          }}
        >
          {businessName}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.successGreen, boxShadow: `0 0 10px ${COLORS.successGreen}` }} />
          <span style={{ fontFamily: FONTS.interface, fontSize: 20, color: COLORS.successGreen }}>{status}</span>
        </span>
      </div>

      {row(IconPin(20, COLORS.warmGold), addressLines.map((l, i) => <div key={i}>{l}</div>), 0)}
      {row(IconClock(20, COLORS.warmGold), hoursLines.map((l, i) => <div key={i}>{l}</div>), 1)}
      {row(IconPhone(20, COLORS.warmGold), phone, 2)}
      {row(IconGlobe(20, COLORS.warmGold), website, 3)}

      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "2px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: Math.max(0, Math.min(1, contentReveal * 6 - 4)) }}>
        <StarRow rating={parseFloat(rating)} color={COLORS.warmGold} size={20} />
        <span style={{ fontFamily: FONTS.interface, fontWeight: 700, fontSize: 22, color: COLORS.white }}>{rating}</span>
        <span style={{ fontFamily: FONTS.support, fontSize: 19, color: COLORS.dimText }}>{reviewCount}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: Math.max(0, Math.min(1, contentReveal * 6 - 5)) }}>
        {IconShield(20, COLORS.successGreen)}
        <span style={{ fontFamily: FONTS.support, fontSize: 20, color: COLORS.mutedText }}>{proof}</span>
      </div>
    </div>
  );
};
