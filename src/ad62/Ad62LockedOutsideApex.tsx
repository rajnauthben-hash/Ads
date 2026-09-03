import React from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "../styles/fonts";
import { C, SCN } from "./theme";
import {
  BlueprintBg, SignalRope, RopePulse, ApexPodium, VelvetRope, SignalGate, LockChip,
  SignalChip, DiagPanel, BusinessMarker, Headline, Copy, Label, Divider, PayoffBar, Brand, CTA, ip, kf, clamp,
} from "./pieces";
import { Pt } from "../utils/routeGeometry";

function win(f: number, s: number, e: number, last = false) {
  return {
    p: (a = -6, b = 26) => ip(f, s + a, s + b, 0, 1),
    ex: (a = 6, b = 14) => (last ? 0 : ip(f, e - a, e + b, 0, 1)),
    at: (a: number, b: number) => ip(f, s + a, s + b, 0, 1),
    live: f >= s - 24 && f <= e + 16,
    fade: last ? 1 : ip(f, e - 4, e + 10, 1, 0),
  };
}

// ============================ SCENE 1 — BARRIER ============================
const rope1: Pt[] = [{ x: 250, y: 1130 }, { x: 400, y: 1120 }, { x: 470, y: 1180 }, { x: 470, y: 1240 }];
const S1: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s1.start, e = SCN.s1.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <ApexPodium cx={690} cy={720} scale={0.92} reveal={W.at(28, 52)} triangle laurel />
        <Label x={720} y={430} text="THE LOCAL MAP" color={C.gold} size={20} p={W.at(30, 48)} />
        <VelvetRope x1={200} x2={980} y={860} reveal={W.at(6, 30)} />
        <BusinessMarker x={250} y={1170} sub="Signal path: incomplete" reveal={W.at(34, 54)} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRope points={rope1} draw={W.at(40, 60)} />
          <g opacity={W.at(52, 66)}><line x1={458} y1={1228} x2={482} y2={1252} stroke={C.cyan} strokeWidth={3} strokeLinecap="round" /><line x1={482} y1={1228} x2={458} y2={1252} stroke={C.cyan} strokeWidth={3} strokeLinecap="round" /></g>
        </svg>
        <Label x={560} y={1250} text="ENTRY: RESTRICTED" color={C.muted} size={19} p={W.at(46, 62)} />
      </div>
      <Headline x={90} y={150} size={92} p={W.p()} ex={ex} lines={[[{ t: "There’s a rope," }], [{ t: "and no queue" }], [{ t: "behind it." }]]} />
      <Copy x={92} y={520} size={30} color={C.muted} p={W.at(20, 40)} ex={ex} width={520} lines={["The top three local results sit", "behind a barrier most businesses", "never notice."]} />
      <PayoffBar x={90} y={1400} w={900} size={40} p={W.at(56, 74)} lines={[[{ t: "The barrier isn’t time. ", c: C.gold }, { t: "It’s information.", c: C.white }]]} />
      <Label x={90} y={1660} text="OMNIFLOW DIGITAL / LOCAL VISIBILITY SYSTEMS" color={C.dim} size={19} p={W.at(64, 80)} />
    </AbsoluteFill>
  );
};

