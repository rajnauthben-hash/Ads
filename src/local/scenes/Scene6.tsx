import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicMap, CustomerNode } from "../components/CinematicMap";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { OmniFlowLogo } from "../components/OmniFlowLogo";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { ResultProfileCard } from "../components/ResultProfileCard";
import { Storefront } from "../components/Storefront";
import { COLORS, FONTS } from "../theme";

const DUR = 80;

// Customer node -> storefront entrance, fully connected.
const ROUTE = [
  { x: 185, y: 1390 },
  { x: 340, y: 1240 },
  { x: 470, y: 1080 },
  { x: 560, y: 900 },
  { x: 660, y: 720 },
  { x: 730, y: 560 },
];

const BENEFITS: { y: number; h: number; icon: React.ReactNode; lines: string[]; appear: number }[] = [
  {
    y: 510,
    h: 220,
    appear: 18,
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="26" cy="26" r="18" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" /><path d="M14 26 L21 26 L25 17 L31 35 L35 22 L38 26 L44 26" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><line x1="39" y1="39" x2="50" y2="50" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" /></svg>
    ),
    lines: ["Show up clearly.", "Build trust fast.", "Turn nearby searches", "into visits."],
  },
  {
    y: 760,
    h: 180,
    appear: 26,
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60"><rect x="10" y="34" width="10" height="16" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" /><rect x="25" y="24" width="10" height="26" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" /><rect x="40" y="12" width="10" height="38" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" /></svg>
    ),
    lines: ["More visibility", "in local results."],
  },
  {
    y: 965,
    h: 180,
    appear: 34,
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60"><path d="M30 8 L50 16 L50 30 C 50 43 40 50 30 54 C 20 50 10 43 10 30 L 10 16 Z" fill="none" stroke={COLORS.cyan} strokeWidth="2.2" strokeLinejoin="round" /><path d="M20 30 L27 37 L41 21" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    lines: ["More chances to", "win the click, call", "and visit."],
  },
];

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const routeP = interpolate(frame, [10, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warmth = interpolate(frame, [8, 40], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneCamera duration={DUR} driftX={10} driftY={-8}>
      <AbsoluteFill>
        <ParallaxLayer depth={0.22}>
          <CinematicMap seed={89} brightness={0.9} warm={0.55} driftX={frame * 0.04} />
        </ParallaxLayer>

        {/* Storefront upper-right */}
        <ParallaxLayer depth={0.45}>
          <Storefront x={615} y={200} width={415} height={475} appear={4} warmth={warmth} pin pinAppear={40} />
        </ParallaxLayer>

        {/* Completed route */}
        <ParallaxLayer depth={0.55}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <EnergyLine points={ROUTE} progress={routeP} frame={frame} coreWidth={4.5} glowWidth={16} arrow seed={8} />
            <CustomerNode x={185} y={1390} appear={6} scale={1.1} />
          </svg>
        </ParallaxLayer>

        {/* Text + cards */}
        <ParallaxLayer depth={1}>
          <div style={{ position: "absolute", left: 70, top: 225, width: 470 }}>
            <MaskedText start={4} lines={[[{ text: "Reconnect" }], [{ text: "to local search." }]]} fontSize={84} fontWeight={850} lineHeight={0.96} condense={0.8} />
          </div>

          {BENEFITS.map((b, i) => (
            <GlassPanel key={i} x={60} y={b.y} width={i === 0 ? 470 : 430} height={b.h} appear={b.appear} accent="cyan" radius={20} padding="24px">
              <div style={{ display: "flex", gap: 18, alignItems: "center", height: "100%" }}>
                <div style={{ flexShrink: 0 }}>{b.icon}</div>
                <span style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 30, color: COLORS.white, lineHeight: 1.24 }}>
                  {b.lines.map((l, li) => <div key={li}>{l}</div>)}
                </span>
              </div>
            </GlassPanel>
          ))}

          {/* Result profile card */}
          <ResultProfileCard x={555} y={785} width={480} height={590} appear={30} />

          {/* CTA panel */}
          <GlassPanel x={60} y={1450} width={960} height={140} appear={50} accent="cyan" glow radius={22} padding="0 34px">
            <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ flexShrink: 0 }}><circle cx="32" cy="32" r="27" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.6" /><circle cx="32" cy="32" r="16" fill="none" stroke={COLORS.cyan} strokeWidth="2" /><circle cx="32" cy="32" r="5" fill={COLORS.cyan} /></svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 34, color: COLORS.white, flex: 1 }}>Turn nearby searches<br />into real-world visits.</span>
              <svg width="70" height="34" viewBox="0 0 70 34" style={{ flexShrink: 0 }}><line x1="2" y1="17" x2="58" y2="17" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" /><path d="M48 6 L64 17 L48 28" fill="none" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </GlassPanel>

          {/* Logo lockup */}
          <OmniFlowLogo appear={58} y={1670} />
          {/* Divider */}
          <div style={{ position: "absolute", left: 180, right: 180, top: 1785, height: 1.5, background: "linear-gradient(90deg, transparent, rgba(243,188,66,0.6), transparent)", opacity: interpolate(frame, [70, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          {/* Tagline */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1810, textAlign: "center", opacity: interpolate(frame, [72, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <span style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 28, color: COLORS.gray, letterSpacing: "0.02em" }}>Get Found. Look Professional. Grow Online.</span>
          </div>
        </ParallaxLayer>
      </AbsoluteFill>
    </SceneCamera>
  );
};
