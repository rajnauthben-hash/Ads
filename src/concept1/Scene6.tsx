import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, GoldTick, HEAD, SUP } from "./ui";
import { win, clamp01 } from "./anim";

const LEFT = 96;

// Perspective street-grid behind the route (faint, native SVG).
const MapGrid: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <g stroke="rgba(120,140,160,0.09)" strokeWidth={1.2} fill="none" transform="translate(560 900) rotate(-24)">
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`h${i}`} x1={-500} y1={-400 + i * 60} x2={700} y2={-400 + i * 60} />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v${i}`} x1={-500 + i * 70} y1={-400} x2={-500 + i * 70} y2={560} />
      ))}
    </g>
  </svg>
);

// Zig-zag cyan route from origin dot to gold pin.
const PTS = [
  [150, 1150],
  [330, 1092],
  [470, 1044],
  [560, 968],
  [672, 936],
  [742, 856],
  [808, 812],
];
const routeD = PTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = clamp01(win(frame, 30, 78, 0, 1));
  const pin = clamp01(win(frame, 74, 92, 0, 1));
  const brand = win(frame, 60, 84, 0, 1);
  const cta = win(frame, 82, 100, 0, 1);
  const ctaY = win(frame, 82, 100, 16, 0);

  return (
    <>
      <MapGrid />

      <div style={{ position: "absolute", left: LEFT, top: 110, maxWidth: 760 }}>
        <Line delay={4}><div style={{ ...HEAD, fontSize: 96 }}>Make it easier</div></Line>
        <Line delay={10}><div style={{ ...HEAD, fontSize: 96 }}>for customers</div></Line>
        <Line delay={16}><div style={{ ...HEAD, fontSize: 96 }}>to find—and</div></Line>
        <Line delay={22}><div style={{ ...HEAD, fontSize: 96 }}><Gold>Choose—you.</Gold></div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 636 }}>
        <GoldTick delay={28} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 690, width: 620 }}>
        <Line delay={32}><div style={{ ...SUP, whiteSpace: "nowrap" }}>OmniFlow Digital strengthens the<br />local search signals that help your<br />business appear clearly across<br />search and maps.</div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 948, width: 620 }}>
        <Line delay={44}><div style={{ ...SUP, color: C.gold, whiteSpace: "nowrap" }}>So nearby demand has a<br />clearer path to your business.</div></Line>
      </div>

      {/* route */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={routeD} pathLength={1000} fill="none" stroke={C.cyan} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={0.18} strokeDasharray={1000} strokeDashoffset={1000 * (1 - draw)} />
        <path d={routeD} pathLength={1000} fill="none" stroke={C.cyan} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - draw)} />
        <path d={routeD} pathLength={1000} fill="none" stroke={C.cyanBright} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - draw)} />
        {/* origin */}
        <circle cx={150} cy={1150} r={30} fill={C.cyan} opacity={0.16} />
        <circle cx={150} cy={1150} r={16} fill="#0B0A09" stroke={C.cyan} strokeWidth={3} />
        <circle cx={150} cy={1150} r={8} fill={C.cyan} />
        {/* gold pin at destination (tip sits on the route end) */}
        <g opacity={pin} transform={`translate(808 812) scale(${0.6 + pin * 0.4})`}>
          <circle cx={0} cy={0} r={6} fill={C.cyan} />
          <path d="M0 -6 C -16 -26 -28 -36 -28 -52 A 28 28 0 1 1 28 -52 C 28 -36 16 -26 0 -6 Z" fill={C.gold} />
          <circle cx={0} cy={-52} r={10} fill="#0B0A09" />
        </g>
      </svg>

      {/* brand lockup */}
      <div style={{ position: "absolute", left: LEFT + 12, top: 1288, display: "flex", alignItems: "center", gap: 26, opacity: brand }}>
        <svg width={110} height={110} viewBox="0 0 110 110" fill="none" stroke={C.cyan} strokeWidth={2.4}>
          <ellipse cx="55" cy="55" rx="42" ry="42" />
          <ellipse cx="45" cy="55" rx="20" ry="40" transform="rotate(-20 45 55)" />
          <ellipse cx="65" cy="55" rx="20" ry="40" transform="rotate(20 65 55)" />
        </svg>
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 68, letterSpacing: 8, color: C.headline, lineHeight: 1 }}>OMNIFLOW</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 34, letterSpacing: 18, color: C.cyan, textAlign: "center" }}>DIGITAL</div>
        </div>
      </div>

      <div style={{ position: "absolute", left: LEFT, top: 1476, opacity: brand }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 34, color: C.support }}>Get Found. Look Professional. Grow Online.</div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 1584,
          width: 888,
          height: 96,
          opacity: cta,
          transform: `translateY(${ctaY}px)`,
          border: `2px solid ${C.gold}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 36, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Improve your local visibility</span>
        <span style={{ color: C.gold, fontSize: 40 }}>→</span>
      </div>
    </>
  );
};