// ====================== SCENE 2 — WAITING vs SIGNALS =======================
const S2: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s2.start, e = SCN.s2.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const needs = ["Clear categories.", "Complete information.", "Trusted activity.", "Local relevance."];
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <div style={{ position: "absolute", left: 540, top: 380, width: 2, height: 1120 * clamp(W.at(4, 22)), background: `linear-gradient(180deg, ${C.cyan}, ${C.gold})`, opacity: 0.7, transform: "translateX(-50%)" }} />
        {/* left: passive clock */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: W.fade }}>
          <circle cx={270} cy={880} r={130} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="4 10" opacity={W.at(16, 34)} />
          <line x1={270} y1={880} x2={270} y2={790} stroke={C.dim} strokeWidth={4} strokeLinecap="round" opacity={W.at(18, 34)} />
          <line x1={270} y1={880} x2={330} y2={910} stroke={C.dim} strokeWidth={4} strokeLinecap="round" opacity={W.at(18, 34)} />
        </svg>
        <Label x={110} y={640} text="WHAT IT FEELS LIKE" color={C.muted} size={24} p={W.at(12, 30)} />
        <Copy x={110} y={690} size={28} color={C.dim} p={W.at(14, 32)} ex={ex} lines={["Stay open.", "Keep posting.", "Hope the map", "eventually notices."]} />
        <Label x={130} y={1080} text="PASSIVE TIME" color={C.dim} size={19} p={W.at(20, 36)} />
        <BusinessMarker x={270} y={1170} active={0} reveal={W.at(24, 42)} w={220} />
        {/* right: system signals -> ranking criteria */}
        <Label x={600} y={640} text="WHAT THE SYSTEM NEEDS" color={C.cyan} size={24} p={W.at(18, 36)} />
        {needs.map((t, i) => <SignalChip key={i} x={600} y={696 + i * 92} w={330} label={t} color={C.cyan} state={i < 3 ? "pass" : "off"} reveal={W.at(22 + i * 4, 40 + i * 4)} />)}
        <ApexPodium cx={720} cy={1300} scale={0.5} reveal={W.at(40, 58)} />
        <Label x={600} y={1400} text="RANKING CRITERIA · LOCAL APEX" color={C.gold} size={18} p={W.at(44, 60)} />
      </div>
      <Headline x={90} y={140} size={78} p={W.p()} ex={ex} lines={[[{ t: "Waiting does not" }], [{ t: "move you closer.", c: C.gold }]]} />
      <PayoffBar x={90} y={1560} w={900} size={34} p={W.at(54, 72)} lines={[[{ t: "Visibility isn’t awarded by time served.", c: C.gold }]]} />
    </AbsoluteFill>
  );
};

// ======================= SCENE 3 — SIGNAL MECHANISM =======================
const chain3: Pt[] = [{ x: 470, y: 560 }, { x: 470, y: 720 }, { x: 470, y: 900 }, { x: 470, y: 1080 }];
const S3: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s3.start, e = SCN.s3.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const sig = [["RELEVANCE", "Does your profile", "clearly match the search?"], ["TRUST", "Are your hours, services,", "photos and reviews complete?"], ["PROXIMITY", "Can Google confidently", "connect you to the customer?"]];
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRope points={chain3} draw={W.at(20, 60)} core={4} />
          <RopePulse points={chain3} t={((f - s) / 40) % 1} maxDraw={W.at(20, 60)} />
        </svg>
        <BusinessMarker x={470} y={520} active={0} reveal={W.at(10, 30)} w={220} />
        <SignalChip x={360} y={640} w={230} label="RELEVANCE" n="01" state="pass" reveal={W.at(24, 40)} />
        <SignalChip x={360} y={820} w={230} label="TRUST" n="02" state="pass" reveal={W.at(30, 46)} />
        <SignalChip x={360} y={1000} w={230} label="PROXIMITY" n="03" state="warn" reveal={W.at(36, 52)} />
        <ApexPodium cx={820} cy={880} scale={0.52} reveal={W.at(40, 58)} />
        <Label x={700} y={1030} text="MAP CONFIDENCE" color={C.gold} size={18} p={W.at(46, 60)} />
      </div>
      <Headline x={90} y={150} size={70} p={W.p()} ex={ex} lines={[[{ t: "The rope is" }], [{ t: "made of signals." }]]} />
      <Copy x={92} y={340} size={28} color={C.muted} p={W.at(18, 36)} ex={ex} width={480} lines={["The map evaluates what your profile", "communicates before deciding", "whether to show it."]} />
      {sig.map((g, i) => (
        <div key={i} style={{ position: "absolute", left: 92, top: 1150 + i * 118, opacity: clamp(W.at(38 + i * 4, 54 + i * 4) * 1.3) }}>
          <div style={{ fontFamily: "'IBM Plex Sans'", fontWeight: 600, fontSize: 24, letterSpacing: 1.5, color: C.cyan }}>{g[0]}</div>
          <div style={{ fontFamily: "Manrope", fontSize: 23, lineHeight: 1.25, color: C.muted }}>{g[1]}<br />{g[2]}</div>
        </div>
      ))}
      <PayoffBar x={90} y={1600} w={900} size={34} p={W.at(58, 74)} gold={false} lines={[[{ t: "Weak signals keep the ", c: C.white }, { t: "gate closed.", c: C.cyan }]]} />
    </AbsoluteFill>
  );
};

