import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { DestinationPin, IconGlyph, type PinIcon } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { splinePoint } from "../helpers";
import { COLORS, FONTS } from "../theme";

// Scene 06 — The resolution. Sequence: global 362–450 (local 0–88; nominal
// start local 10). The five signals have merged into one completed premium
// route: CRAFT & CO. glows in the lower-left, the energized route zigzags
// through the neighborhood past quiet context markers, and blooms into a
// large gold star destination. Holds fully composed to frame 450.
const DUR = 88;

const ROUTE = [
  { x: 243, y: 1648 },
  { x: 360, y: 1575 },
  { x: 330, y: 1470 },
  { x: 468, y: 1400 },
  { x: 440, y: 1290 },
  { x: 562, y: 1232 },
  { x: 540, y: 1120 },
  { x: 662, y: 1078 },
  { x: 706, y: 1022 },
  { x: 812, y: 1028 },
  { x: 866, y: 1032 },
];

// Quiet dark context markers around the route.
const CONTEXT_PINS: { x: number; y: number; icon: PinIcon; at: number }[] = [
  { x: 844, y: 812, icon: "fork", at: 30 },
  { x: 630, y: 952, icon: "bag", at: 36 },
  { x: 482, y: 1136, icon: "bag", at: 42 },
  { x: 827, y: 1208, icon: "coffee", at: 40 },
  { x: 672, y: 1428, icon: "dumbbell", at: 46 },
];

const DISTANCE_LABELS = [
  { x: 585, y: 1195, mi: "0.3 MI", min: "2 MIN", cyan: true, at: 34 },
  { x: 555, y: 1020, mi: "0.7 MI", min: "2 MIN", cyan: true, at: 42 },
  { x: 700, y: 872, mi: "0.7 MI", min: "3 MIN", cyan: false, at: 48 },
  { x: 742, y: 1536, mi: "0.5 MI", min: "1 MIN", cyan: false, at: 52 },
];

