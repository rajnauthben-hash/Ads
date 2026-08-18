import React from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "../styles/fonts";
import { RC, RF, RSC } from "./theme";
import {
  BackgroundTexture, Brand, RoutePath, RouteHead, CustomerMarker, BizCard, StepIcon, Headline, Copy, Divider, ip, kf, clamp,
} from "./pieces";
import { Pt } from "../utils/routeGeometry";

// ---- persistent object state (hold during scene, move during transition) ----
const F = [0, 40, 100, 128, 200, 248, 320, 368, 440, 488, 560, 599];
const seq = (a: number, b: number, c: number, d: number, e: number) => [a, a, a, b, b, c, c, d, d, e, e, e];
const bizAt = (f: number) => ({
  x: kf(f, F, seq(800, 835, 210, 760, 800)),
  y: kf(f, F, seq(1120, 1420, 1230, 1400, 980)),
  act: kf(f, F, seq(0.85, 0.16, 0.1, 1, 1)),
  scale: kf(f, F, seq(1, 0.86, 0.9, 1, 1.24)),
});
const compAt = (f: number) => ({
  x: kf(f, F, seq(830, 835, 800, 770, 770)),
  y: kf(f, F, seq(720, 1170, 900, 720, 720)),
  act: kf(f, F, seq(0.9, 0.85, 1, 0.22, 0.22)),
  scale: kf(f, F, seq(0.92, 0.8, 0.96, 0.86, 0.86)),
  reveal: kf(f, F, [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]),
});
const custAt = (f: number) => ({
  x: kf(f, F, seq(150, 110, 150, 120, 150)),
  y: kf(f, F, seq(1560, 1560, 1650, 1500, 1650)),
});

function win(f: number, s: number, e: number, last = false) {
  return {
    p: (a = -6, b = 30) => ip(f, s + a, s + b, 0, 1),
    ex: (a = 6, b = 16) => (last ? 0 : ip(f, e - a, e + b, 0, 1)),
    at: (a: number, b: number) => ip(f, s + a, s + b, 0, 1),
    live: f >= s - 26 && f <= e + 18,
    fade: last ? 1 : ip(f, e - 4, e + 12, 1, 0),
  };
}

// ---- per-scene routes ----
const route1: Pt[] = [{ x: 150, y: 1560 }, { x: 300, y: 1430 }, { x: 380, y: 1290 }, { x: 540, y: 1200 }, { x: 600, y: 1030 }, { x: 560, y: 900 }, { x: 700, y: 810 }, { x: 812, y: 742 }];
const route2: Pt[] = [{ x: 110, y: 1560 }, { x: 260, y: 1470 }, { x: 300, y: 1360 }, { x: 470, y: 1300 }, { x: 560, y: 1210 }, { x: 700, y: 1210 }, { x: 806, y: 1176 }];
const route3: Pt[] = [{ x: 150, y: 1650 }, { x: 290, y: 1540 }, { x: 300, y: 1410 }, { x: 470, y: 1350 }, { x: 560, y: 1180 }, { x: 650, y: 1050 }, { x: 774, y: 918 }];
const route4: Pt[] = [{ x: 300, y: 960 }, { x: 330, y: 1070 }, { x: 264, y: 1160 }, { x: 300, y: 1250 }, { x: 470, y: 1280 }, { x: 620, y: 1340 }, { x: 754, y: 1382 }];
const route5: Pt[] = [{ x: 150, y: 1648 }, { x: 300, y: 1560 }, { x: 356, y: 1430 }, { x: 300, y: 1300 }, { x: 452, y: 1220 }, { x: 610, y: 1180 }, { x: 730, y: 1090 }, { x: 792, y: 1034 }];