// ======================= SCENE 4 — FAILED ENTRY TEST ======================
const trace4: Pt[] = [{ x: 200, y: 1180 }, { x: 360, y: 1120 }, { x: 540, y: 1060 }, { x: 720, y: 980 }, { x: 760, y: 900 }];
const S4: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s4.start, e = SCN.s4.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <DiagPanel x={90} y={620} w={410} title="REAL-WORLD BUSINESS" titleColor={C.cyan} ok rows={["Strong service", "Happy customers", "Years of experience"]} reveal={W.at(16, 34)} />
        <DiagPanel x={580} y={620} w={410} title="MAP-READABLE PROFILE" titleColor={C.gold} ok={false} rows={["Unclear categories", "Missing detail", "Weak trust activity"]} reveal={W.at(24, 42)} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRope points={trace4} draw={W.at(36, 60)} core={4} />
          <RopePulse points={trace4} t={((f - s) / 40) % 1} maxDraw={W.at(36, 60)} />
        </svg>
        <div style={{ position: "absolute", left: 90, top: 1240, width: 900 }}>
          <div style={{ margin: "0 auto", width: 520, textAlign: "center", border: `2px solid ${C.coral}`, borderRadius: 10, padding: "12px 0", fontFamily: "'IBM Plex Sans'", fontWeight: 700, fontSize: 26, letterSpacing: 2, color: C.coral, opacity: clamp(W.at(48, 64) * 1.3), background: "rgba(255,106,95,0.06)" }}>ENTRY TEST: NOT PASSED</div>
        </div>
      </div>
      <Headline x={90} y={150} size={72} p={W.p()} ex={ex} lines={[[{ t: "A good business can" }], [{ t: "still ", c: C.white }, { t: "fail", c: C.gold }, { t: " the entry test." }]]} />
      <Copy x={92} y={420} size={28} color={C.muted} p={W.at(12, 30)} ex={ex} width={860} lines={["Real-world quality cannot compensate for weak,", "incomplete or contradictory profile signals."]} />
      <PayoffBar x={90} y={1520} w={900} size={34} p={W.at(56, 74)} lines={[[{ t: "The system can only rank what it can read.", c: C.gold }]]} />
    </AbsoluteFill>
  );
};

// ====================== SCENE 5 — CLIMAX (LOCKED) =========================
const S5: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s5.start, e = SCN.s5.end; const W = win(f, s, e); if (!W.live) return null; const ex = W.ex();
  const coral = W.at(40, 52);
  const crit = ["RELEVANCE", "TRUST", "PROXIMITY", "CONFIDENCE", "CONSISTENCY"];
  const cx = [270, 430, 590, 750, 910];
  return (
    <AbsoluteFill>
      <div style={{ opacity: W.fade }}>
        <SignalGate cx={620} cy={760} scale={0.9} reveal={W.at(10, 34)} open={0} coral={coral} />
        {crit.map((t, i) => <LockChip key={i} x={cx[i]} y={1060} label={t} locked={1} coral={coral} reveal={W.at(30 + i * 4, 46 + i * 4)} />)}
        <BusinessMarker x={250} y={860} sub="Outside" reveal={W.at(24, 42)} w={220} />
      </div>
      <Headline x={90} y={160} size={64} p={W.p()} ex={ex} lines={[[{ t: "You don’t get" }], [{ t: "in by waiting." }], [{ t: "The door has criteria", c: C.gold }], [{ t: "nobody told you about.", c: C.gold }]]} />
      <Copy x={92} y={560} size={28} color={C.muted} p={W.at(16, 34)} ex={ex} width={520} lines={["Time alone does not strengthen the", "signals that determine visibility."]} />
      <PayoffBar x={90} y={1520} w={900} size={32} p={W.at(52, 70)} lines={[[{ t: "The map doesn’t promote you", c: C.gold }], [{ t: "because you’ve been there long enough.", c: C.white }]]} />
    </AbsoluteFill>
  );
};

