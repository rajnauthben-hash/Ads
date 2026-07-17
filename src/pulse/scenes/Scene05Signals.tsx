import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField } from "../DataParticle";
import { DepthCamera, DepthLayer } from "../DepthCamera";
import { DestinationPin } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { SignalNetwork } from "../SignalNetwork";
import { StorefrontIllumination } from "../StorefrontIllumination";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { COLORS, FONTS } from "../theme";

// Scene 05 — What actually matters. Sequence: global 284–382 (local 0–98;
// nominal start local 10). The collapsed traffic has become five signal
// spokes around the storefront in the upper half — PHOTOS / REVIEWS /
// CATEGORIES / HOURS / UPDATES — each charging the business as it connects,
// while the giant keyword stack owns the lower-left.
const DUR = 98;

const STORE = { x: 683, y: 760 };

const NODES = [
  { label: "PHOTOS", icon: "photos" as const, x: 683, y: 215 },
  { label: "REVIEWS", icon: "reviews" as const, x: 415, y: 430 },
  { label: "CATEGORIES", icon: "categories" as const, x: 935, y: 430 },
  { label: "HOURS", icon: "hours" as const, x: 438, y: 830 },
  { label: "UPDATES", icon: "updates" as const, x: 913, y: 830 },
];

// Exit: all spokes surge and the energy leaves as one bright route toward
// scene 06's storefront in the lower-left.
const EXIT_ROUTE = [
  { x: STORE.x, y: STORE.y - 40 },
  { x: 520, y: 1080 },
  { x: 360, y: 1400 },
  { x: 245, y: 1630 },
];

const KEYWORD_FRAMES = [10, 20, 30, 40, 50];

