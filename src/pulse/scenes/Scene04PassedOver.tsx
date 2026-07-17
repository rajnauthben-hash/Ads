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

// Sequence: global 222–303 (local 0–81; nominal scene ends local 71).

const STORE = { x: 205, y: 1420 };

// Traffic flows visibly PAST the business, bottom to top.
const BYPASS = buildRoute(
  [
    { x: 660, y: 2000 },
    { x: 730, y: 1700 },
    { x: 620, y: 1480 },
    { x: 700, y: 1290 },
    { x: 640, y: 1090 },
    { x: 790, y: 930 },
    { x: 740, y: 700 },
    { x: 850, y: 520 },
    { x: 800, y: 300 },
    { x: 840, y: 120 },
  ],
  56,
);

const BYPASS_2 = buildRoute(
  [
    { x: 900, y: 2000 },
    { x: 860, y: 1660 },
    { x: 940, y: 1380 },
    { x: 880, y: 1120 },
    { x: 960, y: 860 },
    { x: 920, y: 600 },
    { x: 985, y: 360 },
  ],
  60,
);

// The business tries to reach the stream... and fails.
const FAILED_BRANCH = buildRoute(
  [
    { x: STORE.x + 120, y: STORE.y - 60 },
    { x: 440, y: 1330 },
    { x: 560, y: 1370 },
  ],
  40,
);

const FREEZE_AT = 68; // routes freeze briefly, then collapse inward

