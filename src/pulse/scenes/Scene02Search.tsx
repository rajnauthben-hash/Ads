import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { IconGlyph, type PinIcon } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { SceneTransition } from "../SceneTransition";
import { SearchInterface, searchRowCenterY } from "../SearchInterface";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { DepthCamera, DepthLayer } from "../DepthCamera";
import { noise, smoothPath, type Pt } from "../helpers";
import { EASE_ROUTE, EASE_UI } from "../motion";
import { COLORS, FONTS } from "../theme";

// Scene 02 — Search happens first. Sequence: global 80–172 (local 0–92;
// nominal start local 10). The route from scene 01 arrives as a cable that
// constructs the search panel in the upper-left; fiber strands stream from
// each intent row and converge across the map into three gold place
// markers; the headline holds the lower-left quadrant.
const DUR = 92;

const PANEL = { x: 84, y: 430 };

// Incoming cable — continues scene 01's exit trajectory into the panel.
const CABLE = [
  { x: 420, y: -40 },
  { x: 340, y: 140 },
  { x: 250, y: 300 },
  { x: 150, y: 420 },
  { x: 110, y: 468 },
];

// Gold circular place badges on the map (fork / coffee / bag).
const PLACES: { x: number; y: number; icon: PinIcon; at: number }[] = [
  { x: 905, y: 500, icon: "fork", at: 42 },
  { x: 790, y: 900, icon: "coffee", at: 50 },
  { x: 912, y: 1320, icon: "bag", at: 58 },
];

// Each row emits fine fiber strands that converge toward the places.
const strand = (rowIdx: number, place: { x: number; y: number }, wob: number): Pt[] => {
  const y0 = PANEL.y + searchRowCenterY(rowIdx);
  return [
    { x: PANEL.x + 514, y: y0 },
    { x: 660, y: y0 + 20 + wob * 30 },
    { x: 740, y: (y0 + place.y) / 2 + wob * 46 },
    { x: place.x - 60, y: place.y + 40 - wob * 20 },
    { x: place.x, y: place.y + 56 },
  ];
};

const GoldPlaceBadge: React.FC<{
  x: number;
  y: number;
  icon: PinIcon;
  appear: number;
  frame: number;
}> = ({ x, y, icon, appear, frame }) => {
  const a = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_UI,
  });
  if (a <= 0) {
    return null;
  }
  const beat = 0.8 + 0.2 * Math.sin(frame * 0.11 + x * 0.03);
  return (
    <g opacity={a}>
      {/* Stem down to the lit ground */}
      <line x1={x} y1={y + 38} x2={x} y2={y + 108} stroke={COLORS.gold} strokeWidth={1.6} opacity={0.7} />
      {/* Ground glow + rings */}
      <ellipse cx={x} cy={y + 116} rx={40} ry={15} fill={COLORS.gold} opacity={0.16 * beat} />
      <ellipse cx={x} cy={y + 116} rx={54} ry={20} fill="none" stroke={COLORS.gold} strokeWidth={1.2} opacity={0.4 * beat} />
      <ellipse cx={x} cy={y + 116} rx={74} ry={27} fill="none" stroke={COLORS.gold} strokeWidth={0.9} opacity={0.2} strokeDasharray="5 8" />
      <rect x={x - 17} y={y + 104} width={34} height={22} rx={3} fill={COLORS.gold} opacity={0.3 * beat} />
      {/* Circle badge */}
      <circle cx={x} cy={y} r={41} fill="rgba(12,13,15,0.9)" stroke={COLORS.gold} strokeWidth={2} opacity={0.95} />
      <circle cx={x} cy={y} r={41} fill={COLORS.gold} opacity={0.08 * beat} />
      <g transform={`translate(${x} ${y + 31}) scale(1.35)`}>
        <IconGlyph icon={icon} c={COLORS.gold} />
      </g>
    </g>
  );
};

