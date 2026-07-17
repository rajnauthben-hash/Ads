import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO } from "../theme";
import { buildRoute, makeCamera, prog, ezIn } from "../util";
import { MaterializedText } from "../components/MaterializedText";
import { TextDissolve } from "../components/TextDissolve";
import { PerspectiveMap } from "../components/PerspectiveMap";
import { PersistentPulseRoute } from "../components/PersistentPulseRoute";
import { StorefrontNode } from "../components/StorefrontNode";
import { DestinationPin } from "../components/DestinationPin";
import { DataParticle } from "../components/DataParticle";
import { TechnicalTelemetry } from "../components/TechnicalTelemetry";
import { SignalNode } from "../components/SignalNode";
import { SignalRing } from "../components/SignalRing";
import { IconName } from "../components/icons";

// Sequence: global 294–381 (local 0–87; nominal scene ends local 77).

const CENTER = { x: 556, y: 588 }; // storefront anchor (bottom-centre)
const FOCUS = { x: 556, y: 500 }; // rough visual centre of the store

interface NodeSpec {
  x: number;
  y: number;
  label: string;
  icon: IconName;
  activate: number;
}

const NODES: NodeSpec[] = [
  { x: 556, y: 168, label: "PHOTOS", icon: "camera", activate: 18 },
  { x: 216, y: 356, label: "REVIEWS", icon: "star", activate: 26 },
  { x: 906, y: 356, label: "CATEGORIES", icon: "grid", activate: 34 },
  { x: 266, y: 748, label: "HOURS", icon: "clock", activate: 42 },
  { x: 872, y: 748, label: "UPDATES", icon: "pencil", activate: 50 },
];

// Cyan connection from each node to the storefront.
const LINKS = NODES.map((n) =>
  buildRoute(
    [
      { x: n.x, y: n.y },
      { x: (n.x + FOCUS.x) / 2, y: (n.y + FOCUS.y) / 2 },
      FOCUS,
    ],
    30,
  ),
);

const EXIT_START = 78;

