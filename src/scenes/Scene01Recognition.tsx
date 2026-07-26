import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { SearchNode } from "../components/SearchNode";
import { SignalRoute, MovingPulse, RouteArrow } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import {
  clamp01,
  linearProgress,
  mapRange,
  pulsePosition,
  revealProgress,
  SCENES,
} from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 1 — RECOGNITION: CUSTOMERS NEVER SEE YOU (frames 0–119).
 * Reference: customers_passing_by_unnoticed.
 */
const S = SCENES.s1;

// Search nodes in screen space (inside the protected content region).
const NODE_A: Pt = { x: 210, y: 770 };
const NODE_B: Pt = { x: 250, y: 1130 };
const NODE_C: Pt = { x: 760, y: 1330 };
const MERGE: Pt = { x: 470, y: 980 };

// Routes travel down road centres and pass *near* the storefront (~x640,y960)
// without ever connecting to its entrance and without crossing a building.
const ROUTE_A: Pt[] = [
  { x: 210, y: 800 },
  { x: 300, y: 900 },
  { x: 300, y: 1010 },
  { x: 470, y: 1120 },
  { x: 560, y: 1210 },
];
const ROUTE_C: Pt[] = [
  { x: 760, y: 1300 },
  { x: 690, y: 1210 },
  { x: 560, y: 1160 },
  { x: 470, y: 1090 },
  { x: 470, y: 980 },
];

export const Scene01Recognition: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  // Node activations
  const nodeA = nodeAnim(frame, 58, 67);
  const nodeB = nodeAnim(frame, 68, 77);
  const nodeC = nodeAnim(frame, 78, 87);

  // Route draws
  const drawA = clamp01(mapRange(frame, 60, 88, 0, 0.09) + linearProgress(frame, 18, 40) * 0.0); // small travel
  const routeAProgress = clamp01(mapRange(frame, 6, 95, 0.08, 1)); // grows across scene
  const routeCProgress = clamp01(mapRange(frame, 78, 95, 0, 1));
  void drawA;

  // Transition 96–119: nodes converge to MERGE, then merge into one node.
  const converge = revealProgress(frame, 96, 111);
  const mergeScale = mapRange(frame, 112, 119, 1.0, 1.22);
  const merged = frame >= 112;

  const posA = lerpPt(NODE_A, MERGE, converge);
  const posB = lerpPt(NODE_B, MERGE, converge);
  const posC = lerpPt(NODE_C, MERGE, converge);

  // Route tails shorten toward centre during convergence.
  const tailA = clamp01(routeAProgress * (1 - converge));
  const tailC = clamp01(routeCProgress * (1 - converge));

  const pulseA = pulsePosition(frame, 0, 70);
  const pulseC = pulsePosition(frame, 78, 60);

  const exit = { outStart: 104, outEnd: 111 };

  return (
    <>
      {/* Routes + nodes */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {!merged && (
            <>
              <SignalRoute points={ROUTE_A} progress={tailA} core={3} glow={10} />
              <SignalRoute points={ROUTE_C} progress={tailC} core={3} glow={10} />
              {tailA > 0.15 && <RouteArrow points={ROUTE_A} t={Math.min(tailA, 0.9)} />}
              {tailA > 0.05 && <MovingPulse points={ROUTE_A} t={pulseA} maxProgress={tailA} size={6} />}
              {tailC > 0.05 && <MovingPulse points={ROUTE_C} t={pulseC} maxProgress={tailC} size={6} />}
            </>
          )}

          {merged ? (
            <SearchNode at={MERGE} scale={mergeScale} r={30} opacity={1} pulse={pulsePosition(frame, 112, 30)} />
          ) : (
            <>
              <SearchNode at={posA} scale={nodeA.scale} opacity={nodeA.op} pulse={nodeA.pulse} />
              <SearchNode at={posB} scale={nodeB.scale} opacity={nodeB.op} pulse={nodeB.pulse} variant="person" />
              <SearchNode at={posC} scale={nodeC.scale} opacity={nodeC.op} pulse={nodeC.pulse} />
            </>
          )}
        </svg>
      </ParallaxLayer>

      {/* Text */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={82} y={70} size={26} />
        <EditorialHeadline
          x={82}
          y={200}
          width={745}
          size={47}
          groups={[
            { lines: ["You may not be losing customers", "to better businesses."], color: COLORS.white, inStart: 6, inEnd: 17, ...exit, sliceDir: -1, sliceAmt: 10 },
            { lines: ["You may be losing them", "before they ever see you."], color: COLORS.cyan, inStart: 24, inEnd: 39, ...exit, sliceDir: 1, sliceAmt: 12 },
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
          inStart={44}
          inEnd={57}
          outStart={104}
          outEnd={111}
        />
      </ParallaxLayer>
    </>
  );
};

function nodeAnim(frame: number, start: number, end: number) {
  // scale 0.94 -> 1.05 -> 1.00 (no overshoot beyond spec's stated keyframes)
  let scale = 0.94;
  if (frame <= start) scale = 0.94;
  else if (frame >= end) scale = 1.0;
  else {
    const mid = (start + end) / 2;
    scale = frame < mid ? mapRange(frame, start, mid, 0.94, 1.05) : mapRange(frame, mid, end, 1.05, 1.0);
  }
  const op = frame < start ? 0 : mapRange(frame, start, start + 6, 0.45, 1);
  const pulse = pulsePosition(frame, start, 40);
  return { scale, op: clamp01(op) * (frame >= start ? 1 : 0), pulse };
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
