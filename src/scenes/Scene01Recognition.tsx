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
 * Five nearby customer searches move through the streets but pass YOUR BUSINESS.
 */
const S = SCENES.s1;

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
  { at: { x: 200, y: 770 }, label: "Looking for\nhair salon", variant: "search", in: 57, labelAnchor: "start", labelDx: 36, labelDy: 0 },
  { at: { x: 505, y: 815 }, label: "Searching\nfor dentist", variant: "search", in: 64, labelAnchor: "start", labelDx: 36, labelDy: 0 },
  { at: { x: 235, y: 1120 }, label: "Nearby &\nready to go", variant: "person", in: 71, labelAnchor: "middle", labelDx: 0, labelDy: 44 },
  { at: { x: 255, y: 1360 }, label: "Looking for\ncafé", variant: "search", in: 78, labelAnchor: "middle", labelDx: 0, labelDy: 44 },
  { at: { x: 780, y: 1330 }, label: "Searching\nfor pizza", variant: "search", in: 85, labelAnchor: "end", labelDx: -36, labelDy: 0 },
];

const MERGE: Pt = { x: 470, y: 980 };

// One continuous winding cyan route down the city that passes close to YOUR
// BUSINESS (~x600,y912) but never reaches its entrance.
const MAIN: Pt[] = [
  { x: 200, y: 800 },
  { x: 320, y: 905 },
  { x: 300, y: 1035 },
  { x: 365, y: 1150 },
  { x: 335, y: 1285 },
  { x: 300, y: 1410 },
];

export const Scene01Recognition: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  const mainProgress = clamp01(mapRange(frame, 0, 95, 0.08, 1));
  const pulseA = pulsePosition(frame, 0, 70);

  // Transition 106–119: nodes converge to MERGE and merge into one node.
  const converge = revealProgress(frame, 106, 116);
  const merged = frame >= 116;
  const mergeScale = mapRange(frame, 116, 119, 1.0, 1.22);
  const tail = clamp01(mainProgress * (1 - converge));

  return (
    <>
      {/* Routes + nodes */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {!merged && (
            <>
              <SignalRoute points={MAIN} progress={tail} core={3} glow={10} />
              {tail > 0.2 && <RouteArrow points={MAIN} t={Math.min(tail, 0.85)} />}
              {tail > 0.05 && <MovingPulse points={MAIN} t={pulseA} maxProgress={tail} size={6} />}
            </>
          )}

          {merged ? (
            <SearchNode at={MERGE} scale={mergeScale} r={30} opacity={1} pulse={pulsePosition(frame, 116, 30)} />
          ) : (
            NODES.map((n, i) => {
              const p = revealProgress(frame, n.in, n.in + 11);
              const mid = n.in + 5.5;
              const scale =
                frame <= n.in
                  ? 0.94
                  : frame >= n.in + 11
                    ? 1.0
                    : frame < mid
                      ? mapRange(frame, n.in, mid, 0.94, 1.05)
                      : mapRange(frame, mid, n.in + 11, 1.05, 1.0);
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
            })
          )}
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
