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

// Scene 01 — The hook. Frames 0–89 (sequence runs to 100 for the outgoing
// overlap). Near darkness; a pulse activates at the storefront, then the
// route visibly leaves the business for brighter gold destinations while
// the three copy blocks materialize.
const ROUTE = [
  { x: 250, y: 1545 },
  { x: 400, y: 1470 },
  { x: 560, y: 1420 },
  { x: 700, y: 1330 },
  { x: 830, y: 1250 },
];
const BRANCH_A = [
  { x: 700, y: 1330 },
  { x: 720, y: 1230 },
  { x: 700, y: 1140 },
];
const BRANCH_B = [
  { x: 830, y: 1250 },
  { x: 880, y: 1350 },
  { x: 900, y: 1440 },
];
// Transition object: the route accelerating toward the top of frame,
// where it becomes scene 02's search-interface cable.
const EXIT_ROUTE = [
  { x: 830, y: 1250 },
  { x: 780, y: 1000 },
  { x: 620, y: 720 },
  { x: 470, y: 560 },
];

const DUR = 100;

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Darkness lifts as the first pulse activates (frames 0–8).
  const wake = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const routeProgress = interpolate(frame, [15, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.2, 0.3, 1),
  });
  const branchProgress = interpolate(frame, [40, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The storefront's signal ring tries to activate but weakens.
  const ringActivity = interpolate(frame, [12, 34, 62, 86], [0, 0.55, 0.22, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: the route accelerates upward and the text is pulled into it.
  const exitProgress = interpolate(frame, [80, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.6, 0, 0.7, 0.4),
  });

  return (
    <SceneTransition
      duration={DUR}
      exitFrames={10}
      exitTo={{ x: 30, y: -80, scale: 1.025 }}
      driftX={8}
      driftY={-14}
      rotate={0.6}
      scaleTo={1.028}
    >
      <AbsoluteFill style={{ opacity: 0.25 + 0.75 * wake }}>
        <PerspectiveMap seed={11} brightness={0.85 * wake} driftX={-frame * 0.06} />

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={80} y={1000} width={920} height={800} count={16} seed={4} opacity={0.5} />

          {/* Route leaving the business */}
          <RoutePath points={ROUTE} progress={routeProgress} frame={frame} arrows pulses={3} seed={2} />
          <RoutePath points={BRANCH_A} progress={branchProgress} frame={frame} pulses={1} coreWidth={1.6} glowWidth={8} seed={3} />
          <RoutePath points={BRANCH_B} progress={branchProgress} frame={frame} pulses={1} coreWidth={1.6} glowWidth={8} seed={4} />
          <DataParticleStream points={ROUTE} progress={routeProgress} count={5} seed={6} />

          {/* Exit acceleration toward the search interface */}
          <RoutePath points={EXIT_ROUTE} progress={exitProgress} frame={frame} pulses={2} coreWidth={2.6} glowWidth={12} seed={5} />

          {/* Gold destinations receiving the traffic */}
          <DestinationPin x={700} y={1140} appearFrame={26} pulseAt={52} />
          <DestinationPin x={830} y={1250} appearFrame={32} pulseAt={60} scale={0.88} />
          <DestinationPin x={900} y={1440} appearFrame={38} pulseAt={66} scale={0.8} />
          {/* The business's own marker — dimmer than the competition */}
          <DestinationPin x={250} y={1545} appearFrame={10} dim color={COLORS.cyan} scale={0.75} />

          <StorefrontNode x={250} y={1600} brightness={0.3} ringActivity={ringActivity} appearFrame={4} label="YOUR BUSINESS" />
        </svg>

        {/* Copy stack */}
        <div style={{ position: "absolute", left: 84, top: 168, right: 70 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 360, y: 300 }} seed={21}>
            <MaterializedText
              startFrame={8}
              lines={[
                [{ text: "You might not be losing customers to" }],
                [{ text: "better businesses." }],
              ]}
              fontSize={47}
              fontWeight={500}
              lineHeight={1.24}
              seed={31}
            />
          </TextDissolve>

          <TextDissolve exitStart={80} exitDuration={12} pullTarget={{ x: 320, y: 160 }} seed={22} style={{ marginTop: 46 }}>
            <MaterializedText
              startFrame={20}
              lineDuration={18}
              lineStagger={6}
              lines={[
                [{ text: "You’re losing them" }],
                [{ text: "to the businesses", color: COLORS.gold }],
                [{ text: "that show up first.", color: COLORS.gold }],
              ]}
              fontSize={84}
              fontWeight={600}
              lineHeight={1.12}
              fragmentColor={COLORS.gold}
              seed={32}
            />
          </TextDissolve>

          <TextDissolve exitStart={82} exitDuration={12} pullTarget={{ x: 280, y: -60 }} seed={23} style={{ marginTop: 46 }}>
            <MaterializedText
              startFrame={34}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "For a lot of people, that choice" }],
                [{ text: "happens before they ever" }],
                [{ text: "reach your street." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={33}
            />
          </TextDissolve>
        </div>

        <TechnicalTelemetry tag="SIGNAL / 01 — LOCAL INTENT" readout="TRAFFIC.OUT" seed={1} opacity={wake} />
      </AbsoluteFill>
    </SceneTransition>
  );
};
