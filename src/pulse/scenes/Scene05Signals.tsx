import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { SignalNode } from "../SignalNode";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { COLORS, FONTS } from "../theme";

// Scene 05 — What actually matters. Sequence: global 284–382 (local 0–98;
// nominal start local 10). The collapsed traffic has become five clean
// signal branches: PHOTOS / REVIEWS / CATEGORIES / HOURS / UPDATES, each
// charging the storefront as it connects.
const DUR = 98;

const STORE = { x: 540, y: 1360 };

const NODES = [
  { label: "PHOTOS", icon: "photos" as const, x: 158, y: 1195 },
  { label: "REVIEWS", icon: "reviews" as const, x: 300, y: 966 },
  { label: "CATEGORIES", icon: "categories" as const, x: 540, y: 878 },
  { label: "HOURS", icon: "hours" as const, x: 780, y: 966 },
  { label: "UPDATES", icon: "updates" as const, x: 922, y: 1195 },
];

const connection = (n: { x: number; y: number }) => [
  { x: n.x, y: n.y + 60 },
  { x: (n.x + STORE.x) / 2, y: (n.y + STORE.y) / 2 + 30 },
  { x: STORE.x, y: STORE.y - 90 },
];

// Exit: all branches flash together and the energy leaves as one bright
// route toward scene 06's storefront.
const EXIT_ROUTE = [
  { x: 540, y: 1300 },
  { x: 430, y: 1460 },
  { x: 330, y: 1590 },
];

const KEYWORD_FRAMES = [14, 26, 38, 50, 62];

export const Scene05Signals: React.FC = () => {
  const frame = useCurrentFrame();

  // Each landed connection charges the storefront.
  const charge = KEYWORD_FRAMES.reduce(
    (acc, f) =>
      acc +
      interpolate(frame, [f + 8, f + 18], [0, 0.16], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    0.18,
  );
  const ringActivity = interpolate(frame, [16, 80], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Simultaneous surge, then collapse into one route.
  const surge = interpolate(frame, [84, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitRoute = interpolate(frame, [88, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.7, 0.5),
  });

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 0, y: -40, scale: 1.012 }}
      exitTo={{ x: -30, y: 50, scale: 0.995 }}
      driftX={0}
      driftY={-16}
      rotate={0.5}
      scaleTo={1.035}
    >
      <AbsoluteFill>
        {/* Dense radial map interface */}
        <div style={{ opacity: 0.7 }}>
          <PerspectiveMap seed={71} brightness={0.8 + charge * 0.3} tilt={58} driftY={-frame * 0.04} />
        </div>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          {/* Radial guides around the storefront */}
          {[240, 380, 520].map((r, i) => (
            <ellipse
              key={i}
              cx={STORE.x}
              cy={STORE.y - 60}
              rx={r}
              ry={r * 0.52}
              fill="none"
              stroke={COLORS.mutedUi}
              strokeWidth={1}
              strokeDasharray="4 10"
              opacity={0.6}
              transform={`rotate(${frame * (i % 2 === 0 ? 0.12 : -0.09)} ${STORE.x} ${STORE.y - 60})`}
            />
          ))}
          <DataParticleField x={80} y={1000} width={920} height={720} count={12} seed={55} opacity={0.5} />

          {/* Connections: each node feeds the storefront */}
          {NODES.map((n, i) => {
            const p = interpolate(frame, [KEYWORD_FRAMES[i] + 6, KEYWORD_FRAMES[i] + 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const pts = connection(n);
            return (
              <g key={n.label}>
                <RoutePath
                  points={pts}
                  progress={p}
                  frame={frame}
                  pulses={surge > 0 ? 3 : 1}
                  coreWidth={surge > 0 ? 2.6 : 1.8}
                  glowWidth={surge > 0 ? 13 : 8}
                  glowOpacity={0.14 + surge * 0.14}
                  seed={71 + i}
                />
                <DataParticleStream points={pts} progress={p} count={2} seed={81 + i} size={2.4} speed={0.02} />
              </g>
            );
          })}

          {/* Exit: one bright collapsed route */}
          <RoutePath points={EXIT_ROUTE} progress={exitRoute} frame={frame} pulses={2} coreWidth={3} glowWidth={14} seed={90} />

          {/* Storefront brightening with every connection */}
          <StorefrontNode
            x={STORE.x}
            y={STORE.y}
            scale={1.15}
            brightness={Math.min(1, charge + surge * 0.3)}
            ringActivity={ringActivity}
            appearFrame={0}
          />

          {/* Signal nodes */}
          {NODES.map((n, i) => (
            <SignalNode key={n.label} label={n.label} icon={n.icon} x={n.x} y={n.y} activateFrame={KEYWORD_FRAMES[i]} />
          ))}
        </svg>

        {/* Keyword stack — one keyword per node, same rhythm */}
        <div style={{ position: "absolute", left: 84, top: 140 }}>
          <TextDissolve exitStart={86} exitDuration={12} pullTarget={{ x: 420, y: 1200 }} seed={71}>
            <MaterializedText
              startFrame={14}
              lineDuration={12}
              lineStagger={12}
              lines={[
                [{ text: "Photos." }],
                [{ text: "Reviews." }],
                [{ text: "Categories." }],
                [{ text: "Hours." }],
                [{ text: "Updates." }],
              ]}
              fontSize={58}
              fontWeight={600}
              lineHeight={1.22}
              seed={72}
            />
          </TextDissolve>
        </div>

        {/* Body — trust / understand */}
        <div style={{ position: "absolute", left: 570, top: 168, width: 460 }}>
          <TextDissolve exitStart={87} exitDuration={11} pullTarget={{ x: -30, y: 1200 }} seed={73}>
            <MaterializedText
              startFrame={34}
              lineDuration={13}
              lineStagger={4}
              lines={[
                [{ text: "Those details help" }],
                [{ text: "people " }, { text: "trust", color: COLORS.goldWarm }, { text: " your" }],
                [{ text: "business — and help" }],
                [{ text: "Google " }, { text: "understand", color: COLORS.goldWarm }, { text: " it." }],
              ]}
              fontSize={34}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.52}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 14, y: 0 }}
              seed={74}
            />
          </TextDissolve>
        </div>

        {/* Final technical lock-up */}
        <div style={{ position: "absolute", left: 84, top: 1700 }}>
          <TextDissolve exitStart={88} exitDuration={10} pullTarget={{ x: 260, y: -180 }} seed={75}>
            <MaterializedText
              startFrame={68}
              lineDuration={12}
              lineStagger={5}
              lines={[
                [{ text: "Stronger signals." }],
                [{ text: "Stronger presence.", color: COLORS.cyan }],
              ]}
              fontSize={40}
              fontFamily={FONTS.mono}
              fontWeight={500}
              lineHeight={1.35}
              letterSpacing={0.08}
              drift={{ x: 0, y: 10 }}
              seed={76}
            />
          </TextDissolve>
        </div>

        <TechnicalTelemetry tag="SIGNAL / 05 — PROFILE STRENGTH" readout="TRUST.IDX" seed={47} />
      </AbsoluteFill>
    </SceneTransition>
  );
};
