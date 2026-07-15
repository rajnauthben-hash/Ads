import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_BODY, FONT_HEADLINE, FONT_MONO } from "../config/fonts";
import { Icon, type IconName } from "./Icons";

const Reveal: React.FC<{ frame: number; start: number; children: React.ReactNode }> = ({
  frame,
  start,
  children,
}) => {
  const p = interpolate(frame - start, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{ opacity: p, translate: `0px ${(1 - p) * 14}px` }}>{children}</div>;
};

const ACTIONS: { icon: IconName; label: string }[] = [
  { icon: "phone", label: "Call" },
  { icon: "compass", label: "Directions" },
  { icon: "bookmark", label: "Save" },
  { icon: "globe", label: "Website" },
];

const TABS = ["OVERVIEW", "PHOTOS", "REVIEWS", "UPDATES"];

export const BusinessProfile: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  width: number;
}> = ({ frame, start, x, y, width }) => {
  const glow = interpolate(frame - start, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        borderRadius: 18,
        border: `1.5px solid ${COLORS.cyan}`,
        boxShadow: `0 0 ${20 + glow * 20}px rgba(0,210,255,${0.14 + glow * 0.12})`,
        background: "rgba(8,12,14,0.55)",
        overflow: "hidden",
        opacity: interpolate(frame - start, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* photo header */}
      <Reveal frame={frame} start={start}>
        <div
          style={{
            width: "100%",
            height: 220,
            background:
              "linear-gradient(135deg, #2a1f14 0%, #1a1410 45%, #241c14 70%, #171310 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(90deg, rgba(255,199,0,0.06) 0 40px, transparent 40px 90px)",
            }}
          />
        </div>
      </Reveal>

      <div style={{ padding: "22px 26px 26px" }}>
        <Reveal frame={frame} start={start + 8}>
          <div
            style={{
              fontFamily: FONT_HEADLINE,
              fontWeight: 550,
              fontSize: 34,
              color: COLORS.textPrimary,
              marginBottom: 10,
            }}
          >
            Local Bistro
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 14}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: COLORS.textPrimary }}>4.7</span>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" size={17} filled color={i < 4 ? COLORS.gold : "rgba(255,199,0,0.4)"} />
              ))}
            </div>
            <span style={{ fontFamily: FONT_BODY, fontSize: 20, color: COLORS.textSecondary }}>(162)</span>
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 18}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 20, color: COLORS.textSecondary, marginBottom: 20 }}>
            Bistro · $$ · <span style={{ color: "#3ddc84" }}>Open</span>
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 22}>
          <div style={{ display: "flex", gap: 30, marginBottom: 22 }}>
            {ACTIONS.map((a) => (
              <div key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    border: `1.4px solid ${COLORS.cyan}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={a.icon} size={20} color={COLORS.cyan} />
                </div>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: COLORS.textSecondary }}>{a.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 28}>
          <div
            style={{
              borderTop: "1px solid rgba(174,181,188,0.16)",
              paddingTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Icon name="pin" size={17} color={COLORS.textSecondary} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 19, color: COLORS.textSecondary }}>
              123 Market St, Yourtown, ST 12345
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Icon name="clock" size={17} color={COLORS.textSecondary} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 19 }}>
              <span style={{ color: "#3ddc84" }}>Open</span>
              <span style={{ color: COLORS.textSecondary }}> · Closes 9PM</span>
            </span>
            <Icon name="chevron" size={16} color={COLORS.textSecondary} />
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 32}>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 19,
              lineHeight: 1.4,
              color: COLORS.textSecondary,
              marginBottom: 22,
            }}
          >
            Cozy neighborhood bistro serving
            <br />
            fresh, seasonal dishes.
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 36}>
          <div
            style={{
              display: "flex",
              gap: 28,
              borderBottom: "1px solid rgba(174,181,188,0.16)",
              paddingBottom: 14,
              marginBottom: 18,
              fontFamily: FONT_MONO,
              fontSize: 15,
              letterSpacing: "0.06em",
            }}
          >
            {TABS.map((t, i) => (
              <span
                key={t}
                style={{
                  color: i === 0 ? COLORS.cyan : COLORS.textSecondary,
                  borderBottom: i === 0 ? `2px solid ${COLORS.cyan}` : "none",
                  paddingBottom: 12,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal frame={frame} start={start + 40}>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 96,
                  borderRadius: 8,
                  background:
                    i === 1
                      ? "linear-gradient(135deg, #23201a, #171412)"
                      : "linear-gradient(135deg, #241c16, #14100d)",
                }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
};
