import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { buildRoute, makeCamera, prog, ezIn } from "../util";
import { MaterializedText } from "../components/MaterializedText";
import { TextDissolve } from "../components/TextDissolve";
import { PerspectiveMap } from "../components/PerspectiveMap";
import { PersistentPulseRoute } from "../components/PersistentPulseRoute";
import { DestinationPin } from "../components/DestinationPin";
import { DataParticle } from "../components/DataParticle";
import { TechnicalTelemetry } from "../components/TechnicalTelemetry";
import { SceneTransition } from "../components/SceneTransition";
import { SearchInterface, MODULE_FIRST_Y, MODULE_ROW_H } from "../components/SearchInterface";

// Sequence: global 90–171 (local 0–81; nominal scene ends local 71).

const PANEL = { x: 66, y: 300, w: 508 };

// The scene-01 route arrives from the top-left and becomes the cable that
// powers the search interface.
const INLET = buildRoute(
  [
    { x: -60, y: 40 },
    { x: 140, y: 130 },
    { x: 210, y: 230 },
    { x: PANEL.x + 180, y: PANEL.y + 8 },
  ],
  60,
);

const moduleY = (i: number): number => PANEL.y + MODULE_FIRST_Y + i * MODULE_ROW_H + (MODULE_ROW_H - 14) / 2;

// Data streams from every module into the map's gold destinations.
const STREAMS = [
  buildRoute(
    [
      { x: PANEL.x + PANEL.w, y: moduleY(0) },
      { x: 700, y: moduleY(0) - 30 },
      { x: 812, y: 470 },
    ],
    80,
  ),
  buildRoute(
    [
      { x: PANEL.x + PANEL.w, y: moduleY(1) },
      { x: 660, y: moduleY(1) + 40 },
      { x: 706, y: 812 },
    ],
    80,
  ),
  buildRoute(
    [
      { x: PANEL.x + PANEL.w, y: moduleY(2) },
      { x: 664, y: moduleY(2) + 60 },
      { x: 812, y: 470 },
    ],
    80,
  ),
  buildRoute(
    [
      { x: PANEL.x + PANEL.w, y: moduleY(3) },
      { x: 700, y: moduleY(3) + 90 },
      { x: 836, y: 1150 },
    ],
    80,
  ),
];

const STREAM_STARTS = [24, 30, 36, 42];

export const Scene02Search: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = makeCamera(frame, 82, { zoom: 0.035, dx: 14, dy: -8, rot: -0.5, originX: 42, originY: 52 });

  const exitP = prog(frame, 70, 12, ezIn);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — map on the right */}
      <div style={cam(0.55)}>
        <SceneTransition frame={frame} exit={{ start: 70, dur: 12, to: { y: 60, opacity: 0.35 } }}>
          <PerspectiveMap
            frame={frame + 120}
            seed={23}
            x={860}
            y={820}
            tilt={52}
            rotate={9}
            scale={1.02}
            opacity={prog(frame, 0, 16) * 0.95}
            driftX={0.05}
            driftY={-0.03}
          />
        </SceneTransition>
      </div>

      {/* PLANE 3 — interface, streams, destinations */}
      <div style={cam(1)}>
        <SceneTransition
          frame={frame}
          exit={{ start: 70, dur: 12, to: { y: 240, scaleY: 0.24, opacity: 0 } }}
          origin="50% 78%"
        >
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* incoming cable from scene 01 */}
            <PersistentPulseRoute
              route={INLET}
              frame={frame}
              idPrefix="s2in"
              draw={{ start: 0, dur: 10 }}
              retract={{ start: 10, dur: 16 }}
              coreWidth={3}
              glowWidth={13}
              highlightSpeed={15}
            />
            {/* data streams out of each module */}
            {STREAMS.map((r, i) => (
              <PersistentPulseRoute
                key={i}
                route={r}
                frame={frame}
                idPrefix={`s2st${i}`}
                draw={{ start: STREAM_STARTS[i], dur: 16 }}
                coreWidth={1.6}
                glowWidth={6}
                highlight={false}
                opacity={0.75}
              />
            ))}
            {STREAMS.map((r, i) =>
              frame > STREAM_STARTS[i] + 12 ? (
                <g key={`p${i}`}>
                  <DataParticle route={r} frame={frame} seed={i * 3 + 1} speed={0.016} size={2.8} />
                  <DataParticle route={r} frame={frame} seed={i * 5 + 2} speed={0.012} size={2.2} opacity={0.6} />
                </g>
              ) : null,
            )}

            {/* gold destinations lighting up as intent reaches them */}
            <DestinationPin x={812} y={470} frame={frame} appear={32} size={1.05} icon="fork" rings idPrefix="s2p1" />
            <DestinationPin x={706} y={812} frame={frame} appear={39} size={0.95} icon="coffee" rings idPrefix="s2p2" />
            <DestinationPin x={836} y={1150} frame={frame} appear={46} size={1} icon="bag" rings idPrefix="s2p3" />
          </svg>

          <SearchInterface frame={frame} x={PANEL.x} y={PANEL.y} width={PANEL.w} appear={5} streamStarts={STREAM_STARTS} />
        </SceneTransition>
      </div>

      {/* PLANE 4 — typography */}
      <div style={cam(1.12)}>
        <TechnicalTelemetry frame={frame} x={992} y={96} appear={4} rows={["QUERY STREAM", "MODULES 04 / 04"]} opacity={1 - exitP} />

        <TextDissolve frame={frame} start={68} dur={11} pull={{ x: 130, y: -60 }} seed={21} style={{ position: "absolute", left: 84, top: 1128 }}>
          <MaterializedText
            frame={frame}
            start={14}
            lines={[
              "Most people",
              <span key="s"><span style={{ color: C.cyan }}>search</span> before</span>,
              "they go",
              "anywhere.",
            ]}
            fontSize={95}
            weight={600}
            lineHeight={1.1}
            letterSpacing={-0.025}
            fragments="cyan"
            seed={31}
            revealDur={17}
            lineStagger={5}
          />
        </TextDissolve>

        <TextDissolve frame={frame} start={70} dur={10} pull={{ x: 100, y: -40 }} seed={27} style={{ position: "absolute", left: 84, top: 1590 }}>
          <MaterializedText
            frame={frame}
            start={32}
            lines={["They check Google Maps, reviews,", "photos, and opening hours first."]}
            fontSize={40}
            weight={400}
            font="Inter"
            color={C.text2}
            lineHeight={1.4}
            letterSpacing={-0.005}
            fragments="none"
            quiet
            seed={33}
          />
        </TextDissolve>
      </div>
    </AbsoluteFill>
  );
};
