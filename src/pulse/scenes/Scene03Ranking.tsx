import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { DepthCamera, DepthLayer } from "../DepthCamera";
import { RANK_ROW_SPACING, RankingSystem } from "../RankingSystem";
import { SceneTransition } from "../SceneTransition";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { EASE_UI } from "../motion";
import { COLORS, FONTS } from "../theme";

// Scene 03 — People choose quickly. Sequence: global 152–232 (local 0–80;
// nominal start local 10). The condensed search signals re-emerge from a
// bright cyan origin on the map and branch into a gold ranking spine: the
// top three entries lit and chosen, the bottom three dim and ignored.
const DUR = 80;

const ORIGIN = { x: 118, y: 1330 };
const SPINE_X = 640;
const ROWS_TOP = 918; // center of row 01
const rowY = (i: number) => ROWS_TOP + i * RANK_ROW_SPACING;

// Cyan branches: origin -> spine joints of the top three.
const BRANCHES = [
  [
    { x: ORIGIN.x, y: ORIGIN.y },
    { x: 300, y: 1210 },
    { x: 440, y: 1050 },
    { x: 560, y: 950 },
    { x: SPINE_X, y: rowY(0) },
  ],
  [
    { x: ORIGIN.x, y: ORIGIN.y },
    { x: 290, y: 1270 },
    { x: 430, y: 1180 },
    { x: 555, y: 1100 },
    { x: SPINE_X, y: rowY(1) },
  ],
  [
    { x: ORIGIN.x, y: ORIGIN.y },
    { x: 310, y: 1315 },
    { x: 470, y: 1265 },
    { x: SPINE_X, y: rowY(2) },
  ],
];
// Exit: the active branches stretch into scene 04's bypass route.
const EXIT_ROUTES = [
  [
    { x: SPINE_X, y: rowY(0) },
    { x: 430, y: 1100 },
    { x: 210, y: 1360 },
    { x: 90, y: 1620 },
  ],
  [
    { x: SPINE_X, y: rowY(2) },
    { x: 400, y: 1360 },
    { x: 160, y: 1560 },
  ],
];

