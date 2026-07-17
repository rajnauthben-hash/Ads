import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DataParticleField, DataParticleStream } from "../DataParticle";
import { DestinationPin } from "../DestinationPin";
import { MaterializedText } from "../MaterializedText";
import { RoutePath } from "../PersistentPulseRoute";
import { PerspectiveMap } from "../PerspectiveMap";
import { DepthCamera, DepthLayer } from "../DepthCamera";
import { SceneTransition } from "../SceneTransition";
import { StorefrontIllumination } from "../StorefrontIllumination";
import { StorefrontNode } from "../StorefrontNode";
import { TechnicalTelemetry } from "../TechnicalTelemetry";
import { TextDissolve } from "../TextDissolve";
import { EASE_ROUTE } from "../motion";
import { COLORS, FONTS } from "../theme";

// Scene 04 — The business gets passed over. Sequence: global 212–304
// (local 0–92; nominal start local 10). One bold neon route sweeps in from
// the lower-left, passes directly in front of the dim storefront and
// zigzags up the right side of the frame, feeding three glowing gold
// destinations while the business's own signal stays weak.
const DUR = 92;

// The main bypassing route — a hand-drawn zigzag like the reference.
const BYPASS = [
  { x: -40, y: 1760 },
  { x: 130, y: 1690 },
  { x: 300, y: 1650 },
  { x: 360, y: 1520 },
  { x: 330, y: 1460 }, // brushes right past the storefront
  { x: 560, y: 1360 },
  { x: 640, y: 1300 },
  { x: 620, y: 1180 },
  { x: 790, y: 1110 },
  { x: 760, y: 980 },
  { x: 880, y: 900 },
  { x: 850, y: 740 },
  { x: 950, y: 640 },
  { x: 900, y: 430 },
  { x: 920, y: 260 },
];
// Short branch spurs from the main route into the side destinations.
const SPUR_MID = [
  { x: 790, y: 1110 },
  { x: 900, y: 1060 },
  { x: 975, y: 1020 },
];
const SPUR_LOW = [
  { x: 560, y: 1360 },
  { x: 740, y: 1440 },
  { x: 885, y: 1520 },
];

// Exit: the frozen route collapses into five spoke branches converging on
// the scene-05 storefront core.
const CORE = { x: 683, y: 700 };
const COLLAPSE_BRANCHES = [
  [{ x: 120, y: 420 }, { x: 400, y: 560 }, CORE],
  [{ x: 683, y: 180 }, { x: 683, y: 440 }, CORE],
  [{ x: 1000, y: 420 }, { x: 850, y: 560 }, CORE],
  [{ x: 200, y: 1100 }, { x: 440, y: 900 }, CORE],
  [{ x: 980, y: 1100 }, { x: 830, y: 900 }, CORE],
];

