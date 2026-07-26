import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { SupportingCopy } from "../components/SupportingCopy";
import { SearchNode } from "../components/SearchNode";
import { SignalRoute, MovingPulse } from "../components/SignalRoute";
import { DestinationMarker } from "../components/DestinationMarker";
import { BrandLockup } from "../components/BrandLockup";
import { PhraseReveal } from "../components/PhraseReveal";
import { FONT_HEADLINE } from "../styles/fonts";
import { clamp01, mapRange, pulsePosition, revealProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 6 — OMNIFLOW RECONNECTS THE BUSINESS (frames 645–779).
 * Reference: boost_your_business_visibility_online.
 */
const S = SCENES.s6;

const ENTRANCE: Pt = { x: 655, y: 1060 };
const JUNCTION: Pt = { x: 610, y: 1180 };
const MAIN: Pt[] = [
  { x: 470, y: 1350 },
  { x: 520, y: 1270 },
  JUNCTION,
  { x: 640, y: 1110 },
  ENTRANCE,
];

interface Node {
  at: Pt;
  join: Pt;
  in: number;
  route: number;
  labelAnchor: "start" | "end";
  labelDx: number;
}
// Nodes sit around/above the storefront, clear of the lower-left CTA + brand.
const NODES: Node[] = [
  { at: { x: 165, y: 860 }, join: { x: 520, y: 1250 }, in: 686, route: 696, labelAnchor: "start", labelDx: 34 },
  { at: { x: 205, y: 1055 }, join: { x: 540, y: 1230 }, in: 694, route: 704, labelAnchor: "start", labelDx: 34 },
  { at: { x: 775, y: 940 }, join: { x: 690, y: 1120 }, in: 702, route: 712, labelAnchor: "end", labelDx: -34 },
  { at: { x: 760, y: 1170 }, join: { x: 655, y: 1150 }, in: 710, route: 720, labelAnchor: "end", labelDx: -34 },
];

export const Scene06Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  // Corrected route: continues from Scene 5 (starts ~0.5), reaches key %ages.
  const mainProgress = clamp01(
    frame < 723 ? mapRange(frame, 645, 723, 0.5, 0.72) : mapRange(frame, 723, 742, 0.72, 1),
  );

  const ringDraw = revealProgress(frame, 708, 719);
  const bodyScale = mapRange(frame, 720, 731, 0.92, 1);
  const markerGlow = revealProgress(frame, 720, 743);
  const destText = revealProgress(frame, 724, 738);

  const doorPulse = pulsePosition(frame, 743, 22);
  const showDoorPulse = frame >= 743 && frame <= 752;

  const brandReveal = revealProgress(frame, 748, 765);

  return (
    <>
      {/* Corrected route + node routes + nodes */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRoute points={MAIN} progress={mainProgress} core={3.6} glow={12} />
          {mainProgress >= 0.99 && <MovingPulse points={MAIN} t={pulsePosition(frame, 742, 40)} size={7} />}

          {NODES.map((n, i) => {
            const draw = revealProgress(frame, n.route, n.route + 14);
            const pts = [n.at, { x: (n.at.x + n.join.x) / 2, y: (n.at.y + n.join.y) / 2 }, n.join];
            return <SignalRoute key={i} points={pts} progress={draw} core={2.6} glow={8} />;
          })}

          {showDoorPulse && (
            <MovingPulse points={[{ x: 620, y: 1120 }, ENTRANCE, { x: 680, y: 1030 }]} t={doorPulse} size={7} />
          )}
        </svg>
      </ParallaxLayer>

      {/* Nodes with labels + destination marker */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.ui}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {NODES.map((n, i) => {
            const p = revealProgress(frame, n.in, n.in + 10);
            const scale = frame < (n.in + n.in + 10) / 2 ? mapRange(frame, n.in, (n.in + n.in + 10) / 2, 0.94, 1.05) : mapRange(frame, (n.in + n.in + 10) / 2, n.in + 10, 1.05, 1.0);
            return (
              <SearchNode
                key={i}
                at={n.at}
                r={24}
                scale={clamp01(scale) || 0.94}
                opacity={mapRange(frame, n.in, n.in + 6, 0.45, 1) * (p > 0 ? 1 : 0)}
                pulse={pulsePosition(frame, n.in, 34)}
                label={"Shortlisted\nby customer"}
                labelColor={COLORS.cyan}
                labelAnchor={n.labelAnchor}
                labelDx={n.labelDx}
              />
            );
          })}
        </svg>
        <DestinationMarker cx={705} cy={715} ringDraw={ringDraw} bodyScale={bodyScale} glow={markerGlow} textReveal={destText} />
      </ParallaxLayer>

      {/* Text + closing + brand */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={825} y={70} size={26} align="right" />

        <div style={{ position: "absolute", left: 82, top: 200, width: 745 }}>
          <PhraseReveal inStart={652} inEnd={663} style={headlineStyle()}>
            <span style={{ color: COLORS.white }}>OmniFlow </span>
            <span style={{ color: COLORS.cyan }}>strengthens</span>
          </PhraseReveal>
          <PhraseReveal inStart={664} inEnd={679} style={{ ...headlineStyle(), color: COLORS.cyan, marginTop: 6 }}>
            what customers see first.
          </PhraseReveal>
        </div>

        <SupportingCopy
          x={84}
          y={430}
          width={720}
          size={27}
          lines={[
            "So a good business stops disappearing",
            "from the decision — and becomes",
            "easier to find, trust and choose.",
          ]}
          inStart={686}
          inEnd={699}
        />

        {/* Closing statement */}
        <div style={{ position: "absolute", left: 82, top: 1150, width: 480 }}>
          <PhraseReveal inStart={738} inEnd={746} style={closingStyle(COLORS.white)}>
            Get found.
          </PhraseReveal>
          <PhraseReveal inStart={745} inEnd={753} style={closingStyle(COLORS.cyan)}>
            Look professional.
          </PhraseReveal>
          <PhraseReveal inStart={752} inEnd={760} style={closingStyle(COLORS.gold)}>
            Grow online.
          </PhraseReveal>
        </div>

        {/* Brand lockup (large) */}
        <BrandLockup x={82} y={1360} size={44} reveal={brandReveal} />
      </ParallaxLayer>
    </>
  );
};

function headlineStyle(): React.CSSProperties {
  return {
    fontFamily: FONT_HEADLINE,
    fontWeight: 800,
    fontSize: 52,
    lineHeight: 1.04,
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
  };
}

function closingStyle(color: string): React.CSSProperties {
  return {
    fontFamily: FONT_HEADLINE,
    fontWeight: 800,
    fontSize: 46,
    lineHeight: 1.12,
    letterSpacing: "-0.01em",
    color,
    whiteSpace: "nowrap",
  };
}
