import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { buildRoute, makeCamera, prog, ezIn } from "../util";
import { MaterializedText } from "../components/MaterializedText";
import { TextDissolve } from "../components/TextDissolve";
import { PerspectiveMap } from "../components/PerspectiveMap";
import { PersistentPulseRoute } from "../components/PersistentPulseRoute";
import { StorefrontNode } from "../components/StorefrontNode";
import { DestinationPin } from "../components/DestinationPin";
import { DataParticle } from "../components/DataParticle";
import { TechnicalTelemetry } from "../components/TechnicalTelemetry";
import { SceneTransition } from "../components/SceneTransition";

// Sequence: frames 0–99 (nominal scene 0–89, exit overlaps scene 02).

// The route leaves the business... toward the competition.
const MAIN_ROUTE = buildRoute(
  [
    { x: 235, y: 1462 },
    { x: 420, y: 1345 },
    { x: 545, y: 1385 },
    { x: 655, y: 1265 },
    { x: 705, y: 1115 },
    { x: 668, y: 980 },
    { x: 775, y: 885 },
    { x: 822, y: 775 },
  ],
  46,
);

const BRANCH_A = buildRoute(
  [
    { x: 705, y: 1115 },
    { x: 790, y: 1040 },
    { x: 918, y: 1010 },
  ],
  36,
);

const BRANCH_B = buildRoute(
  [
    { x: 668, y: 980 },
    { x: 640, y: 830 },
    { x: 700, y: 705 },
  ],
  36,
);

