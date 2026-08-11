import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, GoldTick, HEAD, EYEBROW, SUP } from "./ui";
import { win, clamp01 } from "./anim";
import { IcBuilding, IcPeople, IcBox, IcBolt, IcMegaphone } from "./icons";

const ROWS = [
  { Icon: IcBuilding, label: "RENT" },
  { Icon: IcPeople, label: "PAYROLL" },
  { Icon: IcBox, label: "STOCK" },
  { Icon: IcBolt, label: "UTILITIES" },
  { Icon: IcMegaphone, label: "MARKETING" },
];

const LEFT = 96;
const LIST_TOP = 748;
const ROW_H = 108;
const LIST_RIGHT = 720;
const COL_X = 232; // vertical divider between icon + label

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const listReveal = clamp01(win(frame, 40, 60, 0, 1));

  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: 110 }}>
        <GoldTick delay={4} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 150 }}>
        <Line delay={8}>
          <div style={EYEBROW}>
            Every business has
            <br />
            monthly expenses.
          </div>
        </Line>
      </div>

      <div style={{ position: "absolute", left: LEFT, top: 268 }}>
        <Line delay={12}><div style={HEAD}>You know what</div></Line>
        <Line delay={18}><div style={HEAD}>your business</div></Line>
        <Line delay={24}><div style={HEAD}>pays for.</div></Line>
        <Line delay={32}><div style={HEAD}><Gold>Every month.</Gold></div></Line>
      </div>

      {/* expense list */}
      <div style={{ position: "absolute", left: LEFT, top: LIST_TOP, width: LIST_RIGHT - LEFT, height: ROW_H * ROWS.length }}>
        {/* horizontal dividers */}
        {Array.from({ length: ROWS.length + 1 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: i * ROW_H,
              width: (LIST_RIGHT - LEFT) * listReveal,
              height: 1,
              background: C.line,
            }}
          />
        ))}
        {/* vertical divider */}
        <div style={{ position: "absolute", left: COL_X - LEFT, top: 0, width: 1, height: ROW_H * ROWS.length * listReveal, background: C.line }} />

        {ROWS.map((r, i) => {
          const d = 44 + i * 6;
          const rr = win(frame, d, d + 16, 0, 1);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: i * ROW_H, width: "100%", height: ROW_H, opacity: rr }}>
              <div style={{ position: "absolute", left: (COL_X - LEFT) / 2 - 26, top: ROW_H / 2 - 26, transform: `translateX(${win(frame, d, d + 16, -10, 0)}px)` }}>
                <r.Icon size={52} color={C.gold} />
              </div>
              <div style={{ position: "absolute", left: COL_X - LEFT + 34, top: ROW_H / 2, transform: "translateY(-50%)", fontFamily: "Inter, sans-serif", fontSize: 40, fontWeight: 500, letterSpacing: 2, color: C.headline }}>
                {r.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* bottom copy */}
      <div style={{ position: "absolute", left: LEFT, top: 1360 }}>
        <Line delay={74}><div style={{ ...SUP, color: C.headline }}>They all show up somewhere.</div></Line>
        <Line delay={82}><div style={{ ...SUP, marginTop: 26 }}>But <span style={{ color: C.gold, fontWeight: 700 }}>one cost</span> <span style={{ color: C.gold }}>rarely does.</span></div></Line>
      </div>
    </>
  );
};
