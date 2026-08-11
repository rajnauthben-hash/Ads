import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, GoldTick, HEAD, SUP } from "./ui";
import { win, clamp01 } from "./anim";
import { IcSearch, IcPin, IcClock, IcStarChat, IcInfo, IcBuilding } from "./icons";

const LEFT = 96;
const RAIL_X = 118;
const ICON_X = 165;
const LABEL_X = 262;
const DESC_X = 512;
const ROWS_TOP = 604;
const ROW_H = 96;

const ROWS = [
  { Icon: IcSearch, label: ["SEARCH"], desc: ["They look for", "solutions nearby."] },
  { Icon: IcPin, label: ["MAPS"], desc: ["They scan the", "options that appear."] },
  { Icon: IcClock, label: ["HOURS"], desc: ["They check if you're", "open and available."] },
  { Icon: IcStarChat, label: ["REVIEWS"], desc: ["They look for", "proof you deliver."] },
  { Icon: IcInfo, label: ["CLEAR", "INFORMATION"], desc: ["They choose what", "feels easiest to trust", "and reach."] },
];

const Box: React.FC<{ x: number; title: string[]; sub: string[]; gold?: boolean; delay: number }> = ({ x, title, sub, gold, delay }) => {
  const frame = useCurrentFrame();
  const op = win(frame, delay, delay + 18, 0, 1);
  const y = win(frame, delay, delay + 18, 16, 0);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 1268,
        width: 300,
        height: 250,
        opacity: op,
        transform: `translateY(${y}px)`,
        border: `2px solid ${gold ? C.boxGold : "rgba(241,235,221,0.18)"}`,
        borderRadius: 14,
        padding: "26px 26px",
        background: gold ? "rgba(198,144,47,0.05)" : "rgba(241,235,221,0.02)",
      }}
    >
      <IcBuilding size={40} color={gold ? C.gold : C.support} />
      <div style={{ fontFamily: HEAD.fontFamily, fontSize: 34, letterSpacing: 0.5, textTransform: "uppercase", color: gold ? C.gold : C.headline, marginTop: 18, lineHeight: 1.05 }}>
        {title.map((t, i) => <div key={i}>{t}</div>)}
      </div>
      <div style={{ width: 90, height: 1, background: gold ? C.boxGold : "rgba(241,235,221,0.18)", margin: "16px 0 12px" }} />
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 24, color: C.supportDim, lineHeight: 1.25 }}>
        {sub.map((s, i) => <div key={i}>{s}</div>)}
      </div>
    </div>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const railGrow = clamp01(win(frame, 30, 70, 0, 1));
  const railBottom = ROWS_TOP + (ROWS.length - 1) * ROW_H;
  const dashArrow = win(frame, 76, 96, 0, 1);
  const cyanArrow = win(frame, 84, 104, 0, 1);

  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: 96, maxWidth: 900 }}>
        <Line delay={6}><div style={{ ...HEAD, fontSize: 96 }}>They were already</div></Line>
        <Line delay={12}><div style={{ ...HEAD, fontSize: 96 }}>looking for</div></Line>
        <Line delay={18}><div style={{ ...HEAD, fontSize: 96 }}><Gold>what you sell.</Gold></div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 440 }}>
        <GoldTick delay={24} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 486 }}>
        <Line delay={28}><div style={SUP}>The decision often begins<br />before a call or visit.</div></Line>
      </div>

      {/* signal rail */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <line x1={RAIL_X} y1={ROWS_TOP} x2={RAIL_X} y2={ROWS_TOP + (railBottom - ROWS_TOP) * railGrow} stroke={C.cyan} strokeWidth={2.5} />
        {ROWS.map((_, i) => {
          const cy = ROWS_TOP + i * ROW_H;
          const on = clamp01(win(frame, 34 + i * 6, 34 + i * 6 + 12, 0, 1));
          return (
            <g key={i} opacity={on}>
              <circle cx={RAIL_X} cy={cy} r={11} fill={C.cyan} opacity={0.2} />
              <circle cx={RAIL_X} cy={cy} r={6} fill="#0B0A09" stroke={C.cyan} strokeWidth={2.5} />
            </g>
          );
        })}
      </svg>

      {/* rows */}
      {ROWS.map((r, i) => {
        const cy = ROWS_TOP + i * ROW_H;
        const d = 36 + i * 6;
        const op = win(frame, d, d + 16, 0, 1);
        return (
          <div key={i} style={{ opacity: op }}>
            {i > 0 ? <div style={{ position: "absolute", left: ICON_X - 20, top: cy - ROW_H / 2, width: 620, height: 1, background: C.lineSoft }} /> : null}
            <div style={{ position: "absolute", left: ICON_X, top: cy, transform: "translate(-50%,-50%)" }}>
              <r.Icon size={44} color={C.gold} />
            </div>
            <div style={{ position: "absolute", left: LABEL_X, top: cy, transform: "translateY(-50%)", fontFamily: HEAD.fontFamily, fontSize: 34, letterSpacing: 0.5, textTransform: "uppercase", color: C.headline, lineHeight: 1.0 }}>
              {r.label.map((t, k) => <div key={k}>{t}</div>)}
            </div>
            <div style={{ position: "absolute", left: DESC_X, top: cy, transform: "translateY(-50%)", fontFamily: "Inter, sans-serif", fontSize: 25, color: C.support, lineHeight: 1.24 }}>
              {r.desc.map((t, k) => <div key={k}>{t}</div>)}
            </div>
          </div>
        );
      })}

      {/* comparison */}
      <Box x={96} title={["YOUR", "BUSINESS"]} sub={["Unclear /", "Bypassed"]} delay={70} />
      <Box x={600} title={["ANOTHER", "BUSINESS"]} sub={["Clear /", "Selected"]} gold delay={78} />

      {/* dashed arrow between boxes */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g opacity={dashArrow}>
          <line x1={410} y1={1390} x2={578} y2={1390} stroke={C.support} strokeWidth={2} strokeDasharray="10 8" />
          <path d="M574 1384 L586 1390 L574 1396" fill="none" stroke={C.support} strokeWidth={2} />
        </g>
        {/* cyan curved arrow under the boxes */}
        <g opacity={cyanArrow}>
          <path d="M180 1540 C 300 1610, 560 1610, 700 1548" fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" />
          <path d="M690 1540 L706 1546 L694 1560" fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      <div style={{ position: "absolute", left: LEFT, top: 1636 }}>
        <Line delay={92}><div style={{ ...SUP, color: C.gold }}>The demand was real.<br />The connection wasn't.</div></Line>
      </div>
    </>
  );
};
