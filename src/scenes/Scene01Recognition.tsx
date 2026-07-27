import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { SearchNode } from "../components/SearchNode";
import { SignalRoute, MovingPulse, RouteArrow } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import { clamp01, mapRange, pulsePosition, revealProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 1 — INVISIBLE DEMAND (frames 0–119). Reference: 7769.png.
 *
 * The cyan signal traces the reference line-map exactly: one connected network
 * — a central S-spine dropping from the HAIR SALON node, the DENTIST branch
 * merging into it, a NEARBY spur, then a split into a CAFÉ branch (left) and a
 * long PIZZA diagonal that runs in front of YOUR BUSINESS toward the lower-right.
 * None of it touches the storefront entrance.
 */
const S = SCENES.s1;

const N_HAIR: Pt = { x: 175, y: 782 };
const N_DENT: Pt = { x: 495, y: 800 };
const N_NEAR: Pt = { x: 235, y: 1150 };
const N_CAFE: Pt = { x: 255, y: 1385 };
const N_PIZZA: Pt = { x: 792, y: 1345 };
const SPLIT: Pt = { x: 345, y: 1258 };
const MERGE: Pt = { x: 430, y: 1010 };

// Connected route network (screen space), tracing 7769.
const SPINE: Pt[] = [
  { x: 178, y: 808 },
  { x: 272, y: 892 },
  { x: 246, y: 992 },
  { x: 312, y: 1082 },
  { x: 286, y: 1176 },
  SPLIT,
];
const DENT_BR: Pt[] = [
  { x: 493, y: 824 },
  { x: 420, y: 878 },
  { x: 344, y: 936 },
  { x: 268, y: 992 },
];
const NEAR_BR: Pt[] = [
  { x: 262, y: 1150 },
  { x: 300, y: 1168 },
];
const CAFE_BR: Pt[] = [SPLIT, { x: 300, y: 1332 }, { x: 258, y: 1382 }];
const PIZZA_BR: Pt[] = [SPLIT, { x: 470, y: 1300 }, { x: 610, y: 1342 }, { x: 720, y: 1356 }, { x: 786, y: 1348 }];

interface Node {
  at: Pt;
  label: string;
  variant: "search" | "person";
  in: number;
  labelAnchor: "start" | "middle" | "end";
  labelDx: number;
  labelDy: number;
}
const NODES: Node[] = [
  { at: N_HAIR, label: "Looking for\nhair salon", variant: "search", in: 57, labelAnchor: "start", labelDx: 36, labelDy: 0 },
  { at: N_DENT, label: "Searching\nfor dentist", variant: "search", in: 64, labelAnchor: "start", labelDx: 36, labelDy: 0 },
  { at: N_NEAR, label: "Nearby &\nready to go", variant: "person", in: 71, labelAnchor: "middle", labelDx: 0, labelDy: 44 },
  { at: N_CAFE, label: "Looking for\ncafé", variant: "search", in: 78, labelAnchor: "middle", labelDx: 0, labelDy: 44 },
  { at: N_PIZZA, label: "Searching\nfor pizza", variant: "search", in: 85, labelAnchor: "end", labelDx: -36, labelDy: 0 },
];

export const Scene01Recognition: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  // Network draws progressively; branches follow their node activation.
  const spineDraw = clamp01(mapRange(frame, 0, 70, 0.1, 1, "ROUTE"));
  const dentDraw = clamp01(mapRange(frame, 62, 88, 0, 1, "ROUTE"));
  const nearDraw = clamp01(mapRange(frame, 69, 84, 0, 1, "ROUTE"));
  const cafeDraw = clamp01(mapRange(frame, 78, 96, 0, 1, "ROUTE"));
  const pizzaDraw = clamp01(mapRange(frame, 80, 100, 0, 1, "ROUTE"));

  // Transition 106–119: network retracts, nodes converge and merge.
  const converge = revealProgress(frame, 106, 116);
  const merged = frame >= 116;
  const mergeScale = mapRange(frame, 116, 119, 1.0, 1.22);
  const netOpacity = 1 - converge;

  // Continuous travelling pulses (fluid motion, not a static hold).
  const p1 = pulsePosition(frame, 0, 64);
  const p2 = pulsePosition(frame, 12, 78);
  const pDent = pulsePosition(frame, 62, 52);

  return (
    <>
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {!merged ? (
            <g opacity={netOpacity}>
              <SignalRoute points={DENT_BR} progress={dentDraw} core={3} glow={9} />
              <SignalRoute points={NEAR_BR} progress={nearDraw} core={2.6} glow={7} />
              <SignalRoute points={SPINE} progress={spineDraw} core={3.2} glow={10} />
              <SignalRoute points={CAFE_BR} progress={cafeDraw} core={3} glow={9} />
              <SignalRoute points={PIZZA_BR} progress={pizzaDraw} core={3.2} glow={10} />

              {/* directional arrows along the map */}
              {spineDraw > 0.4 && <RouteArrow points={SPINE} t={0.42} />}
              {dentDraw > 0.5 && <RouteArrow points={DENT_BR} t={0.55} />}
              {cafeDraw > 0.6 && <RouteArrow points={CAFE_BR} t={0.6} />}
              {pizzaDraw > 0.4 && <RouteArrow points={PIZZA_BR} t={0.5} />}
              {pizzaDraw > 0.8 && <RouteArrow points={PIZZA_BR} t={0.85} />}

              {/* continuous pulses */}
              <MovingPulse points={SPINE} t={p1} maxProgress={spineDraw} size={6} />
              <MovingPulse points={PIZZA_BR} t={p2} maxProgress={pizzaDraw} size={6} />
              {dentDraw > 0.05 && <MovingPulse points={DENT_BR} t={pDent} maxProgress={dentDraw} size={5} />}
            </g>
          ) : (
            <SearchNode at={MERGE} scale={mergeScale} r={30} opacity={1} pulse={pulsePosition(frame, 116, 30)} />
          )}

          {/* nodes */}
          {!merged &&
            NODES.map((n, i) => {
              const p = revealProgress(frame, n.in, n.in + 11);
              const mid = n.in + 5.5;
              const scale =
                frame <= n.in ? 0.94 : frame >= n.in + 11 ? 1.0 : frame < mid ? mapRange(frame, n.in, mid, 0.94, 1.05) : mapRange(frame, mid, n.in + 11, 1.05, 1.0);
              const pos: Pt = {
                x: n.at.x + (MERGE.x - n.at.x) * converge,
                y: n.at.y + (MERGE.y - n.at.y) * converge,
              };
              return (
                <SearchNode
                  key={i}
                  at={pos}
                  r={26}
                  variant={n.variant}
                  scale={clamp01(scale) || 0.94}
                  opacity={clamp01(mapRange(frame, n.in, n.in + 6, 0.45, 1)) * (p > 0 ? 1 : 0) * (1 - converge)}
                  pulse={pulsePosition(frame, n.in, 40)}
                  label={n.label}
                  labelColor={COLORS.cyan}
                  labelAnchor={n.labelAnchor}
                  labelDx={n.labelDx}
                  labelDy={n.labelDy}
                />
              );
            })}
        </svg>
      </ParallaxLayer>

      {/* Text */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={82} y={70} size={26} reveal={revealProgress(frame, 8, 17)} />
        <EditorialHeadline
          x={82}
          y={200}
          width={745}
          size={47}
          groups={[
            { lines: ["You may not be losing customers", "to better businesses."], color: COLORS.white, inStart: 14, inEnd: 31, outStart: 106, outEnd: 114, sliceDir: -1, sliceAmt: 10 },
            { lines: ["You may be losing them", "before they ever see you."], color: COLORS.cyan, inStart: 29, inEnd: 49, outStart: 106, outEnd: 114, sliceDir: 1, sliceAmt: 12 },
          ]}
        />
        <SupportingCopy
          x={84}
          y={575}
          width={660}
          size={29}
          lines={[
            "A nearby customer can be ready to call,",
            "visit or buy — and still never realise your",
            "business was available.",
          ]}
          inStart={46}
          inEnd={62}
          outStart={106}
          outEnd={114}
        />
      </ParallaxLayer>
    </>
  );
};
