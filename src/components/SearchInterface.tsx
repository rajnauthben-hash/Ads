import React from "react";
import { interpolate, Easing } from "remotion";
import { COLORS } from "../config/design";
import { FONT_MONO } from "../config/fonts";
import { Icon } from "./Icons";
import { smoothPath } from "./pathMath";

const ROW_H = 108;
const ROW_GAP = 18;

const Reveal: React.FC<{ frame: number; start: number; children: React.ReactNode; dir?: "x" | "y" }> = ({
  frame,
  start,
  children,
  dir = "x",
}) => {
  const p = interpolate(frame - start, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shift = dir === "x" ? `${(1 - p) * -26}px, 0px` : `0px, ${(1 - p) * 14}px`;
  return <div style={{ opacity: p, translate: shift }}>{children}</div>;
};

export const SearchInterface: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  width: number;
}> = ({ frame, start, x, y, width }) => {
  const rows: { icon: "pin" | "star" | "photo" | "clock"; content: React.ReactNode }[] = [
    {
      icon: "pin",
      content: <div style={{ width: "58%", height: 4, background: "rgba(0,210,255,0.3)" }} />,
    },
    {
      icon: "star",
      content: (
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" size={20} color={COLORS.cyan} filled />
          ))}
        </div>
      ),
    },
    {
      icon: "photo",
      content: (
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 46,
                height: 46,
                border: "1.5px solid rgba(0,210,255,0.35)",
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: "clock",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ width: "70%", height: 4, background: "rgba(0,210,255,0.3)" }} />
          <div style={{ width: "44%", height: 4, background: "rgba(0,210,255,0.18)" }} />
        </div>
      ),
    },
  ];

  const barTop = 0;
  const barH = 82;
  const rowsTop = barH + 26;
  const dotX = width - 4;
  const rowDotY = (i: number) => rowsTop + i * (ROW_H + ROW_GAP) + ROW_H / 2;
  const convergeY = rowDotY(1.5);

  return (
    <div style={{ position: "absolute", left: x, top: y, width }}>
      {/* connector cables to a single convergence point at the panel edge */}
      <svg width={width + 60} height={rowsTop + rows.length * (ROW_H + ROW_GAP)} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {rows.map((_, i) => {
          const p = interpolate(frame - (start + 20 + i * 5), [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const d = smoothPath([
            { x: dotX, y: rowDotY(i) },
            { x: dotX + 26, y: rowDotY(i) },
            { x: dotX + 44, y: convergeY },
            { x: dotX + 58, y: convergeY },
          ]);
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={2}
              opacity={0.7 * p}
              strokeDasharray={220}
              strokeDashoffset={220 * (1 - p)}
            />
          );
        })}
        <circle cx={dotX + 58} cy={convergeY} r={5} fill={COLORS.cyan} opacity={0.85} />
      </svg>

      {/* search bar */}
      <Reveal frame={frame} start={start} dir="y">
        <div
          style={{
            position: "absolute",
            top: barTop,
            left: 0,
            width,
            height: barH,
            borderRadius: 16,
            border: `1.5px solid ${COLORS.cyan}`,
            background: "rgba(0,210,255,0.06)",
            boxShadow: `0 0 22px rgba(0,210,255,0.18)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 24px",
            boxSizing: "border-box",
          }}
        >
          <Icon name="search" size={24} color={COLORS.cyan} />
          <div style={{ width: "48%", height: 4, background: "rgba(0,210,255,0.4)" }} />
        </div>
      </Reveal>

      {rows.map((row, i) => (
        <div key={i} style={{ position: "absolute", top: rowsTop + i * (ROW_H + ROW_GAP), left: 0, width }}>
          <Reveal frame={frame} start={start + 10 + i * 6}>
            <div
              style={{
                width,
                height: ROW_H,
                borderRadius: 12,
                border: "1px solid rgba(0,210,255,0.22)",
                background: "rgba(0,210,255,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 22px",
                boxSizing: "border-box",
              }}
            >
              <Icon name={row.icon} size={26} color={COLORS.cyan} filled={row.icon === "star"} />
              {row.content}
            </div>
          </Reveal>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: -34,
          left: 2,
          fontFamily: FONT_MONO,
          fontSize: 15,
          letterSpacing: "0.14em",
          color: "rgba(0,210,255,0.5)",
        }}
      >
        LOCAL SEARCH
      </div>
    </div>
  );
};
