import React from "react";
import { FONT, COLOR } from "../theme";
import { clamp01, envelope, revealIn } from "./anim";
import { Line } from "./EditorialText";

export const CalloutBox: React.FC<{
  lines: Line[];
  into: number;
  out?: number;
  bordered?: boolean;
  size?: number;
}> = ({ lines, into, out = 0, bordered = true, size = 30 }) => {
  return (
    <div
      style={{
        ...envelope(clamp01(into), out, 12),
        display: "inline-block",
        padding: bordered ? "20px 26px" : 0,
        border: bordered ? `1.5px solid ${COLOR.gold}` : "none",
        borderRadius: bordered ? 6 : 0,
        fontFamily: FONT.body,
        fontSize: size,
        lineHeight: 1.4,
        fontWeight: 500,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          {line.map((seg, j) => (
            <span key={j} style={{ color: seg.c ?? COLOR.white }}>
              {seg.t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const CHECK_ITEMS = [
  "Accurate profile",
  "Right categories",
  "Updated hours",
  "Clear services",
  "Better photos",
  "More reviews",
];

export const Checklist: React.FC<{ into: number; size?: number }> = ({ into, size = 30 }) => {
  return (
    <div style={{ fontFamily: FONT.body, fontSize: size, color: COLOR.white }}>
      {CHECK_ITEMS.map((item, i) => {
        // grouped timing (pairs), controlled — no bounce
        const gp = clamp01((into * 1.5 - Math.floor(i / 2) * 0.22) / 0.5);
        return (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 18,
              ...revealIn(gp, 8),
            }}
          >
            <svg width={40} height={40} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
              <circle cx={20} cy={20} r={17} fill="none" stroke={COLOR.cyan} strokeWidth={2} opacity={0.85} />
              <path
                d="M 12 20 l 5 5 l 11 -11"
                fill="none"
                stroke={COLOR.cyanCore}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - clamp01((gp - 0.3) / 0.5)}
              />
            </svg>
            <span style={{ fontWeight: 500 }}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};