// Exit: the route accelerates toward the upper area of the frame,
// becoming the search-interface cable of scene 02.
const EXIT_ROUTE = buildRoute(
  [
    { x: 822, y: 775 },
    { x: 730, y: 480 },
    { x: 480, y: 220 },
    { x: 210, y: 60 },
    { x: 60, y: -80 },
  ],
  70,
);

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = makeCamera(frame, 100, { zoom: 0.05, dx: -18, dy: 12, rot: 0.6 });

  // Frames 0–8: near darkness, a single cyan pulse activates at the store.
  const spark = prog(frame, 0, 9);
  const sparkFlash = interpolate(frame, [2, 6, 12], [0, 1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mapIn = prog(frame, 2, 22);
  // The storefront's own signal ring tries to activate... and weakens.
  const ringLevel = interpolate(frame, [12, 30, 48, 66], [0, 0.55, 0.62, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitP = prog(frame, 84, 14, ezIn);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — distant neighborhood grid */}
      <div style={cam(0.55)}>
        <SceneTransition frame={frame} exit={{ start: 86, dur: 14, to: { y: -70, opacity: 0.25, blur: 3 } }}>
          <PerspectiveMap frame={frame} seed={11} x={640} y={1330} tilt={56} rotate={-13} scale={1.06} opacity={mapIn * 0.9} />
        </SceneTransition>
      </div>

      {/* PLANE 3 — routes, storefront, destination pins */}
      <div style={cam(1)}>
        <SceneTransition frame={frame} exit={{ start: 86, dur: 14, to: { y: -140, opacity: 0.1, blur: 2 } }} origin="76% 30%">
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* activation spark near the storefront */}
            {spark > 0.01 ? (
              <g>
                <circle cx={235} cy={1462} r={6 + spark * 8} fill="#DFF8FF" opacity={0.9 * Math.max(sparkFlash, 0.4)} />
                <circle cx={235} cy={1462} r={14 + spark * 44} fill="none" stroke={C.cyan} strokeWidth={2} opacity={(1 - spark) * 0.9} />
                <circle cx={235} cy={1462} r={30 + spark * 26} fill={C.cyan} opacity={sparkFlash * 0.18} />
              </g>
            ) : null}

            <PersistentPulseRoute
              route={MAIN_ROUTE}
              frame={frame}
              idPrefix="s1m"
              draw={{ start: 15, dur: 46 }}
              pulses={{ count: 3, speed: 0.009, size: 4.5 }}
              arrows={[0.3, 0.62, 0.88]}
            />
            <PersistentPulseRoute
              route={BRANCH_A}
              frame={frame}
              idPrefix="s1a"
              draw={{ start: 40, dur: 16 }}
              coreWidth={1.8}
              glowWidth={7}
              highlight={false}
              opacity={0.8}
            />
            <PersistentPulseRoute
              route={BRANCH_B}
              frame={frame}
              idPrefix="s1b"
              draw={{ start: 44, dur: 14 }}
              coreWidth={1.8}
              glowWidth={7}
              highlight={false}
              opacity={0.8}
            />
            {frame > 34 ? (
              <>
                <DataParticle route={MAIN_ROUTE} frame={frame} seed={3} speed={0.012} />
                <DataParticle route={MAIN_ROUTE} frame={frame} seed={8} speed={0.01} size={2.4} opacity={0.7} />
              </>
            ) : null}

            {/* gold destinations receiving the traffic */}
            <DestinationPin x={822} y={775} frame={frame} appear={44} size={1.25} icon="star" rings idPrefix="s1p1" />
            <DestinationPin x={700} y={705} frame={frame} appear={54} size={0.85} icon="coffee" rings idPrefix="s1p2" />
            <DestinationPin x={918} y={1010} frame={frame} appear={48} size={0.8} icon="fork" idPrefix="s1p3" />
            <DestinationPin x={968} y={620} frame={frame} appear={58} size={0.6} dim={0.8} idPrefix="s1p4" />

            {/* exit acceleration route */}
            <PersistentPulseRoute
              route={EXIT_ROUTE}
              frame={frame}
              idPrefix="s1x"
              draw={{ start: 84, dur: 13 }}
              retract={{ start: 90, dur: 12 }}
              coreWidth={3.2}
              glowWidth={14}
              highlightSpeed={16}
            />
          </svg>

          {/* the business — dimmer than the destinations that win */}
          <StorefrontNode
            x={215}
            y={1560}
            frame={frame}
            width={390}
            glow={interpolate(frame, [0, 10, 40, 70], [0.12, 0.4, 0.42, 0.3], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
            pinColor={C.cyan}
            pinOpacity={0.5 + spark * 0.3}
            ringLevel={ringLevel}
            ringFlicker={frame > 40}
            idPrefix="s1sf"
          />
        </SceneTransition>
      </div>

      {/* PLANE 4 — typography + telemetry */}
      <div style={cam(1.12)}>
        <TechnicalTelemetry frame={frame} x={992} y={96} appear={10} rows={["LOCAL SEARCH", "INTENT / LIVE"]} opacity={1 - exitP} />

        {/* Statement 1 */}
        <TextDissolve frame={frame} start={82} dur={11} pull={{ x: 120, y: -160 }} seed={2} style={{ position: "absolute", left: 92, top: 208 }}>
          <MaterializedText
            frame={frame}
            start={8}
            lines={["You might not be losing customers to", "better businesses."]}
            fontSize={47}
            weight={500}
            color="#C9CFD4"
            letterSpacing={-0.015}
            fragments="cyan"
            seed={4}
          />
        </TextDissolve>

        {/* Statement 2 — the strong one, assembled from cyan + gold */}
        <TextDissolve frame={frame} start={83} dur={12} pull={{ x: 150, y: -190 }} seed={9} style={{ position: "absolute", left: 92, top: 392 }}>
          <MaterializedText
            frame={frame}
            start={20}
            lines={[
              <span key="a" style={{ color: C.text }}>You’re losing them</span>,
              <span key="b" style={{ color: C.goldWarm }}>to the businesses</span>,
              <span key="c" style={{ color: C.goldWarm }}>that show up first.</span>,
            ]}
            fontSize={84}
            weight={600}
            lineHeight={1.12}
            letterSpacing={-0.025}
            fragments="mixed"
            seed={7}
            revealDur={18}
            lineStagger={6}
          />
        </TextDissolve>

        {/* Supporting copy — quieter masked reveal */}
        <TextDissolve frame={frame} start={80} dur={10} pull={{ x: 90, y: -120 }} seed={13} style={{ position: "absolute", left: 92, top: 742 }}>
          <MaterializedText
            frame={frame}
            start={36}
            lines={["For a lot of people, that choice", "happens before they ever", "reach your street."]}
            fontSize={40}
            weight={400}
            font="Inter"
            color={C.text2}
            lineHeight={1.4}
            letterSpacing={-0.005}
            fragments="none"
            quiet
            seed={5}
          />
        </TextDissolve>
      </div>
    </AbsoluteFill>
  );
};