// ====================== SCENE 6 — SOLUTION (OPEN) =========================
const flow6: Pt[] = [{ x: 470, y: 640 }, { x: 560, y: 720 }, { x: 620, y: 820 }, { x: 720, y: 900 }, { x: 820, y: 900 }];
const S6: React.FC<{ f: number }> = ({ f }) => {
  const s = SCN.s6.start, e = SCN.s6.end; const W = win(f, s, e, true);
  if (!W.live) return null;
  const open = W.at(30, 54);
  const steps = [["STEP 1", "CLARIFY THE PROFILE"], ["STEP 2", "ALIGN THE CATEGORIES"], ["STEP 3", "STRENGTHEN TRUST"], ["STEP 4", "MAINTAIN THE SIGNALS"]];
  return (
    <AbsoluteFill>
      <div>
        <SignalGate cx={720} cy={720} scale={0.8} reveal={W.at(6, 30)} open={open} />
        <ApexPodium cx={880} cy={620} scale={0.42} reveal={W.at(40, 58)} laurel />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRope points={flow6} draw={W.at(34, 58)} core={4} />
          <RopePulse points={flow6} t={((f - s) / 40) % 1} maxDraw={W.at(34, 58)} />
        </svg>
        <BusinessMarker x={820} y={980} active={1} reveal={W.at(48, 64)} w={200} />
      </div>
      <Headline x={90} y={130} size={92} p={W.p()} lines={[[{ t: "The criteria" }], [{ t: "are ", c: C.white }, { t: "knowable.", c: C.gold }]]} />
      <Copy x={92} y={380} size={28} color={C.muted} p={W.at(14, 32)} width={540} lines={[[{ t: "OmniFlow Digital", c: C.cyan }, { t: " strengthens the signals" }], "that help the map understand,", "trust and surface your business."]} />
      {steps.map((st, i) => (
        <div key={i} style={{ position: "absolute", left: 92, top: 640 + i * 132, display: "flex", alignItems: "center", gap: 16, opacity: clamp(W.at(20 + i * 5, 36 + i * 5) * 1.3) }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, border: `2px solid ${C.cyan}`, color: C.cyan, fontFamily: "'Inter Tight'", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div><div style={{ fontFamily: "'IBM Plex Sans'", fontWeight: 600, fontSize: 17, letterSpacing: 2, color: C.muted }}>{st[0]}</div><div style={{ fontFamily: "'Inter Tight'", fontWeight: 800, fontSize: 27, color: C.white, letterSpacing: 0.3 }}>{st[1]}</div></div>
        </div>
      ))}
      <PayoffBar x={90} y={1330} w={900} size={30} p={W.at(54, 70)} lines={[[{ t: "Compete with a system built around", c: C.white }], [{ t: "what the map actually reads.", c: C.gold }]]} />
      <Brand y={1520} p={W.at(60, 76)} size={44} />
      <Divider x={340} y={1590} w={400} reveal={W.at(64, 78)} />
      <CTA y={1630} p={W.at(66, 82)} />
    </AbsoluteFill>
  );
};

export const Ad62LockedOutsideApex: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("ad62-fonts"));
  React.useEffect(() => { initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle)); }, [handle]);
  const dx = kf(f, [0, 330, 659], [0, 10, -6]);
  const dy = kf(f, [0, 330, 659], [0, -6, 5]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <BlueprintBg driftX={dx} driftY={dy} />
      <S1 f={f} /><S2 f={f} /><S3 f={f} /><S4 f={f} /><S5 f={f} /><S6 f={f} />
    </AbsoluteFill>
  );
};
