// ============================================================================
// SearchSignal routing per scene. The same electric-cyan strand primitive is
// reused so it reads as one continuous customer signal across all five scenes.
// Motion system: clean C1-continuous beziers, consistent stroke, restrained
// glow, ease-out draw-on. No wobble, no decorative drift.
//   Behind the phone: Scene 1 curve (hides behind the shell).
//   In front:         Scene 4 waves into the shop, Scene 5 repaired route.
// (Scene 2 broken connection and Scene 3 decision track live in their scenes.)
// ============================================================================
import React from "react";
import { clampInterp } from "../framePlan";
import { SignalStrand, SignalPulseDot } from "./SignalStrand";

// Unified motion constants
const CORE_WIDTH = 3;
const CORE_GLOW = 12;

// Scene 1 — one clean stroke leaving the search field, dropping down the phone
// edge and arcing toward the store door (stopping ~110px short). Two mirrored
// cubic segments = a single smooth gesture, no double inflection.
const S1_CURVE =
  "M 772 502 C 828 702, 720 882, 566 928 C 412 974, 438 792, 436 656";

// Scene 4 — three parallel signal strands flowing from the phone (right) toward
// the shop, plus one descending into the doorway. Even amplitude + spacing.
const A = 13; // restrained, even wave amplitude
const waveAt = (y: number) =>
  `M 1000 ${y} C 892 ${y - A}, 800 ${y + A}, 690 ${y} ` +
  `C 580 ${y - A}, 490 ${y + A}, 380 ${y} ` +
  `C 270 ${y - A}, 196 ${y + A - 2}, 120 ${y}`;
const S4_PRIMARY = waveAt(892);
const S4_SECONDARY = waveAt(912);
const S4_TERTIARY = waveAt(872);
const S4_DESCEND = "M 556 892 C 572 958, 562 1004, 548 1040";

// Scene 5 — repaired route: exits the Directions action, one confident bow,
// straightens into the doorway. Monotonic descent, no back-and-forth.
const S5_ROUTE =
  "M 792 548 C 828 712, 820 904, 798 1040 C 776 1176, 772 1250, 772 1308";

export const SignalsBehind: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 30 || frame > 132) return null;
  const draw = clampInterp(frame, [38, 74], [0, 1]);
  const opacity = clampInterp(frame, [38, 54, 109, 131], [0, 1, 1, 0]);
  return <SignalStrand d={S1_CURVE} draw={draw} opacity={opacity} width={CORE_WIDTH} glow={CORE_GLOW} />;
};

export const SignalsFront: React.FC<{ frame: number }> = ({ frame }) => {
  // ---- Scene 4 waves ----
  if (frame >= 455 && frame <= 552) {
    const draw = clampInterp(frame, [470, 500], [0, 1]);
    const opacityIn = clampInterp(frame, [455, 482], [0, 1]);
    // primary dims 45% after entering the shop
    const primaryDim = clampInterp(frame, [500, 522], [1, 0.55]);
    return (
      <>
        <SignalStrand d={S4_TERTIARY} draw={draw} opacity={opacityIn * 0.34} width={2.6} glow={10} />
        <SignalStrand d={S4_SECONDARY} draw={draw} opacity={opacityIn * 0.66} width={2.8} glow={11} />
        <SignalStrand d={S4_PRIMARY} draw={draw} opacity={opacityIn} width={CORE_WIDTH} glow={CORE_GLOW} />
        <SignalStrand d={S4_DESCEND} draw={clampInterp(frame, [492, 512], [0, 1])} opacity={opacityIn * primaryDim} width={CORE_WIDTH} glow={CORE_GLOW} />
      </>
    );
  }

  // ---- Scene 5 repaired route ----
  if (frame >= 552) {
    const draw = clampInterp(frame, [608, 648], [0, 1]);
    const opacity = clampInterp(frame, [606, 624], [0, 1]);
    // one clean pulse toward the store every 42 frames during the hold
    const rawPhase = ((frame - 648) % 42) / 42;
    const phase = rawPhase * rawPhase * (3 - 2 * rawPhase); // smoothstep
    const pulseOn = frame >= 648 && draw >= 1;
    const py = 548 + (1308 - 548) * phase;
    const px = clampInterp(py, [548, 904, 1040, 1308], [792, 820, 798, 772]);
    return (
      <>
        <SignalStrand d={S5_ROUTE} draw={draw} opacity={opacity} width={CORE_WIDTH} glow={CORE_GLOW} />
        {pulseOn && <SignalPulseDot x={px} y={py} r={5} opacity={(1 - rawPhase) * 0.85} />}
      </>
    );
  }

  return null;
};