export const Scene05Signals: React.FC = () => {
  const frame = useCurrentFrame();

  // Each landed connection charges the storefront.
  const charge = KEYWORD_FRAMES.reduce(
    (acc, f) =>
      acc +
      interpolate(frame, [f + 8, f + 18], [0, 0.15], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    0.2,
  );
  const ringActivity = interpolate(frame, [14, 78], [0.15, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const surge = interpolate(frame, [84, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitRoute = interpolate(frame, [88, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.7, 0.5),
  });
  const labelIn = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Per-signal storefront improvements, keyed to each node's connection:
  // 0 PHOTOS — window light, 1 REVIEWS — gold reputation glow,
  // 2 CATEGORIES — map relationship, 3 HOURS — status dot,
  // 4 UPDATES — telemetry rhythm.
  const improvements = KEYWORD_FRAMES.map((f) =>
    interpolate(frame, [f + 12, f + 22], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

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
        <DepthCamera mode="orbit" duration={DUR}>
        {/* Map clearly visible beneath the network */}
        <DepthLayer factor={0.28}>
        <div style={{ position: "absolute", left: -260, top: -420, width: 1700, height: 1750, opacity: 0.9 }}>
          <PerspectiveMap seed={71} brightness={0.85 + charge * 0.25} tilt={56} width={1650} height={1500} driftY={-frame * 0.04} labels={["MAIN ST", "OAK DRIVE"]} goldDust={0.85} />
        </div>
        {/* Keep the lower text field readable */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 42%, rgba(10,11,13,0.82) 62%, rgba(10,11,13,0.95) 100%)" }} />
        </DepthLayer>

        <DepthLayer factor={0.6}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          {/* Radial guides — the map relationship sharpens when CATEGORIES
              connects (hero improvement #3) */}
          {[300, 440].map((r, i) => (
            <ellipse
              key={i}
              cx={STORE.x}
              cy={STORE.y - 80}
              rx={r}
              ry={r * 0.62}
              fill="none"
              stroke={`rgba(0,216,255,${0.08 + 0.1 * improvements[2]})`}
              strokeWidth={1 + 0.5 * improvements[2]}
              strokeDasharray="4 10"
              transform={`rotate(${frame * (i % 2 === 0 ? 0.1 : -0.08)} ${STORE.x} ${STORE.y - 80})`}
            />
          ))}
          <DataParticleField x={300} y={150} width={700} height={800} count={12} seed={55} opacity={0.5} />

          {/* The five-spoke network: activations, connections, synchronized
              visibility pulse */}
          <SignalNetwork nodes={NODES} center={STORE} activationFrames={KEYWORD_FRAMES} frame={frame} surge={surge} />

          {/* Exit: one bright collapsed route toward scene 06 */}
          <RoutePath points={EXIT_ROUTE} progress={exitRoute} frame={frame} pulses={2} coreWidth={3.6} glowWidth={16} hot seed={90} />

          {/* Storefront brightening with every connection, gold pin above.
              PHOTOS lifts the windows; REVIEWS adds the gold reputation
              glow; HOURS lights the status dot; UPDATES starts a telemetry
              rhythm beside the door. */}
          <StorefrontNode
            x={STORE.x}
            y={STORE.y}
            scale={1.02}
            brightness={Math.min(1, 0.2 + improvements[0] * 0.3 + charge * 0.55 + surge * 0.3)}
            ringActivity={ringActivity}
            appearFrame={0}
            label="YOUR BUSINESS"
          />
          <StorefrontIllumination
            x={STORE.x}
            y={STORE.y}
            scale={1.02}
            strength={Math.min(1, charge * 0.9 + surge * 0.4)}
            goldAccent={improvements[1]}
          />
          {/* HOURS status indicator */}
          {improvements[3] > 0.02 && (
            <g transform={`translate(${STORE.x + 128} ${STORE.y - 148})`} opacity={improvements[3]}>
              <circle cx={0} cy={0} r={7} fill="rgba(12,13,15,0.9)" stroke={COLORS.gold} strokeWidth={1.4} />
              <circle cx={0} cy={0} r={3} fill={COLORS.gold} opacity={0.6 + 0.4 * Math.sin(frame * 0.16)} />
            </g>
          )}
          {/* UPDATES telemetry rhythm */}
          {improvements[4] > 0.02 && (
            <g transform={`translate(${STORE.x - 165} ${STORE.y - 40})`} opacity={improvements[4]}>
              {[0, 1, 2, 3, 4].map((i) => {
                const h = 6 + 12 * (0.5 + 0.5 * Math.sin(frame * 0.18 + i * 1.3));
                return <rect key={i} x={i * 8} y={-h} width={5} height={h} fill={COLORS.cyan} opacity={0.55} />;
              })}
            </g>
          )}
          <DestinationPin x={STORE.x} y={STORE.y - 256} appearFrame={6} scale={1.2} ringRichness={0.9} pulseAt={86} seed={31} />
        </svg>
        </DepthLayer>

        <DepthLayer factor={1}>
        {/* Scene index + progress dots */}
        <div style={{ position: "absolute", left: 64, top: 96, opacity: labelIn }}>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 24, letterSpacing: 4, color: COLORS.gold }}>05</div>
          <div style={{ width: 40, height: 1.5, background: COLORS.gold, opacity: 0.7, margin: "10px 0 16px" }} />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                margin: "10px 0",
                background: i === 1 ? COLORS.gold : "rgba(154,163,173,0.4)",
              }}
            />
          ))}
        </div>

        {/* Giant keyword stack — lower-left */}
        <div style={{ position: "absolute", left: 90, top: 940 }}>
          <TextDissolve exitStart={86} exitDuration={12} pullTarget={{ x: 500, y: -300 }} seed={71}>
            <MaterializedText
              startFrame={KEYWORD_FRAMES[0]}
              lineDuration={12}
              lineStagger={10}
              lines={[
                [{ text: "Photos." }],
                [{ text: "Reviews." }],
                [{ text: "Categories." }],
                [{ text: "Hours." }],
                [{ text: "Updates.", color: COLORS.gold }],
              ]}
              fontSize={92}
              fontWeight={640}
              lineHeight={1.12}
              fragmentColor={COLORS.gold}
              flavor={5}
              seed={72}
            />
          </TextDissolve>
        </div>

        {/* Gold rule + support copy */}
        <div style={{ position: "absolute", left: 94, top: 1490 }}>
          <TextDissolve exitStart={87} exitDuration={11} pullTarget={{ x: 460, y: -600 }} seed={73}>
            <div
              style={{
                width: 46,
                height: 3,
                background: COLORS.gold,
                marginBottom: 26,
                opacity: interpolate(frame, [54, 62], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            />
            <MaterializedText
              startFrame={56}
              lineDuration={12}
              lineStagger={3}
              lines={[
                [{ text: "Those details help" }],
                [{ text: "people " }, { text: "trust", color: COLORS.gold }, { text: " your" }],
                [{ text: "business — and help" }],
                [{ text: "Google " }, { text: "understand", color: COLORS.gold }, { text: " it." }],
              ]}
              fontSize={31}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.42}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 10 }}
              seed={74}
            />
          </TextDissolve>
        </div>

        {/* Bottom lockup with logomark */}
        <div style={{ position: "absolute", left: 94, top: 1782, display: "flex", alignItems: "center", gap: 22 }}>
          <TextDissolve exitStart={88} exitDuration={10} pullTarget={{ x: 420, y: -700 }} seed={75}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: interpolate(frame, [68, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <svg width="42" height="34" viewBox="0 0 42 34">
                <path d="M 4 30 L 15 6 L 22 20 L 27 11 L 38 30" fill="none" stroke={COLORS.gold} strokeWidth={2.4} strokeLinejoin="round" />
              </svg>
              <div style={{ width: 1, height: 40, background: "rgba(154,163,173,0.3)" }} />
              <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 25, lineHeight: 1.35, color: COLORS.textDim }}>
                Stronger signals.
                <br />
                Stronger presence.
              </div>
            </div>
          </TextDissolve>
        </div>
        </DepthLayer>
        </DepthCamera>

        <TechnicalTelemetry
          tag="SIGNAL / 05 — PROFILE STRENGTH"
          readout="TRUST.IDX"
          seed={47}
          opacity={
            0.6 *
            interpolate(frame, [10, 18, 80, 88], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
