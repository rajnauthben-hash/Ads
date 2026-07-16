import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { RankingSystem } from "../RankingSystem";
import { SceneTransition } from "../SceneTransition";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { COLORS, FONTS } from "../theme";

// Scene 03 — People choose quickly. Sequence: global 152–232 (local 0–80;
// nominal start local 10). The compressed search results reorganize into
// ranked positions; cyan traffic splits toward the top three while the
// bottom half of the list loses the viewer's attention.
const DUR = 80;

// Feed line arriving from the folded search interface.
const FEED = [
  { x: 300, y: 420 },
  { x: 420, y: 560 },
  { x: 540, y: 660 },
];
// Traffic splitting toward positions 01–03 (card left edges).
const SPLITS = [
  [
    { x: 540, y: 660 },
    { x: 420, y: 700 },
    { x: 232, y: 760 },
  ],
  [
    { x: 540, y: 660 },
    { x: 440, y: 790 },
    { x: 232, y: 878 },
  ],
  [
    { x: 540, y: 660 },
    { x: 460, y: 890 },
    { x: 232, y: 996 },
  ],
];
// Exit: the active routes stretch and curve down-left into scene 04's
// bypassing traffic.
const EXIT_ROUTES = [
  [
    { x: 232, y: 760 },
    { x: 120, y: 980 },
    { x: 60, y: 1240 },
  ],
  [
    { x: 232, y: 878 },
    { x: 140, y: 1080 },
    { x: 90, y: 1330 },
  ],
];

export const Scene03Ranking: React.FC = () => {
  const frame = useCurrentFrame();

  const feedIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const splitProgress = interpolate(frame, [26, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.6, 0.3, 1),
  });
  const narrowing = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitStretch = interpolate(frame, [66, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.75, 0.4),
  });

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 0, y: 50, scale: 0.988 }}
      exitTo={{ x: -30, y: 60, scale: 1.02 }}
      driftX={6}
      driftY={-8}
      rotate={0.4}
      // The field of view narrows slightly — limited attention.
      scaleFrom={1}
      scaleTo={1.045}
    >
      <AbsoluteFill>
        <div style={{ opacity: 0.55 }}>
          <PerspectiveMap seed={37} brightness={0.7} tilt={56} driftX={frame * 0.04} />
        </div>

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={60} y={620} width={960} height={800} count={10} seed={31} opacity={0.45} />
          <RoutePath points={FEED} progress={feedIn} frame={frame} pulses={2} coreWidth={2.2} glowWidth={10} seed={16} />
          {SPLITS.map((line, i) => (
            <RoutePath
              key={i}
              points={line}
              progress={interpolate(frame, [26 + i * 6, 44 + i * 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              frame={frame}
              pulses={2}
              coreWidth={1.8}
              glowWidth={8}
              seed={17 + i}
            />
          ))}
          {SPLITS.map((line, i) => (
            <DataParticleStream key={`s${i}`} points={line} progress={splitProgress} count={3} seed={26 + i} size={2.6} speed={0.018} />
          ))}
          {EXIT_ROUTES.map((line, i) => (
            <RoutePath key={`e${i}`} points={line} progress={exitStretch} frame={frame} pulses={1} coreWidth={2.2} glowWidth={10} seed={19 + i} />
          ))}
        </svg>

        {/* Headline — quick but elegant */}
        <div style={{ position: "absolute", left: 84, top: 148 }}>
          <TextDissolve exitStart={66} exitDuration={11} pullTarget={{ x: -180, y: 700 }} seed={51}>
            <MaterializedText
              startFrame={8}
              lineDuration={13}
              lineStagger={4}
              lines={[
                [{ text: "And they" }],
                [{ text: "usually " }, { text: "don’t", color: COLORS.goldWarm }],
                [{ text: "look for long.", color: COLORS.goldWarm }],
              ]}
              fontSize={92}
              fontWeight={600}
              lineHeight={1.1}
              fragmentColor={COLORS.gold}
              seed={52}
            />
          </TextDissolve>
        </div>

        {/* Ranked positions rising from the map */}
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 700,
            transform: `translate3d(${exitStretch * -70}px, ${exitStretch * 130}px, 0)`,
            opacity: 1 - exitStretch,
          }}
        >
          <RankingSystem buildFrame={12} attentionNarrowing={Math.max(narrowing, exitStretch)} width={660} />
        </div>

        {/* Supporting copy */}
        <div style={{ position: "absolute", left: 84, top: 1585 }}>
          <TextDissolve exitStart={68} exitDuration={11} pullTarget={{ x: -140, y: -260 }} seed={53}>
            <MaterializedText
              startFrame={30}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "They pick from the first few" }],
                [{ text: "places that look right." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={54}
            />
          </TextDissolve>
        </div>

        {/* Attention vignette tightening with the narrowing */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(9,11,13,0.85) 100%)",
            opacity: narrowing * 0.8,
            pointerEvents: "none",
          }}
        />

        <TechnicalTelemetry
          tag="SIGNAL / 03 — DECISION WINDOW"
          readout="DWELL.MS"
          seed={22}
          opacity={interpolate(frame, [10, 18, 62, 70], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
