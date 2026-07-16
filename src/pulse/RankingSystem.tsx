import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { COLORS, FONTS } from "./theme";

// Editorial ranked list matching the reference: gold position numbers, photo
// thumbnails (warm interior impressions), name + star rating. Top three lit
// in gold; bottom three dim, gray and semi-disabled.
export const RANK_ENTRIES = [
  { name: "Top Choice", rating: "4.9", active: true },
  { name: "Great Option", rating: "4.7", active: true },
  { name: "Solid Pick", rating: "4.5", active: true },
  { name: "Looks Okay", rating: "4.1", active: false },
  { name: "Maybe Later", rating: "3.8", active: false },
  { name: "Nah", rating: "3.2", active: false },
] as const;

export const RANK_ROW_SPACING = 146;
export const RANK_THUMB = 96;

type Props = {
  // Local frame at which position 01 assembles.
  buildFrame: number;
  // 0..1 — how strongly the ignored (04–06) positions have faded.
  attentionNarrowing: number;
  style?: React.CSSProperties;
};

const Thumb: React.FC<{ i: number; active: boolean; glowT: number }> = ({ i, active, glowT }) => {
  // Warm restaurant-interior impression built from gradients.
  const warm = active ? 1 : 0.35;
  return (
    <div
      style={{
        width: RANK_THUMB,
        height: RANK_THUMB,
        borderRadius: 14,
        position: "relative",
        overflow: "hidden",
        border: active
          ? `1.4px solid rgba(224,184,91,${0.35 + 0.4 * glowT})`
          : "1px solid rgba(154,163,173,0.16)",
        boxShadow: active ? `0 0 ${18 * glowT}px rgba(224,184,91,0.18)` : "none",
        background: `linear-gradient(${160 + i * 20}deg, rgba(58,40,22,${0.9 * warm}), rgba(24,18,12,${0.95}) 55%, rgba(12,11,10,1))`,
      }}
    >
      {/* Window light */}
      <div
        style={{
          position: "absolute",
          left: 8 + noise(3, i) * 30,
          top: 10,
          width: 26,
          height: 34,
          borderRadius: 4,
          background: `rgba(255,214,140,${0.28 * warm})`,
          filter: "blur(2px)",
        }}
      />
      {/* Pendant lights */}
      {[0, 1, 2].map((p) => (
        <div
          key={p}
          style={{
            position: "absolute",
            left: 14 + p * 28 + noise(5, i * 3 + p) * 8,
            top: 26 + noise(6, i * 3 + p) * 10,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: `rgba(255,220,150,${0.75 * warm})`,
            boxShadow: `0 0 8px rgba(255,200,120,${0.6 * warm})`,
          }}
        />
      ))}
      {/* Table silhouettes */}
      <div style={{ position: "absolute", left: 10, bottom: 12, width: 32, height: 10, borderRadius: 3, background: "rgba(0,0,0,0.55)" }} />
      <div style={{ position: "absolute", right: 12, bottom: 18, width: 26, height: 9, borderRadius: 3, background: "rgba(0,0,0,0.5)" }} />
      {/* Floor glow */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: `linear-gradient(0deg, rgba(224,166,80,${0.16 * warm}), transparent)` }} />
    </div>
  );
};

export const RankingSystem: React.FC<Props> = ({ buildFrame, attentionNarrowing, style }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "relative", ...style }}>
      {RANK_ENTRIES.map((entry, i) => {
        const isTop = entry.active;
        const rise = interpolate(
          frame,
          [buildFrame + i * (isTop ? 5 : 4) + (isTop ? 0 : 10), buildFrame + i * (isTop ? 5 : 4) + (isTop ? 12 : 22)],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.85, 0.3, 1),
          },
        );
        if (rise <= 0) {
          return null;
        }
        const glowT = isTop
          ? interpolate(frame, [buildFrame + 14 + i * 6, buildFrame + 24 + i * 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;
        const ignoreFade = isTop ? 0 : attentionNarrowing * (0.5 + (i - 3) * 0.08);
        const numberColor = isTop ? COLORS.gold : "rgba(154,163,173,0.5)";

        return (
          <div
            key={entry.name}
            style={{
              position: "absolute",
              left: 0,
              top: i * RANK_ROW_SPACING,
              display: "flex",
              alignItems: "center",
              gap: 26,
              opacity: rise * (1 - ignoreFade),
              transform: `translate3d(0, ${(1 - rise) * 40}px, 0)`,
              filter: `blur(${(1 - rise) * 5 + ignoreFade * 1.4}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontWeight: 500,
                fontSize: 27,
                letterSpacing: 2,
                color: numberColor,
                width: 52,
                textShadow: isTop ? `0 0 ${12 * glowT}px rgba(224,184,91,0.5)` : "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <Thumb i={i} active={isTop} glowT={glowT} />
            <div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontWeight: 500,
                  fontSize: 30,
                  letterSpacing: 0.2,
                  color: isTop ? COLORS.gold : "rgba(154,163,173,0.55)",
                  marginBottom: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.name}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontWeight: 400,
                  fontSize: 25,
                  color: isTop ? "rgba(245,246,247,0.9)" : "rgba(154,163,173,0.45)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {entry.rating}
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M10 1.5 L12.2 7 L18 7.4 L13.5 11 L15 16.8 L10 13.5 L5 16.8 L6.5 11 L2 7.4 L7.8 7 Z"
                    fill={isTop ? COLORS.gold : "rgba(154,163,173,0.4)"}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
