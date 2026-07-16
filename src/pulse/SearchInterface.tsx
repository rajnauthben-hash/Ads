import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "./theme";

type Props = {
  // Local frame at which the interface begins constructing itself.
  buildFrame: number;
  width?: number;
  style?: React.CSSProperties;
};

const MODULES = [
  { label: "MAPS", icon: "pin" },
  { label: "REVIEWS", icon: "stars" },
  { label: "PHOTOS", icon: "photo" },
  { label: "OPENING HOURS", icon: "clock" },
] as const;

const ModuleIcon: React.FC<{ kind: string; active: number }> = ({ kind, active }) => {
  const stroke = `rgba(0, 210, 255, ${0.45 + 0.55 * active})`;
  switch (kind) {
    case "pin":
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <path d="M17 29 C 10 20 8 17 8 12 A 9 9 0 1 1 26 12 C 26 17 24 20 17 29 Z" fill="none" stroke={stroke} strokeWidth={2} />
          <circle cx="17" cy="12.5" r="3.4" fill={stroke} />
        </svg>
      );
    case "stars":
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              transform={`translate(${4 + i * 10} 12) scale(0.5)`}
              d="M8 0 L10 6 L16 6 L11 10 L13 16 L8 12 L3 16 L5 10 L0 6 L6 6 Z"
              fill={i < 2 ? COLORS.goldWarm : "none"}
              stroke={i < 2 ? "none" : stroke}
              strokeWidth={1.6}
              opacity={0.4 + 0.6 * active}
            />
          ))}
          <rect x="4" y="23" width={18 * active + 4} height="3" rx="1.5" fill={stroke} />
        </svg>
      );
    case "photo":
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <rect x="5" y="7" width="24" height="20" rx="3" fill="none" stroke={stroke} strokeWidth={2} />
          <circle cx="12" cy="14" r="2.4" fill={stroke} />
          <path d="M7 24 L 15 16 L 20 21 L 24 17 L 28 21" fill="none" stroke={stroke} strokeWidth={2} />
        </svg>
      );
    default:
      return (
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="17" r="11" fill="none" stroke={stroke} strokeWidth={2} />
          <path d={`M17 17 L 17 10`} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
          <path d={`M17 17 L ${17 + 6 * Math.cos(active * 6)} ${17 + 6 * Math.sin(active * 6)}`} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        </svg>
      );
  }
};

// Abstract search surface (deliberately not Google's UI, no logo): a search
// field constructs itself from the incoming route, four intent modules
// materialize in sequence, and scanning indicators keep the panel alive.
export const SearchInterface: React.FC<Props> = ({ buildFrame, width = 620, style }) => {
  const frame = useCurrentFrame();
  const t = (from: number, dur: number, easing = Easing.bezier(0.2, 0.8, 0.25, 1)) =>
    interpolate(frame, [buildFrame + from, buildFrame + from + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  const bar = t(0, 12);
  const scanY = ((frame - buildFrame) * 4.2) % 560;

  return (
    <div style={{ width, position: "relative", ...style }}>
      {/* Search field — draws its own outline first */}
      <div
        style={{
          position: "relative",
          height: 92,
          borderRadius: 46,
          background: "rgba(18, 19, 20, 0.92)",
          border: `1.5px solid rgba(0, 210, 255, ${0.2 + 0.45 * bar})`,
          boxShadow: `0 0 ${26 * bar}px rgba(0, 210, 255, 0.14)`,
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          gap: 22,
          clipPath: `inset(0 ${(1 - bar) * 100}% 0 0 round 46px)`,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="15" cy="15" r="9" fill="none" stroke={COLORS.cyan} strokeWidth={2.4} />
          <line x1="22" y1="22" x2="29" y2="29" stroke={COLORS.cyan} strokeWidth={2.6} strokeLinecap="round" />
        </svg>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 500,
            fontSize: 24,
            letterSpacing: 2,
            color: COLORS.textDim,
          }}
        >
          {"coffee near me".slice(0, Math.floor(t(6, 26, Easing.linear) * 14))}
        </div>
        {/* Blinking caret, frame-driven */}
        <div
          style={{
            width: 2.5,
            height: 30,
            background: COLORS.cyan,
            opacity: Math.floor(frame / 14) % 2 === 0 ? 1 : 0.15,
            marginLeft: -14,
          }}
        />
      </div>

      {/* Modules */}
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
        {MODULES.map((m, i) => {
          const mt = t(10 + i * 7, 12);
          if (mt <= 0) {
            return <div key={m.label} style={{ height: 96 }} />;
          }
          const stream = t(22 + i * 7, 20, Easing.linear);
          return (
            <div
              key={m.label}
              style={{
                position: "relative",
                height: 96,
                borderRadius: 18,
                background: "rgba(18, 19, 20, 0.88)",
                border: `1.2px solid rgba(0, 210, 255, ${0.12 + 0.3 * mt})`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "0 28px",
                opacity: mt,
                transform: `translate3d(${(1 - mt) * -34}px, 0, 0)`,
                filter: `blur(${(1 - mt) * 6}px)`,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  background: COLORS.mutedUi,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ModuleIcon kind={m.icon} active={mt} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 500,
                    fontSize: 19,
                    letterSpacing: 4,
                    color: COLORS.text,
                  }}
                >
                  {m.label}
                </div>
                {/* Abstract content bars */}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {[86, 130, 58].map((w, bi) => (
                    <div
                      key={bi}
                      style={{
                        width: w * mt,
                        height: 7,
                        borderRadius: 3.5,
                        background: bi === 0 ? "rgba(221,174,74,0.55)" : "rgba(167,175,183,0.3)",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Data stream leaving the module toward the map */}
              <div
                style={{
                  position: "absolute",
                  right: -6,
                  top: "50%",
                  width: 46,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${COLORS.cyan})`,
                  opacity: stream > 0 ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.3 + i)) : 0,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Scanning indicator sweeping the panel */}
      {bar > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: scanY,
            height: 40,
            background:
              "linear-gradient(180deg, transparent, rgba(0,210,255,0.045), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
