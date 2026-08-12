import React from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "../styles/fonts";
import { C, F, SC } from "./theme";
import { MapGrid } from "./MapGrid";
import { CrownHardware, Competitor, Interchange } from "./vectors";
import { Headline, Copy } from "./text";
import {
  Brand,
  Pin,
  Route,
  Packet,
  RouteArrow,
  Divider,
  CircleIcon,
  BrokenX,
  ip,
  kf,
  clamp,
} from "./primitives";
import { Pt, smoothPath } from "../utils/routeGeometry";

// ===========================================================================
// Persistent-element state — ONE Crown Hardware + ONE map camera as continuous
// functions of frame. They hold during reads and move during transitions.
// ===========================================================================
const CF = [0, 56, 104, 139, 218, 259, 338, 379, 458, 505, 570, 599];
const c1 = { x: 712, y: 1892, s: 1.5, act: 0.9, tools: 1 };
const c2 = { x: 858, y: 1852, s: 0.7, act: 0.5, tools: 0 };
const c3 = { x: 182, y: 1762, s: 0.62, act: 0.12, tools: 0 };
const c4 = { x: 645, y: 1246, s: 0.52, act: 0.12, tools: 0 };
const c5 = { x: 736, y: 1668, s: 1.16, act: 1, tools: 0 };
const dupe = (a: number, b: number, c: number, d: number, e: number) => [a, a, a, b, b, c, c, d, d, e, e, e];
const CX = dupe(c1.x, c2.x, c3.x, c4.x, c5.x);
const CY = [c1.y + 28, c1.y, c1.y, c2.y, c2.y, c3.y, c3.y, c4.y, c4.y, c5.y, c5.y, c5.y];
const CS = [c1.s * 0.94, c1.s, c1.s, c2.s, c2.s, c3.s, c3.s, c4.s, c4.s, c5.s, c5.s, c5.s];
const CA = dupe(c1.act, c2.act, c3.act, c4.act, c5.act);
const CT = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function crownAt(f: number) {
  return {
    x: kf(f, CF, CX),
    y: kf(f, CF, CY),
    s: kf(f, CF, CS),
    act: kf(f, CF, CA),
    tools: kf(f, CF, CT),
  };
}
const MF = [0, 120, 240, 360, 480, 599];
function mapAt(f: number) {
  return {
    x: kf(f, MF, [0, -18, 12, -10, 2, -14]),
    y: kf(f, MF, [0, 10, -6, 8, -4, 8]),
    scale: kf(f, MF, [1.0, 1.04, 1.08, 1.06, 1.03, 1.07]),
    rot: kf(f, MF, [0, -1, 0.4, -0.6, 0.3, -0.5]),
  };
}

// Per-scene entrance / exit helpers. Windows deliberately CROSS the scene
// boundary: the incoming scene begins entering a few frames before its start
// while the outgoing scene lingers a few frames past its end, so one slides in
// as the other slides out — never a dead gap, never a slide cut.
function win(f: number, s: number, e: number) {
  return {
    p: (a = -6, b = 30) => ip(f, s + a, s + b, 0, 1),
    ex: (a = 6, b = 16) => ip(f, e - a, e + b, 0, 1),
    draw: (a: number, b: number) => ip(f, s + a, s + b, 0, 1),
    live: f >= s - 26 && f <= e + 18,
    fade: ip(f, e - 2, e + 15, 1, 0),
  };
}