// ===========================================================================
const Scene1: React.FC<{ f: number }> = ({ f }) => {
  const s = RSC.s1.start, e = RSC.s1.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const draw = W.at(30, 96);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        <RoutePath points={route1} draw={draw} chevrons={5} />
        <RouteHead points={route1} draw={draw} />
      </svg>
      <Brand y={60} reveal={W.at(6, 26)} underline />
      <Headline x={64} y={190} size={104} p={W.p()} ex={W.ex()} lines={[[{ t: "You don’t need" }], [{ t: "a better " }, { t: "location.", c: RC.gold }]]} />
      <Copy x={66} y={560} size={34} color={RC.cream} p={W.at(28, 46)} ex={W.ex()} lines={["Your customers may already be nearby."]} />
      <Divider x={66} y={628} w={120} reveal={W.at(34, 48)} />
      <Copy x={66} y={672} size={44} weight={700} color={RC.white} p={W.at(38, 58)} ex={W.ex()} width={430}
        lines={[[{ t: "They’re just taking" }], [{ t: "a route that " }, { t: "never", c: RC.gold }], [{ t: "reaches you.", c: RC.gold }]]} />
    </AbsoluteFill>
  );
};

// ===========================================================================
const Scene2: React.FC<{ f: number }> = ({ f }) => {
  const s = RSC.s2.start, e = RSC.s2.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const draw = W.at(38, 96);
  const steps: [string, "search" | "scales" | "check"][] = [["SEARCH", "search"], ["COMPARE", "scales"], ["CHOOSE", "check"]];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        {/* failed dashed branch to the unconnected business */}
        <RoutePath points={[{ x: 470, y: 1300 }, { x: 640, y: 1360 }, { x: 720, y: 1420 }]} draw={W.at(46, 64)} dashed color={RC.gray} />
        <g opacity={W.at(50, 66)}><line x1={664} y1={1372} x2={684} y2={1392} stroke={RC.gray} strokeWidth={3} strokeLinecap="round" /><line x1={684} y1={1372} x2={664} y2={1392} stroke={RC.gray} strokeWidth={3} strokeLinecap="round" /></g>
        <RoutePath points={route2} draw={draw} chevrons={4} />
        <RouteHead points={route2} draw={draw} />
        {steps.map(([, k], i) => (
          <g key={i}>
            {i < 2 && <path d={`M${175 + i * 295 + 46} 900 L ${175 + (i + 1) * 295 - 46} 900`} stroke={RC.cyan} strokeWidth={2.4} markerEnd="" opacity={W.at(40 + i * 8, 54 + i * 8)} />}
            <StepIcon x={175 + i * 295} y={900} kind={k} r={40} reveal={W.at(34 + i * 8, 52 + i * 8)} />
          </g>
        ))}
      </svg>
      {steps.map(([t], i) => (
        <div key={i} style={{ position: "absolute", left: 175 + i * 295 - 70, top: 958, width: 140, textAlign: "center", fontFamily: RF.head, fontWeight: 800, fontSize: 26, letterSpacing: 1, color: RC.white, opacity: ip(f, s + 40 + i * 8, s + 56 + i * 8, 0, 1) * W.fade }}>{t}</div>
      ))}
      <Brand y={54} reveal={W.at(4, 22)} mark={false} underline />
      <Headline x={64} y={150} size={86} p={W.p()} ex={W.ex()} lines={[[{ t: "The road changed." }], [{ t: "Your business didn’t.", c: RC.gold }]]} />
      <Copy x={66} y={470} size={32} color={RC.cream} p={W.at(24, 42)} ex={W.ex()} lines={["Customers now search, compare", "and decide before they ever arrive."]} />
      <Copy x={66} y={620} size={32} color={RC.muted} p={W.at(32, 50)} ex={W.ex()} lines={["If your business isn’t connected", "to that journey,", [{ t: "being nearby", c: RC.gold }, { t: " isn’t enough." }]]} />
    </AbsoluteFill>
  );
};

