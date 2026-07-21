import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BusinessProfileCard } from "../components/BusinessProfileCard";
import { CinematicMap, CustomerNode } from "../components/CinematicMap";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { SignalChecklist } from "../components/SignalChecklist";
import { COLORS, FONTS } from "../theme";

const DUR = 100;

// Diagnostic spine: base node up through the five profile rows.
const SPINE = [
  { x: 250, y: 1300 },
  { x: 380, y: 1140 },
  { x: 460, y: 980 },
  { x: 468, y: 700 },
  { x: 468, y: 470 },
];
// Row anchor Y positions on the profile card for the spine dots.
const ROW_Y = [700, 793, 886, 979, 1072];

// Each signal activates in sequence.
const ACT = [14, 26, 38, 50, 62];

// Where the spine bends toward on exit — the scene-06 customer route origin.
const SPINE_BENT = [
  { x: 250, y: 1300 },
  { x: 360, y: 1420 },
  { x: 300, y: 1560 },
  { x: 220, y: 1660 },
  { x: 185, y: 1720 },
];

export const Scene5: React.FC<{ bend?: number }> = ({ bend = 0 }) => {
  const frame = useCurrentFrame();
  const spineP = interpolate(frame, [8, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topBeat = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // On exit the diagnostic spine bends downward, morphing toward the
  // completed customer route of scene 6.
  const spinePts = SPINE.map((p, i) => ({
    x: p.x + (SPINE_BENT[i].x - p.x) * bend,
    y: p.y + (SPINE_BENT[i].y - p.y) * bend,
  }));

  return (
    <SceneCamera duration={DUR} driftX={8} driftY={-6}>
      <AbsoluteFill>
        <ParallaxLayer depth={0.2}>
          <div style={{ opacity: 0.7 }}>
            <CinematicMap seed={71} brightness={0.75} warm={0.4} />
          </div>
        </ParallaxLayer>

        {/* Diagnostic spine + base node */}
        <ParallaxLayer depth={0.5}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <EnergyLine points={spinePts} progress={spineP} frame={frame} coreWidth={4} glowWidth={15} seed={7} />
            <CustomerNode x={250} y={1300} appear={4} scale={1} />
            {/* Signal dots travelling into each profile row */}
            {ROW_Y.map((ry, i) => {
              const on = interpolate(frame, [ACT[i] - 2, ACT[i] + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (on <= 0) return null;
              const pulse = 0.6 + 0.4 * Math.sin(frame * 0.2 + i);
              return (
                <g key={i} opacity={on}>
                  <circle cx={468} cy={ry} r={16} fill={COLORS.cyan} opacity={0.16 * pulse} />
                  <circle cx={468} cy={ry} r={9} fill={COLORS.cyan} opacity={0.4} />
                  <circle cx={468} cy={ry} r={5} fill="#DFFBFF" />
                </g>
              );
            })}
          </svg>
        </ParallaxLayer>

        {/* Panels */}
        <ParallaxLayer depth={1} style={{ opacity: 1 - bend * 0.85 }}>
          {/* Top headline panel */}
          <GlassPanel x={28} y={45} width={1025} height={405} appear={2} accent="cyan" radius={24} padding="42px">
            <div style={{ position: "relative", height: "100%" }}>
              <MaskedText start={6} lines={[[{ text: "What keeps" }], [{ text: "you connected" }]]} fontSize={82} fontWeight={850} lineHeight={0.96} condense={0.9} />
              <div style={{ marginTop: 20, width: 470 }}>
                <MaskedText start={18} dur={13} stagger={4} lines={[[{ text: "Strong local visibility is built" }], [{ text: "from clear signals, not guesswork." }]]} fontSize={32} fontFamily={FONTS.body} fontWeight={400} lineHeight={1.25} color={COLORS.gray} letterSpacing={0} from={{ x: 0, y: 10 }} />
              </div>
              {/* Top-right heartbeat line */}
              <svg width="420" height="150" viewBox="0 0 420 150" style={{ position: "absolute", right: -10, top: 20, overflow: "visible" }}>
                <path d="M0 75 L200 75 L230 30 L260 120 L285 55 L300 75 L420 75" fill="none" stroke={COLORS.cyan} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(31,199,255,0.6))" }} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - topBeat)} />
              </svg>
            </div>
          </GlassPanel>

          {/* Left checklist */}
          <GlassPanel x={28} y={485} width={390} height={790} appear={10} accent="cyan" radius={22}>
            <SignalChecklist x={0} y={0} width={390} height={790} activations={ACT} />
          </GlassPanel>

          {/* Right profile card */}
          <BusinessProfileCard x={440} y={485} width={590} height={935} appear={12} activations={ACT} />

          {/* Bottom takeaway */}
          <GlassPanel x={28} y={1600} width={1025} height={225} appear={70} accent="cyan" radius={22} padding="0 40px">
            <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%" }}>
              <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}><circle cx="45" cy="45" r="40" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.5" /><path d="M22 58 L38 38 L48 48 L68 24" fill="none" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M58 24 L68 24 L68 34" fill="none" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 33, color: COLORS.white, lineHeight: 1.28, flex: 1 }}>These signals help search platforms trust your business and guide customers to you.</span>
              <svg width="70" height="34" viewBox="0 0 70 34" style={{ flexShrink: 0 }}><line x1="2" y1="17" x2="58" y2="17" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" /><path d="M48 6 L64 17 L48 28" fill="none" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </GlassPanel>
        </ParallaxLayer>
      </AbsoluteFill>
    </SceneCamera>
  );
};
