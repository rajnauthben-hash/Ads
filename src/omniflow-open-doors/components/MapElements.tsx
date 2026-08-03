import React from "react";
import { COLORS, FONTS } from "../constants";

/**
 * SpeechBubble — the "Weak digital presence" bubble in Scene 3. This same
 * primitive expands into the Crown information card in Scene 4, so it accepts
 * an animatable rect + opacity.
 */
export const SpeechBubble: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  opacity?: number;
  fontSize?: number;
  tail?: boolean;
}> = ({ x, y, width, height, text, opacity = 1, fontSize = 22, tail = true }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      opacity,
      background: "rgba(18,23,30,0.96)",
      border: `1px solid ${COLORS.cardBorder}`,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "0 14px",
      color: COLORS.mutedText,
      fontFamily: FONTS.interface,
      fontWeight: 500,
      fontSize,
      lineHeight: 1.15,
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      whiteSpace: "pre-line",
    }}
  >
    {text}
    {tail && (
      <div
        style={{
          position: "absolute",
          bottom: -9,
          left: 34,
          width: 18,
          height: 18,
          background: "rgba(18,23,30,0.96)",
          borderRight: `1px solid ${COLORS.cardBorder}`,
          borderBottom: `1px solid ${COLORS.cardBorder}`,
          transform: "rotate(45deg)",
        }}
      />
    )}
  </div>
);

/** A small stylized nighttime store building used as a map destination. */
export const MapStore: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  bright?: boolean;
}> = ({ x, y, width, height, opacity = 1, bright = true }) => {
  const bodyH = height * 0.62;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + height - bodyH,
        width,
        height: bodyH,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,#0f0c07 0%,#080705 100%)",
          border: "1px solid rgba(214,163,74,0.22)",
          borderRadius: 4,
          boxShadow: bright
            ? "0 0 46px rgba(214,163,74,0.22), 0 18px 44px rgba(0,0,0,0.7)"
            : "0 18px 44px rgba(0,0,0,0.7)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gridTemplateRows: "repeat(3,1fr)",
          gap: 7,
          padding: 12,
        }}
      >
        {Array.from({ length: 21 }).map((_, i) => {
          // Deterministic warm-window pattern; most windows dim, a few lit.
          const seed = (i * 73 + 11) % 10;
          const on = bright ? seed > 3 : seed > 7;
          return (
            <div
              key={i}
              style={{
                background: on ? COLORS.warmGold : "#1c150b",
                opacity: on ? (bright ? 0.72 : 0.4) : 0.5,
                borderRadius: 1,
                boxShadow: on && bright ? `0 0 4px rgba(214,163,74,0.5)` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Map destination label chip (gold-outlined, two-line business name). */
export const DestinationLabel: React.FC<{
  x: number;
  y: number;
  line1: string;
  line2?: string;
  opacity?: number;
}> = ({ x, y, line1, line2, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      padding: "10px 16px",
      border: `1px solid ${COLORS.warmGold}`,
      borderRadius: 8,
      background: "rgba(10,8,4,0.72)",
      textAlign: "center",
      fontFamily: FONTS.headline,
      color: COLORS.warmGold,
      boxShadow: "0 0 22px rgba(214,163,74,0.18)",
    }}
  >
    <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.02em" }}>{line1}</div>
    {line2 && (
      <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.28em", opacity: 0.9 }}>
        {line2}
      </div>
    )}
  </div>
);

/** Gold destination map pin (teardrop) planted on a store. */
export const MapPin: React.FC<{ x: number; y: number; opacity?: number; dim?: boolean }> = ({
  x,
  y,
  opacity = 1,
  dim = false,
}) => {
  const c = dim ? COLORS.inactiveRouteGray : COLORS.warmGold;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-100%)", opacity }}>
      <svg width={40} height={52} viewBox="0 0 40 52">
        <path
          d="M20 1C10 1 2 9 2 19c0 13 18 32 18 32s18-19 18-32C38 9 30 1 20 1z"
          fill={c}
          stroke="#1a1206"
          strokeWidth={1.5}
          style={{ filter: dim ? "none" : "drop-shadow(0 0 10px rgba(214,163,74,0.6))" }}
        />
        <circle cx={20} cy={18} r={6.5} fill="#1a1206" />
      </svg>
    </div>
  );
};

/** Small pill label used for the Customer node in Scene 3. */
export const NodeLabel: React.FC<{
  x: number;
  y: number;
  text: string;
  opacity?: number;
}> = ({ x, y, text, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity,
      padding: "6px 14px",
      borderRadius: 8,
      background: "rgba(18,23,30,0.96)",
      border: `1px solid ${COLORS.cardBorder}`,
      color: COLORS.white,
      fontFamily: FONTS.interface,
      fontWeight: 500,
      fontSize: 22,
    }}
  >
    {text}
  </div>
);