// ===========================================================================
const Scene3: React.FC<{ f: number }> = ({ f }) => {
  const s = RSC.s3.start, e = RSC.s3.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const draw = W.at(30, 96);
  const items: [string, "click" | "call" | "pin"][] = [["No click.", "click"], ["No call.", "call"], ["No direction request.", "pin"]];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        <RoutePath points={[{ x: 300, y: 1410 }, { x: 260, y: 1310 }, { x: 300, y: 1250 }]} draw={W.at(44, 62)} dashed color={RC.gray} />
        <RoutePath points={route3} draw={draw} chevrons={4} />
        <RouteHead points={route3} draw={draw} />
        {items.map((_, i) => (
          <StepIcon key={i} x={110} y={628 + i * 118} kind={items[i][1]} r={38} reveal={W.at(30 + i * 8, 48 + i * 8)} cross />
        ))}
      </svg>
      {items.map(([t], i) => (
        <div key={i} style={{ position: "absolute", left: 176, top: 600 + i * 118, fontFamily: RF.body, fontWeight: 500, fontSize: 40, color: RC.white, opacity: ip(f, s + 34 + i * 8, s + 52 + i * 8, 0, 1) * W.fade }}>{t}</div>
      ))}
      <Brand y={54} reveal={W.at(4, 22)} mark={false} underline />
      <Headline x={64} y={158} size={94} p={W.p()} ex={W.ex()} lines={[[{ t: "So the traffic" }], [{ t: "keeps ", c: RC.cream }, { t: "moving.", c: RC.gold }]]} />
      <Copy x={66} y={1000} size={34} color={RC.muted} p={W.at(52, 70)} ex={W.ex()} width={520}
        lines={[[{ t: "Another business" }], [{ t: "becomes the " }, { t: "easier destination.", c: RC.gold }]]} />
    </AbsoluteFill>
  );
};

