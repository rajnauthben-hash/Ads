import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { ActionIcon } from "../components/ActionIcon";
import { CompetitorStore } from "../components/CompetitorStore";
import { SignalRoute, MovingPulse } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import { FONT_UI } from "../styles/fonts";
import { clamp01, mapRange, pulsePosition, revealProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 4 — YOU WERE BYPASSED (frames 372–503).
 * Reference: city_of_missed_opportunities.
 */
const S = SCENES.s4;

// Routes rise up and over toward the competitor's left side, staying above the
// YOUR BUSINESS roofline so they never cross the storefront volume.
const CALL: Pt[] = [
  { x: 150, y: 968 },
  { x: 320, y: 930 },
  { x: 450, y: 905 },
  { x: 560, y: 900 },
];
const DIRECTIONS: Pt[] = [
  { x: 150, y: 1086 },
  { x: 300, y: 1000 },
  { x: 420, y: 935 },
  { x: 545, y: 918 },
];
const VISIT: Pt[] = [
  { x: 150, y: 1202 },
  { x: 300, y: 1090 },
  { x: 400, y: 985 },
  { x: 530, y: 935 },
];
const FAILED: Pt[] = [
  { x: 470, y: 1120 },
  { x: 500, y: 1240 },
  { x: 560, y: 1300 },
];
const FAIL_MARK: Pt = { x: 560, y: 1300 };

export const Scene04Bypassed: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  const callDraw = clamp01(frame < 423 ? mapRange(frame, 410, 422, 0, 0.42) : mapRange(frame, 423, 438, 0.42, 1));
  const dirDraw = clamp01(frame < 432 ? mapRange(frame, 416, 431, 0, 0.52) : mapRange(frame, 432, 447, 0.52, 1));
  const visitDraw = clamp01(frame < 442 ? mapRange(frame, 424, 441, 0, 0.55) : mapRange(frame, 442, 458, 0.55, 1));

  const compReveal = revealProgress(frame, 436, 447);
  const compLight = mapRange(frame, 444, 455, 0.78, 0.9);
  const compLightExit = mapRange(frame, 484, 503, 0.9, 0.82);
  const light = frame >= 484 ? compLightExit : compLight;

  const failedDraw = clamp01(mapRange(frame, 446, 458, 0, 0.63) * (1 - revealProgress(frame, 492, 503)));
  // repairing branch during transition
  const repair = revealProgress(frame, 492, 503);
  const warnReveal = clamp01(revealProgress(frame, 459, 466) * (1 - repair));
  const warnScale = mapRange(frame, 459, 466, 0.92, 1);

  const iconsCondense = revealProgress(frame, 492, 503);
  const iconDraw = (t: number) => clamp01(t * (1 - iconsCondense));

  const compPulse = pulsePosition(frame, 471, 50);
  const reversePulse = 1 - pulsePosition(frame, 484, 40);

  return (
    <>
      {/* Routes + competitor + failure */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <CompetitorStore origin={{ x: 590, y: 800 }} light={light} glow={compReveal} />

          <SignalRoute points={CALL} progress={callDraw} core={3} glow={9} />
          <SignalRoute points={DIRECTIONS} progress={dirDraw} core={3} glow={9} />
          <SignalRoute points={VISIT} progress={visitDraw} core={3} glow={9} />

          {/* competitor slow pulse during hold */}
          {frame >= 460 && frame < 492 && <MovingPulse points={CALL} t={compPulse} size={6} maxProgress={callDraw} />}
          {frame >= 484 && frame < 503 && (
            <MovingPulse points={DIRECTIONS} t={reversePulse} size={6} maxProgress={dirDraw} color={COLORS.cyan} />
          )}

          {/* failed YOUR BUSINESS route (solid then dotted) */}
          <SignalRoute points={[FAILED[0], FAILED[1]]} progress={Math.min(1, failedDraw / 0.63)} core={3} glow={8} brightness={0.7} />
          <SignalRoute points={[FAILED[1], FAILED[2]]} progress={failedDraw > 0.5 ? 1 : 0} dotted core={3} glow={6} brightness={0.6} />
          {/* repaired dashes closing from junction */}
          {repair > 0 && <SignalRoute points={FAILED} progress={repair} core={3} glow={8} brightness={0.8} />}

          {/* failure marker */}
          {warnReveal > 0 && (
            <g opacity={warnReveal} transform={`translate(${FAIL_MARK.x} ${FAIL_MARK.y}) scale(${warnScale})`}>
              <circle cx={0} cy={0} r={17} fill="rgba(9,12,17,0.9)" stroke="#B4534B" strokeWidth={2} />
              <g stroke="#C85C52" strokeWidth={2.6} strokeLinecap="round">
                <line x1={-6} y1={-6} x2={6} y2={6} />
                <line x1={6} y1={-6} x2={-6} y2={6} />
              </g>
            </g>
          )}
        </svg>
      </ParallaxLayer>

      {/* Action icons + competitor card + takeaway */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.ui} shareScale={false}>
        <ActionIcon cx={150} cy={972} type="call" label="CALL" draw={iconDraw(revealProgress(frame, 392, 405))} />
        <ActionIcon cx={150} cy={1088} type="directions" label="DIRECTIONS" draw={iconDraw(revealProgress(frame, 412, 424))} />
        <ActionIcon cx={150} cy={1204} type="visit" label="VISIT" draw={iconDraw(revealProgress(frame, 424, 436))} />

        {/* Competitor card */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 690,
            width: 280,
            opacity: compReveal * (1 - revealProgress(frame, 484, 503)),
            transform: `translateY(${(1 - compReveal) * 12}px)`,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              border: "1.5px solid rgba(18,211,238,0.6)",
              background: "rgba(11,16,22,0.6)",
              boxShadow: "0 0 14px rgba(18,211,238,0.2)",
              padding: "16px 18px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: COLORS.white }}>
              COMPETITOR
            </div>
            <div style={{ color: COLORS.cyan, fontSize: 22, letterSpacing: 3, margin: "6px 0" }}>★★★★★</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 19, color: COLORS.grey, lineHeight: 1.3 }}>
              Clear information.
              <br />
              Easy next step.
            </div>
          </div>
        </div>

        {/* Bottom takeaway */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 1370,
            width: 430,
            opacity: revealProgress(frame, 463, 470),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: 14,
              border: "1px solid rgba(18,211,238,0.28)",
              background: "rgba(11,16,22,0.5)",
              padding: "16px 18px",
            }}
          >
            <svg width={30} height={34} viewBox="0 0 24 30" fill="none" stroke={COLORS.cyan} strokeWidth={2}>
              <path d="M12 2 C6 2 3 6 3 11 C3 17 12 27 12 27 C12 27 21 17 21 11 C21 6 18 2 12 2 Z" />
              <circle cx={12} cy={11} r={3.4} />
            </svg>
            <div style={{ fontFamily: FONT_UI, fontSize: 22, lineHeight: 1.3 }}>
              <span style={{ color: COLORS.white }}>The demand was close.</span>
              <br />
              <span style={{ color: COLORS.cyan }}>It just went elsewhere.</span>
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* Text */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={82} y={70} size={26} />
        <SupportingCopy
          x={82}
          y={195}
          width={640}
          size={26}
          lines={["The customer does not think,", "“I rejected that business.”"]}
          inStart={380}
          inEnd={391}
        />
        <EditorialHeadline
          x={82}
          y={320}
          width={745}
          size={40}
          gap={10}
          groups={[
            { lines: ["They call the business they saw."], color: COLORS.white, inStart: 400, inEnd: 411 },
            { lines: ["They trust the information", "that looked clearer."], color: COLORS.white, inStart: 412, inEnd: 423 },
            { lines: ["They visit the option", "that made the next step easier."], color: COLORS.white, inStart: 424, inEnd: 435 },
          ]}
        />
        <EditorialHeadline
          x={82}
          y={720}
          width={745}
          size={44}
          gap={2}
          groups={[
            { lines: ["You were not compared.", "You were bypassed."], color: COLORS.cyan, inStart: 447, inEnd: 462 },
          ]}
        />
      </ParallaxLayer>
    </>
  );
};
