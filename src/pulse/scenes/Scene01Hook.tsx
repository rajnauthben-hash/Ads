import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { DepthCamera, DepthLayer } from "../DepthCamera";
import { DestinationPin } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { StorefrontIllumination } from "../StorefrontIllumination";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { EASE_ROUTE } from "../motion";
import { COLORS, FONTS } from "../theme";

// Scene 01 — The hook. Frames 0–89 (sequence runs to 100 for the outgoing
// overlap). Near darkness; the premium storefront reveals from shadow, the
// thick neon route energizes away from it toward a cluster of glowing gold
// destinations on the right, and the copy assembles in phrase groups.
const ROUTE = [
  { x: 258, y: 1655 },
  { x: 310, y: 1620 },
  { x: 415, y: 1555 },
  { x: 500, y: 1580 },
  { x: 585, y: 1520 },
  { x: 665, y: 1535 },
  { x: 730, y: 1465 },
  { x: 790, y: 1400 },
  { x: 830, y: 1300 },
  { x: 862, y: 1195 },
  { x: 875, y: 1115 },
];
// Transition object: the route accelerating toward the top of frame,
// where it becomes scene 02's search-interface cable.
const EXIT_ROUTE = [
  { x: 875, y: 1115 },
  { x: 800, y: 900 },
  { x: 620, y: 680 },
  { x: 420, y: 520 },
];

const DUR = 100;

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Darkness lifts as the first pulse activates (frames 0–10).
  const wake = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const routeProgress = interpolate(frame, [14, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_ROUTE,
  });
  // The storefront attempts one weak pulse as the gold phrase locks (~f56),
  // fails to attract the route, and contracts — the emotional beat.
  const ringActivity = interpolate(
    frame,
    [12, 34, 50, 56, 63, 72, 86],
    [0, 0.42, 0.24, 0.62, 0.2, 0.13, 0.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
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
      <AbsoluteFill style={{ opacity: 0.2 + 0.8 * wake }}>
        <DepthCamera mode="push" duration={DUR}>
        <DepthLayer factor={0.3}>
        <PerspectiveMap
          seed={11}
          brightness={0.95 * wake}
          driftX={-frame * 0.06}
          labels={["PINE ST", "OAK AVE", "MAPLE DR"]}
          goldDust={1}
        />

        {/* Atmospheric falloff pooling light around the destinations */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 40% 22% at 80% 55%, rgba(224,184,91,0.10), transparent 70%), radial-gradient(ellipse 45% 26% at 18% 78%, rgba(224,166,80,0.06), transparent 70%)",
            opacity: wake,
          }}
        />
        </DepthLayer>

        <DepthLayer factor={0.62}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={80} y={1000} width={920} height={800} count={14} seed={4} opacity={0.45} />

          {/* Thick neon route leaving the business */}
          <RoutePath
            points={ROUTE}
            progress={routeProgress}
            frame={frame}
            chevrons={4}
            pulses={3}
            coreWidth={5}
            glowWidth={22}
            glowOpacity={0.2}
            hot
            seed={2}
          />
          <DataParticleStream points={ROUTE} progress={routeProgress} count={5} seed={6} />

          {/* Exit acceleration toward the search interface */}
          <RoutePath points={EXIT_ROUTE} progress={exitProgress} frame={frame} pulses={2} coreWidth={3.4} glowWidth={14} hot seed={5} />

          {/* Premium storefront revealing from shadow */}
          <StorefrontNode
            x={200}
            y={1620}
            scale={1.55}
            brightness={0.34 + 0.16 * wake}
            ringActivity={ringActivity}
            appearFrame={2}
            label="YOUR BUSINESS"
          />
          {/* The business's cyan pin — on the sidewalk in front of the door */}
          <DestinationPin x={258} y={1655} appearFrame={8} flatBody="#0E3540" color={COLORS.cyan} scale={0.85} ringRichness={0.9} seed={4} />

          {/* Hero beat: pins awaken in sequence the moment "that show up
              first." resolves in gold (~f50) — the route visibly chooses
              them over the storefront. */}
          <DestinationPin x={875} y={1115} appearFrame={48} scale={1.35} icon="none" ringRichness={1.5} pulseAt={62} seed={11} />
          <DestinationPin x={755} y={965} appearFrame={54} scale={1} pulseAt={70} seed={12} />
          <DestinationPin x={815} y={815} appearFrame={60} scale={0.68} glow={0.8} seed={13} />
          <DestinationPin x={938} y={880} appearFrame={65} scale={0.6} glow={0.7} seed={14} />

          {/* Weak digital presence on the building itself */}
          <StorefrontIllumination x={200} y={1620} scale={1.55} strength={ringActivity * 0.45} />
        </svg>
        </DepthLayer>

        {/* Copy stack */}
        <DepthLayer factor={1}>
        <div style={{ position: "absolute", left: 100, top: 235, right: 60 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 360, y: 300 }} seed={21}>
            <MaterializedText
              startFrame={8}
              lines={[
                [{ text: "You might not be" }],
                [{ text: "losing customers to" }],
                [{ text: "better businesses." }],
              ]}
              fontSize={46}
              fontWeight={480}
              lineHeight={1.26}
              color="rgba(230,234,237,0.82)"
              seed={31}
            />
          </TextDissolve>

          <TextDissolve exitStart={80} exitDuration={12} pullTarget={{ x: 320, y: 160 }} seed={22} style={{ marginTop: 68 }}>
            <MaterializedText
              startFrame={20}
              lineDuration={18}
              lineStagger={6}
              lines={[
                [{ text: "You’re losing them" }],
                [{ text: "to the businesses", color: COLORS.gold }],
                [{ text: "that show up first.", color: COLORS.gold }],
              ]}
              fontSize={80}
              fontWeight={620}
              lineHeight={1.13}
              fragmentColor={COLORS.gold}
              flavor={1}
              seed={32}
            />
          </TextDissolve>

          <TextDissolve exitStart={82} exitDuration={12} pullTarget={{ x: 280, y: -60 }} seed={23} style={{ marginTop: 44 }}>
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
        </DepthLayer>
        </DepthCamera>

        <TechnicalTelemetry
          tag="SIGNAL / 01 — LOCAL INTENT"
          readout="TRAFFIC.OUT"
          seed={1}
          opacity={
            0.75 *
            wake *
            interpolate(frame, [82, 90], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