// ===========================================================================
const Scene4: React.FC<{ f: number }> = ({ f }) => {
  const s = RSC.s4.start, e = RSC.s4.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const draw = W.at(30, 98);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        {/* abandoned dashed path up to the competitor, cut by an X */}
        <RoutePath points={[{ x: 340, y: 1050 }, { x: 500, y: 940 }, { x: 660, y: 820 }]} draw={W.at(20, 40)} dashed color={RC.gray} />
        <g opacity={W.at(26, 44)}><circle cx={492} cy={946} r={18} fill={RC.char} stroke={RC.gray} strokeWidth={2.2} /><line x1={484} y1={938} x2={500} y2={954} stroke={RC.gray} strokeWidth={2.6} strokeLinecap="round" /><line x1={500} y1={938} x2={484} y2={954} stroke={RC.gray} strokeWidth={2.6} strokeLinecap="round" /></g>
        {/* rerouted cyan path down to your business, with two check nodes */}
        <RoutePath points={route4} draw={draw} chevrons={3} />
        <RouteHead points={route4} draw={draw} />
        {[[330, 1070], [300, 1250]].map(([cx, cy], i) => (
          <g key={i} opacity={clamp((draw - (i === 0 ? 0.18 : 0.42)) * 6)} style={{ mixBlendMode: "screen" }}>
            <circle cx={cx} cy={cy} r={22} fill="rgba(40,171,242,0.9)" style={{ filter: "drop-shadow(0 0 8px rgba(40,171,242,0.7))" }} />
            <path d={`M${cx - 8} ${cy} L${cx - 2} ${cy + 6} L${cx + 9} ${cy - 7}`} fill="none" stroke={RC.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      <Brand y={54} reveal={W.at(4, 22)} mark={false} underline />
      <Headline x={64} y={140} size={90} p={W.p()} ex={W.ex()} lines={[[{ t: "But you don’t" }], [{ t: "have to move." }], [{ t: "The road can move.", c: RC.gold }]]} />
      <Copy x={66} y={620} size={34} color={RC.cream} p={W.at(28, 48)} ex={W.ex()} width={520}
        lines={[[{ t: "Fix the information, visibility and" }], [{ t: "trust signals customers rely on—" }], [{ t: "and the path can start " }, { t: "leading", c: RC.gold }], [{ t: "back to you.", c: RC.gold }]]} />
    </AbsoluteFill>
  );
};

// ===========================================================================
const Scene5: React.FC<{ f: number }> = ({ f }) => {
  const s = RSC.s5.start, e = RSC.s5.end;
  const W = win(f, s, e, true);
  if (!W.live) return null;
  const draw = W.at(30, 92);
  const steps: [string, "search" | "scales" | "check"][] = [["SEARCHING.", "search"], ["COMPARING.", "scales"], ["DECIDING.", "check"]];
  const tag: [string, string][] = [["GET FOUND.", RC.gold], ["LOOK PROFESSIONAL.", RC.white], ["GROW ONLINE.", RC.gold]];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <RoutePath points={route5} draw={draw} chevrons={4} />
        <RouteHead points={route5} draw={draw} color={RC.goldHi} size={18} />
        {/* arrival glow at the business door */}
        <circle cx={796} cy={1030} r={40 * clamp((draw - 0.85) * 6)} fill="rgba(231,169,58,0.35)" style={{ filter: "blur(10px)", mixBlendMode: "screen" }} />
        {/* left decision list connector */}
        <line x1={110} y1={770} x2={110} y2={1074} stroke={RC.cyan} strokeWidth={2.4} opacity={W.at(40, 60) * 0.8} />
        {steps.map((_, i) => (
          <g key={i}><circle cx={110} cy={782 + i * 146} r={9} fill={RC.cyan} opacity={W.at(42 + i * 8, 58 + i * 8)} style={{ filter: "drop-shadow(0 0 6px rgba(40,171,242,0.7))" }} /></g>
        ))}
      </svg>
      {steps.map(([t], i) => (
        <div key={i} style={{ position: "absolute", left: 176, top: 752 + i * 146, fontFamily: RF.head, fontWeight: 800, fontSize: 54, letterSpacing: -0.5, color: RC.cream, opacity: ip(f, s + 44 + i * 8, s + 60 + i * 8, 0, 1) }}>{t}</div>
      ))}
      <Brand y={60} reveal={W.at(4, 24)} underline />
      <Headline x={64} y={210} size={96} p={W.p()} ex={0} lines={[[{ t: "Route the traffic" }], [{ t: "to your ", c: RC.cream }, { t: "door.", c: RC.gold }]]} />
      <Copy x={66} y={560} size={32} color={RC.muted} p={W.at(28, 48)} width={560} lines={["OmniFlow Digital helps your business", "show up where customers are already:"]} />
      <Divider x={66} y={1660} w={984} reveal={W.at(64, 80)} />
      <div style={{ position: "absolute", left: 66, top: 1686, display: "flex", alignItems: "center", gap: 18, opacity: W.at(66, 84) }}>
        {tag.map(([t, c], i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 2, height: 26, background: RC.grayDim }} />}
            <span style={{ fontFamily: RF.head, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: c }}>{t}</span>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const RouteTheTraffic: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("route-fonts"));
  React.useEffect(() => { initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle)); }, [handle]);
  const b = bizAt(f), c = compAt(f), cu = custAt(f);
  const custReveal = ip(f, 8, 40, 0, 1);
  const compLabel = f < RSC.s2.start - 10 ? ["YOUR", "COMPETITOR"] : ["ANOTHER", "BUSINESS"];
  // business sublabel changes by state across the scenes
  const bizSub = f < RSC.s2.start ? undefined : f < RSC.s3.start ? "UNCONNECTED" : f < RSC.s4.start ? "UNCLEAR · BYPASSED" : "CLEAR · SELECTED";
  const compSub = f < RSC.s3.start ? undefined : f < RSC.s4.start ? "CLEAR · CHOSEN" : undefined;
  return (
    <AbsoluteFill style={{ background: RC.black }}>
      <BackgroundTexture driftX={Math.sin(f * 0.008) * 8} driftY={Math.cos(f * 0.006) * 6} />
      {/* persistent destinations + customer sit above the map, below text */}
      <CustomerMarker x={cu.x} y={cu.y} f={f} reveal={custReveal} />
      <BizCard x={c.x} y={c.y} act={c.act} scale={c.scale} reveal={c.reveal} dashed={c.act < 0.4} label={compLabel} sub={compSub} />
      <BizCard x={b.x} y={b.y} act={b.act} scale={b.scale} label={["YOUR", "BUSINESS"]} sub={bizSub} dashed={b.act < 0.4} />
      <Scene1 f={f} />
      <Scene2 f={f} />
      <Scene3 f={f} />
      <Scene4 f={f} />
      <Scene5 f={f} />
    </AbsoluteFill>
  );
};
