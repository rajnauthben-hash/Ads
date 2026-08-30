import React from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "../styles/fonts";
import { C, SCN } from "./theme";
import {
  IsoCity, PhoneWithResults, Storefront, RoutePath, RoutePulse, TriangleSlots,
  Headline, Copy, Label, GoldDivider, Brand, NumberedSignal, CheckItem, StatementBox, CTAButton, ip, kf, clamp,
} from "./pieces";
import { Pt } from "../utils/routeGeometry";

// Entrances finish by ~s+46 so each scene is fully assembled at its match
// frame, then holds; incoming/outgoing overlap across boundaries (no slideshow).
function win(f: number, s: number, e: number, last = false) {
  return {
    p: (a = -6, b = 26) => ip(f, s + a, s + b, 0, 1),
    ex: (a = 6, b = 16) => (last ? 0 : ip(f, e - a, e + b, 0, 1)),
    at: (a: number, b: number) => ip(f, s + a, s + b, 0, 1),
    live: f >= s - 26 && f <= e + 18,
    fade: last ? 1 : ip(f, e - 4, e + 12, 1, 0),
  };
}
const routeMap: Pt[] = [{ x: 120, y: 1360 }, { x: 300, y: 1250 }, { x: 360, y: 1420 }, { x: 520, y: 1480 }, { x: 640, y: 1410 }];

// ============================ SCENE 1 — HOOK ================================
const S1: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s1.start, e = SCN.s1.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const draw = W.at(6, 44);
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <RoutePath points={routeMap} draw={draw} />
          <RoutePulse points={routeMap} t={(f / 42) % 1} maxDraw={draw} />
        </svg>
        <Storefront x={600} y={1500} scale={0.82} lit={0.15} reveal={W.at(18, 38)} />
        <PhoneWithResults x={840} y={1020} scale={0.6} reveal={W.at(12, 34)} cards={[{ n: 1, lit: 1 }, { n: 2, lit: 1 }, { n: 3, lit: 1 }]} />
      </div>
      <Headline x={64} y={150} size={70} p={W.p()} ex={ex} lines={[[{ t: "Three slots on a phone" }], [{ t: "worth more than any frontage" }], [{ t: "in Port of Spain.", c: C.gold }]]} />
      <Label x={84} y={520} text="THE DECISION STARTS HERE." p={W.at(10, 26)} />
      <Copy x={84} y={566} size={28} color={C.muted} p={W.at(12, 30)} ex={ex} lines={["Your storefront can be open,", "visible and fully stocked—", "and still lose the decision", "before the customer arrives."]} />
      <GoldDivider x={84} y={772} w={280} reveal={W.at(20, 32)} />
      <Copy x={84} y={820} size={28} color={C.muted} p={W.at(22, 38)} ex={ex} lines={["Local buying often begins", "with a search. The first three", "results become the first", "businesses seen and considered."]} />
      <GoldDivider x={84} y={1560} w={520} reveal={W.at(30, 42)} />
      <Label x={84} y={1584} text="THE FIRST STREET IS THE SEARCH SCREEN." color={C.gold} size={24} p={W.at(32, 44)} />
      <Brand x={84} y={1670} size={44} center={false} p={W.at(34, 46)} />
      <Label x={84} y={1728} text="GET FOUND. LOOK PROFESSIONAL. GROW ONLINE." color={C.dim} size={18} p={W.at(36, 46)} />
    </AbsoluteFill>
  );
};

// ======================== SCENE 2 — COMPARISON =============================
const S2: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s2.start, e = SCN.s2.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <div style={{ position: "absolute", left: 540, top: 430, width: 2, height: 1180 * clamp(W.at(4, 22)), background: `linear-gradient(180deg, ${C.gold}, ${C.cyan})`, opacity: 0.7 }} />
        <Storefront x={280} y={1240} scale={0.92} lit={0.12} reveal={W.at(12, 32)} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <RoutePath points={[{ x: 60, y: 1360 }, { x: 200, y: 1300 }, { x: 300, y: 1400 }, { x: 440, y: 1460 }]} draw={W.at(10, 40)} />
        </svg>
        <PhoneWithResults x={820} y={1240} scale={0.5} reveal={W.at(14, 34)} cards={[{ n: 1, lit: 1 }, { n: 2, lit: 1 }, { n: 3, lit: 1 }]} tilt={-10} />
      </div>
      <Headline x={64} y={110} size={58} p={W.p()} ex={ex} lines={[[{ t: "You pay for physical frontage." }], [{ t: "They win with digital frontage.", c: C.gold }]]} />
      <Label x={70} y={432} text="PHYSICAL FRONTAGE" size={24} p={W.at(10, 26)} />
      <Copy x={70} y={480} size={27} color={C.muted} p={W.at(12, 30)} ex={ex} lines={["Built for people passing by.", "Paid rent. Fixed location.", "Limited to the street", "directly in front of you."]} />
      <Label x={610} y={432} text="DIGITAL FRONTAGE" color={C.gold} size={24} p={W.at(16, 30)} />
      <Copy x={610} y={480} size={27} color={C.muted} p={W.at(18, 34)} ex={ex} lines={["Shown at the moment of need.", "Visible across the local area.", "One tap from a call,", "a route or a decision."]} />
      <Copy x={110} y={1620} size={34} color={C.white} weight={600} p={W.at(28, 42)} ex={ex} width={860} lines={["The most visible storefront may now be", "the one inside the search results."]} />
      <Label x={70} y={1724} text="WHAT CUSTOMERS SEE FIRST SHAPES WHERE THEY GO." color={C.gold} size={18} p={W.at(34, 46)} />
    </AbsoluteFill>
  );
};

