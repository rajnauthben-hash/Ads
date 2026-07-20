import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicMap, CustomerNode } from "../components/CinematicMap";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { Storefront } from "../components/Storefront";
import { splinePoint } from "../helpers";
import { COLORS, FONTS } from "../theme";

const DUR = 86;

// Customer origin -> storefront entrance.
const ROUTE = [
  { x: 170, y: 1390 },
  { x: 340, y: 1250 },
  { x: 560, y: 1120 },
  { x: 620, y: 980 },
  { x: 720, y: 850 },
  { x: 840, y: 700 },
];

export const Scene3: React.FC<{ breakAt?: number; divert?: number }> = ({ breakAt, divert = 0 }) => {
  const frame = useCurrentFrame();
  const routeP = interpolate(frame, [18, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warmth = interpolate(frame, [30, 70], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - divert * 0.7);
  const callGold = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrivePos = splinePoint(ROUTE, Math.min(routeP, breakAt ?? 1));

  return (
    <SceneCamera duration={DUR} driftX={12} driftY={-10}>
      <AbsoluteFill>
        <ParallaxLayer depth={0.25}>
          <CinematicMap seed={37} brightness={0.85} warm={0.45} driftX={frame * 0.04} />
        </ParallaxLayer>

        {/* Storefront */}
        <ParallaxLayer depth={0.5}>
          <Storefront x={530} y={95} width={510} height={1150} appear={6} warmth={warmth} />
        </ParallaxLayer>

        {/* Route + nodes + cards */}
        <ParallaxLayer depth={0.6}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <EnergyLine points={ROUTE} progress={routeP} frame={frame} coreWidth={4.5} glowWidth={16} arrow breakAt={breakAt} seed={3} />
            <CustomerNode x={170} y={1390} appear={10} scale={1.1} />
            {/* Signal loss flicker at the break point */}
            {breakAt !== undefined && divert > 0 && (
              <g opacity={interpolate(divert, [0, 0.3, 1], [0, 1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
                <circle cx={arrivePos.x} cy={arrivePos.y} r={14} fill="none" stroke={COLORS.cyan} strokeWidth={2} opacity={0.6} />
                <line x1={arrivePos.x - 10} y1={arrivePos.y} x2={arrivePos.x + 10} y2={arrivePos.y} stroke={COLORS.cyan} strokeWidth={2} opacity={0.4} strokeDasharray="3 3" />
              </g>
            )}
          </svg>
          {/* Arrival card near entrance */}
          <div style={{ opacity: interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - divert) }}>
            <div style={{ position: "absolute", left: 700, top: 620, borderRadius: 14, background: "rgba(9,14,20,0.9)", border: "1.4px solid rgba(243,188,66,0.5)", padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="none" stroke={COLORS.gold} strokeWidth="1.6" /><path d="M8 13 L12 17 L18 9" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 22, color: COLORS.gold }}>ARRIVING SOON<br /><span style={{ fontWeight: 400, fontSize: 20, color: COLORS.gray }}>2 min • 0.3 mi</span></span>
            </div>
          </div>
          {/* Travel card along route */}
          <div style={{ position: "absolute", left: 470, top: 1080, borderRadius: 12, background: "rgba(9,14,20,0.85)", border: "1px solid rgba(85,188,235,0.3)", padding: "8px 14px", opacity: interpolate(frame, [36, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - divert) }}>
            <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 22, color: COLORS.white, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="22" viewBox="0 0 16 22"><circle cx="8" cy="4" r="3" fill={COLORS.cyan} /><path d="M8 7 L8 14 M8 9 L3 12 M8 9 L13 11 M8 14 L4 21 M8 14 L12 21" stroke={COLORS.cyan} strokeWidth="1.8" strokeLinecap="round" fill="none" /></svg>
              2 min<br />0.3 mi
            </span>
          </div>
        </ParallaxLayer>

        {/* Text + left panels */}
        <ParallaxLayer depth={1}>
          <div style={{ position: "absolute", left: 50, top: 150, width: 450 }}>
            <MaskedText start={4} lines={[[{ text: "Searches" }], [{ text: "become action." }]]} fontSize={86} fontWeight={850} lineHeight={0.96} condense={0.78} />
          </div>

          <GlassPanel x={43} y={430} width={460} height={225} appear={18} accent="cyan" radius={20} padding="26px">
            <div style={{ display: "flex", gap: 20, height: "100%", alignItems: "center" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ flexShrink: 0 }}><circle cx="30" cy="30" r="27" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.5" /><path d="M10 30 L22 30 L27 18 L33 42 L38 26 L42 30 L50 30" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 33, color: COLORS.white, lineHeight: 1.22 }}>They turn into routes, calls and real visits.</span>
            </div>
          </GlassPanel>

          {/* Call panel */}
          <GlassPanel x={43} y={690} width={460} height={165} appear={30} accent="gold" glow={callGold > 0.3} radius={18} padding="0 26px">
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: "100%" }}>
              <div style={{ width: 66, height: 66, borderRadius: 33, border: `2px solid ${COLORS.gold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: callGold > 0.3 ? "0 0 20px rgba(243,188,66,0.4)" : "none" }}>
                <svg width="32" height="32" viewBox="0 0 32 32"><path d="M9 6 C 6 12 14 24 21 26 L 26 20 L 19 17 C 17 19 13 15 14 13 L 12 6 Z" fill={COLORS.gold} /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.head, fontWeight: 800, fontSize: 34, color: COLORS.gold }}>CALL</div>
                <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 24, color: COLORS.gray }}>Connect in one tap.</div>
              </div>
              <svg width="40" height="30" viewBox="0 0 40 30"><line x1="2" y1="15" x2="30" y2="15" stroke={COLORS.gold} strokeWidth="2.4" strokeLinecap="round" /><path d="M24 6 L36 15 L24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </GlassPanel>

          <GlassPanel x={43} y={890} width={460} height={175} appear={40} accent="muted" radius={18} padding="0 26px">
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: "100%" }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, border: "1.6px solid rgba(98,108,119,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="30" height="30" viewBox="0 0 30 30"><path d="M5 22 L13 12 L18 17 L27 6" fill="none" stroke={COLORS.gray} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 6 L27 6 L27 12" fill="none" stroke={COLORS.gray} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 32, color: COLORS.white, lineHeight: 1.2 }}>The customer is<br />already moving.</span>
            </div>
          </GlassPanel>

          {/* Support panel bottom-right */}
          <GlassPanel x={535} y={1310} width={500} height={200} appear={46} accent="cyan" radius={18} padding="26px">
            <div style={{ display: "flex", gap: 18, height: "100%", alignItems: "center" }}>
              <svg width="58" height="58" viewBox="0 0 58 58" style={{ flexShrink: 0 }}><circle cx="29" cy="29" r="26" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.5" /><path d="M14 38 L24 26 L31 32 L44 18" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M37 18 L44 18 L44 25" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 32, color: COLORS.white, lineHeight: 1.22 }}>A strong local presence turns intent into movement.</span>
            </div>
          </GlassPanel>

          {/* Bottom panel */}
          <GlassPanel x={25} y={1570} width={1030} height={150} appear={54} accent="cyan" radius={22} padding="0 34px">
            <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%" }}>
              <svg width="66" height="66" viewBox="0 0 66 66" style={{ flexShrink: 0 }}><circle cx="33" cy="33" r="30" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.6" /><circle cx="30" cy="30" r="12" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" /><line x1="39" y1="39" x2="47" y2="47" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 34, color: COLORS.white }}>Search intent quickly becomes<br />real-world traffic.</span>
            </div>
          </GlassPanel>
        </ParallaxLayer>
      </AbsoluteFill>
    </SceneCamera>
  );
};
