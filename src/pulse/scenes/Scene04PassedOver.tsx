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
import { TextDissolve } from "../TextDissolve";
import { COLORS, FONTS } from "../theme";

// Scene 04 — The business gets passed over. Sequence: global 212–304
// (local 0–92; nominal start local 10). The ranking routes have become
// street traffic: bright cyan routes stream past the dim storefront toward
// gold destinations elsewhere on the map.
const DUR = 92;

const BYPASS_ROUTES = [
  [
    { x: -40, y: 1180 },
    { x: 240, y: 1230 },
    { x: 520, y: 1220 },
    { x: 800, y: 1140 },
    { x: 1000, y: 1080 },
  ],
  [
    { x: -40, y: 1330 },
    { x: 260, y: 1360 },
    { x: 560, y: 1370 },
    { x: 840, y: 1300 },
    { x: 1060, y: 1240 },
  ],
  [
    { x: -40, y: 1470 },
    { x: 300, y: 1510 },
    { x: 620, y: 1520 },
    { x: 900, y: 1440 },
    { x: 1080, y: 1400 },
  ],
];

// Exit: the frozen routes collapse inward and split into five clean signal
// branches converging on the storefront (handing off to scene 05).
const COLLAPSE_BRANCHES = [
  [
    { x: 120, y: 900 },
    { x: 330, y: 1060 },
    { x: 540, y: 1215 },
  ],
  [
    { x: 540, y: 780 },
    { x: 540, y: 1000 },
    { x: 540, y: 1215 },
  ],
  [
    { x: 960, y: 900 },
    { x: 750, y: 1060 },
    { x: 540, y: 1215 },
  ],
  [
    { x: 140, y: 1580 },
    { x: 340, y: 1400 },
    { x: 540, y: 1215 },
  ],
  [
    { x: 940, y: 1580 },
    { x: 740, y: 1400 },
    { x: 540, y: 1215 },
  ],
];

export const Scene04PassedOver: React.FC = () => {
  const frame = useCurrentFrame();

  const bypass = interpolate(frame, [8, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.3, 0.3, 1),
  });
  // The business's signal contracts inward.
  const contraction = interpolate(frame, [20, 60], [0.45, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const disconnect = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Freeze then collapse.
  const freeze = interpolate(frame, [76, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const collapse = interpolate(frame, [80, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  const frozenFrame = frame < 76 ? frame : 76 + (frame - 76) * freeze;

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 40, y: 30, scale: 0.99 }}
      exitTo={{ x: 0, y: -40, scale: 1.015 }}
      driftX={-8}
      driftY={-10}
      rotate={-0.6}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        <PerspectiveMap seed={53} brightness={0.9} tilt={55} driftX={-frame * 0.05} />

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={60} y={950} width={960} height={720} count={14} seed={44} opacity={0.55} />

          {/* Traffic streaming past the business */}
          {BYPASS_ROUTES.map((line, i) => (
            <g key={i} opacity={1 - collapse}>
              <RoutePath
                points={line}
                progress={interpolate(frame, [8 + i * 5, 38 + i * 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
                frame={frozenFrame}
                arrows
                pulses={3}
                coreWidth={2.2}
                glowWidth={10}
                seed={33 + i}
              />
              <DataParticleStream points={line} progress={bypass} count={4} seed={39 + i} size={2.8} speed={0.016} />
            </g>
          ))}

          {/* Collapse into five signal branches (scene 05 handoff) */}
          {COLLAPSE_BRANCHES.map((line, i) => (
            <RoutePath
              key={`c${i}`}
              points={line}
              progress={collapse}
              frame={frame}
              pulses={1}
              coreWidth={2}
              glowWidth={9}
              seed={61 + i}
            />
          ))}

          {/* Gold destinations elsewhere */}
          <DestinationPin x={800} y={1140} appearFrame={22} pulseAt={44} scale={0.9} />
          <DestinationPin x={840} y={1300} appearFrame={28} pulseAt={52} />
          <DestinationPin x={900} y={1440} appearFrame={34} pulseAt={58} scale={0.82} />

          {/* The dim, disconnected business */}
          <StorefrontNode x={230} y={1460} brightness={0.22} ringActivity={contraction} appearFrame={0} label="YOUR BUSINESS" />
          <DestinationPin x={230} y={1290} appearFrame={4} dim color={COLORS.cyan} scale={0.7} />
          {/* Failed-signal badge */}
          {disconnect > 0 && (
            <g transform="translate(310 1270)" opacity={disconnect}>
              <circle cx={0} cy={0} r={17} fill="rgba(18,19,20,0.95)" stroke="rgba(167,175,183,0.6)" strokeWidth={1.6} />
              <path d="M -6 -2 Q 0 -8 6 -2" fill="none" stroke={COLORS.textDim} strokeWidth={2} strokeLinecap="round" />
              <circle cx={0} cy={5} r={1.8} fill={COLORS.textDim} />
              <line x1={-11} y1={11} x2={11} y2={-11} stroke="#E86A6A" strokeWidth={2.4} strokeLinecap="round" />
            </g>
          )}
        </svg>

        {/* Headline */}
        <div style={{ position: "absolute", left: 84, top: 160 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 260, y: 760 }} seed={61}>
            <MaterializedText
              startFrame={12}
              lineDuration={15}
              lineStagger={5}
              lines={[
                [{ text: "So if your business" }],
                [{ text: "is hard to spot online," }],
                [{ text: "it gets passed over.", color: COLORS.gold }],
              ]}
              fontSize={76}
              fontWeight={600}
              lineHeight={1.16}
              fragmentColor={COLORS.gold}
              seed={62}
            />
          </TextDissolve>
        </div>

        {/* Supporting copy — only after the bypass is visible */}
        <div style={{ position: "absolute", left: 84, top: 620 }}>
          <TextDissolve exitStart={80} exitDuration={11} pullTarget={{ x: 220, y: 480 }} seed={63}>
            <MaterializedText
              startFrame={48}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "Not because you’re worse —" }],
                [{ text: "because you’re easier to miss." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={64}
            />
          </TextDissolve>
        </div>

        <TechnicalTelemetry
          tag="SIGNAL / 04 — VISIBILITY GAP"
          readout="PASS.RATE"
          seed={38}
          opacity={interpolate(frame, [10, 18, 74, 82], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
