import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, GoldTick, HEAD, SUP } from "./ui";
import { win } from "./anim";
import { IcPhone, IcPin, IcDoor } from "./icons";

const LEFT = 96;
const ROWS = [
  { Icon: IcPhone, label: "NO CALL.", desc: ["They didn't reach out."] },
  { Icon: IcPin, label: "NO DIRECTIONS.", desc: ["They didn't ask", "for where to go."] },
  { Icon: IcDoor, label: "NO VISIT.", desc: ["They never came in."] },
];
const ROWS_TOP = 660;
const ROW_H = 196;

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: 100 }}>
        <GoldTick delay={2} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 150, maxWidth: 900 }}>
        <Line delay={6}><div style={{ ...HEAD, fontSize: 92 }}>When they can't</div></Line>
        <Line delay={12}><div style={{ ...HEAD, fontSize: 92 }}>find you clearly,</div></Line>
        <Line delay={18}><div style={{ ...HEAD, fontSize: 92 }}>the opportunity</div></Line>
        <Line delay={24}><div style={{ ...HEAD, fontSize: 92 }}><Gold>Disappears</Gold> quietly.</div></Line>
      </div>

      {ROWS.map((r, i) => {
        const cy = ROWS_TOP + i * ROW_H;
        const d = 34 + i * 10;
        const op = win(frame, d, d + 18, 0, 1);
        const x = win(frame, d, d + 18, -12, 0);
        return (
          <div key={i} style={{ opacity: op }}>
            {i > 0 ? <div style={{ position: "absolute", left: 96, top: cy - ROW_H / 2, width: 660, height: 1, background: C.lineSoft }} /> : null}
            <div style={{ position: "absolute", left: 150, top: cy, transform: `translate(-50%,-50%) translateX(${x}px)` }}>
              <div style={{ width: 108, height: 108, borderRadius: 108, border: `2px solid ${C.boxGold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <r.Icon size={52} color={C.cyan} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 232, top: cy - 44, width: 1, height: 88, background: C.line }} />
            <div style={{ position: "absolute", left: 268, top: cy, transform: "translateY(-50%)" }}>
              <div style={{ fontFamily: HEAD.fontFamily, fontSize: 52, letterSpacing: 0.5, textTransform: "uppercase", color: C.headline }}>{r.label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 30, color: C.support, marginTop: 4, lineHeight: 1.2 }}>
                {r.desc.map((t, k) => <div key={k}>{t}</div>)}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: LEFT, top: 1300, maxWidth: 620 }}>
        <Line delay={66}><div style={SUP}>They choose the business<br />that was easier to find and<br />understand.</div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 1520, maxWidth: 620 }}>
        <Line delay={76}><div style={{ ...SUP, color: C.gold }}>And you may never know<br />that opportunity existed.</div></Line>
      </div>
    </>
  );
};
