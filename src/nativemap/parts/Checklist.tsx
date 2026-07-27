import React from "react";
import { T, FONT_BODY } from "../tokens";
import { clamp01, bodyIn } from "./motion";

const ITEMS = ["Accurate profile", "Right categories", "Updated hours", "Clear services", "Better photos", "More reviews"];

/** Scene 4 checklist — cyan outlined circle + white check + white label. */
export const Checklist: React.FC<{
  x: number; y: number; size: number; rowGap: number;
  circleP: number[]; labelP: number[];
}> = ({ x, y, size, rowGap, circleP, labelP }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    {ITEMS.map((item, i) => {
      const cp = clamp01(circleP[i] ?? 0);
      const lp = clamp01(labelP[i] ?? 0);
      return (
        <div key={item} style={{ position: "absolute", top: i * rowGap, left: 0, display: "flex", alignItems: "center", gap: 20 }}>
          <svg width={38} height={38} viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
            <circle cx={19} cy={19} r={16} fill="none" stroke={T.cyan} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cp} />
            <path d="M11 19 l5 5 l11 -11" fill="none" stroke={T.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((cp - 0.4) / 0.6)} />
          </svg>
          <span style={{ fontFamily: FONT_BODY, fontSize: size, color: T.white, whiteSpace: "nowrap", ...bodyIn(lp, 6) }}>{item}</span>
        </div>
      );
    })}
  </div>
);
