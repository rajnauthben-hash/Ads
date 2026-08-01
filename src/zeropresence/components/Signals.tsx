// ============================================================================
// SearchSignal routing per scene. The same electric-cyan strand primitive is
// reused so it reads as one continuous customer signal across all five scenes.
//   Behind the phone: Scene 1 curve (hides behind the shell).
//   In front:         Scene 4 waves into the shop, Scene 5 repaired route.
// (Scene 2 broken connection and Scene 3 decision track live in their scenes.)
// ============================================================================
import React from "react";
import { clampInterp } from "../framePlan";
import { SignalStrand, SignalPulseDot } from "./SignalStrand";

// Scene 1 — from the search cursor, around the phone, toward the store door.
const S1_CURVE =
  "M 782 472 C 968 566, 1012 792, 896 946 C 792 1082, 596 1058, 470 948 C 428 912, 430 720, 442 606";

// Scene 4 — flowing waves leaving the phone, descending into the doorway.
const S4_PRIMARY =
  "M 1000 828 C 892 764, 800 902, 690 852 C 596 810, 512 900, 416 862 C 320 826, 236 900, 150 898";
const S4_DESCEND =
  "M 566 892 C 578 968, 566 1012, 548 1044";
const S4_SECONDARY =
  "M 1000 872 C 892 812, 800 946, 690 900 C 596 862, 512 946, 416 910 C 320 876, 236 946, 150 944";
const S4_TERTIARY =
  "M 1000 812 C 892 752, 800 884, 690 838 C 596 800, 512 884, 416 848 C 320 814, 236 884, 150 882";

// Scene 5 — repaired route from the Directions action down into the doorway.
const S5_ROUTE =
  "M 792 545 C 900 640, 872 770, 830 880 C 792 976, 812 1100, 800 1200 C 792 1270, 786 1320, 784 1360";

export const SignalsBehind: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 30 || frame > 132) return null;
  const draw = clampInterp(frame, [38, 74], [0, 1]);
  const opacity = clampInterp(frame, [38, 52, 109, 131], [0, 1, 1, 0]);
  // 2% breathing during hold
  const breathe = 1 + 0.02 * Math.sin((frame - 78) * 0.4);
  return <SignalStrand d={S1_CURVE} draw={draw} opacity={opacity * breathe} width={3} glow={14} headDot />;
};

export const SignalsFront: React.FC<{ frame: number }> = ({ frame }) => {
  // ---- Scene 4 waves ----
  if (frame >= 455 && frame <= 552) {
    const draw = clampInterp(frame, [470, 505], [0, 1]);
    const opacityIn = clampInterp(frame, [455, 485], [0, 1]);
    // primary dims 45% after entering the shop
    const primaryDim = clampInterp(frame, [500, 522], [1, 0.55]);
    return (
      <>
        <SignalStrand d={S4_TERTIARY} draw={draw} opacity={opacityIn * 0.32} width={2.4} glow={10} />
        <SignalStrand d={S4_SECONDARY} draw={draw} opacity={opacityIn * 0.64} width={2.7} glow={12} />
        <SignalStrand d={S4_PRIMARY} draw={draw} opacity={opacityIn} width={3.2} glow={14} />
        <SignalStrand d={S4_DESCEND} draw={clampInterp(frame, [492, 512], [0, 1])} opacity={opacityIn * primaryDim} width={3} glow={12} />
      </>
    );
  }

  // ---- Scene 5 repaired route ----
  if (frame >= 552) {
    const draw = clampInterp(frame, [608, 648], [0, 1]);
    const opacity = clampInterp(frame, [606, 624], [0, 1]);
    // pulse toward the store every 42 frames during the hold
    const phase = ((frame - 648) % 42) / 42;
    const pulseOn = frame >= 648 && draw >= 1;
    const py = 548 + (1312 - 548) * Math.min(1, phase * 1.1);
    const px = clampInterp(py, [548, 860, 1180, 1312], [742, 820, 782, 760]);
    return (
      <>
        <SignalStrand d={S5_ROUTE} draw={draw} opacity={opacity} width={3.5} glow={14} headDot />
        {pulseOn && <SignalPulseDot x={px} y={py} r={5} opacity={(1 - phase) * 0.9} />}
      </>
    );
  }

  return null;
};