export const Scene05Signals: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = makeCamera(frame, 88, { zoom: 0.035, dx: -8, dy: -10, rot: 0.5, originX: 52, originY: 40 });

  // storefront brightens with every connection
  const connected = NODES.filter((n) => frame >= n.activate + 6).length;
  const glow = Math.min(1, 0.3 + connected * 0.14);
  const exitP = prog(frame, EXIT_START, 10, ezIn);
  // final simultaneous surge (05 → 06)
  const surge = interpolate(frame, [EXIT_START, EXIT_START + 4, EXIT_START + 10], [0, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelP = prog(frame, 2, 12);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — dense radial map interface */}
      <div style={cam(0.55)}>
        <PerspectiveMap
          frame={frame + 520}
          seed={67}
          x={560}
          y={700}
          tilt={46}
          rotate={2}
          scale={0.98}
          opacity={prog(frame, 0, 12) * 0.9}
          accents={40}
          driftX={-0.04}
          driftY={-0.02}
        />
        {/* rotating radar rings */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }} opacity={prog(frame, 4, 16) * 0.7}>
          {[240, 360, 480].map((r, i) => (
            <ellipse
              key={i}
              cx={FOCUS.x}
              cy={FOCUS.y + 40}
              rx={r}
              ry={r * 0.52}
              fill="none"
              stroke={C.cyan}
              strokeWidth={1}
              strokeDasharray="4 18"
              strokeDashoffset={frame * (0.5 + i * 0.22) * (i % 2 === 0 ? 1 : -1)}
              opacity={0.16 - i * 0.035}
            />
          ))}
        </svg>
      </div>

      {/* PLANE 3 — storefront, nodes, currents */}
      <div style={cam(1)}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${(1 - exitP * 0.12).toFixed(3)})`,
            transformOrigin: `${FOCUS.x}px ${FOCUS.y}px`,
          }}
        >
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <SignalRing frame={frame} cx={FOCUS.x} cy={CENTER.y + 8} rx={250} level={0.25 + connected * 0.15} start={6} />

            {LINKS.map((r, i) => (
              <PersistentPulseRoute
                key={i}
                route={r}
                frame={frame}
                idPrefix={`s5l${i}`}
                draw={{ start: NODES[i].activate - 8, dur: 12 }}
                retract={{ start: EXIT_START, dur: 9 }}
                coreWidth={1.8 + surge * 1.6}
                glowWidth={8 + surge * 8}
                highlight={false}
                opacity={0.7 + surge * 0.3}
                pulses={{ count: 1, speed: 0.02, size: 3.6 + surge * 2 }}
              />
            ))}
            {LINKS.map((r, i) =>
              frame >= NODES[i].activate + 2 ? (
                <DataParticle key={`p${i}`} route={r} frame={frame} seed={i * 9 + 4} speed={0.017} size={2.6} />
              ) : null,
            )}

            {/* gold pin above the store */}
            <DestinationPin x={FOCUS.x} y={FOCUS.y - 116} frame={frame} appear={10} size={0.9} icon="star" idPrefix="s5pin" bob />
          </svg>

          <StorefrontNode
            x={CENTER.x}
            y={CENTER.y}
            frame={frame}
            width={270}
            glow={glow + surge * 0.4}
            pinOpacity={0}
            ringLevel={0}
            sign="YOUR BUSINESS"
            idPrefix="s5sf"
            premium={connected >= 4}
          />

          {NODES.map((n, i) => (
            <SignalNode
              key={n.label}
              frame={frame}
              x={n.x}
              y={n.y}
              r={64}
              label={n.label}
              icon={n.icon}
              appear={4 + i * 3}
              activate={n.activate}
              exit={{ start: EXIT_START, dur: 10, toX: FOCUS.x, toY: FOCUS.y }}
            />
          ))}
        </div>
      </div>

      {/* PLANE 4 — typography */}
      <div style={cam(1.12)}>
        {/* scene index + progress dots */}
        <div style={{ position: "absolute", left: 70, top: 118, opacity: labelP * (1 - exitP) }}>
          <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: C.goldWarm }}>05</div>
          <div style={{ width: 44, height: 2, background: C.goldWarm, marginTop: 8, opacity: 0.8 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 26 }}>
            {NODES.map((n, i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: frame >= n.activate ? C.gold : "#3A4147",
                  boxShadow: frame >= n.activate ? `0 0 8px ${C.gold}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* the five keywords, each materializing in rhythm with its node */}
        <TextDissolve frame={frame} start={EXIT_START + 1} dur={10} pull={{ x: 160, y: -240 }} seed={61} style={{ position: "absolute", left: 84, top: 856 }}>
          <MaterializedText
            frame={frame}
            start={16}
            lines={[
              "Photos.",
              "Reviews.",
              "Categories.",
              "Hours.",
              <span key="u" style={{ color: C.goldWarm }}>Updates.</span>,
            ]}
            fontSize={88}
            weight={600}
            lineHeight={1.06}
            letterSpacing={-0.025}
            fragments="mixed"
            seed={63}
            revealDur={12}
            lineStagger={6}
          />
        </TextDissolve>

        <TextDissolve frame={frame} start={EXIT_START} dur={10} pull={{ x: 130, y: -200 }} seed={67} style={{ position: "absolute", left: 84, top: 1382 }}>
          <div style={{ width: 46, height: 3, background: C.goldWarm, marginBottom: 26, opacity: prog(frame, 46, 8) }} />
          <MaterializedText
            frame={frame}
            start={48}
            lines={[
              <span key="a">Those details help</span>,
              <span key="b">people <span style={{ color: C.goldWarm }}>trust</span> your</span>,
              <span key="c">business — and help</span>,
              <span key="d">Google <span style={{ color: C.goldWarm }}>understand</span> it.</span>,
            ]}
            fontSize={42}
            weight={400}
            font="Inter"
            color={C.text2}
            lineHeight={1.32}
            letterSpacing={-0.005}
            fragments="none"
            quiet
            lineStagger={3}
            seed={69}
          />
        </TextDissolve>

        {/* final technical lock-up */}
        <TextDissolve frame={frame} start={EXIT_START + 2} dur={9} pull={{ x: 110, y: -170 }} seed={71} style={{ position: "absolute", left: 84, top: 1712 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: prog(frame, 60, 10) }}>
            <svg width={44} height={34} viewBox="0 0 44 34">
              <path d="M 4 30 L 15 8 L 22 20 L 29 8 L 40 30" fill="none" stroke={C.goldWarm} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div style={{ width: 1.5, height: 44, background: "rgba(167,175,183,0.35)" }} />
            <MaterializedText
              frame={frame}
              start={62}
              lines={["Stronger signals.", "Stronger presence."]}
              fontSize={27}
              weight={500}
              font={FONT_MONO}
              color={C.text2}
              lineHeight={1.4}
              letterSpacing={0.04}
              fragments="none"
              quiet
              lineStagger={4}
              revealDur={10}
              seed={73}
            />
          </div>
        </TextDissolve>

        <TechnicalTelemetry
          frame={frame}
          x={992}
          y={96}
          appear={6}
          rows={["SIGNAL MATRIX", `LINKED 0${connected} / 05`]}
          opacity={1 - exitP}
        />
      </div>
    </AbsoluteFill>
  );
};