// ======================== SCENE 3 — MECHANISM =============================
const S3: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s3.start, e = SCN.s3.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const qc = Math.floor(ip(f, s + 12, s + 30, 0, 14));
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <RoutePath points={routeMap} draw={W.at(6, 44)} />
          <RoutePulse points={routeMap} t={(f / 42) % 1} maxDraw={W.at(6, 44)} />
        </svg>
        <Storefront x={600} y={1560} scale={0.8} lit={0.15} reveal={W.at(14, 34)} />
        <PhoneWithResults x={840} y={980} scale={0.6} reveal={W.at(12, 32)} query="service near me" queryChars={qc}
          cards={[{ n: 1, lit: W.at(24, 34) }, { n: 2, lit: W.at(30, 40) }, { n: 3, lit: W.at(36, 46) }]} />
      </div>
      <Headline x={64} y={150} size={68} p={W.p()} ex={ex} lines={[[{ t: "One local" }], [{ t: "search creates" }], [{ t: "three immediate", c: C.gold }], [{ t: "choices.", c: C.gold }]]} />
      <GoldDivider x={70} y={520} w={120} reveal={W.at(14, 28)} />
      <Copy x={70} y={556} size={28} color={C.muted} p={W.at(16, 32)} ex={ex} lines={["The customer types a few words.", "The map decides what appears first."]} />
      <NumberedSignal x={70} y={690} n={1} head="RELEVANCE" body={["Does the profile clearly match", "what the customer needs?"]} p={W.at(18, 34)} ex={ex} />
      <NumberedSignal x={70} y={870} n={2} head="DISTANCE" body={["Is the business close enough", "to become a practical option?"]} p={W.at(24, 40)} ex={ex} />
      <NumberedSignal x={70} y={1050} n={3} head="TRUST" body={["Are the hours, photos, services", "and reviews clear enough?"]} p={W.at(30, 44)} ex={ex} />
      <GoldDivider x={70} y={1250} w={120} reveal={W.at(36, 46)} />
      <Copy x={70} y={1286} size={30} color={C.white} weight={600} p={W.at(38, 46)} ex={ex} lines={["The system chooses what to show", "before the customer compares."]} />
      <Label x={70} y={1724} text="THREE POSITIONS. THE FIRST CHANCE TO BE CHOSEN." color={C.gold} size={19} p={W.at(40, 46)} />
    </AbsoluteFill>
  );
};

// ======================= SCENE 4 — CONSEQUENCE ============================
const S4: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s4.start, e = SCN.s4.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <PhoneWithResults x={840} y={880} scale={0.6} reveal={W.at(8, 28)}
          cards={[{ n: 1, lit: 1 }, { n: 2, lit: 1 }, { n: 3, lit: 1 }]} you={W.at(28, 44)} />
      </div>
      <Headline x={64} y={140} size={82} p={W.p()} ex={ex} lines={[[{ t: "Those" }], [{ t: "three are" }], [{ t: "seen ", c: C.white }, { t: "first.", c: C.gold }]]} />
      <NumberedSignal x={70} y={560} n={1} head="WHAT THEY RECEIVE" body={["The first calls, direction taps", "and chance to be chosen."]} p={W.at(14, 30)} ex={ex} />
      <NumberedSignal x={70} y={760} n={2} head="WHY IT HAPPENS" body={["The map gives stronger visibility", "to profiles it understands and trusts."]} p={W.at(20, 36)} ex={ex} />
      <NumberedSignal x={70} y={960} n={3} head="WHAT YOU MAY LOSE" body={["If your signals are unclear,", "the customer may never reach", "your listing."]} p={W.at(26, 42)} ex={ex} />
      <Copy x={70} y={1240} size={30} color={C.muted} p={W.at(30, 44)} ex={ex} lines={["Everyone below the top three", [{ t: "starts with less attention.", c: C.gold }]]} />
      <StatementBox x={64} y={1560} w={952} size={38} p={W.at(34, 46)} align="left"
        lines={[[{ t: "The customer did not reject your business." }], [{ t: "They may never have seen it.", c: C.gold }]]} />
    </AbsoluteFill>
  );
};

