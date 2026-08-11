import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, Cyan, GoldTick, HEAD, SUP } from "./ui";
import { win } from "./anim";
import { IcPhone, IcWalk, IcSwap } from "./icons";

const LEFT = 96;

const MONTHS = [
  { m: "JAN", x: 774, y: 902, rot: -19, s: 0.78 },
  { m: "FEB", x: 748, y: 1012, rot: -15, s: 0.85 },
  { m: "MAR", x: 712, y: 1124, rot: -11, s: 0.92 },
  { m: "APR", x: 672, y: 1240, rot: -7, s: 1.0, gold: true },
  { m: "MAY", x: 628, y: 1358, rot: -3, s: 1.07 },
  { m: "JUN", x: 582, y: 1478, rot: 0, s: 1.13 },
];

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {MONTHS.map((mo, i) => {
        const d = 40 + i * 5;
        const op = win(frame, d, d + 18, 0, 1);
        const dx = win(frame, d, d + 18, 40, 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mo.x,
              top: mo.y,
              opacity: op,
              transform: `translateX(${dx}px) rotate(${mo.rot}deg) scale(${mo.s})`,
              transformOrigin: "left center",
            }}
          >
            {/* page card */}
            <div
              style={{
                width: 300,
                height: 96,
                background: "linear-gradient(180deg, rgba(40,38,34,0.85), rgba(18,16,14,0.9))",
                border: "1px solid rgba(120,110,90,0.18)",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                paddingLeft: 26,
                boxShadow: "0 18px 30px rgba(0,0,0,0.5)",
              }}
            >
              <span
                style={{
                  fontFamily: HEAD.fontFamily,
                  fontSize: 66,
                  letterSpacing: 2,
                  transform: "skewX(-9deg)",
                  color: mo.gold ? C.gold : "rgba(180,176,168,0.55)",
                }}
              >
                {mo.m}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SYMPTOMS = [
  { Icon: IcPhone, pre: "Fewer ", hot: "calls." },
  { Icon: IcWalk, pre: "Fewer ", hot: "visits." },
  { Icon: IcSwap, pre: "More demand", hot: "", two: true },
];

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: 110, maxWidth: 760 }}>
        <Line delay={4}><div style={{ ...HEAD, fontSize: 100 }}>This is the <Gold>cost</Gold></div></Line>
        <Line delay={10}><div style={{ ...HEAD, fontSize: 100 }}>of weak local</div></Line>
        <Line delay={16}><div style={{ ...HEAD, fontSize: 100 }}>visibility.</div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 560 }}>
        <GoldTick delay={22} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 606 }}>
        <Line delay={26}><div style={SUP}>Not a charge on a statement.<br />It shows up differently:</div></Line>
      </div>

      <Ribbon />

      {/* symptom rows */}
      {SYMPTOMS.map((s, i) => {
        const cy = 786 + i * 148;
        const d = 32 + i * 8;
        const op = win(frame, d, d + 16, 0, 1);
        return (
          <div key={i} style={{ opacity: op }}>
            {i > 0 ? <div style={{ position: "absolute", left: 96, top: cy - 74, width: 470, height: 1, background: C.lineSoft }} /> : null}
            <div style={{ position: "absolute", left: 158, top: cy, transform: "translate(-50%,-50%)" }}>
              <div style={{ width: 96, height: 96, borderRadius: 96, border: "2px solid rgba(241,235,221,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.Icon size={46} color={C.cyan} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 250, top: cy, transform: "translateY(-50%)", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 40, color: C.headline, lineHeight: 1.15 }}>
              {s.two ? (
                <>
                  <div>{s.pre}</div>
                  <div>going <Cyan>somewhere else.</Cyan></div>
                </>
              ) : (
                <div>{s.pre}<Cyan>{s.hot}</Cyan></div>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: LEFT, top: 1258, maxWidth: 470 }}>
        <Line delay={64}>
          <div style={SUP}>And if nothing changes,<br />it can happen again<br /><span style={{ color: C.gold, fontWeight: 700, fontSize: 40 }}>next month.</span></div>
        </Line>
      </div>
    </>
  );
};