const ContextBadge: React.FC<{ x: number; y: number; icon: PinIcon; appear: number; frame: number }> = ({
  x,
  y,
  icon,
  appear,
  frame,
}) => {
  const a = interpolate(frame, [appear, appear + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (a <= 0) {
    return null;
  }
  return (
    <g opacity={a * 0.85}>
      <path
        d={`M ${x} ${y + 28} C ${x - 20} ${y + 6} ${x - 23} ${y - 2} ${x - 23} ${y - 10} A 23 23 0 1 1 ${x + 23} ${y - 10} C ${x + 23} ${y - 2} ${x + 20} ${y + 6} ${x} ${y + 28} Z`}
        fill="rgba(34,37,41,0.94)"
        stroke="rgba(154,163,173,0.4)"
        strokeWidth={1.2}
      />
      <g transform={`translate(${x} ${y + 20}) scale(1.05)`}>
        <IconGlyph icon={icon} c="rgba(210,216,222,0.9)" />
      </g>
      <ellipse cx={x} cy={y + 34} rx={12} ry={4} fill="#000" opacity={0.4} />
    </g>
  );
};

export const Scene06Resolution: React.FC = () => {
  const frame = useCurrentFrame();

  const routeDraw = interpolate(frame, [6, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.5, 0.25, 1),
  });
  const illuminate = interpolate(frame, [4, 24], [0.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const completion = interpolate(frame, [38, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.2, 0.4, 1),
  });
  const completionPos = splinePoint(ROUTE, completion);
  const labelIn = interpolate(frame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const walkerT = 0.32 + 0.05 * Math.sin(frame * 0.05);
  const walker = splinePoint(ROUTE, walkerT * routeDraw);

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      enterFrom={{ x: 30, y: 40, scale: 0.99 }}
      driftX={6}
      driftY={-10}
      rotate={0.4}
      scaleFrom={1.005}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        {/* Cleanest, brightest neighborhood of the film */}
        <PerspectiveMap
          seed={89}
          brightness={1.4}
          tilt={53}
          width={1750}
          height={1750}
          driftX={frame * 0.04}
          labels={["MAIN ST", "OAK DRIVE", "RIVER RD"]}
          goldDust={1}
        />
        {/* Warm pooled light around the destination */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 40% 20% at 80% 54%, rgba(224,184,91,0.13), transparent 70%), radial-gradient(ellipse 42% 24% at 16% 84%, rgba(224,166,80,0.1), transparent 70%)",
          }}
        />

        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={80} y={880} width={920} height={840} count={14} seed={66} opacity={0.55} />

          {/* Cyan origin puddle at the storefront door */}
          <g opacity={illuminate}>
            <ellipse cx={243} cy={1652} rx={40} ry={14} fill={COLORS.cyan} opacity={0.3 + 0.1 * Math.sin(frame * 0.1)} />
            <ellipse cx={243} cy={1652} rx={58} ry={21} fill="none" stroke={COLORS.cyan} strokeWidth={1.6} opacity={0.5} />
            <ellipse cx={243} cy={1652} rx={80} ry={29} fill="none" stroke={COLORS.cyan} strokeWidth={1} opacity={0.22} strokeDasharray="5 8" />
          </g>

          {/* The completed customer route — fully energized */}
          <RoutePath
            points={ROUTE}
            progress={routeDraw}
            frame={frame}
            chevrons={4}
            pulses={3}
            coreWidth={5.4}
            glowWidth={24}
            glowOpacity={0.22}
            hot
            seed={95}
          />
          <DataParticleStream points={ROUTE} progress={routeDraw} count={4} seed={97} size={2.6} speed={0.014} />

          {/* Walking figure on the route */}
          {routeDraw > 0.5 && (
            <g transform={`translate(${walker.x} ${walker.y - 16})`} opacity={0.9}>
              <circle cx={0} cy={-11} r={3.4} fill={COLORS.cyan} />
              <path d="M 0 -8 L 0 2 M 0 -5 L -6 0 M 0 -5 L 6 -1 M 0 2 L -5 12 M 0 2 L 5 12" stroke={COLORS.cyan} strokeWidth={2.2} strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Travelling pulse completing the connection */}
          {completion > 0 && completion < 1 && (
            <g>
              <circle cx={completionPos.x} cy={completionPos.y} r={12} fill={COLORS.cyan} opacity={0.25} />
              <circle cx={completionPos.x} cy={completionPos.y} r={4.6} fill="#E9FCFF" />
            </g>
          )}

          {/* Context markers + distance telemetry */}
          {CONTEXT_PINS.map((p, i) => (
            <ContextBadge key={i} x={p.x} y={p.y} icon={p.icon} appear={p.at} frame={frame} />
          ))}
          {DISTANCE_LABELS.map((l, i) => {
            const a = interpolate(frame, [l.at, l.at + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const c = l.cyan ? COLORS.cyan : "rgba(154,163,173,0.75)";
            return (
              <g key={i} opacity={a * (l.cyan ? 0.95 : 0.7)}>
                <text x={l.x} y={l.y} fill={c} fontFamily={FONTS.mono} fontWeight={500} fontSize={19} letterSpacing={2}>
                  {l.mi}
                </text>
                <text x={l.x} y={l.y + 24} fill={c} fontFamily={FONTS.mono} fontWeight={500} fontSize={19} letterSpacing={2} opacity={0.8}>
                  {l.min}
                </text>
              </g>
            );
          })}

          {/* Grand gold star destination */}
          <DestinationPin x={878} y={1042} appearFrame={22} scale={1.75} icon="star" ringRichness={2.1} pulseAt={56} glow={1.2} seed={77} />

          {/* CRAFT & CO. — fully lit premium storefront */}
          <StorefrontNode
            x={200}
            y={1688}
            scale={1.58}
            brightness={illuminate}
            ringActivity={0.75}
            appearFrame={0}
            label="CRAFT & CO."
            goldSign
            plants
          />
        </svg>

        {/* 06 / 06 label with gold rule */}
        <div style={{ position: "absolute", left: 100, top: 178, opacity: labelIn }}>
          <div style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 24, letterSpacing: 5, color: COLORS.gold, marginBottom: 14 }}>
            06 / 06
          </div>
          <div style={{ position: "relative", width: 250 * labelIn, height: 1.5, background: "linear-gradient(90deg, rgba(224,184,91,0.9), rgba(224,184,91,0.15))" }}>
            <div style={{ position: "absolute", right: -3, top: -2.2, width: 6, height: 6, borderRadius: 3, background: COLORS.gold, opacity: 0.9 }} />
          </div>
        </div>

        {/* Main statement */}
        <div style={{ position: "absolute", left: 100, top: 268 }}>
          <MaterializedText
            startFrame={12}
            lineDuration={15}
            lineStagger={6}
            lines={[
              [{ text: "If your business" }],
              [{ text: "looks premium" }],
              [{ text: "in person," }],
              [{ text: "it should look", color: COLORS.gold }],
              [{ text: "premium online too.", color: COLORS.gold }],
            ]}
            fontSize={74}
            fontWeight={620}
            lineHeight={1.15}
            fragmentColor={COLORS.gold}
            seed={81}
          />
        </div>

        {/* Supporting copy resolves last */}
        <div style={{ position: "absolute", left: 100, top: 800 }}>
          <MaterializedText
            startFrame={48}
            lineDuration={14}
            lineStagger={4}
            lines={[
              [{ text: "Show up better, and turn more" }],
              [{ text: "nearby searches into real visits." }],
            ]}
            fontSize={33}
            fontFamily={FONTS.body}
            fontWeight={400}
            lineHeight={1.5}
            color={COLORS.textDim}
            letterSpacing={0}
            drift={{ x: 0, y: 12 }}
            seed={82}
          />
        </div>

        <TechnicalTelemetry
          tag="SIGNAL / 06 — CONNECTION COMPLETE"
          readout="VISITS.IN"
          seed={59}
          opacity={
            0.7 *
            interpolate(frame, [10, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