export const Scene04PassedOver: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = makeCamera(frame, 82, { zoom: 0.04, dx: 12, dy: 10, rot: -0.6, originX: 45, originY: 55 });

  // The user's location signal contracts inward.
  const ringLevel = interpolate(frame, [8, 26, 44, 60], [0.5, 0.55, 0.28, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const failFade = interpolate(frame, [20, 30, 36, 46], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const disconnectP = prog(frame, 48, 10);
  const exitP = prog(frame, 72, 10, ezIn);
  // collapse of the whole route field toward the storefront (04 → 05)
  const collapse = prog(frame, 72, 10, ezIn);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — dense map */}
      <div style={cam(0.55)}>
        <SceneTransition frame={frame} exit={{ start: 72, dur: 10, to: { scale: 0.94, opacity: 0.4 } }} origin="30% 65%">
          <PerspectiveMap
            frame={frame + 400}
            seed={53}
            x={560}
            y={1150}
            tilt={56}
            rotate={-10}
            scale={1.1}
            opacity={prog(frame, 0, 12) * 0.95}
            accents={44}
          />
        </SceneTransition>
      </div>

      {/* PLANE 3 — bypassing routes + storefront */}
      <div style={cam(1)}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate3d(${(-(560 - STORE.x) * collapse * 0.85).toFixed(1)}px, ${((STORE.y - 1000) * collapse * 0.55).toFixed(1)}px, 0) scale(${(1 - collapse * 0.55).toFixed(3)})`,
            transformOrigin: `${STORE.x}px ${STORE.y}px`,
            opacity: 1 - collapse * 0.9,
          }}
        >
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <PersistentPulseRoute
              route={BYPASS}
              frame={frame}
              idPrefix="s4m"
              draw={{ start: 3, dur: 26 }}
              coreWidth={3}
              glowWidth={13}
              highlightSpeed={12}
              pulses={{ count: 4, speed: 0.011, size: 4.5 }}
              freezePulsesAt={FREEZE_AT}
              arrows={[0.16, 0.36, 0.56, 0.76, 0.92]}
            />
            <PersistentPulseRoute
              route={BYPASS_2}
              frame={frame}
              idPrefix="s4s"
              draw={{ start: 12, dur: 26 }}
              coreWidth={1.8}
              glowWidth={7}
              highlight={false}
              opacity={0.6}
              pulses={{ count: 2, speed: 0.009, size: 3 }}
              freezePulsesAt={FREEZE_AT}
              arrows={[0.3, 0.66]}
            />
            {frame > 24 && frame < FREEZE_AT ? (
              <>
                <DataParticle route={BYPASS} frame={frame} seed={11} speed={0.014} size={3} />
                <DataParticle route={BYPASS_2} frame={frame} seed={17} speed={0.011} size={2.4} opacity={0.6} />
              </>
            ) : null}

            {/* the failed connection attempt */}
            <g opacity={failFade}>
              <PersistentPulseRoute
                route={FAILED_BRANCH}
                frame={frame}
                idPrefix="s4f"
                draw={{ start: 20, dur: 12 }}
                coreWidth={1.6}
                glowWidth={6}
                highlight={false}
                opacity={0.55}
              />
              <circle cx={560} cy={1370} r={6} fill="none" stroke={C.cyan} strokeWidth={1.5} opacity={0.5 * failFade} />
              <line x1={552} y1={1362} x2={568} y2={1378} stroke={C.cyan} strokeWidth={1.5} opacity={0.7 * failFade} />
            </g>

            {/* gold destinations elsewhere brighten */}
            <DestinationPin x={840} y={140} frame={frame} appear={28} size={1.1} icon="star" rings idPrefix="s4p1" />
            <DestinationPin x={905} y={640} frame={frame} appear={34} size={0.95} icon="fork" rings idPrefix="s4p2" />
            <DestinationPin x={745} y={1430} frame={frame} appear={22} size={1} icon="coffee" rings idPrefix="s4p3" />

            {/* disconnected-signal icon near the store's pin */}
            {disconnectP > 0.01 ? (
              <g transform={`translate(${STORE.x + 96} ${STORE.y - 330})`} opacity={disconnectP * 0.95}>
                <circle r={26} fill="rgba(14,16,18,0.9)" stroke="rgba(0,210,255,0.3)" strokeWidth={1.5} />
                {[7, 12.5, 18].map((r, i) => (
                  <path key={i} d={`M ${-r} 6 A ${r} ${r} 0 0 1 ${r} 6`} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.28} />
                ))}
                <circle cx={0} cy={9} r={2.4} fill={C.cyan} opacity={0.5} />
                <line x1={-14} y1={-14} x2={14} y2={16} stroke={C.goldWarm} strokeWidth={2.6} strokeLinecap="round" />
              </g>
            ) : null}
          </svg>

          <StorefrontNode
            x={STORE.x}
            y={STORE.y}
            frame={frame}
            width={370}
            glow={interpolate(frame, [0, 30, 60], [0.35, 0.3, 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            pinColor={C.cyan}
            pinOpacity={0.45}
            ringLevel={ringLevel}
            ringFlicker
            idPrefix="s4sf"
          />
        </div>
      </div>

      {/* PLANE 4 — typography */}
      <div style={cam(1.12)}>
        <TextDissolve frame={frame} start={70} dur={11} pull={{ x: -140, y: 160 }} seed={51} style={{ position: "absolute", left: 92, top: 286 }}>
          <MaterializedText
            frame={frame}
            start={6}
            lines={[
              "So if your business",
              "is hard to spot online,",
              <span key="c" style={{ color: C.goldWarm }}>it gets passed over.</span>,
            ]}
            fontSize={66}
            weight={600}
            lineHeight={1.16}
            letterSpacing={-0.02}
            fragments="mixed"
            seed={53}
            revealDur={16}
            lineStagger={5}
          />
        </TextDissolve>

        {/* supporting line enters only after the bypass is visible */}
        <TextDissolve frame={frame} start={72} dur={10} pull={{ x: -110, y: 130 }} seed={57} style={{ position: "absolute", left: 92, top: 574 }}>
          <MaterializedText
            frame={frame}
            start={34}
            lines={["Not because you’re worse —", "because you’re easier to miss."]}
            fontSize={40}
            weight={400}
            font="Inter"
            color={C.text2}
            lineHeight={1.4}
            letterSpacing={-0.005}
            fragments="none"
            quiet
            seed={59}
          />
        </TextDissolve>

        <TechnicalTelemetry frame={frame} x={84} y={1770} appear={6} align="left" rows={["PASSING TRAFFIC", `MISSED ${String(Math.min(99, 12 + Math.floor(Math.max(0, frame - 10) / 4))).padStart(2, "0")}`]} opacity={1 - exitP} />
      </div>
    </AbsoluteFill>
  );
};
