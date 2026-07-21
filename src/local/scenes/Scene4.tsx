import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicMap, CustomerNode } from "../components/CinematicMap";
import { ConsequenceCard } from "../components/ConsequenceCard";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { COLORS, FONTS } from "../theme";

const DUR = 86;

// Customer origin (lower-mid-left) initially heads toward Your Business
// (lower-right), then breaks and diverts up to the competitor (upper-right).
const ORIGIN = { x: 445, y: 940 };
const YOUR_BIZ = { x: 730, y: 780 };
const COMPETITOR = { x: 760, y: 355 };

// Approach segment (toward your business) then the diverted route to competitor.
const APPROACH = [ORIGIN, { x: 520, y: 880 }, { x: 640, y: 820 }, { x: 700, y: 800 }];
const DIVERT = [
  ORIGIN,
  { x: 500, y: 780 },
  { x: 560, y: 640 },
  { x: 520, y: 520 },
  { x: 620, y: 440 },
  COMPETITOR,
];

const MiniStore: React.FC<{ x: number; y: number; gold: boolean; appear: number }> = ({ x, y, gold, appear }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t <= 0) return null;
  const c = gold ? COLORS.gold : COLORS.grayMuted;
  return (
    <g transform={`translate(${x} ${y})`} opacity={t}>
      {gold && [0, 1].map((i) => { const ph = (frame * 0.014 + i / 2) % 1; return <ellipse key={i} cx={0} cy={40} rx={40 + ph * 40} ry={(40 + ph * 40) * 0.35} fill="none" stroke={COLORS.gold} strokeWidth={1.4} opacity={(1 - ph) * 0.5} />; })}
      <ellipse cx={0} cy={40} rx={54} ry={18} fill="none" stroke={c} strokeWidth={1.4} opacity={gold ? 0.6 : 0.3} />
      {gold && <ellipse cx={0} cy={40} rx={44} ry={14} fill={COLORS.gold} opacity={0.12} />}
      <path d={`M -34 4 L -26 -14 L 26 -14 L 34 4 Z`} fill={gold ? "rgba(243,188,66,0.9)" : "#1a1e24"} stroke={c} strokeWidth={1.4} />
      <rect x={-30} y={4} width={60} height={34} fill={gold ? "rgba(243,166,74,0.5)" : "#12161c"} stroke={c} strokeWidth={1.4} />
      {[-20, -6, 8, 22].map((wx, i) => <rect key={i} x={wx} y={10} width={9} height={20} fill={gold ? "rgba(255,224,160,0.6)" : "rgba(98,108,119,0.25)"} />)}
      {gold && <circle cx={26} cy={30} r={5} fill="#FFF3D0" />}
    </g>
  );
};

