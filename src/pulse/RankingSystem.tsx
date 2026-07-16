import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { COLORS, FONTS } from "./theme";

type Props = {
  // Local frame at which position 01 rises from the map.
  buildFrame: number;
  // 0..1 — how strongly the ignored (04–06) positions have faded.
  attentionNarrowing: number;
  width?: number;
  style?: React.CSSProperties;
};

const Stars: React.FC<{ active: boolean; seedIdx: number }> = ({ active, seedIdx }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M8 0.8 L9.8 5.6 L15 5.8 L11 9 L12.4 14.4 L8 11.3 L3.6 14.4 L5 9 L1 5.8 L6.2 5.6 Z"
          fill={
            i < (noise(41, seedIdx) > 0.5 ? 5 : 4)
              ? active
                ? COLORS.gold
                : "rgba(167,175,183,0.4)"
              : "rgba(167,175,183,0.18)"
          }
        />
      </svg>
    ))}
  </div>
);

// Ranked positions 01–06 rising from the map. The top three activate in
// gold sequence and carry traffic; the bottom three lose brightness as the
// viewer's attention narrows.
export const RankingSystem: React.FC<Props> = ({
  buildFrame,
  attentionNarrowing,
  width = 660,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 14, ...style }}>
      {Array.from({ length: 6 }, (_, i) => {
        const isTop = i < 3;
        const rise = interpolate(
          frame,
          [buildFrame + i * 4, buildFrame + i * 4 + 12],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.85, 0.3, 1),
          },
        );
        const activate = isTop
          ? interpolate(
              frame,
              [buildFrame + 16 + i * 6, buildFrame + 26 + i * 6],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          : 0;
        const ignoreFade = isTop ? 0 : attentionNarrowing * (0.55 + i * 0.06);
        const glow = activate * (0.7 + 0.3 * Math.sin(frame * 0.13 + i));

        return (
          <div
            key={i}
            style={{
              height: 104,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 24px",
              background: isTop
                ? `rgba(18,19,20,${0.9})`
                : "rgba(18,19,20,0.72)",
              border: isTop
                ? `1.4px solid rgba(255,199,0,${0.14 + 0.5 * activate})`
                : "1px solid rgba(167,175,183,0.12)",
              boxShadow: isTop ? `0 0 ${22 * glow}px rgba(255,199,0,0.12)` : "none",
              opacity: rise * (1 - ignoreFade),
              transform: `translate3d(0, ${(1 - rise) * 44}px, 0) scale(${
                1 - ignoreFade * 0.03
              })`,
              filter: `blur(${(1 - rise) * 5 + ignoreFade * 1.6}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 2,
                color: isTop
                  ? activate > 0.4
                    ? COLORS.gold
                    : COLORS.textDim
                  : "rgba(167,175,183,0.5)",
                width: 56,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            {/* Thumbnail */}
            <div
              style={{
                width: 66,
                height: 66,
                borderRadius: 12,
                background: isTop
                  ? `linear-gradient(135deg, rgba(0,210,255,${0.12 + activate * 0.16}), rgba(221,174,74,${0.1 + activate * 0.2}))`
                  : "rgba(167,175,183,0.1)",
                border: `1px solid rgba(0,210,255,${isTop ? 0.2 + activate * 0.2 : 0.08})`,
              }}
            />
            <div style={{ flex: 1 }}>
              {/* Abstract name bar */}
              <div
                style={{
                  width: 130 + noise(17, i) * 120,
                  height: 12,
                  borderRadius: 6,
                  background: isTop
                    ? `rgba(244,246,247,${0.5 + activate * 0.4})`
                    : "rgba(167,175,183,0.28)",
                  marginBottom: 12,
                }}
              />
              <Stars active={isTop && activate > 0.3} seedIdx={i} />
            </div>
            {isTop && (
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  letterSpacing: 3,
                  color: COLORS.cyan,
                  opacity: activate,
                }}
              >
                {["0.4 MI", "0.7 MI", "1.1 MI"][i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