// ===========================================================================
// SCENE 1 — Has your business felt quieter lately?
// ===========================================================================
const Scene1: React.FC<{ f: number }> = ({ f }) => {
  const s = SC.s1.start, e = SC.s1.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const p = W.p(), ex = W.ex();
  return (
    <AbsoluteFill>
      {/* interchange upper-right, flowing all the way down into the store */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        <Interchange draw={W.draw(14, 50)} />
        <Route points={route1} draw={W.draw(40, 100)} core={8} glow={26} radius={30} />
        <Packet points={route1} t={((f - s) / 64) % 1} size={9} maxDraw={W.draw(40, 100)} />
        {[0.3, 0.72].map((b, i) => (
          <RouteArrow key={i} points={route1} t={((f - s) / 52 + b) % 1} size={13} opacity={clamp(W.draw(40, 100)) * 0.9} />
        ))}
      </svg>
      <Headline
        x={58}
        y={190}
        size={128}
        weight={800}
        lh={0.92}
        p={p}
        ex={ex}
        dir={{ x: -40, y: -70 }}
        lines={[{ parts: [{ t: "Has your" }] }, { parts: [{ t: "business" }] }, { parts: [{ t: "felt quieter" }] }, { parts: [{ t: "lately?" }] }]}
      />
      {/* bullets */}
      <div style={{ opacity: 1 - clamp(ex * 1.1), transform: `translateY(${ex * -40}px)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(96 866)" opacity={ip(f, s + 42, s + 60, 0, 1)}>
            <CircleIcon x={0} y={0} kind="people" r={26} color={C.gold} reveal={ip(f, s + 42, s + 60, 0, 1)} />
          </g>
          <g transform="translate(96 1000)" opacity={ip(f, s + 52, s + 70, 0, 1)}>
            <CircleIcon x={0} y={0} kind="search" r={26} color={C.gold} reveal={ip(f, s + 52, s + 70, 0, 1)} />
          </g>
          <g transform="translate(96 1300)" opacity={ip(f, s + 72, s + 90, 0, 1)}>
            <CircleIcon x={0} y={0} kind="bars" r={26} color={C.gold} reveal={ip(f, s + 72, s + 90, 0, 1)} />
          </g>
        </svg>
        <Copy x={148} y={838} size={30} p={W.draw(42, 60)} lines={[[{ t: "People may still need", color: C.white }], "exactly what you sell."]} />
        <Copy x={148} y={968} size={30} p={W.draw(52, 72)} lines={[[{ t: "The problem might not", color: C.white }], [{ t: "be demand.", color: C.white }], "It might be where", "customers are looking first."]} />
        <Divider x={58} y={1220} w={180} reveal={W.draw(64, 80)} />
        <div style={{ position: "absolute", left: 148, top: 1266, opacity: W.draw(72, 92) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.white, lineHeight: 1 }}>
            There is still
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.gold, lineHeight: 1.05 }}>traffic.</div>
          <div style={{ fontFamily: F.body, fontSize: 28, color: C.muted, marginTop: 8, lineHeight: 1.3 }}>
            It just may not be
            <br />
            reaching you.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 1 — highway flows out of the interchange down the right side into the
// Crown Hardware storefront (bottom-right).
const route1: Pt[] = [
  { x: 866, y: 548 }, { x: 912, y: 700 }, { x: 842, y: 884 }, { x: 916, y: 1064 },
  { x: 832, y: 1236 }, { x: 760, y: 1352 }, { x: 714, y: 1400 },
];

// ===========================================================================
// SCENE 2 — A new highway got built.  (editorial serif)
// ===========================================================================
const route2: Pt[] = [
  { x: 890, y: 1620 }, { x: 800, y: 1440 }, { x: 880, y: 1240 }, { x: 815, y: 1050 },
  { x: 885, y: 860 }, { x: 810, y: 620 }, { x: 880, y: 430 }, { x: 835, y: 200 },
];
const pins2 = [route2[7], route2[5], route2[3], route2[1]];
const Scene2: React.FC<{ f: number }> = ({ f }) => {
  const s = SC.s2.start, e = SC.s2.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const p = W.p(), ex = W.ex();
  const draw = W.draw(44, 100);
  const journey: [string, "search" | "pin" | "reviews" | "www"][] = [["Search", "search"], ["Maps", "pin"], ["Reviews", "reviews"], ["Websites", "www"]];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        <Route points={route2} draw={draw} core={6} glow={22} />
        <Packet points={route2} t={((f - s) / 60) % 1} size={9} maxDraw={draw} />
        {pins2.map((pn, i) => {
          const anchor = [0.86, 0.62, 0.36, 0.12][i];
          return <Pin key={i} x={pn.x} y={pn.y - 8} size={30} color={C.gold} reveal={ip(f, s + 44 + (1 - anchor) * 46, s + 60 + (1 - anchor) * 46, 0, 1)} />;
        })}
      </svg>
      <Headline
        x={58}
        y={150}
        size={104}
        font={F.serif}
        weight={700}
        lh={0.98}
        tracking={-1}
        p={p}
        ex={ex}
        dir={{ x: -30, y: -70 }}
        lines={[{ parts: [{ t: "A new" }] }, { parts: [{ t: "highway" }] }, { parts: [{ t: "got built." }] }]}
      />
      <div style={{ opacity: 1 - clamp(ex * 1.1), transform: `translateY(${ex * -36}px)` }}>
        <Divider x={58} y={620} w={200} dots reveal={W.draw(30, 46)} />
        <Copy x={58} y={648} size={30} p={W.draw(34, 54)} lines={["And it starts when", "someone searches for", "a business nearby."]} />
        {/* journey icons */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {journey.map(([, kind], i) => {
            const rv = ip(f, s + 44 + i * 10, s + 62 + i * 10, 0, 1);
            const cx = 104 + i * 148;
            return (
              <g key={i}>
                {i < 3 && <line x1={cx + 40} y1={930} x2={cx + 108} y2={930} stroke={C.gold} strokeWidth={2} opacity={ip(f, s + 50 + i * 10, s + 64 + i * 10, 0, 0.9)} />}
                <CircleIcon x={cx} y={930} kind={kind} r={38} color={C.cyan} reveal={rv} />
              </g>
            );
          })}
        </svg>
        {journey.map(([label], i) => (
          <div key={i} style={{ position: "absolute", left: 104 + i * 148 - 60, top: 986, width: 120, textAlign: "center", fontFamily: F.body, fontSize: 24, color: C.white, opacity: ip(f, s + 54 + i * 10, s + 70 + i * 10, 0, 1) }}>
            {label}
          </div>
        ))}
        <Divider x={58} y={1120} w={200} reveal={W.draw(60, 74)} />
        <Copy x={58} y={1160} size={34} color={C.white} weight={500} p={W.draw(64, 84)} lines={["That’s where many", "customers begin deciding", "where to go."]} />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 3 — If you're not on that road, they pass you.
// ===========================================================================
const route3: Pt[] = [
  { x: 770, y: 1820 }, { x: 630, y: 1560 }, { x: 820, y: 1360 }, { x: 660, y: 1150 },
  { x: 845, y: 960 }, { x: 690, y: 770 }, { x: 825, y: 560 }, { x: 720, y: 340 }, { x: 800, y: 120 },
];
const cards3: { label: string; y: number; anchor: number }[] = [
  { label: "TOP RESULT", y: 250, anchor: 0.86 },
  { label: "LOCAL PICK", y: 520, anchor: 0.63 },
  { label: "NEAR YOU", y: 850, anchor: 0.4 },
  { label: "BEST MATCH", y: 1230, anchor: 0.14 },
];
const Scene3: React.FC<{ f: number }> = ({ f }) => {
  const s = SC.s3.start, e = SC.s3.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const p = W.p(), ex = W.ex();
  const draw = W.draw(20, 70);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        {/* bright wide highway ribbon */}
        <Route points={route3} draw={draw} core={26} glow={64} radius={46} />
        <path d={smoothPath(route3, 46)} fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={`${0.01} ${0.018}`} opacity={0.6 * clamp(draw * 1.4)} />
        {[0.15, 0.4, 0.65, 0.9].map((b, i) => (
          <RouteArrow key={i} points={route3} t={((f - s) / 55 + b) % 1} size={18} opacity={clamp(draw) * 0.95} />
        ))}
        {/* big destination arrowhead at the top of the highway */}
        <g opacity={clamp((draw - 0.85) * 6)}>
          <path d={`M ${route3[route3.length - 1].x - 26} ${route3[route3.length - 1].y + 34} L ${route3[route3.length - 1].x} ${route3[route3.length - 1].y - 8} L ${route3[route3.length - 1].x + 26} ${route3[route3.length - 1].y + 34}`} fill="none" stroke={C.cyanHi} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* gold pins + dashed connectors to each result card */}
        {cards3.map((c, i) => {
          const rv = ip(f, s + 30 + (1 - c.anchor) * 40, s + 46 + (1 - c.anchor) * 40, 0, 1);
          return (
            <g key={i}>
              <line x1={812} y1={c.y} x2={846} y2={c.y} stroke={C.gold} strokeWidth={1.6} strokeDasharray="3 5" opacity={rv * 0.8} />
              <Pin x={838} y={c.y - 6} size={26} color={C.gold} reveal={rv} />
            </g>
          );
        })}
        {/* gray failed branch to dead crown bottom-left */}
        <Route points={[{ x: 470, y: 1560 }, { x: 360, y: 1650 }, { x: 250, y: 1680 }]} draw={W.draw(60, 78)} dead />
        <BrokenX x={470} y={1560} r={20} reveal={W.draw(64, 80)} />
      </svg>
      {/* result cards */}
      {cards3.map((c, i) => {
        const rv = ip(f, s + 30 + (1 - c.anchor) * 40, s + 46 + (1 - c.anchor) * 40, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: 856, top: c.y - 34, opacity: clamp(rv * 1.2) * W.fade, transform: `translateX(${(1 - rv) * 18}px)` }}>
            <div style={{ border: `2px solid ${C.gold}`, borderRadius: 8, padding: "8px 14px", background: "rgba(7,18,30,0.85)" }}>
              <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 20, letterSpacing: 1.5, color: C.gold }}>{c.label}</div>
              <div style={{ color: C.gold, fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
            </div>
          </div>
        );
      })}
      <Headline
        x={58}
        y={150}
        size={112}
        weight={800}
        lh={0.9}
        p={p}
        ex={ex}
        dir={{ x: -40, y: -70 }}
        lines={[
          { parts: [{ t: "If you’re" }] },
          { parts: [{ t: "not on" }] },
          { parts: [{ t: "that " }, { t: "road,", color: C.cyan }] },
          { parts: [{ t: "they pass" }] },
          { parts: [{ t: "you" }, { t: ".", color: C.cyan }] },
        ]}
      />
      <div style={{ opacity: 1 - clamp(ex * 1.1), transform: `translateY(${ex * -40}px)` }}>
        <Copy x={58} y={840} size={30} p={W.draw(40, 58)} lines={["Often before they ever", "compare your business."]} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {["No click.", "No call.", "No direction request."].map((_, i) => (
            <g key={i} transform={`translate(80 ${966 + i * 58})`} opacity={ip(f, s + 54 + i * 8, s + 68 + i * 8, 0, 1)}>
              <line x1={-10} y1={-10} x2={10} y2={10} stroke={C.gold} strokeWidth={3} strokeLinecap="round" />
              <line x1={10} y1={-10} x2={-10} y2={10} stroke={C.gold} strokeWidth={3} strokeLinecap="round" />
            </g>
          ))}
        </svg>
        {["No click.", "No call.", "No direction request."].map((t, i) => (
          <div key={i} style={{ position: "absolute", left: 112, top: 942 + i * 58, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white, opacity: ip(f, s + 54 + i * 8, s + 70 + i * 8, 0, 1) }}>
            {t}
          </div>
        ))}
        <Copy x={58} y={1150} size={30} p={W.draw(70, 86)} lines={["They simply reach an", "easier-to-find option first."]} />
        <div style={{ position: "absolute", left: 58, top: 1250, opacity: W.draw(80, 96) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.gold, lineHeight: 1.02 }}>
            Visibility happens
            <br />
            before comparison.
          </div>
          <Divider x={0} y={92} w={300 * W.draw(88, 100)} thick={4} reveal={1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 4 — If your info is incomplete, you get bypassed.  (HIGHEST PRIORITY)
// ===========================================================================
const route4: Pt[] = [{ x: 178, y: 1120 }, { x: 340, y: 1010 }, { x: 520, y: 940 }, { x: 650, y: 830 }, { x: 715, y: 720 }];
const dead4: Pt[] = [{ x: 210, y: 1170 }, { x: 360, y: 1215 }, { x: 452, y: 1210 }];
const Scene4: React.FC<{ f: number }> = ({ f }) => {
  const s = SC.s4.start, e = SC.s4.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const p = W.p(), ex = W.ex();
  const activeDraw = W.draw(24, 90);
  const compReveal = ip(f, s + 46, s + 66, 0, 1);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        {/* active cyan route: customer -> competitor */}
        <Route points={route4} draw={activeDraw} core={7} glow={24} radius={30} />
        {[0.25, 0.6, 0.92].map((b, i) => (
          <RouteArrow key={i} points={route4} t={((f - s) / 46 + b) % 1} size={13} opacity={clamp(activeDraw) * 0.95} />
        ))}
        {/* failed gray dashed route: customer -> crown, stops at X */}
        <Route points={dead4} draw={W.draw(28, 44)} dead />
        <BrokenX x={492} y={1208} r={20} reveal={W.draw(40, 54)} />
        {/* customer search node */}
        <g opacity={ip(f, s + 16, s + 34, 0, 1)}>
          <circle cx={150} cy={1090} r={44 + Math.sin((f - s) * 0.16) * 3} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.4} />
          <circle cx={150} cy={1090} r={30} fill="rgba(17,207,255,0.12)" stroke={C.cyan} strokeWidth={2.4} />
          <g transform="translate(150 1090)" stroke={C.cyanHi} strokeWidth={2.4} fill="none" strokeLinecap="round">
            <circle cx={-3} cy={-3} r={8} />
            <line x1={3} y1={3} x2={10} y2={10} />
          </g>
          <ellipse cx={150} cy={1128} rx={40} ry={7} fill="none" stroke={C.cyan} strokeWidth={1.5} opacity={0.35} />
        </g>
      </svg>
      {/* customer label */}
      <div style={{ position: "absolute", left: 78, top: 1150, opacity: ip(f, s + 22, s + 40, 0, 1) * W.fade }}>
        <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: C.white, lineHeight: 1.1 }}>
          CUSTOMER
          <br />
          SEARCHES
        </div>
      </div>
      {/* competitor storefront + block */}
      <Competitor x={840} y={760} scale={0.92} reveal={compReveal} />
      <div style={{ position: "absolute", left: 726, top: 800, opacity: clamp(compReveal * 1.2) * W.fade }}>
        <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.white, letterSpacing: 0.5 }}>YOUR COMPETITOR</div>
        <Divider x={0} y={40} w={220} reveal={compReveal} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        {["Gets the call.", "Gets the visit.", "Gets the customer."].map((_, i) => (
          <g key={i} transform={`translate(748 ${900 + i * 52})`} opacity={ip(f, s + 58 + i * 8, s + 72 + i * 8, 0, 1)}>
            <circle cx={0} cy={0} r={15} fill="none" stroke={C.gold} strokeWidth={2} />
            <path d="M-6 0 L -2 5 L 7 -6" fill="none" stroke={C.gold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      {["Gets the call.", "Gets the visit.", "Gets the customer."].map((t, i) => (
        <div key={i} style={{ position: "absolute", left: 776, top: 884 + i * 52, fontFamily: F.body, fontSize: 27, color: C.white, opacity: ip(f, s + 58 + i * 8, s + 74 + i * 8, 0, 1) * W.fade }}>
          {t}
        </div>
      ))}
      <Copy x={540} y={1258} size={24} color={C.muted} p={W.draw(52, 70)} lines={["Missing or incomplete", "information stops", "customers from", "finding you."]} />
      {/* headline + body */}
      <Headline
        x={58}
        y={140}
        size={86}
        font={F.serif}
        weight={700}
        lh={1.0}
        tracking={-1}
        p={p}
        ex={ex}
        dir={{ x: -30, y: -60 }}
        lines={[{ parts: [{ t: "If your info is" }] }, { parts: [{ t: "incomplete," }] }, { parts: [{ t: "you get " }, { t: "bypassed.", color: C.gold }] }]}
      />
      <div style={{ opacity: 1 - clamp(ex * 1.1), transform: `translateY(${ex * -34}px)` }}>
        <Copy x={58} y={476} size={27} p={W.draw(34, 52)} lines={[[{ t: "When customers search, they follow the clearest", color: C.white }], "path to a business they can trust."]} />
        <Copy x={58} y={560} size={27} p={W.draw(40, 58)} lines={["If your information is missing or outdated,", "they get sent somewhere else."]} />
        <div style={{ position: "absolute", left: 58, top: 654, fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.gold, opacity: W.draw(46, 64) }}>
          Visibility starts with complete information.
        </div>
      </div>
      {/* incomplete information card bottom-right */}
      <InfoCard reveal={W.draw(58, 76)} fade={W.fade} f={f} s={s} />
    </AbsoluteFill>
  );
};

const InfoCard: React.FC<{ reveal: number; fade: number; f: number; s: number }> = ({ reveal, fade, f, s }) => {
  const ty = (1 - clamp(reveal)) * 18;
  const rows: [string, string][] = [["Hours", "Missing"], ["Location", "Incomplete"], ["Phone", "Missing"]];
  const icons: ("clock" | "pin" | "phone")[] = ["clock", "pin", "phone"];
  return (
    <div style={{ position: "absolute", left: 556, top: 1398, width: 462, opacity: clamp(reveal * 1.2) * fade, transform: `translateY(${ty}px)` }}>
      <div style={{ border: `1.5px solid ${C.grayDark}`, borderRadius: 12, background: "rgba(5,12,21,0.9)", padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <svg width={34} height={34} viewBox="-16 -16 32 32">
            <path d="M0 -11 L12 10 H-12 Z" fill="none" stroke={C.gold} strokeWidth={2.2} strokeLinejoin="round" />
            <line x1={0} y1={-4} x2={0} y2={3} stroke={C.gold} strokeWidth={2.2} strokeLinecap="round" />
            <circle cx={0} cy={6.5} r={1.2} fill={C.gold} />
          </svg>
          <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 22, letterSpacing: 1.5, color: C.gold }}>INCOMPLETE INFORMATION</span>
        </div>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: i > 0 ? `1px solid ${C.navy}` : "none", opacity: ip(f, s + 62 + i * 6, s + 76 + i * 6, 0, 1) }}>
            <svg width={26} height={26} viewBox="-14 -14 28 28" stroke={C.gray} strokeWidth={2} fill="none" strokeLinecap="round">
              {icons[i] === "clock" && (<><circle cx={0} cy={0} r={9} /><path d="M0 -5 V0 L4 3" /></>)}
              {icons[i] === "pin" && (<><path d="M0 10 C -7 1, -6 -9, 0 -9 C 6 -9, 7 1, 0 10 Z" /><circle cx={0} cy={-2} r={2.6} /></>)}
              {icons[i] === "phone" && <path d="M-7 -9 C -9 -2, 2 9, 9 7 L 6 2 L 1 3 C -2 1, -4 -2, -3 -5 L -4 -9 Z" />}
            </svg>
            <span style={{ fontFamily: F.body, fontSize: 24, color: C.white }}>{k}</span>
            <span style={{ marginLeft: "auto", fontFamily: F.body, fontWeight: 600, fontSize: 24, color: C.red }}>— {v}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.navy}`, opacity: ip(f, s + 82, s + 96, 0, 1) }}>
          <svg width={30} height={30} viewBox="-14 -14 28 28" stroke={C.gray} strokeWidth={2} fill="none">
            <rect x={-7} y={-1} width={14} height={10} rx={1.6} />
            <path d="M-4 -1 V-5 A4 4 0 0 1 4 -5 V-1" />
          </svg>
          <span style={{ fontFamily: F.body, fontSize: 23, color: C.muted, lineHeight: 1.25 }}>
            Customers can’t reach
            <br />
            what they can’t find.
          </span>
        </div>
      </div>
    </div>
  );
};

// ===========================================================================
// SCENE 5 — Get on the road that's moving.  (solution / payoff, serif)
// ===========================================================================
const route5: Pt[] = [
  { x: 560, y: 200 }, { x: 650, y: 360 }, { x: 585, y: 540 }, { x: 700, y: 690 },
  { x: 610, y: 900 }, { x: 690, y: 1110 }, { x: 700, y: 1150 },
];
const prongL: Pt[] = [{ x: 700, y: 1150 }, { x: 590, y: 1208 }, { x: 624, y: 1286 }, { x: 718, y: 1282 }];
const prongR: Pt[] = [{ x: 700, y: 1150 }, { x: 810, y: 1208 }, { x: 784, y: 1286 }, { x: 718, y: 1282 }];
const labels5: { t: string; y: number; anchor: number }[] = [
  { t: "SEARCHING", y: 250, anchor: 0.9 },
  { t: "COMPARING", y: 620, anchor: 0.58 },
  { t: "DECIDING", y: 1010, anchor: 0.28 },
];
const Scene5: React.FC<{ f: number }> = ({ f }) => {
  const s = SC.s5.start, e = SC.s5.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const p = W.p(), ex = 0; // final scene holds — never slides out
  const draw = W.draw(20, 90);
  const tagline: [string, "search" | "person" | "bars"][] = [["Get Found.", "search"], ["Look Professional.", "person"], ["Grow Online.", "bars"]];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
        <Route points={route5} draw={draw} core={11} glow={32} radius={34} />
        <Route points={prongL} draw={W.draw(46, 84)} core={10} glow={28} radius={30} />
        <Route points={prongR} draw={W.draw(46, 84)} core={10} glow={28} radius={30} />
        <Packet points={route5} t={((f - s) / 66) % 1} size={10} maxDraw={draw} />
        <Packet points={prongL} t={((f - s) / 60) % 1} size={8} maxDraw={W.draw(46, 84)} opacity={0.85} />
        <Packet points={prongR} t={((f - s) / 60 + 0.3) % 1} size={8} maxDraw={W.draw(46, 84)} opacity={0.85} />
        {/* final down-arrow into the crown storefront */}
        <g opacity={clamp((W.draw(46, 84) - 0.7) * 4)}>
          <path d="M696 1272 L718 1306 L740 1272" fill="none" stroke={C.cyanHi} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* gray decision branches */}
        {labels5.map((l, i) => {
          const rv = ip(f, s + 30 + (1 - l.anchor) * 40, s + 46 + (1 - l.anchor) * 40, 0, 1);
          const anchorPt = { x: [640, 690, 700][i], y: [360, 690, 1120][i] };
          return (
            <g key={i} opacity={rv}>
              <path d={`M${anchorPt.x} ${anchorPt.y} L ${866} ${l.y}`} stroke={C.grayDark} strokeWidth={2} strokeDasharray="3 8" fill="none" />
              <circle cx={anchorPt.x} cy={anchorPt.y} r={5} fill={C.gray} />
              <circle cx={866} cy={l.y} r={4} fill="none" stroke={C.gray} strokeWidth={1.6} />
            </g>
          );
        })}
      </svg>
      {labels5.map((l, i) => (
        <div key={i} style={{ position: "absolute", left: 880, top: l.y - 13, fontFamily: F.ui, fontWeight: 500, fontSize: 20, letterSpacing: 2, color: C.gray, opacity: ip(f, s + 34 + (1 - l.anchor) * 40, s + 50 + (1 - l.anchor) * 40, 0, 1) * W.fade }}>
          {l.t}
        </div>
      ))}
      <Headline
        x={58}
        y={150}
        size={102}
        font={F.serif}
        weight={700}
        lh={0.98}
        tracking={-1}
        p={p}
        ex={ex}
        dir={{ x: -30, y: -60 }}
        lines={[{ parts: [{ t: "Get on" }] }, { parts: [{ t: "the road" }] }, { parts: [{ t: "that’s" }] }, { parts: [{ t: "moving.", color: C.gold }] }]}
      />
      <div style={{ opacity: 1 - clamp(ex * 1.1), transform: `translateY(${ex * -34}px)` }}>
        <Divider x={58} y={700} w={150} reveal={W.draw(28, 42)} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <CircleIcon x={92} y={790} kind="trend" r={26} color={C.gold} reveal={ip(f, s + 34, s + 52, 0, 1)} />
          <CircleIcon x={92} y={940} kind="search" r={26} color={C.gold} reveal={ip(f, s + 46, s + 64, 0, 1)} />
          <CircleIcon x={92} y={1120} kind="target" r={26} color={C.gold} reveal={ip(f, s + 58, s + 76, 0, 1)} />
        </svg>
        <Copy x={142} y={764} size={30} p={W.draw(34, 52)} lines={[[{ t: "You don’t need", color: C.white }], [{ t: "more traffic", color: C.white }, { t: " to exist." }]]} />
        <Copy x={142} y={912} size={30} p={W.draw(46, 64)} lines={[[{ t: "You need the", color: C.white }], [{ t: "existing traffic", color: C.white }, { t: " to" }], [{ t: "find you.", color: C.gold }]]} />
        <Copy x={142} y={1094} size={28} width={430} p={W.draw(58, 78)} lines={[[{ t: "OmniFlow Digital", color: C.white }], "helps your business", "show up where local", "customers are already", "searching, comparing", "and deciding."]} />
        {/* tagline row — kept inside the safe zone so it never clips off */}
        <Divider x={58} y={1686} w={964} reveal={W.draw(54, 70)} thick={2} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {tagline.map(([, kind], i) => (
            <CircleIcon key={i} x={86 + i * 338} y={1718} kind={kind} r={18} color={C.gold} reveal={ip(f, s + 58 + i * 6, s + 74 + i * 6, 0, 1)} />
          ))}
          {[1, 2].map((i) => (
            <line key={i} x1={58 + i * 338 - 20} y1={1702} x2={58 + i * 338 - 20} y2={1734} stroke={C.grayDark} strokeWidth={1.5} opacity={ip(f, s + 60, s + 76, 0, 0.8)} />
          ))}
        </svg>
        {tagline.map(([t], i) => (
          <div key={i} style={{ position: "absolute", left: 116 + i * 338, top: 1705, fontFamily: F.sans, fontWeight: 700, fontSize: 24, color: C.white, opacity: ip(f, s + 60 + i * 6, s + 76 + i * 6, 0, 1) * W.fade }}>
            {t}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Root composition — persistent map + crown + brand, five scenes over them.
// ===========================================================================
export const LocalSearchExpressway: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("expressway-fonts"));
  React.useEffect(() => {
    initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const cam = mapAt(f);
  const cr = crownAt(f);
  const brandUnderline = f >= SC.s3.start;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <MapGrid x={cam.x} y={cam.y} scale={cam.scale} rot={cam.rot} />
      {/* persistent Crown Hardware, above map, below text */}
      <CrownHardware x={cr.x} y={cr.y} scale={cr.s} act={cr.act} tools={cr.tools} />
      <Scene1 f={f} />
      <Scene2 f={f} />
      <Scene3 f={f} />
      <Scene4 f={f} />
      <Scene5 f={f} />
      <Brand x={54} y={54} size={30} underline={brandUnderline} reveal={ip(f, 8, 32, 0, 1)} />
    </AbsoluteFill>
  );
};
