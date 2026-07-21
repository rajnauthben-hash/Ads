import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicMap, CustomerNode } from "../components/CinematicMap";
import { EnergyLine } from "../components/PersistentPulseRoute";
import { GlassPanel } from "../components/GlassPanel";
import { MaskedText } from "../components/MaskedText";
import { ParallaxLayer, SceneCamera } from "../components/SceneCamera";
import { PhoneSearchUI } from "../components/PhoneSearchUI";
import { heartbeatPath } from "../helpers";
import { COLORS, FONTS } from "../theme";

const DUR = 90;

// Route from the customer node rising up into the phone search bar.
const ROUTE = [
  { x: 185, y: 1330 },
  { x: 300, y: 1160 },
  { x: 270, y: 1010 },
  { x: 360, y: 900 },
  { x: 620, y: 660 },
  { x: 760, y: 520 },
];

export const Scene1: React.FC<{ fragment?: number }> = ({ fragment = 0 }) => {
  const frame = useCurrentFrame();
  const mapUp = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeP = interpolate(frame, [58, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneCamera duration={DUR} driftX={10} driftY={-8}>
      <AbsoluteFill>
        {/* Map light-sweep reveal */}
        <ParallaxLayer depth={0.25}>
          <div style={{ opacity: mapUp }}>
            <CinematicMap seed={11} brightness={0.85} warm={0.35} />
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(105deg, transparent, rgba(31,199,255,0.05) 40%, transparent 60%)", opacity: interpolate(frame, [0, 14, 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateX(${interpolate(frame, [0, 20], [-400, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }} />
        </ParallaxLayer>

        {/* Route + customer node */}
        <ParallaxLayer depth={0.55}>
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <EnergyLine points={ROUTE} progress={routeP} frame={frame} coreWidth={4} glowWidth={15} seed={2} />
            <CustomerNode x={185} y={1330} appear={6} scale={1.1} />
          </svg>
        </ParallaxLayer>

        {/* Phone */}
        <ParallaxLayer depth={0.7}>
          <PhoneSearchUI x={455} y={135} width={590} height={1370} appear={8} queryDone={26} resultsFrom={26} fragment={fragment} />
        </ParallaxLayer>

        {/* Text + panels */}
        <ParallaxLayer depth={1}>
          <div style={{ position: "absolute", left: 55, top: 262, width: 400 }}>
            <MaskedText
              start={5}
              lines={[[{ text: "Someone" }], [{ text: "near you" }], [{ text: "is searching" }]]}
              fontSize={90}
              fontWeight={850}
              lineHeight={0.96}
              condense={0.72}
              exitStart={fragment > 0 ? 0 : undefined}
            />
          </div>
          <div style={{ position: "absolute", left: 58, top: 648, width: 380 }}>
            <MaskedText
              start={22}
              dur={14}
              stagger={4}
              lines={[[{ text: "for exactly what you sell." }], [{ text: "They may never see" }], [{ text: "your business." }]]}
              fontSize={34}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.25}
              color={COLORS.gray}
              letterSpacing={0}
              from={{ x: 0, y: 14 }}
            />
          </div>

          {/* Recognition callout */}
          <GlassPanel x={38} y={815} width={392} height={150} appear={40} accent="cyan" glow radius={20} padding="0 26px">
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: "100%" }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ flexShrink: 0 }}>
                <circle cx="30" cy="30" r="27" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.5" />
                <path d="M10 30 L22 30 L27 18 L33 42 L38 26 L42 30 L50 30" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 30, color: COLORS.white, lineHeight: 1.2 }}>This could be<br />happening right now.</span>
            </div>
          </GlassPanel>
        </ParallaxLayer>

        {/* Bottom transition panel */}
        <ParallaxLayer depth={1}>
          <GlassPanel x={20} y={1565} width={1040} height={130} appear={52} accent="cyan" glow radius={24} padding="0 34px">
            <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%" }}>
              <svg width="66" height="66" viewBox="0 0 66 66" style={{ flexShrink: 0 }}>
                <circle cx="33" cy="33" r="30" fill="none" stroke={COLORS.cyan} strokeWidth="2" opacity="0.6" />
                <circle cx="30" cy="30" r="12" fill="none" stroke={COLORS.cyan} strokeWidth="2.4" />
                <line x1="39" y1="39" x2="47" y2="47" stroke={COLORS.cyan} strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 34, color: COLORS.white, flex: 1 }}>Every search begins a customer journey.</span>
              <svg width="70" height="34" viewBox="0 0 70 34" style={{ flexShrink: 0 }}>
                <line x1="2" y1="17" x2="58" y2="17" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" />
                <path d="M48 6 L64 17 L48 28" fill="none" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </GlassPanel>
        </ParallaxLayer>

        {/* Small animated heartbeat behind callout icon area (ambient) */}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.0 }}>
          <path d={heartbeatPath(0, 100, 50, 20)} />
        </svg>
      </AbsoluteFill>
    </SceneCamera>
  );
};