export const Scene4: React.FC<{ compress?: number }> = ({ compress = 0 }) => {
  const frame = useCurrentFrame();
  // Route approaches your business, hesitates, breaks, diverts to competitor.
  const approachP = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breakBeat = interpolate(frame, [30, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const divertP = interpolate(frame, [36, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const compGold = interpolate(frame, [56, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bizFade = interpolate(frame, [40, 56], [1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneCamera duration={DUR} driftX={-12} driftY={8}>
      <AbsoluteFill>
        <ParallaxLayer depth={0.25}>
          <CinematicMap seed={53} brightness={0.85} warm={0.4} />
        </ParallaxLayer>

        {/* Routes + stores */}
        <ParallaxLayer depth={0.55}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            {/* Approach that fizzles */}
            <EnergyLine points={APPROACH} progress={approachP * (1 - divertP)} frame={frame} coreWidth={4} glowWidth={14} opacity={1 - divertP} seed={5} />
            {/* Break flicker */}
            {breakBeat > 0 && divertP < 0.5 && (
              <g opacity={breakBeat * (1 - divertP * 2)}>
                <circle cx={700} cy={800} r={12 + breakBeat * 10} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={0.6} />
                <line x1={688} y1={800} x2={712} y2={800} stroke={COLORS.cyan} strokeWidth={2.5} strokeDasharray="4 4" opacity={0.5} />
              </g>
            )}
            {/* Diverted route to competitor */}
            <EnergyLine points={DIVERT} progress={divertP} frame={frame} coreWidth={4.5} glowWidth={16} arrow seed={6} />
            <CustomerNode x={ORIGIN.x} y={ORIGIN.y} appear={4} scale={1} />
            <g style={{ filter: `saturate(${bizFade})`, opacity: bizFade }} transform={`translate(0 ${(1 - bizFade) * 10})`}>
              <MiniStore x={YOUR_BIZ.x} y={YOUR_BIZ.y} gold={false} appear={6} />
            </g>
            <MiniStore x={COMPETITOR.x} y={COMPETITOR.y} gold={compGold > 0.4} appear={6} />
          </svg>

          {/* Competitor label */}
          <GlassPanel x={685} y={110} width={220} height={130} appear={8} accent="gold" radius={14} padding="16px 18px">
            <div style={{ fontFamily: FONTS.body }}>
              <div style={{ fontWeight: 600, fontSize: 26, color: COLORS.gold }}>Competitor</div>
              <div style={{ fontWeight: 400, fontSize: 20, color: COLORS.gray, marginTop: 4 }}>Complete • Active</div>
              <div style={{ fontWeight: 400, fontSize: 20, color: COLORS.gray, display: "flex", alignItems: "center", gap: 6 }}>Chosen <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginLeft: "auto" }}><path d="M8 15 C 4 10 2.5 8 2.5 5.5 A 5.5 5.5 0 1 1 13.5 5.5 C 13.5 8 12 10 8 15 Z" fill="none" stroke={COLORS.gold} strokeWidth="1.4" /></svg></div>
            </div>
          </GlassPanel>
          {/* Your Business label */}
          <div style={{ opacity: bizFade }}>
            <GlassPanel x={690} y={585} width={230} height={120} appear={10} accent="muted" radius={14} padding="14px 18px">
              <div style={{ fontFamily: FONTS.body }}>
                <div style={{ fontWeight: 600, fontSize: 25, color: COLORS.gray }}>Your Business</div>
                <div style={{ fontWeight: 400, fontSize: 19, color: COLORS.grayMuted, marginTop: 4 }}>Incomplete • Inactive</div>
                <div style={{ fontWeight: 400, fontSize: 19, color: COLORS.grayMuted }}>Harder to find</div>
              </div>
            </GlassPanel>
          </div>
        </ParallaxLayer>

        {/* Text */}
        <ParallaxLayer depth={1}>
          <div style={{ position: "absolute", left: 55, top: 125, width: 410 }}>
            <MaskedText start={4} lines={[[{ text: "But the" }], [{ text: "pulse can" }], [{ text: "miss you." }]]} fontSize={94} fontWeight={850} lineHeight={0.96} condense={0.82} />
          </div>
          <div style={{ position: "absolute", left: 57, top: 440, width: 60, height: 4, background: COLORS.gold, opacity: interpolate(frame, [22, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          <div style={{ position: "absolute", left: 57, top: 480, width: 340 }}>
            <MaskedText start={24} dur={13} stagger={4} lines={[[{ text: "An incomplete or" }], [{ text: "inactive profile breaks" }], [{ text: "the connection." }]]} fontSize={37} fontFamily={FONTS.body} fontWeight={400} lineHeight={1.25} color={COLORS.gray} letterSpacing={0} from={{ x: 0, y: 12 }} />
          </div>

          {/* Explanation panel */}
          <GlassPanel x={48} y={720} width={360} height={330} appear={34} accent="cyan" radius={18} padding="26px">
            <div style={{ display: "flex", gap: 18 }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ flexShrink: 0 }}><circle cx="26" cy="26" r="23" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.5" /><path d="M9 26 L19 26 L23 16 L29 36 L33 22 L37 26 L43 26" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 29, color: COLORS.white, lineHeight: 1.3 }}>Weak categories, missing photos, old info or low activity make your business easier to skip.</span>
            </div>
          </GlassPanel>

          {/* Consequence cards */}
          <div style={{ opacity: 1 - compress }}>
            <ConsequenceCard x={48} y={1120} width={300} height={225} appear={44} label="Never saw you" icon="eyeoff" />
            <ConsequenceCard x={388} y={1120} width={300} height={225} appear={50} label="Never called you" icon="phonex" />
            <ConsequenceCard x={728} y={1120} width={300} height={225} appear={56} label="Chose someone else" icon="userstar" />
          </div>

          {/* Bottom landing panel */}
          <GlassPanel x={48} y={1420} width={985} height={290} appear={60} accent="gold" glow radius={22} padding="30px 34px">
            <div style={{ display: "flex", gap: 26, alignItems: "center", height: "100%" }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
                {[52, 38, 24, 10].map((r, i) => <circle key={i} cx="55" cy="55" r={r} fill="none" stroke={COLORS.gold} strokeWidth="3" opacity={0.4 + i * 0.15} />)}
                <circle cx="55" cy="55" r="4" fill={COLORS.gold} />
                <path d="M55 55 L92 22" stroke={COLORS.gold} strokeWidth="3" strokeLinecap="round" /><path d="M84 20 L94 20 L94 30" fill="none" stroke={COLORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontFamily: FONTS.body }}>
                <div style={{ fontWeight: 500, fontSize: 33, color: COLORS.white, lineHeight: 1.2 }}>You may not be losing to<br />better businesses.</div>
                <div style={{ fontWeight: 600, fontSize: 33, color: COLORS.gold, lineHeight: 1.2, marginTop: 10 }}>You may be losing to the<br />businesses that show up first.</div>
              </div>
            </div>
          </GlassPanel>
        </ParallaxLayer>
      </AbsoluteFill>
    </SceneCamera>
  );
};
