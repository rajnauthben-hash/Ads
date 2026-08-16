import React from "react";
import { AbsoluteFill, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "../styles/fonts";
import { K, KSC } from "./theme";
import { Cap, Body, Brand, ip, clamp } from "./kinetic";

// Boundary-crossing entrance/exit so scenes transform into each other rather
// than cutting: incoming begins before its start, outgoing lingers past its end.
function win(f: number, s: number, e: number, last = false) {
  return {
    p: (a = -6, b = 30) => ip(f, s + a, s + b, 0, 1),
    ex: (a = 8, b = 16) => (last ? 0 : ip(f, e - a, e + b, 0, 1)),
    at: (a: number, b: number) => ip(f, s + a, s + b, 0, 1),
    live: f >= s - 26 && f <= e + 18,
  };
}
// smear that is strong on entry and decays to a small residual
const smearOf = (p: number, residual = 0.12) => clamp((1 - p) * 1.3 + residual * p);

const Bg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 22%, ${K.bg2} 0%, ${K.bg} 70%)` }} />
);

// ===========================================================================
// SCENE 1 — Your business can look fine while the flow is already slowing.
// ===========================================================================
const S1: React.FC<{ f: number }> = ({ f }) => {
  const s = KSC.s1.start, e = KSC.s1.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const ex = W.ex();
  return (
    <AbsoluteFill>
      <Brand y={54} reveal={W.at(8, 26)} />
      <Cap x={64} y={150} size={62} parts={[{ t: "Your business" }]} p={W.at(14, 40)} dir={{ x: 0, y: 18 }} ex={ex} exDir={{ x: -20, y: -60 }} />
      <Cap x={64} y={214} size={62} parts={[{ t: "can" }]} p={W.at(18, 44)} dir={{ x: 0, y: 18 }} ex={ex} exDir={{ x: -20, y: -70 }} />
      <Cap x={60} y={288} size={252} parts={[{ t: "Look" }]} weight={900} p={W.at(18, 48)} scaleFrom={1.09} dir={{ x: 0, y: 0 }} ex={ex} exDir={{ x: -40, y: -120 }} />
      <Cap x={60} y={520} size={252} parts={[{ t: "Fine" }]} weight={900} p={W.at(24, 52)} scaleFrom={1.0} dir={{ x: 0, y: 24 }} ex={ex} exDir={{ x: -40, y: -150 }} />
      <Cap x={64} y={828} size={56} color={K.silver} parts={[{ t: "While the flow is" }]} p={W.at(40, 62)} ex={ex} exDir={{ x: 40, y: -30 }} />
      <Cap x={64} y={892} size={76} weight={900} color={K.gold} parts={[{ t: "Already slowing." }]} p={W.at(48, 70)} dir={{ x: -40, y: 0 }} smear={smearOf(W.at(48, 70))} smearStep={20} ex={ex} exDir={{ x: 30, y: -20 }} />
      <Cap x={64} y={1078} size={54} color={K.muted} parts={[{ t: "Fewer calls." }]} p={W.at(60, 78)} dir={{ x: -30, y: 0 }} smear={smearOf(W.at(60, 78))} smearStep={26} ex={ex} exDir={{ x: -30, y: -20 }} />
      <Cap x={84} y={1142} size={54} color={K.muted} parts={[{ t: "Quieter days." }]} p={W.at(68, 84)} dir={{ x: -30, y: 0 }} smear={smearOf(W.at(68, 84))} smearStep={26} ex={ex} exDir={{ x: -30, y: -20 }} />
      <Cap x={112} y={1206} size={54} color={K.muted} parts={[{ t: "Less traffic." }]} p={W.at(76, 92)} dir={{ x: -30, y: 0 }} smear={smearOf(W.at(76, 92))} smearStep={26} ex={ex} exDir={{ x: -30, y: -20 }} />
      <Cap x={64} y={1352} size={48} color={K.silver} parts={[{ t: "It’s easy to blame" }]} p={W.at(82, 98)} ex={ex} exDir={{ x: -20, y: 30 }} />
      <Cap x={64} y={1408} size={58} weight={900} color={K.gold} parts={[{ t: "The market." }]} p={W.at(86, 102)} ex={ex} exDir={{ x: -20, y: 40 }} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 2 — The problem may be upstream. Find / understand / or trust.
// ===========================================================================
const S2: React.FC<{ f: number }> = ({ f }) => {
  const s = KSC.s2.start, e = KSC.s2.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const ex = W.ex();
  return (
    <AbsoluteFill>
      <Brand y={54} reveal={W.at(2, 22)} />
      <Cap x={64} y={168} size={118} weight={900} parts={[{ t: "The" }]} p={W.at(-10, 16)} dir={{ x: 0, y: 22 }} ex={ex} exDir={{ x: -30, y: -70 }} />
      <Cap x={64} y={286} size={118} weight={900} parts={[{ t: "Problem" }]} p={W.at(-6, 20)} dir={{ x: 0, y: 22 }} ex={ex} exDir={{ x: -30, y: -80 }} />
      <Cap x={64} y={404} size={118} weight={900} parts={[{ t: "May be" }]} p={W.at(-2, 24)} dir={{ x: 0, y: 22 }} ex={ex} exDir={{ x: -30, y: -90 }} />
      <Cap x={64} y={548} size={158} weight={900} color={K.gold} parts={[{ t: "Upstream." }]} p={W.at(-12, 26)} scaleFrom={1.12} dir={{ x: 0, y: 0 }} ex={ex} exDir={{ x: 0, y: -60 }} smear={smearOf(W.at(-12, 26), 0)} smearStep={14} />
      <Body x={68} y={780} size={38} p={W.at(28, 48)} ex={ex} color={K.silver} lines={[[{ t: "Customers can still " }, { t: "need", c: K.gold }, { t: " what you sell." }]]} />
      <Body x={68} y={868} size={38} p={W.at(36, 56)} ex={ex} color={K.silver} lines={["But if your business is harder to"]} />
      <Cap x={64} y={932} size={150} weight={900} color={K.gold} parts={[{ t: "Find" }]} p={W.at(46, 66)} dir={{ x: -24, y: 0 }} ex={ex} exDir={{ x: -30, y: -20 }} />
      <Cap x={64} y={1102} size={150} weight={900} color={K.gold} parts={[{ t: "Understand" }]} p={W.at(54, 74)} dir={{ x: 30, y: 0 }} ex={ex} exDir={{ x: 20, y: -20 }} />
      <Cap x={64} y={1272} size={150} weight={900} color={K.gold} parts={[{ t: "Or trust" }]} p={W.at(62, 82)} dir={{ x: 60, y: 0 }} ex={ex} exDir={{ x: 60, y: -20 }} />
      <Body x={68} y={1470} size={38} p={W.at(72, 92)} ex={ex} color={K.silver} lines={["online, fewer of those", [{ t: "customers ever " }, { t: "reach you.", c: K.gold }]]} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 3 — That doesn't mean your business is broken.
// ===========================================================================
const S3: React.FC<{ f: number }> = ({ f }) => {
  const s = KSC.s3.start, e = KSC.s3.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const ex = W.ex();
  // compression: the problem stack tightens vertically as the scene settles
  const comp = ip(f, s + 40, s + 90, 10, 0);
  return (
    <AbsoluteFill>
      <Brand y={54} reveal={W.at(2, 22)} />
      <Cap x={64} y={196} size={92} weight={900} parts={[{ t: "That doesn’t" }]} p={W.at(-10, 16)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: -20, y: -60 }} />
      <Cap x={64} y={288} size={92} weight={900} parts={[{ t: "Mean your" }]} p={W.at(-6, 20)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: -20, y: -70 }} />
      <Cap x={64} y={380} size={92} weight={900} parts={[{ t: "Business is" }]} p={W.at(-2, 24)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: -20, y: -80 }} />
      <Cap x={60} y={486} size={198} weight={900} color={K.silver} parts={[{ t: "Broken." }]} p={W.at(2, 32)} scaleFrom={1.1} ex={ex} exDir={{ x: 0, y: -120 }} />
      <Body x={68} y={776} size={38} p={W.at(40, 58)} ex={ex} color={K.silver} lines={["Sometimes the blockage is smaller:"]} />
      <Cap x={64} y={834 + comp * 0} size={56} parts={[{ t: "Missing ", c: K.gold }, { t: "information.", c: K.muted }]} weight={800} p={W.at(52, 68)} dir={{ x: -20, y: 0 }} ex={ex} exDir={{ x: -50, y: 0 }} />
      <Cap x={92} y={902 - comp} size={56} parts={[{ t: "Weak ", c: K.gold }, { t: "visibility.", c: K.muted }]} weight={800} p={W.at(56, 72)} dir={{ x: -20, y: 0 }} ex={ex} exDir={{ x: 60, y: 0 }} />
      <Cap x={64} y={970 - comp * 2} size={56} parts={[{ t: "An ", c: K.muted }, { t: "outdated ", c: K.gold }, { t: "website.", c: K.muted }]} weight={800} p={W.at(60, 76)} dir={{ x: -20, y: 0 }} ex={ex} exDir={{ x: -40, y: 0 }} />
      <Cap x={100} y={1038 - comp * 3} size={56} parts={[{ t: "Unclear ", c: K.gold }, { t: "proof.", c: K.muted }]} weight={800} p={W.at(64, 80)} dir={{ x: -20, y: 0 }} ex={ex} exDir={{ x: 50, y: 0 }} />
      <div style={{ position: "absolute", left: 64, top: 1150, width: 720 * W.at(66, 82), height: 2, background: K.gold, opacity: 0.85 * (1 - clamp(ex * 1.2)) }} />
      <Body x={68} y={1186} size={40} p={W.at(70, 88)} ex={ex} color={K.muted} lines={["Small digital problems", "can create a much"]} />
      <Cap x={64} y={1320} size={100} weight={900} color={K.gold} caps={false} parts={[{ t: "bigger silence." }]} p={W.at(76, 94)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: 0, y: 40 }} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 4 — You don't need surgery. You need the blockage cleared.
// ===========================================================================
const S4: React.FC<{ f: number }> = ({ f }) => {
  const s = KSC.s4.start, e = KSC.s4.end;
  const W = win(f, s, e);
  if (!W.live) return null;
  const ex = W.ex();
  return (
    <AbsoluteFill>
      <Brand y={54} reveal={W.at(2, 22)} />
      <Cap x={64} y={196} size={72} parts={[{ t: "You don’t need" }]} p={W.at(-10, 16)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: -20, y: -60 }} />
      <Cap x={60} y={272} size={186} weight={900} color={K.silver} parts={[{ t: "Surgery." }]} p={W.at(-6, 26)} scaleFrom={1.1} ex={ex} exDir={{ x: 0, y: -110 }} />
      <Cap x={64} y={556} size={72} parts={[{ t: "You need the" }]} p={W.at(30, 52)} dir={{ x: 0, y: 20 }} ex={ex} exDir={{ x: -20, y: -50 }} />
      <Cap x={60} y={636} size={186} weight={900} color={K.gold} parts={[{ t: "Blockage" }]} p={W.at(38, 62)} scaleFrom={1.08} dir={{ x: 0, y: 0 }} ex={ex} exDir={{ x: 0, y: -40 }} smear={smearOf(W.at(38, 62), 0.05)} smearStep={18} />
      <Cap x={60} y={824} size={186} weight={900} color={K.gold} parts={[{ t: "Cleared." }]} p={W.at(46, 70)} scaleFrom={1.08} dir={{ x: -30, y: 0 }} ex={ex} exDir={{ x: 20, y: -20 }} smear={smearOf(W.at(46, 70), 0.05)} smearStep={26} />
      <Body x={68} y={1120} size={40} p={W.at(60, 80)} ex={ex} color={K.muted} lines={["Fix the signals customers", "rely on before they"]} />
      <Cap x={64} y={1256} size={72} weight={900} parts={[{ t: "Call, ", c: K.gold }, { t: "visit ", c: K.gold }, { t: "or ", c: K.white }, { t: "choose.", c: K.gold }]} p={W.at(70, 90)} dir={{ x: -20, y: 0 }} smear={smearOf(W.at(70, 90), 0)} smearStep={16} ex={ex} exDir={{ x: 0, y: 30 }} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// SCENE 5 — Then the pulse starts coming back.
// ===========================================================================
const S5: React.FC<{ f: number }> = ({ f }) => {
  const s = KSC.s5.start, e = KSC.s5.end;
  const W = win(f, s, e, true);
  if (!W.live) return null;
  const pulseP = W.at(-12, 30);
  // pulse ghost echoes breathe subtly
  const beat = 1 + Math.sin(f * 0.12) * 0.01;
  return (
    <AbsoluteFill>
      <Brand y={54} reveal={W.at(2, 22)} />
      <Cap x={64} y={188} size={92} weight={900} color={K.silver} parts={[{ t: "Then the" }]} p={W.at(-10, 16)} dir={{ x: 0, y: 20 }} />
      <div style={{ transform: `scale(${beat})`, transformOrigin: "64px 400px" }}>
        <Cap x={60} y={286} size={214} weight={900} color={K.gold} parts={[{ t: "Pulse" }]} p={pulseP} scaleFrom={1.12} glow dir={{ x: 0, y: 0 }} />
      </div>
      <Cap x={64} y={556} size={92} weight={900} color={K.silver} parts={[{ t: "Starts coming" }]} p={W.at(28, 52)} dir={{ x: 0, y: 20 }} />
      <Cap x={64} y={648} size={92} weight={900} color={K.silver} parts={[{ t: "Back." }]} p={W.at(34, 58)} dir={{ x: 0, y: 20 }} />
      <Body x={68} y={806} size={38} p={W.at(46, 64)} color={K.muted} lines={["More people can:"]} />
      <div style={{ position: "absolute", left: 66, top: 872, width: 4, height: 244 * clamp(W.at(50, 70)), background: K.gold, opacity: 0.8, boxShadow: "0 0 10px rgba(234,170,47,0.5)" }} />
      <Cap x={92} y={868} size={76} weight={900} parts={[{ t: "Find ", c: K.gold }, { t: "you.", c: K.white }]} p={W.at(52, 70)} dir={{ x: -24, y: 0 }} />
      <Cap x={92} y={954} size={76} weight={900} parts={[{ t: "Understand ", c: K.gold }, { t: "you.", c: K.white }]} p={W.at(58, 76)} dir={{ x: -24, y: 0 }} />
      <Cap x={92} y={1040} size={76} weight={900} parts={[{ t: "Reach ", c: K.gold }, { t: "you.", c: K.white }]} p={W.at(64, 82)} dir={{ x: -24, y: 0 }} />
      <Body x={68} y={1174} size={34} p={W.at(70, 88)} color={K.muted} lines={["OmniFlow Digital helps clear", "the digital problems that make", [{ t: "a good business " }, { t: "harder to discover.", c: K.gold }]]} />
      <div style={{ position: "absolute", left: 64, top: 1360, width: 900 * clamp(W.at(76, 92)), height: 2, background: K.gold, opacity: 0.7 }} />
      <Cap x={64} y={1392} size={62} weight={900} color={K.gold} parts={[{ t: "Get found." }]} p={W.at(66, 82)} dir={{ x: -16, y: 0 }} />
      <Cap x={64} y={1470} size={62} weight={900} color={K.silver} parts={[{ t: "Look professional." }]} p={W.at(70, 86)} dir={{ x: -16, y: 0 }} />
      <Cap x={64} y={1548} size={62} weight={900} color={K.gold} parts={[{ t: "Grow online." }]} p={W.at(74, 90)} dir={{ x: -16, y: 0 }} />
    </AbsoluteFill>
  );
};

export const RestoringTheFlow: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = React.useState(() => delayRender("flow-fonts"));
  React.useEffect(() => {
    initFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Bg />
      <S1 f={f} />
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
    </AbsoluteFill>
  );
};
