import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { SearchNode } from "../components/SearchNode";
import { SearchBar } from "../components/SearchBar";
import { SearchResultCard } from "../components/SearchResultCard";
import { SignalRoute, MovingPulse } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import { FONT_UI } from "../styles/fonts";
import { clamp01, mapRange, pulsePosition, revealProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 2 — CUSTOMERS FORM A SHORTLIST (frames 120–245).
 * Reference: digital_search_and_customer_shortlist.
 */
const S = SCENES.s2;
const NODE: Pt = { x: 445, y: 800 };

// Dotted connector origins (near surrounding businesses) feeding the search node.
const FEEDS: Pt[] = [
  { x: 150, y: 690 },
  { x: 120, y: 940 },
  { x: 400, y: 1060 },
  { x: 720, y: 640 },
  { x: 250, y: 560 },
  { x: 600, y: 560 },
];

const RESULTS = [
  { name: ["Bright Smiles", "Dental"], rating: "4.9", distance: "0.4 mi" },
  { name: ["CareFirst", "Dentistry"], rating: "4.7", distance: "0.7 mi" },
  { name: ["Smile Studio", "Dental"], rating: "4.6", distance: "0.9 mi" },
];

export const Scene02Shortlist: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  // Node continues from Scene 1 merge (470,980) and settles at NODE.
  const settle = revealProgress(frame, 120, 137);
  const nodePos: Pt = { x: 470 + (NODE.x - 470) * settle, y: 980 + (NODE.y - 980) * settle };
  const spine = mapRange(frame, 120, 137, 0, 1); // widen into interface spine

  const feedDraw = revealProgress(frame, 128, 160);

  const outline = revealProgress(frame, 180, 185);
  const query = "best dentist near me";
  const chars = mapRange(frame, 186, 202, 0, query.length);

  const iconPulse = pulsePosition(frame, 203, 30);
  const marketDim = mapRange(frame, 231, 236, 1, 0.28);
  const labelReveal = revealProgress(frame, 236, 241);
  const compress = revealProgress(frame, 240, 245);

  const cardReveal = (a: number, b: number) => clamp01(revealProgress(frame, a, b) * (1 - compress));

  const containerX = 105;
  const containerW = 710;
  const cardW = (containerW - 32) / 3;
  const cardH = 190;
  const cardY = 1145;

  return (
    <>
      {/* Routes / node / spine */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <line
            x1={nodePos.x - 150 * spine}
            y1={nodePos.y}
            x2={nodePos.x + 150 * spine}
            y2={nodePos.y}
            stroke={COLORS.cyan}
            strokeWidth={2}
            opacity={0.4 * spine}
            style={{ filter: "blur(1px)" }}
          />
          {FEEDS.map((f, i) => (
            <SignalRoute
              key={i}
              points={[f, { x: (f.x + nodePos.x) / 2, y: (f.y + nodePos.y) / 2 - 20 }, nodePos]}
              progress={feedDraw}
              dotted
              core={2.4}
              glow={7}
              brightness={0.7 * marketDim}
              color={COLORS.cyan}
            />
          ))}
          <SignalRoute
            points={[nodePos, { x: nodePos.x, y: 980 }, { x: 320, y: 1010 }, { x: 320, y: 1040 }]}
            progress={revealProgress(frame, 186, 210)}
            core={3}
            glow={9}
          />
          {frame >= 203 && frame < 240 && (
            <MovingPulse
              points={[{ x: nodePos.x, y: nodePos.y }, { x: 320, y: 1010 }, { x: 320, y: 1040 }]}
              t={iconPulse}
              size={6}
            />
          )}
          <SearchNode at={nodePos} r={30} scale={1} opacity={1} pulse={pulsePosition(frame, 160, 40)} />
        </svg>
      </ParallaxLayer>

      {/* UI: search bar + result cards + bottom label */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.ui} shareScale={false}>
        <SearchBar x={150} y={1040} width={650} query={query} visibleChars={chars} outlineProgress={outline} showCaret />

        <div
          style={{
            position: "absolute",
            left: containerX - 10,
            top: cardY - 12,
            width: containerW + 20,
            height: cardH + 24,
            borderRadius: 20,
            border: `1.5px solid rgba(18,211,238,${0.4 * (1 - compress)})`,
            opacity: revealProgress(frame, 205, 215),
          }}
        />

        {RESULTS.map((r, i) => {
          const start = 209 + i * 6;
          const rev = cardReveal(start, start + 9);
          const w = cardW * (1 - compress) + 4 * compress;
          const x = containerX + i * (cardW + 16) + (cardW - w) / 2;
          return compress > 0.01 ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: cardY + i * 4,
                width: w,
                height: 6,
                background: COLORS.cyan,
                borderRadius: 3,
                boxShadow: "0 0 8px rgba(18,211,238,0.5)",
                opacity: compress,
              }}
            />
          ) : (
            <SearchResultCard
              key={i}
              x={containerX + i * (cardW + 16)}
              y={cardY}
              width={cardW}
              height={cardH}
              name={r.name}
              rating={r.rating}
              distance={r.distance}
              reveal={rev}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 1360,
            width: 1080,
            textAlign: "center",
            opacity: labelReveal * (1 - compress),
          }}
        >
          <svg width={40} height={44} style={{ display: "block", margin: "0 auto 8px" }}>
            <rect x={10} y={20} width={20} height={16} rx={3} fill="none" stroke={COLORS.grey} strokeWidth={2} />
            <path d="M14 20 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke={COLORS.grey} strokeWidth={2} />
            <circle cx={20} cy={28} r={2.4} fill={COLORS.grey} />
          </svg>
          <div style={{ fontFamily: FONT_UI, fontSize: 22, letterSpacing: 4, color: COLORS.grey, lineHeight: 1.4 }}>
            THE REST OF
            <br />
            THE MARKET
          </div>
        </div>
      </ParallaxLayer>

      {/* Text */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={82} y={70} size={26} />
        <EditorialHeadline
          x={82}
          y={195}
          width={745}
          size={52}
          groups={[
            { lines: ["When customers search,"], color: COLORS.white, inStart: 132, inEnd: 143, outStart: 240, outEnd: 245, sliceDir: -1 },
            { lines: ["they do not study every", "business nearby."], color: COLORS.cyan, inStart: 144, inEnd: 159, outStart: 240, outEnd: 245, sliceDir: 1 },
          ]}
        />
        <SupportingCopy
          x={84}
          y={500}
          width={700}
          size={27}
          lines={[
            "Google gives them a small group to compare first.",
            "Those results become the customer’s shortlist",
            "before they explore the rest of the market.",
          ]}
          inStart={166}
          inEnd={179}
          outStart={240}
          outEnd={245}
        />
      </ParallaxLayer>
    </>
  );
};
