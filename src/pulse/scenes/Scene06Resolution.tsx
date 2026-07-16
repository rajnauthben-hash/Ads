import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { DestinationPin } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { COLORS, FONTS } from "../theme";
import { splinePoint } from "../helpers";

// Scene 06 — The resolution. Sequence: global 362–450 (local 0–88; nominal
// start local 10). The five signal branches have merged into one bright,
// stable customer route: the storefront is fully lit, intent nodes activate
// along the path and a travelling pulse completes the connection. The final
// composition holds — no dissolve, no fade to black.
const DUR = 88;

const ROUTE = [
  { x: 330, y: 1590 },
  { x: 440, y: 1470 },
  { x: 560, y: 1330 },
  { x: 660, y: 1210 },
  { x: 770, y: 1120 },
  { x: 815, y: 1035 },
];

// Customer-intent nodes sitting on the route.
const INTENT_TS = [0.28, 0.55, 0.8];

export const Scene06Resolution: React.FC = () => {
  const frame = useCurrentFrame();

  const routeDraw = interpolate(frame, [6, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.5, 0.25, 1),
  });
  const illuminate = interpolate(frame, [4, 22], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The completing pulse travels the route once, then the system settles
  // into a steady premium heartbeat.
  const completion = interpolate(frame, [36, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.2, 0.4, 1),
  });
  const completionPos = splinePoint(ROUTE, completion);

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      enterFrom={{ x: 30, y: 40, scale: 0.99 }}
      driftX={6}
      driftY={-10}
      rotate={0.4}
      scaleFrom={1.005}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        {/* Cleaner, brighter neighborhood */}
        <PerspectiveMap seed={89} brightness={1.35} tilt={53} driftX={frame * 0.04} />

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={80} y={950} width={920} height={780} count={14} seed={66} opacity={0.6} />

          {/* The completed customer route — bright and stable */}
          <RoutePath points={ROUTE} progress={routeDraw} frame={frame} arrows pulses={3} coreWidth={2.6} glowWidth={13} glowOpacity={0.2} seed={95} />
          <DataParticleStream points={ROUTE} progress={routeDraw} count={4} seed={97} size={2.6} speed={0.014} />

          {/* Customer-intent nodes activating as the pulse passes */}
          {INTENT_TS.map((t, i) => {
            const p = splinePoint(ROUTE, t);
            const active = interpolate(frame, [36 + t * 18, 42 + t * 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const breathe = 0.8 + 0.2 * Math.sin(frame * 0.12 + i * 2);
            return (
              <g key={i} opacity={Math.max(0.35, active)}>
                <circle cx={p.x} cy={p.y} r={13 + active * 3} fill="rgba(18,19,20,0.9)" stroke={COLORS.cyan} strokeWidth={1.8} opacity={0.9} />
                <circle cx={p.x} cy={p.y} r={5} fill={COLORS.cyan} opacity={0.35 + 0.65 * active * breathe} />
                {active > 0 && active < 1 && (
                  <circle cx={p.x} cy={p.y} r={14 + active * 26} fill="none" stroke={COLORS.cyan} strokeWidth={1.4} opacity={(1 - active) * 0.7} />
                )}
              </g>
            );
          })}

          {/* Travelling pulse completing the connection */}
          {completion > 0 && completion < 1 && (
            <g>
              <circle cx={completionPos.x} cy={completionPos.y} r={11} fill={COLORS.cyan} opacity={0.25} />
              <circle cx={completionPos.x} cy={completionPos.y} r={4.5} fill="#DFFBFF" />
            </g>
          )}

          {/* Premium gold destination — one restrained pulse on completion */}
          <DestinationPin x={815} y={1035} appearFrame={26} scale={1.15} pulseAt={54} />

          {/* Fully lit storefront */}
          <StorefrontNode x={330} y={1660} scale={1.25} brightness={illuminate} ringActivity={0.8} appearFrame={0} label="YOUR BUSINESS" />
        </svg>

        {/* Main statement — assembles from gold and white fragments, holds */}
        <div style={{ position: "absolute", left: 84, top: 150 }}>
          <MaterializedText
            startFrame={12}
            lineDuration={15}
            lineStagger={6}
            lines={[
              [{ text: "If your business" }],
              [{ text: "looks premium" }],
              [{ text: "in person," }],
              [{ text: "it should look", color: COLORS.gold }],
              [{ text: "premium online too.", color: COLORS.gold }],
            ]}
            fontSize={78}
            fontWeight={600}
            lineHeight={1.14}
            fragmentColor={COLORS.gold}
            seed={81}
          />
        </div>

        {/* Supporting copy resolves cleanly */}
        <div style={{ position: "absolute", left: 84, top: 950 }}>
          <MaterializedText
            startFrame={46}
            lineDuration={14}
            lineStagger={4}
            lines={[
              [{ text: "Show up better, and turn more" }],
              [{ text: "nearby searches into real visits." }],
            ]}
            fontSize={33}
            fontFamily={FONTS.body}
            fontWeight={400}
            lineHeight={1.5}
            color={COLORS.textDim}
            letterSpacing={0}
            drift={{ x: 0, y: 12 }}
            seed={82}
          />
        </div>

        <TechnicalTelemetry
          tag="SIGNAL / 06 — CONNECTION COMPLETE"
          readout="VISITS.IN"
          seed={59}
          opacity={interpolate(frame, [10, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
