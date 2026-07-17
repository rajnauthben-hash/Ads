import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { noise } from "./helpers";
import { EASE_TEXT } from "./motion";
import { COLORS, FONTS } from "./theme";

export type TextSegment = { text: string; color?: string };
export type TextLine = TextSegment[];

type Props = {
  lines: TextLine[];
  // Local frame at which the first line begins materializing.
  startFrame: number;
  lineDuration?: number;
  lineStagger?: number;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  lineHeight?: number;
  color?: string;
  letterSpacing?: number;
  drift?: { x: number; y: number };
  fragmentColor?: string;
  textAlign?: "left" | "center";
  // 1–6: varies mask direction, drift axis and fragment behavior so no two
  // scenes share the exact same construction.
  flavor?: number;
  seed?: number;
  style?: React.CSSProperties;
};

// Three-layer text materialization:
//   A — ghost construction: faint, blurred, slightly stretched duplicate
//       that appears a beat before the primary text.
//   B — primary text: directional mask, 10–22px settle, blur collapse,
//       tracking tighten. Gold phrases resolve ~4 frames after the white.
//   C — signal fragments: deterministic cyan/gold slivers that travel
//       toward the line and vanish exactly at lock-in.
export const PremiumTextMaterialize: React.FC<Props> = ({
  lines,
  startFrame,
  lineDuration = 16,
  lineStagger = 5,
  fontSize,
  fontFamily = FONTS.headline,
  fontWeight = 560,
  lineHeight = 1.14,
  color = COLORS.text,
  letterSpacing = -0.022,
  drift,
  fragmentColor = COLORS.cyan,
  textAlign = "left",
  flavor = 1,
  seed = 7,
  style,
}) => {
  const frame = useCurrentFrame();

  // Flavor decides the construction axis.
  const maskFromLeft = flavor % 3 !== 2;
  const driftVec = drift ?? {
    x: flavor % 2 === 0 ? (maskFromLeft ? 14 : -14) : 0,
    y: flavor % 2 === 0 ? 6 : 18,
  };

  const fragments = useMemo(
    () =>
      lines.map((_, li) =>
        Array.from({ length: 8 }, (__, fi) => ({
          // Destination inside the line box (percent / px).
          x: 4 + noise(seed + li * 13, fi * 5) * 82,
          y: noise(seed + li * 13, fi * 5 + 1) * 70 - 10,
          // Travel vector: fragments fly in from the un-masked side.
          fromX: (maskFromLeft ? 1 : -1) * (46 + noise(seed + li * 13, fi * 5 + 2) * 90),
          fromY: (noise(seed + li * 13, fi * 5 + 3) - 0.5) * 60,
          w: 10 + noise(seed + li * 13, fi * 5 + 4) * 34,
          gold: noise(seed + li * 17, fi) > 0.7,
          lead: noise(seed + li * 19, fi), // per-fragment phase offset
        })),
      ),
    [lines, seed, maskFromLeft],
  );

  return (
    <div style={{ textAlign, ...style }}>
      {lines.map((segments, li) => {
        const s = startFrame + li * lineStagger;
        const t = interpolate(frame, [s, s + lineDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_TEXT,
        });
        // Gold phrases resolve ~4 frames after the surrounding white text.
        const tGold = interpolate(frame, [s + 4, s + lineDuration + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_TEXT,
        });
        if (t <= 0) {
          return <div key={li} style={{ height: fontSize * lineHeight }} />;
        }

        // Layer A — ghost construction (brief, leads the primary).
        const ghost = interpolate(t, [0, 0.28, 0.62], [0, 0.2, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const blur = 13 * (1 - t);
        const clip = 106 * (1 - t);
        const dx = driftVec.x * (1 - t);
        const dy = driftVec.y * (1 - t);
        const tracking = letterSpacing + 0.065 * (1 - t);
        const lockFrame = s + lineDuration;
        const lockGlow =
          frame >= lockFrame - 1 && frame <= lockFrame + 1 ? 1 - Math.abs(frame - lockFrame) : 0;
        const fragWindow = interpolate(t, [0.06, 0.4, 0.88], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const textStyleBase: React.CSSProperties = {
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight,
          whiteSpace: "pre-wrap",
        };

        return (
          <div key={li} style={{ position: "relative" }}>
            {/* Layer C — converging signal fragments */}
            {fragWindow > 0.01 &&
              fragments[li].map((f, fi) => {
                const local = Math.min(1, Math.max(0, (t - f.lead * 0.24) / 0.6));
                if (local <= 0) {
                  return null;
                }
                const travel = 1 - EASE_TEXT(local);
                return (
                  <div
                    key={fi}
                    style={{
                      position: "absolute",
                      left: `${f.x}%`,
                      top: f.y,
                      width: f.w,
                      height: 2,
                      background: f.gold ? COLORS.gold : fragmentColor,
                      opacity: 0.7 * fragWindow * local,
                      transform: `translate3d(${f.fromX * travel}px, ${f.fromY * travel}px, 0)`,
                    }}
                  />
                );
              })}

            {/* Layer A — ghost */}
            {ghost > 0.01 && (
              <div
                aria-hidden
                style={{
                  ...textStyleBase,
                  position: "absolute",
                  inset: 0,
                  letterSpacing: `${letterSpacing + 0.04}em`,
                  color,
                  opacity: ghost,
                  filter: "blur(11px)",
                  transform: `translate3d(${dx * 1.6}px, ${dy * 0.5}px, 0) scaleX(1.05)`,
                  transformOrigin: maskFromLeft ? "0% 50%" : "100% 50%",
                }}
              >
                {segments.map((seg, si) => (
                  <span key={si}>{seg.text}</span>
                ))}
              </div>
            )}

            {/* Layer B — primary */}
            <div
              style={{
                ...textStyleBase,
                letterSpacing: `${tracking}em`,
                color,
                clipPath: maskFromLeft
                  ? `inset(-4% ${clip}% -8% -2%)`
                  : `inset(-4% -2% -8% ${clip}%)`,
                transform: `translate3d(${dx}px, ${dy}px, 0)`,
                filter: `blur(${blur}px)${lockGlow > 0 ? ` brightness(${1 + 0.3 * lockGlow})` : ""}`,
              }}
            >
              {segments.map((seg, si) => {
                if (!seg.color) {
                  return (
                    <span key={si} style={{ opacity: Math.min(1, t * 1.6) }}>
                      {seg.text}
                    </span>
                  );
                }
                // Delayed gold resolve — emphasis without karaoke.
                return (
                  <span
                    key={si}
                    style={{
                      color: seg.color,
                      opacity: Math.min(1, tGold * 1.5),
                      filter: tGold < 1 ? `blur(${3 * (1 - tGold)}px)` : undefined,
                    }}
                  >
                    {seg.text}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
