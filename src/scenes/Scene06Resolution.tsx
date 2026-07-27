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
 * SCENE 6 — RESOLUTION (frames 650–779). Reference: 7767.png.
 * OmniFlow strengthens what customers see first; the corrected route reaches
 * the storefront entrance and the CTA + brand resolve as a clean end card.
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
  { at: { x: 165, y: 860 }, join: { x: 520, y: 1250 }, in: 686, route: 690, labelAnchor: "start", labelDx: 34 },
  { at: { x: 205, y: 1050 }, join: { x: 540, y: 1230 }, in: 695, route: 699, labelAnchor: "start", labelDx: 34 },
  { at: { x: 775, y: 930 }, join: { x: 690, y: 1120 }, in: 704, route: 708, labelAnchor: "end", labelDx: -34 },
  { at: { x: 775, y: 1120 }, join: { x: 655, y: 1150 }, in: 713, route: 717, labelAnchor: "end", labelDx: -34 },
];

export const Scene06Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  // Corrected route: continues from Scene 5 (~0.5), reaches the key %ages.
  const mainProgress = clamp01(
    frame < 719 ? mapRange(frame, 650, 719, 0.5, 0.72) : mapRange(frame, 719, 740, 0.72, 1, "ROUTE"),
  );

  const ringDraw = revealProgress(frame, 707, 720);
  const bodyScale = mapRange(frame, 718, 730, 0.92, 1);
  const markerGlow = revealProgress(frame, 718, 740);
  const destText = revealProgress(frame, 723, 736);

  const doorPulse = pulsePosition(frame, 740, 22);
  const showDoorPulse = frame >= 740 && frame <= 750;

  const ctaPanel = revealProgress(frame, 746, 760);
  const brandReveal = revealProgress(frame, 748, 765);
  const connector = revealProgress(frame, 752, 764);

  return (
    <>
      {/* Corrected route + node routes + nodes */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <SignalRoute points={MAIN} progress={mainProgress} core={3.6} glow={12} />
          {mainProgress >= 0.99 && <MovingPulse points={MAIN} t={pulsePosition(frame, 740, 40)} size={7} />}

          {NODES.map((n, i) => {
            const draw = revealProgress(frame, n.route, n.route + 16);
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
            const mid = n.in + 5;
            const scale = frame < mid ? mapRange(frame, n.in, mid, 0.94, 1.05) : mapRange(frame, mid, n.in + 10, 1.05, 1.0);
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

        {/* Gold connector from CTA panel to the final brand lockup */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M 470 1300 L 540 1300 Q 560 1300 560 1330 L 560 1370"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${connector} ${1 - connector + 0.0001}`}
            opacity={0.85}
            style={{ filter: "drop-shadow(0 0 4px rgba(228,179,99,0.4))" }}
          />
        </svg>
      </ParallaxLayer>

      {/* Text + closing + brand */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={825} y={70} size={26} align="right" reveal={revealProgress(frame, 754, 764)} />

        <div style={{ position: "absolute", left: 82, top: 200, width: 745 }}>
          <PhraseReveal inStart={658} inEnd={671} style={headlineStyle()}>
            <span style={{ color: COLORS.white }}>OmniFlow </span>
            <span style={{ color: COLORS.cyan }}>strengthens</span>
          </PhraseReveal>
          <PhraseReveal inStart={669} inEnd={685} style={{ ...headlineStyle(), color: COLORS.cyan, marginTop: 6 }}>
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
          inStart={681}
          inEnd={696}
        />

        {/* CTA panel — dark rounded rectangle with a thin warm-gold border */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 1150,
            width: 388,
            opacity: Math.min(1, ctaPanel * 1.3),
            clipPath: `inset(0 ${(1 - ctaPanel) * 100}% 0 0)`,
          }}
        >
          <div
            style={{
              borderRadius: 18,
              border: `1.6px solid ${COLORS.gold}`,
              background: "rgba(9,12,17,0.72)",
              padding: "22px 26px",
            }}
          >
            <PhraseReveal inStart={732} inEnd={742} style={closingStyle(COLORS.white)}>
              Get found.
            </PhraseReveal>
            <PhraseReveal inStart={740} inEnd={750} style={closingStyle(COLORS.cyan)}>
              Look professional.
            </PhraseReveal>
            <PhraseReveal inStart={748} inEnd={758} style={closingStyle(COLORS.gold)}>
              Grow online.
            </PhraseReveal>
          </div>
        </div>

        {/* Final brand lockup (bottom-right, joined to the CTA by the gold line) */}
        <BrandLockup x={700} y={1360} size={36} reveal={brandReveal} align="left" />
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
    fontSize: 40,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
    color,
    whiteSpace: "nowrap",
  };
}
