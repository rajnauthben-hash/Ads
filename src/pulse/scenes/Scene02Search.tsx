import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { DestinationPin } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { SearchInterface } from "../SearchInterface";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { COLORS, FONTS } from "../theme";

// Scene 02 — Search happens first. Sequence: global 80–172 (local 0–92;
// nominal scene start at local 10). The route from scene 01 arrives as a
// cable that constructs the search bar; modules materialize and stream
// intent into the map on the right.
const DUR = 92;

// Incoming cable — continues scene 01's exit trajectory into the bar,
// arcing along the right side of the headline before plugging into the
// search field.
const CABLE = [
  { x: 700, y: -40 },
  { x: 780, y: 240 },
  { x: 700, y: 480 },
  { x: 420, y: 640 },
  { x: 150, y: 696 },
];

// Data lines from each module's right edge into the map.
const DATA_LINES = [
  [
    { x: 700, y: 866 },
    { x: 810, y: 900 },
    { x: 880, y: 1010 },
  ],
  [
    { x: 700, y: 980 },
    { x: 830, y: 1040 },
    { x: 905, y: 1180 },
  ],
  [
    { x: 700, y: 1094 },
    { x: 820, y: 1160 },
    { x: 860, y: 1320 },
  ],
  [
    { x: 700, y: 1208 },
    { x: 800, y: 1280 },
    { x: 900, y: 1430 },
  ],
];

export const Scene02Search: React.FC = () => {
  const frame = useCurrentFrame();

  const cableIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.4, 0.3, 1),
  });
  const dataFlow = interpolate(frame, [34, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: the interface compresses vertically into the ranking column.
  const fold = interpolate(frame, [80, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.55, 0, 0.8, 0.45),
  });

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 0, y: 40, scale: 0.99 }}
      exitTo={{ x: 0, y: -60, scale: 1.02 }}
      driftX={-10}
      driftY={-10}
      rotate={-0.5}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        {/* Map on the right receiving intent */}
        <div style={{ position: "absolute", right: -420, top: 380, width: 900, height: 1300, opacity: 0.9 }}>
          <PerspectiveMap seed={23} brightness={0.75 + 0.35 * dataFlow} tilt={50} width={1100} height={1200} driftX={frame * 0.05} />
        </div>

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={640} y={800} width={420} height={800} count={12} seed={14} opacity={0.6} />

          {/* Incoming cable from scene 01 */}
          <RoutePath points={CABLE} progress={cableIn} frame={frame} pulses={2} coreWidth={2.4} glowWidth={11} seed={7} />

          {/* Intent streams: modules -> map */}
          {DATA_LINES.map((line, i) => (
            <g key={i} opacity={1 - fold}>
              <RoutePath
                points={line}
                progress={interpolate(frame, [34 + i * 5, 52 + i * 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
                frame={frame}
                pulses={2}
                coreWidth={1.5}
                glowWidth={6}
                glowOpacity={0.12}
                seed={8 + i}
              />
              <DataParticleStream points={line} progress={dataFlow} count={3} seed={20 + i} size={2.4} speed={0.02} />
            </g>
          ))}

          {/* Gold destinations lighting as information reaches them */}
          <DestinationPin x={880} y={1010} appearFrame={46} scale={0.85} pulseAt={62} />
          <DestinationPin x={905} y={1180} appearFrame={52} scale={0.95} pulseAt={70} />
          <DestinationPin x={860} y={1320} appearFrame={58} scale={0.8} pulseAt={76} />
        </svg>

        {/* Headline */}
        <div style={{ position: "absolute", left: 84, top: 150 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 140, y: 420 }} seed={41}>
            <MaterializedText
              startFrame={12}
              lineDuration={16}
              lineStagger={5}
              lines={[
                [{ text: "Most people" }],
                [{ text: "search", color: COLORS.cyan }, { text: " before" }],
                [{ text: "they go" }],
                [{ text: "anywhere." }],
              ]}
              fontSize={92}
              fontWeight={600}
              lineHeight={1.1}
              seed={42}
            />
          </TextDissolve>
        </div>

        {/* Search interface constructing from the cable, folding out at exit */}
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 700,
            transformOrigin: "50% 20%",
            transform: `translate3d(${fold * 90}px, ${fold * 60}px, 0) scaleY(${1 - fold * 0.82}) scaleX(${1 - fold * 0.12})`,
            opacity: 1 - fold * fold,
            filter: fold > 0 ? `blur(${fold * 4}px)` : undefined,
          }}
        >
          <SearchInterface buildFrame={10} width={600} />
        </div>

        {/* Supporting copy */}
        <div style={{ position: "absolute", left: 84, top: 1580 }}>
          <TextDissolve exitStart={80} exitDuration={11} pullTarget={{ x: 220, y: -500 }} seed={43}>
            <MaterializedText
              startFrame={40}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "They check Google Maps, reviews," }],
                [{ text: "photos, and opening hours first." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={44}
            />
          </TextDissolve>
        </div>

        <TechnicalTelemetry
          tag="SIGNAL / 02 — SEARCH INTENT"
          readout="QUERY.VOL"
          seed={12}
          opacity={interpolate(frame, [10, 18, 74, 82], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