// ========================== SCENE 5 — CLIMAX ==============================
const S5: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s5.start, e = SCN.s5.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const checks = ["Accurate profile", "Relevant categories", "Current hours", "Clear services", "Strong photos", "Consistent reviews"];
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <RoutePath points={[{ x: 90, y: 1560 }, { x: 260, y: 1440 }, { x: 360, y: 1300 }, { x: 520, y: 1180 }, { x: 650, y: 1080 }]} draw={W.at(14, 42)} />
        </svg>
        <TriangleSlots cx={700} cy={1120} f={f} reveal={W.at(8, 36)} />
      </div>
      <Headline x={64} y={110} size={96} weight={800} p={W.p()} ex={ex}
        lines={[[{ t: "No rent", c: C.white }, { t: ".", c: C.gold }], [{ t: "No lease", c: C.white }, { t: ".", c: C.gold }], [{ t: "No deposit", c: C.white }, { t: ".", c: C.gold }]]} />
      <StatementBox x={64} y={470} w={952} size={27} p={W.at(14, 30)} align="center"
        lines={[[{ t: "These positions are not leased like storefronts.", c: C.muted }], [{ t: "They are earned through clear, trusted signals", c: C.muted }], [{ t: "that help the map understand your business.", c: C.muted }]]} />
      <Label x={70} y={740} text="SIGNALS THAT MATTER" p={W.at(18, 32)} />
      {checks.map((t, i) => <CheckItem key={i} x={80} y={800 + i * 62} text={t} p={W.at(18 + i * 3, 32 + i * 3)} />)}
      <StatementBox x={64} y={1520} w={952} size={40} p={W.at(34, 48)} align="center"
        lines={[[{ t: "The digital space is invisible.", c: C.white }], [{ t: "The advantage is real.", c: C.muted }], [{ t: " ", c: C.white }], [{ t: "And almost nobody here", c: C.gold }], [{ t: "is fighting for them.", c: C.gold }]]} />
    </AbsoluteFill>
  );
};

// ========================= SCENE 6 — SOLUTION =============================
const S6: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s6.start, e = SCN.s6.end; const W = win(f, s, e, true); if (!W.live) return null;
  return (
    <AbsoluteFill>
      <TriangleSlots cx={720} cy={900} f={f} reveal={W.at(6, 40)} storefront />
      <Headline x={64} y={110} size={120} weight={800} p={W.p()} lines={[[{ t: "Claim ", c: C.white }, { t: "one.", c: C.gold }]]} />
      <Copy x={70} y={340} size={30} color={C.muted} p={W.at(14, 32)} lines={["OmniFlow Digital strengthens the signals", "that help your business compete", "for local visibility."]} />
      <NumberedSignal x={70} y={560} n={1} head="PROFILE CLARITY" body={["Accurate information, categories", "and hours customers can trust."]} p={W.at(16, 34)} />
      <NumberedSignal x={70} y={720} n={2} head="TRUST SIGNALS" body={["Clear services, stronger photos", "and a review-ready presence."]} p={W.at(22, 40)} />
      <NumberedSignal x={70} y={880} n={3} head="LOCAL RELEVANCE" body={["A structure that helps the map", "understand who you serve."]} p={W.at(28, 46)} />
      <StatementBox x={64} y={1430} w={952} size={34} p={W.at(34, 50)} align="center" lines={[[{ t: "Be one of the businesses customers see first.", c: C.white }]]} />
      <CTAButton x={70} y={1600} p={W.at(40, 56)} />
    </AbsoluteFill>
  );
};

export const OmniFlowAd16: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("ad16-fonts"));
  React.useEffect(() => { initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle)); }, [handle]);
  const camX = kf(f, [0, 300, 599], [0, 14, -6]);
  const camY = kf(f, [0, 300, 599], [0, -8, 6]);
  const camS = 1 + kf(f, [0, 599], [0, 0.02]);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${camX}px, ${camY}px) scale(${camS})`, transformOrigin: "center center" }}>
        <IsoCity ox={560} oy={640} opacity={0.9} />
      </div>
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
    </AbsoluteFill>
  );
};