export const Scene02Search: React.FC = () => {
  const frame = useCurrentFrame();

  const cableIn = interpolate(frame, [0, 13], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_ROUTE,
  });
  const flow = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: the panel and strands condense into the ranking system.
  const fold = interpolate(frame, [80, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.55, 0, 0.8, 0.45),
  });

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 0, y: 40, scale: 0.99 }}
      exitTo={{ x: 0, y: -60, scale: 1.02 }}
      driftX={-10}
      driftY={-10}
      rotate={-0.5}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        <DepthCamera mode="lateral" duration={DUR}>
        {/* City map dominating the right half */}
        <DepthLayer factor={0.25}>
        <div style={{ position: "absolute", right: -560, top: -60, width: 1300, height: 2000, opacity: 0.92 }}>
          <PerspectiveMap
            seed={23}
            brightness={0.8 + 0.3 * flow}
            tilt={48}
            width={1250}
            height={1750}
            driftX={frame * 0.05}
            labels={["RIVER RD", "MAIN ST"]}
            goldDust={0.9}
          />
        </div>
        {/* Falloff keeping the left column readable */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(100deg, rgba(10,11,13,0.9) 26%, rgba(10,11,13,0.25) 55%, transparent 75%)",
          }}
        />
        </DepthLayer>

        <DepthLayer factor={0.55}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={600} y={300} width={460} height={1300} count={14} seed={14} opacity={0.5} />

          {/* Incoming cable from scene 01 */}
          <RoutePath points={CABLE} progress={cableIn} frame={frame} pulses={2} coreWidth={3} glowWidth={13} hot seed={7} />

          {/* Fiber strands: rows -> places. Three fine filaments per row. */}
          <g opacity={(1 - fold) * 0.9}>
            {PLACES.map((place, pi) =>
              [0, 1, 2, 3].map((rowIdx) => {
                if ((rowIdx + pi) % 2 === 1 && rowIdx !== pi) {
                  return null;
                }
                const wob = noise(31, rowIdx * 4 + pi) - 0.5;
                const pts = strand(rowIdx, place, wob);
                const draw = interpolate(frame, [28 + rowIdx * 4 + pi * 3, 50 + rowIdx * 4 + pi * 3], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <g key={`${pi}-${rowIdx}`}>
                    <path
                      d={smoothPath(pts)}
                      fill="none"
                      stroke={COLORS.cyan}
                      strokeWidth={1.3}
                      opacity={0.34}
                      pathLength={100}
                      strokeDasharray={100}
                      strokeDashoffset={100 * (1 - draw)}
                    />
                    {/* Light packet riding the strand */}
                    <path
                      d={smoothPath(pts)}
                      fill="none"
                      stroke="#CFF6FF"
                      strokeWidth={2}
                      opacity={0.65 * draw}
                      pathLength={100}
                      strokeDasharray="2.5 97.5"
                      strokeDashoffset={100 - ((frame * 1.9 + rowIdx * 21 + pi * 37) % 130)}
                    />
                    <DataParticleStream points={pts} progress={draw} count={2} seed={41 + rowIdx * 4 + pi} size={2} speed={0.02} />
                  </g>
                );
              }),
            )}
          </g>

          {/* Gold place badges lighting as the signals arrive */}
          {PLACES.map((p) => (
            <GoldPlaceBadge key={p.icon} x={p.x} y={p.y} icon={p.icon} appear={p.at} frame={frame} />
          ))}
        </svg>
        </DepthLayer>

        {/* Search panel constructing from the cable, folding out at exit */}
        <DepthLayer factor={0.8}>
        <div
          style={{
            position: "absolute",
            left: PANEL.x,
            top: PANEL.y,
            transformOrigin: "50% 10%",
            transform: `translate3d(${fold * 110}px, ${fold * 120}px, 0) scaleY(${1 - fold * 0.8}) scaleX(${1 - fold * 0.14})`,
            opacity: 1 - fold * fold,
            filter: fold > 0 ? `blur(${fold * 4}px)` : undefined,
          }}
        >
          <SearchInterface buildFrame={8} />
        </div>
        </DepthLayer>

        {/* Headline — lower-left quadrant */}
        <DepthLayer factor={1}>
        {/* Local atmosphere so the copy never fights the strands behind it */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 940,
            width: 760,
            height: 700,
            background: "radial-gradient(ellipse 70% 55% at 34% 45%, rgba(10,11,13,0.72), transparent 72%)",
          }}
        />
        <div style={{ position: "absolute", left: 84, top: 1020 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 240, y: -300 }} seed={41}>
            <MaterializedText
              startFrame={16}
              lineDuration={16}
              lineStagger={5}
              lines={[
                [{ text: "Most people" }],
                [{ text: "search", color: "#8FC6D8" }, { text: " before" }],
                [{ text: "they go" }],
                [{ text: "anywhere." }],
              ]}
              fontSize={88}
              fontWeight={620}
              lineHeight={1.1}
              flavor={2}
              seed={42}
            />
          </TextDissolve>
        </div>

        {/* Supporting copy */}
        <div style={{ position: "absolute", left: 84, top: 1500 }}>
          <TextDissolve exitStart={80} exitDuration={11} pullTarget={{ x: 220, y: -500 }} seed={43}>
            <MaterializedText
              startFrame={44}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "They check Google Maps, reviews," }],
                [{ text: "photos, and opening hours first." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={44}
            />
          </TextDissolve>
        </div>
        </DepthLayer>
        </DepthCamera>

        <TechnicalTelemetry
          tag="SIGNAL / 02 — SEARCH INTENT"
          readout="QUERY.VOL"
          seed={12}
          opacity={
            0.75 *
            interpolate(frame, [10, 18, 74, 82], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </AbsoluteFill>
    </SceneTransition>
  );
};
