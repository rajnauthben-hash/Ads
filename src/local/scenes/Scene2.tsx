import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicMap } from "../components/CinematicMap";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { SearchChip } from "../components/SearchChip";
import { COLORS, FONTS } from "../theme";

const DUR = 86;

// Heartbeat network weaving between the four search nodes (chip stems land
// on these node points).
const NODES = [
  { x: 640, y: 300 }, // coffee
  { x: 760, y: 690 }, // plumber
  { x: 235, y: 1150 }, // hardware
  { x: 800, y: 1290 }, // restaurant
];
const NETWORK = [
  { x: 640, y: 300 },
  { x: 560, y: 520 },
  { x: 700, y: 640 },
  { x: 620, y: 850 },
  { x: 520, y: 1000 },
  { x: 300, y: 1120 },
  { x: 500, y: 1200 },
  { x: 800, y: 1290 },
];

export const Scene2: React.FC<{ selectExpand?: number }> = ({ selectExpand = 0 }) => {
  const frame = useCurrentFrame();
  const netP = interpolate(frame, [24, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneCamera duration={DUR} driftX={-16} driftY={10}>
      <AbsoluteFill>
        <ParallaxLayer depth={0.25}>
          <CinematicMap seed={23} brightness={0.8} warm={0.4} />
        </ParallaxLayer>

        {/* Network route + node ripples */}
        <ParallaxLayer depth={0.55}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <EnergyLine points={NETWORK} progress={netP} frame={frame} coreWidth={4} glowWidth={16} seed={4} />
            {NODES.map((n, i) => {
              const on = interpolate(frame, [12 + i * 6, 24 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (on <= 0) return null;
              const selected = i === 2; // hardware
              const expand = selected ? selectExpand : 0;
              // One gentle ripple per node, phase-offset so they don't pulse
              // in unison — calm, not a stack of racing rings.
              const rp = ((frame * 0.009 + i * 0.27) % 1 + 1) % 1;
              return (
                <g key={i} opacity={on * (1 - (selected ? 0 : selectExpand * 0.7))}>
                  <ellipse
                    cx={n.x}
                    cy={n.y}
                    rx={(18 + rp * 52) * (1 + expand)}
                    ry={(18 + rp * 52) * 0.42 * (1 + expand)}
                    fill="none"
                    stroke={COLORS.cyan}
                    strokeWidth={1.4}
                    opacity={(1 - rp) * (1 - rp) * 0.42 * on}
                  />
                  <ellipse cx={n.x} cy={n.y} rx={26 * (1 + expand * 1.5)} ry={10 * (1 + expand * 1.5)} fill={COLORS.cyan} opacity={0.14 * on} />
                  <circle cx={n.x} cy={n.y} r={8 * (1 + expand)} fill="#CFF4FF" />
                </g>
              );
            })}
          </svg>
        </ParallaxLayer>

        {/* Search chips */}
        <ParallaxLayer depth={0.7}>
          <div style={{ opacity: 1 - selectExpand * 0.8 }}>
            <SearchChip x={520} y={150} label="coffee near me" appear={12} stem={90} />
            <SearchChip x={640} y={528} label="plumber near me" appear={20} stem={100} />
          </div>
          <SearchChip x={95} y={975} label="hardware store near me" appear={26} stem={110} />
          <div style={{ opacity: 1 - selectExpand * 0.8 }}>
            <SearchChip x={640} y={1128} label="restaurant near me" appear={32} stem={90} />
          </div>
        </ParallaxLayer>

        {/* Text */}
        <ParallaxLayer depth={1}>
          <div style={{ position: "absolute", left: 75, top: 185, width: 440 }}>
            <MaskedText start={6} lines={[[{ text: "Every" }], [{ text: "“near me”" }], [{ text: "search" }]]} fontSize={96} fontWeight={850} lineHeight={0.94} condense={0.82} />
          </div>
          <div style={{ position: "absolute", left: 78, top: 560, width: 400 }}>
            <MaskedText start={24} dur={13} stagger={4} lines={[[{ text: "is a customer" }], [{ text: "ready to move." }]]} fontSize={40} fontFamily={FONTS.body} fontWeight={400} lineHeight={1.2} color={COLORS.gray} letterSpacing={0} from={{ x: 0, y: 12 }} />
          </div>
          {/* Heartbeat accent + statement */}
          <div style={{ position: "absolute", left: 78, top: 720 }}>
            <svg width="180" height="46" viewBox="0 0 180 46" style={{ opacity: interpolate(frame, [34, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <path d="M0 23 L60 23 L72 6 L86 40 L98 16 L108 23 L180 23" fill="none" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 5px rgba(31,199,255,0.6))" }} />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 78, top: 780, width: 400 }}>
            <MaskedText start={38} dur={13} stagger={4} lines={[[{ text: "Every search is" }], [{ text: "a heartbeat." }]]} fontSize={40} fontFamily={FONTS.body} fontWeight={400} lineHeight={1.2} color={COLORS.gray} letterSpacing={0} from={{ x: 0, y: 12 }} />
          </div>
        </ParallaxLayer>

        {/* Bottom panels */}
        <ParallaxLayer depth={1}>
          <GlassPanel x={55} y={1500} width={970} height={150} appear={48} accent="cyan" radius={22} padding="0 30px">
            <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%" }}>
              <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
                <circle cx="36" cy="36" r="32" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.6" />
                <circle cx="32" cy="32" r="13" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" />
                <line x1="42" y1="42" x2="52" y2="52" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 34, color: COLORS.white }}>These searches happen all day,<br />across every category.</span>
            </div>
          </GlassPanel>
          <GlassPanel x={55} y={1690} width={970} height={100} appear={46} accent="gold" glow radius={20} padding="0 34px">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, height: "100%" }}>
              <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 34, color: COLORS.gold }}>Intent is already in motion.</span>
              <svg width="60" height="30" viewBox="0 0 60 30"><line x1="2" y1="15" x2="48" y2="15" stroke={COLORS.gold} strokeWidth="2.6" strokeLinecap="round" /><path d="M40 5 L55 15 L40 25" fill="none" stroke={COLORS.gold} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </GlassPanel>
        </ParallaxLayer>
      </AbsoluteFill>
    </SceneCamera>
  );
};