export const Scene03Ranking: React.FC = () => {
  const frame = useCurrentFrame();

  const originWake = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const narrowing = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spineDraw = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_UI,
  });
  const dimSpine = interpolate(frame, [36, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitStretch = interpolate(frame, [66, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.75, 0.4),
  });
  const beat = 0.75 + 0.25 * Math.sin(frame * 0.12);

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
        <DepthCamera mode="narrow" duration={DUR}>
        {/* City below, weighted to the lower-left like the reference */}
        <DepthLayer factor={0.28}>
        <div style={{ position: "absolute", left: -420, top: 480, width: 1500, height: 1500, opacity: 0.85 }}>
          <PerspectiveMap seed={37} brightness={0.85} tilt={57} width={1500} height={1300} driftX={frame * 0.04} labels={["OAK AVE", "PINE ST"]} goldDust={0.7} />
        </div>
        </DepthLayer>

        <DepthLayer factor={0.6}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={60} y={900} width={520} height={800} count={12} seed={31} opacity={0.5} />

          {/* Bright cyan origin with radial rings */}
          <g opacity={originWake}>
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={40} fill={COLORS.cyan} opacity={0.14 * beat} />
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={22} fill={COLORS.cyan} opacity={0.24 * beat} />
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r={9} fill="#DFFBFF" />
            {[0, 1, 2].map((i) => {
              const ph = (frame * 0.012 + i / 3) % 1;
              return (
                <ellipse
                  key={i}
                  cx={ORIGIN.x}
                  cy={ORIGIN.y}
                  rx={20 + ph * 130}
                  ry={(20 + ph * 130) * 0.45}
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth={1.4}
                  opacity={(1 - ph) * 0.5 * originWake}
                />
              );
            })}
          </g>

          {/* Cyan branches to the top three */}
          {BRANCHES.map((line, i) => (
            <RoutePath
              key={i}
              points={line}
              progress={interpolate(frame, [10 + i * 6, 30 + i * 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              frame={frame}
              pulses={2}
              coreWidth={2.6}
              glowWidth={11}
              hot={i === 0}
              seed={17 + i}
            />
          ))}
          {BRANCHES.map((line, i) => (
            <DataParticleStream key={`s${i}`} points={line} progress={spineDraw} count={2} seed={26 + i} size={2.4} speed={0.018} />
          ))}

          {/* Gold ranking spine: solid across 01–03, dashed and dim below */}
          <line
            x1={SPINE_X}
            y1={rowY(0)}
            x2={SPINE_X}
            y2={rowY(0) + (rowY(2) - rowY(0)) * spineDraw}
            stroke={COLORS.gold}
            strokeWidth={2.2}
            opacity={0.85}
          />
          {dimSpine > 0 && (
            <line
              x1={SPINE_X}
              y1={rowY(2)}
              x2={SPINE_X}
              y2={rowY(2) + (rowY(5) - rowY(2)) * dimSpine}
              stroke="rgba(154,163,173,0.35)"
              strokeWidth={1.4}
              strokeDasharray="4 8"
              opacity={(1 - narrowing * 0.6) * 0.8}
            />
          )}
          {/* Spine joints + ticks toward each entry */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const active = i < 3;
            const on = active ? spineDraw > i / 3 : dimSpine > (i - 2) / 4;
            if (!on) {
              return null;
            }
            const c = active ? COLORS.gold : "rgba(154,163,173,0.4)";
            return (
              <g key={i} opacity={active ? 1 : 1 - narrowing * 0.55}>
                <circle cx={SPINE_X} cy={rowY(i)} r={active ? 6 : 4} fill={active ? COLORS.gold : COLORS.bg} stroke={c} strokeWidth={1.6} />
                {active && <circle cx={SPINE_X} cy={rowY(i)} r={10 + 3 * beat} fill="none" stroke={COLORS.gold} strokeWidth={1} opacity={0.4} />}
                <line x1={SPINE_X + 8} y1={rowY(i)} x2={SPINE_X + 26} y2={rowY(i)} stroke={c} strokeWidth={1.2} strokeDasharray={active ? "none" : "3 5"} opacity={0.7} />
              </g>
            );
          })}

          {/* Exit stretch toward scene 04 */}
          {EXIT_ROUTES.map((line, i) => (
            <RoutePath key={`e${i}`} points={line} progress={exitStretch} frame={frame} pulses={1} coreWidth={2.6} glowWidth={11} seed={19 + i} />
          ))}
        </svg>
        </DepthLayer>

        <DepthLayer factor={1}>
        {/* Scene index label */}
        <div style={{ position: "absolute", left: 100, top: 210, display: "flex", alignItems: "center", gap: 16, opacity: interpolate(frame, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ width: 54, height: 1.5, background: COLORS.gold, opacity: 0.8 }} />
          <div style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, color: COLORS.gold }}>03</div>
        </div>

        {/* Headline — all white, editorial */}
        <div style={{ position: "absolute", left: 100, top: 280 }}>
          <TextDissolve exitStart={66} exitDuration={11} pullTarget={{ x: -180, y: 700 }} seed={51}>
            <MaterializedText
              startFrame={8}
              lineDuration={13}
              lineStagger={4}
              lines={[
                [{ text: "And they" }],
                [{ text: "usually don’t" }],
                [{ text: "look for long." }],
              ]}
              fontSize={88}
              fontWeight={620}
              lineHeight={1.12}
              flavor={3}
              seed={52}
            />
          </TextDissolve>
        </div>

        {/* Supporting copy directly below the headline */}
        <div style={{ position: "absolute", left: 100, top: 645 }}>
          <TextDissolve exitStart={68} exitDuration={11} pullTarget={{ x: -140, y: 260 }} seed={53}>
            <MaterializedText
              startFrame={26}
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

        {/* Ranked entries — anchored so row centers land on the spine joints */}
        <div
          style={{
            position: "absolute",
            left: SPINE_X + 42,
            top: ROWS_TOP - 48,
            transform: `translate3d(${exitStretch * -60}px, ${exitStretch * 120}px, 0)`,
            opacity: 1 - exitStretch,
          }}
        >
          <RankingSystem buildFrame={14} attentionNarrowing={Math.max(narrowing, exitStretch)} />
        </div>
        </DepthLayer>
        </DepthCamera>

        {/* Attention vignette tightening with the narrowing */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 92% 72% at 50% 44%, transparent 55%, rgba(10,11,13,0.85) 100%)",
            opacity: narrowing * 0.8,
            pointerEvents: "none",
          }}
        />

        <TechnicalTelemetry
          tag="SIGNAL / 03 — DECISION WINDOW"
          readout="DWELL.MS"
          seed={22}
          opacity={
            0.75 *
            interpolate(frame, [10, 18, 62, 70], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
