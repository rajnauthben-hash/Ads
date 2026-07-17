import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO } from "../theme";
import { buildRoute, makeCamera, prog, ezIn } from "../util";
import { MaterializedText } from "../components/MaterializedText";
import { TextDissolve } from "../components/TextDissolve";
import { PerspectiveMap } from "../components/PerspectiveMap";
import { PersistentPulseRoute } from "../components/PersistentPulseRoute";
import { DataParticle } from "../components/DataParticle";
import { TechnicalTelemetry } from "../components/TechnicalTelemetry";
import { SceneTransition } from "../components/SceneTransition";
import { RankingSystem, rankRowCenter } from "../components/RankingSystem";

// Sequence: global 162–231 (local 0–69; nominal scene ends local 59).

const HUB = { x: 175, y: 1470 };
const LIST = { x: 596, y: 936 };
const ROW_H = 128;
const GAP = 26;

// Cyan intent splits toward the first three visible results.
const topRoutes = [0, 1, 2].map((i) =>
  buildRoute(
    [
      HUB,
      { x: 330 + i * 26, y: 1360 - i * 36 },
      { x: 430 + i * 30, y: rankRowCenter(LIST.y, i, ROW_H, GAP) + 60 - i * 20 },
      { x: LIST.x + 62, y: rankRowCenter(LIST.y, i, ROW_H, GAP) + 24 },
    ],
    52,
  ),
);

// Exit: the active routes stretch and curve downward — becoming the
// bypassing traffic of scene 04.
const EXIT_ROUTE = buildRoute(
  [
    { x: LIST.x + 62, y: rankRowCenter(LIST.y, 2, ROW_H, GAP) + 24 },
    { x: 700, y: 1560 },
    { x: 660, y: 1780 },
    { x: 700, y: 1990 },
  ],
  70,
);

export const Scene03Ranking: React.FC = () => {
  const frame = useCurrentFrame();
  // limited attention: the field of view narrows slightly
  const cam = makeCamera(frame, 70, { zoom: 0.055, dx: -10, dy: -14, rot: 0.4, originX: 60, originY: 55 });

  const labelP = prog(frame, 2, 12);
  const hubPulse = 0.6 + 0.4 * Math.sin(frame * 0.22);
  const vignette = interpolate(frame, [26, 58], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitP = prog(frame, 58, 12, ezIn);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — city map lower-left */}
      <div style={cam(0.55)}>
        <SceneTransition frame={frame} exit={{ start: 60, dur: 12, to: { y: -50, opacity: 0.5 } }}>
          <PerspectiveMap
            frame={frame + 260}
            seed={37}
            x={330}
            y={1430}
            tilt={58}
            rotate={-7}
            scale={1.05}
            opacity={prog(frame, 0, 14) * 0.95}
          />
        </SceneTransition>
      </div>

      {/* PLANE 3 — hub, split routes, ranking list */}
      <div style={cam(1)}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* search hub — compressed remains of the interface */}
          <g opacity={prog(frame, 0, 10)}>
            <circle cx={HUB.x} cy={HUB.y} r={30 + hubPulse * 8} fill={C.cyan} opacity={0.12} />
            <circle cx={HUB.x} cy={HUB.y} r={16} fill={C.cyan} opacity={0.28} />
            <circle cx={HUB.x} cy={HUB.y} r={7.5} fill="#DFF8FF" opacity={0.95} />
            {[0, 1, 2].map((i) => {
              const q = ((frame * 0.018 + i / 3) % 1 + 1) % 1;
              return (
                <ellipse
                  key={i}
                  cx={HUB.x}
                  cy={HUB.y}
                  rx={26 + q * 120}
                  ry={11 + q * 48}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={1.6}
                  opacity={(1 - q) * 0.45}
                />
              );
            })}
          </g>

          {topRoutes.map((r, i) => (
            <PersistentPulseRoute
              key={i}
              route={r}
              frame={frame}
              idPrefix={`s3r${i}`}
              draw={{ start: 14 + i * 5, dur: 18 }}
              coreWidth={2.2}
              glowWidth={9}
              highlightSpeed={11}
              pulses={{ count: 2, speed: 0.014, size: 3.6 }}
            />
          ))}
          {topRoutes.map((r, i) =>
            frame > 30 + i * 5 ? <DataParticle key={`d${i}`} route={r} frame={frame} seed={i * 7 + 2} speed={0.013} size={2.6} /> : null,
          )}

          {/* exit — routes stretch into bypassing traffic */}
          <PersistentPulseRoute
            route={EXIT_ROUTE}
            frame={frame}
            idPrefix="s3x"
            draw={{ start: 58, dur: 12 }}
            coreWidth={3}
            glowWidth={12}
            highlightSpeed={14}
          />
        </svg>

        <SceneTransition frame={frame} exit={{ start: 62, dur: 9, to: { x: 60, opacity: 0, blur: 4 } }}>
          <RankingSystem
            frame={frame}
            x={LIST.x}
            y={LIST.y}
            start={8}
            rowH={ROW_H}
            gap={GAP}
            dimStart={36}
            exitInactive={{ start: 52, dur: 12 }}
          />
        </SceneTransition>
      </div>

      {/* PLANE 4 — typography */}
      <div style={cam(1.12)}>
        {/* scene index */}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 158,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: labelP * (1 - exitP),
          }}
        >
          <div style={{ width: 54 * labelP, height: 2, background: C.goldWarm, opacity: 0.9 }} />
          <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 30, letterSpacing: 6, color: C.goldWarm }}>03</div>
        </div>

        <TextDissolve frame={frame} start={58} dur={11} pull={{ x: 90, y: 120 }} seed={41} style={{ position: "absolute", left: 92, top: 246 }}>
          <MaterializedText
            frame={frame}
            start={4}
            lines={[
              "And they",
              <span key="b">usually <span style={{ color: C.goldWarm }}>don’t</span></span>,
              <span key="c" style={{ color: C.goldWarm }}>look for long.</span>,
            ]}
            fontSize={92}
            weight={600}
            lineHeight={1.1}
            letterSpacing={-0.025}
            fragments="gold"
            seed={43}
            revealDur={14}
            lineStagger={4}
          />
        </TextDissolve>

        <TextDissolve frame={frame} start={60} dur={10} pull={{ x: 70, y: 100 }} seed={47} style={{ position: "absolute", left: 92, top: 620 }}>
          <MaterializedText
            frame={frame}
            start={16}
            lines={["They pick from the first few", "places that look right."]}
            fontSize={40}
            weight={400}
            font="Inter"
            color={C.text2}
            lineHeight={1.4}
            letterSpacing={-0.005}
            fragments="none"
            quiet
            seed={49}
          />
        </TextDissolve>

        <TechnicalTelemetry frame={frame} x={992} y={96} appear={6} rows={["ATTENTION SPAN", "TOP 03 / 06"]} opacity={1 - exitP} />
      </div>

      {/* attention vignette — the world outside the top picks goes dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 92% 78% at 58% 52%, transparent 55%, rgba(5,6,8,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