export const Scene04PassedOver: React.FC = () => {
  const frame = useCurrentFrame();

  // Hero beat: the route approaches the storefront, hesitates for ~3 frames
  // right in front of it (t≈0.3 on the path), then commits away toward the
  // gold destinations. The bend must read as a decision, not an accident.
  const bypass = interpolate(frame, [4, 22, 25, 48], [0, 0.3, 0.32, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_ROUTE,
  });
  // The storefront pin's failed activation attempt during the hesitation.
  const attempt = interpolate(frame, [22, 27, 36], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spurs = interpolate(frame, [34, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The business's signal contracts inward.
  const contraction = interpolate(frame, [20, 62], [0.45, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const disconnect = interpolate(frame, [46, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Freeze then collapse.
  const freeze = interpolate(frame, [76, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const collapse = interpolate(frame, [80, DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const frozenFrame = frame < 76 ? frame : 76 + (frame - 76) * freeze;

  return (
    <SceneTransition
      duration={DUR}
      enterFrames={8}
      exitFrames={10}
      enterFrom={{ x: 40, y: 30, scale: 0.99 }}
      exitTo={{ x: 0, y: -40, scale: 1.015 }}
      driftX={-8}
      driftY={-10}
      rotate={-0.6}
      scaleTo={1.03}
    >
      <AbsoluteFill>
        <DepthCamera mode="track" duration={DUR}>
        <DepthLayer factor={0.3}>
        <PerspectiveMap
          seed={53}
          brightness={1}
          tilt={54}
          width={1750}
          height={1750}
          driftX={-frame * 0.05}
          labels={["RIVER RD", "MAPLE DR", "MAIN ST"]}
          goldDust={0.9}
        />
        {/* Atmosphere pooling around the gold destinations */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 34% 16% at 86% 12%, rgba(224,184,91,0.1), transparent 70%), radial-gradient(ellipse 30% 14% at 84% 80%, rgba(224,184,91,0.08), transparent 70%)",
          }}
        />
        </DepthLayer>

        <DepthLayer factor={0.65}>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <DataParticleField x={60} y={850} width={960} height={860} count={16} seed={44} opacity={0.5} />

          {/* Main bypass — thick, hot, unmistakably moving away */}
          <g opacity={1 - collapse}>
            <RoutePath
              points={BYPASS}
              progress={bypass}
              frame={frozenFrame}
              chevrons={6}
              pulses={4}
              coreWidth={6}
              glowWidth={26}
              glowOpacity={0.22}
              hot
              seed={33}
            />
            <RoutePath points={SPUR_MID} progress={spurs} frame={frozenFrame} chevrons={2} pulses={1} coreWidth={3} glowWidth={12} seed={35} />
            <RoutePath points={SPUR_LOW} progress={spurs} frame={frozenFrame} chevrons={2} pulses={1} coreWidth={3} glowWidth={12} seed={36} />
            <DataParticleStream points={BYPASS} progress={bypass} count={5} seed={39} size={2.8} speed={0.014} />
          </g>

          {/* Collapse into five signal spokes (scene 05 handoff) */}
          {COLLAPSE_BRANCHES.map((line, i) => (
            <RoutePath key={`c${i}`} points={line} progress={collapse} frame={frame} pulses={1} coreWidth={2.4} glowWidth={10} seed={61 + i} />
          ))}

          {/* Gold destinations receiving the traffic */}
          <DestinationPin x={920} y={225} appearFrame={40} scale={1.3} ringRichness={1.6} pulseAt={58} seed={21} />
          <DestinationPin x={975} y={985} appearFrame={46} scale={1.1} ringRichness={1.3} pulseAt={66} seed={22} />
          <DestinationPin x={885} y={1495} appearFrame={50} scale={1.2} ringRichness={1.4} pulseAt={72} seed={23} />

          {/* The dim business, brushed past */}
          <StorefrontNode x={215} y={1470} scale={1.45} brightness={0.22} ringActivity={contraction} appearFrame={0} label="YOUR BUSINESS" />
          <StorefrontIllumination x={215} y={1470} scale={1.45} strength={0.12 + attempt * 0.4} />
          <DestinationPin x={215} y={1180} appearFrame={4} dim color={COLORS.cyan} flatBody="#0E3540" scale={0.85} ringRichness={0.7} seed={24} />
          {/* Failed activation attempt while the route hesitates alongside */}
          {attempt > 0.02 && (
            <g opacity={attempt}>
              <circle cx={215} cy={1148} r={20 + attempt * 30} fill="none" stroke={COLORS.cyan} strokeWidth={1.8} opacity={0.7 * (1 - attempt * 0.5)} />
              <circle cx={215} cy={1148} r={9 + attempt * 12} fill={COLORS.cyan} opacity={0.16} />
            </g>
          )}
          {/* Failed-signal badge */}
          {disconnect > 0 && (
            <g transform="translate(300 1160)" opacity={disconnect}>
              <circle cx={0} cy={0} r={18} fill="rgba(18,19,20,0.95)" stroke="rgba(154,163,173,0.6)" strokeWidth={1.6} />
              <path d="M -6 -2 Q 0 -8 6 -2" fill="none" stroke={COLORS.textDim} strokeWidth={2} strokeLinecap="round" />
              <circle cx={0} cy={5} r={1.8} fill={COLORS.textDim} />
              <line x1={-12} y1={12} x2={12} y2={-12} stroke="#E86A6A" strokeWidth={2.4} strokeLinecap="round" />
            </g>
          )}
        </svg>
        </DepthLayer>

        <DepthLayer factor={1}>
        {/* Local atmosphere behind the copy */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 260,
            width: 780,
            height: 560,
            background: "radial-gradient(ellipse 66% 55% at 38% 45%, rgba(10,11,13,0.66), transparent 74%)",
          }}
        />
        {/* Headline */}
        <div style={{ position: "absolute", left: 100, top: 355 }}>
          <TextDissolve exitStart={78} exitDuration={12} pullTarget={{ x: 260, y: 400 }} seed={61}>
            <MaterializedText
              startFrame={10}
              lineDuration={15}
              lineStagger={5}
              lines={[
                [{ text: "So if your business" }],
                [{ text: "is hard to spot online," }],
                [{ text: "it gets passed over.", color: COLORS.gold }],
              ]}
              fontSize={62}
              fontWeight={620}
              lineHeight={1.22}
              fragmentColor={COLORS.gold}
              flavor={4}
              seed={62}
            />
          </TextDissolve>
        </div>

        {/* Supporting copy — only after the bypass is visible */}
        <div style={{ position: "absolute", left: 100, top: 680 }}>
          <TextDissolve exitStart={80} exitDuration={11} pullTarget={{ x: 220, y: 60 }} seed={63}>
            <MaterializedText
              startFrame={46}
              lineDuration={14}
              lineStagger={4}
              lines={[
                [{ text: "Not because you’re worse —" }],
                [{ text: "because you’re easier to miss." }],
              ]}
              fontSize={33}
              fontFamily={FONTS.body}
              fontWeight={400}
              lineHeight={1.5}
              color={COLORS.textDim}
              letterSpacing={0}
              drift={{ x: 0, y: 12 }}
              seed={64}
            />
          </TextDissolve>
        </div>
        </DepthLayer>
        </DepthCamera>

        <TechnicalTelemetry
          tag="SIGNAL / 04 — VISIBILITY GAP"
          readout="PASS.RATE"
          seed={38}
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
