import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { DiagnosticCard, DiagStatus } from "../components/DiagnosticCard";
import { PhraseReveal } from "../components/PhraseReveal";
import { SignalRoute } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import { FONT_UI } from "../styles/fonts";
import { clamp01, mapRange, revealProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";

/**
 * SCENE 3 — PHYSICAL BUSINESS vs DIGITAL VERSION (frames 246–371).
 * Reference: digital_marketing_in_the_modern_age.
 */
const S = SCENES.s3;

interface Diag {
  icon: "hours" | "reviews" | "services" | "website" | "profile" | "category" | "photos";
  title: string;
  subtitle?: string;
  status: DiagStatus;
  in: number;
}
const DIAGS: Diag[] = [
  { icon: "hours", title: "HOURS", subtitle: "Not updated", status: "INCOMPLETE", in: 306 },
  { icon: "reviews", title: "REVIEWS", subtitle: "Few reviews", status: "WEAK", in: 313 },
  { icon: "services", title: "SERVICES", status: "INCOMPLETE", in: 320 },
  { icon: "website", title: "WEBSITE CLARITY", subtitle: "Unclear or missing", status: "MISSING", in: 327 },
  { icon: "profile", title: "PROFILE COMPLETENESS", subtitle: "40% complete", status: "INCOMPLETE", in: 334 },
  { icon: "category", title: "CATEGORY", subtitle: "Not specific", status: "UNCLEAR", in: 341 },
  { icon: "photos", title: "PHOTOS & VIDEOS", subtitle: "Very few", status: "MISSING", in: 348 },
];

const SEAM_X = 505;

export const Scene03PhysicalDigital: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  const seamGrow = revealProgress(frame, 250, 260);
  const seamTop = 700;
  const seamBottom = seamTop + (610 * seamGrow) - 0;
  const vsRotate = mapRange(frame, 369, 379, 0, 90);

  // storefront -> seam route, becomes dotted at the barrier
  const routeDraw = revealProgress(frame, 352, 363);
  const barrierDim = mapRange(frame, 355, 363, 1, 0.48);
  const warnReveal = revealProgress(frame, 355, 363);

  const exitFade = revealProgress(frame, 369, 379);

  return (
    <>
      {/* Comparison seam + route */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* vertical seam */}
          <line
            x1={SEAM_X}
            y1={seamTop}
            x2={SEAM_X}
            y2={seamBottom}
            stroke={COLORS.cyan}
            strokeWidth={2.4}
            opacity={0.6}
            style={{ filter: "drop-shadow(0 0 5px rgba(18,211,238,0.4))" }}
          />
          {/* storefront -> seam route (solid then dotted at barrier) */}
          <SignalRoute
            points={[
              { x: 300, y: 1250 },
              { x: 300, y: 1330 },
              { x: 470, y: 1330 },
              { x: 505, y: 1290 },
            ]}
            progress={Math.min(routeDraw, 0.6)}
            core={3}
            glow={9}
            brightness={barrierDim}
          />
          <SignalRoute
            points={[
              { x: 505, y: 1290 },
              { x: 505, y: 1180 },
            ]}
            progress={clamp01(mapRange(frame, 355, 363, 0, 1))}
            dotted
            core={3}
            glow={7}
            brightness={barrierDim}
          />
          {/* warning marker at barrier */}
          {warnReveal > 0 && (
            <g opacity={warnReveal} transform={`translate(505 1180) scale(${mapRange(frame, 355, 365, 0.92, 1)})`}>
              <circle cx={0} cy={0} r={16} fill="rgba(9,12,17,0.9)" stroke={COLORS.red} strokeWidth={2} />
              <g stroke={COLORS.red} strokeWidth={2.4} strokeLinecap="round">
                <line x1={-6} y1={-6} x2={6} y2={6} />
                <line x1={6} y1={-6} x2={-6} y2={6} />
              </g>
            </g>
          )}
          {/* VS. circle */}
          <g transform={`translate(${SEAM_X} 690) rotate(${vsRotate})`} opacity={revealProgress(frame, 310, 318)}>
            <circle cx={0} cy={0} r={30} fill="rgba(9,12,17,0.95)" stroke={COLORS.cyan} strokeWidth={2.2} />
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${-vsRotate})`}
              fill={COLORS.white}
              fontFamily={FONT_UI}
              fontWeight={500}
              fontSize={22}
            >
              VS.
            </text>
          </g>
        </svg>
      </ParallaxLayer>

      {/* Diagnostic cards */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.ui} shareScale={false}>
        {DIAGS.map((d, i) => (
          <DiagnosticCard
            key={d.title}
            x={520}
            y={732 + i * 100}
            width={300}
            height={92}
            icon={d.icon}
            title={d.title}
            subtitle={d.subtitle}
            status={d.status}
            reveal={clamp01(revealProgress(frame, d.in, d.in + 9) * (1 - exitFade))}
          />
        ))}
        {/* live "scan" sweep down the diagnostic panel */}
        {(() => {
          const scan = revealProgress(frame, 300, 360);
          if (scan <= 0 || scan >= 1) return null;
          const sy = 720 + scan * 740;
          return (
            <div
              style={{
                position: "absolute",
                left: 512,
                top: sy,
                width: 316,
                height: 3,
                background: "linear-gradient(90deg, rgba(18,211,238,0) 0%, rgba(18,211,238,0.9) 50%, rgba(18,211,238,0) 100%)",
                boxShadow: "0 0 16px rgba(18,211,238,0.7)",
                opacity: 0.85,
              }}
            />
          );
        })()}
      </ParallaxLayer>

      {/* Labels */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.text} shareScale={false}>
        <BrandLockup x={82} y={70} size={26} />
        <EditorialHeadline
          x={82}
          y={195}
          width={745}
          size={46}
          groups={[
            { lines: ["Your doors can be open."], color: COLORS.white, inStart: 257, inEnd: 270, outStart: 369, outEnd: 379, sliceDir: -1 },
            { lines: ["Your team can be ready."], color: COLORS.white, inStart: 267, inEnd: 280, outStart: 369, outEnd: 379, sliceDir: 1 },
            { lines: ["Your service can be excellent."], color: COLORS.cyan, inStart: 277, inEnd: 291, outStart: 369, outEnd: 379, sliceDir: -1 },
          ]}
          gap={6}
        />
        <SupportingCopy
          x={84}
          y={470}
          width={730}
          size={26}
          lines={[
            "But incomplete information, weak reviews",
            "and unclear profile signals can prevent",
            "customers from reaching that part of your story.",
          ]}
          inStart={288}
          inEnd={305}
        />

        {/* Left label: IN REAL LIFE */}
        <div style={{ position: "absolute", left: 92, top: 640, width: 380 }}>
          <PhraseReveal inStart={298} inEnd={308}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth={2} strokeLinejoin="round">
                <path d="M4 9 L5 5 L19 5 L20 9 Z" />
                <path d="M5 9 L5 19 L19 19 L19 9" />
              </svg>
              <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 22, letterSpacing: 1.5, color: COLORS.gold }}>
                IN REAL LIFE
              </span>
            </div>
          </PhraseReveal>
          <PhraseReveal inStart={304} inEnd={314} style={{ marginTop: 6 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 19, color: COLORS.grey, lineHeight: 1.3 }}>
              Complete. Ready.
              <br />
              Built for customers.
            </div>
          </PhraseReveal>
        </div>

        {/* Right label: DIGITALLY */}
        <div style={{ position: "absolute", left: 535, top: 640, width: 290 }}>
          <PhraseReveal inStart={305} inEnd={315}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width={24} height={30} viewBox="0 0 20 26" fill="none" stroke={COLORS.cyan} strokeWidth={2}>
                <rect x={3} y={2} width={14} height={22} rx={3} />
                <line x1={8} y1={20} x2={12} y2={20} />
              </svg>
              <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 22, letterSpacing: 1.5, color: COLORS.cyan }}>
                DIGITALLY
              </span>
            </div>
          </PhraseReveal>
          <PhraseReveal inStart={311} inEnd={321} style={{ marginTop: 6 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 19, color: COLORS.grey, lineHeight: 1.3 }}>
              Incomplete. Hidden.
              <br />
              Harder to find.
            </div>
          </PhraseReveal>
        </div>
      </ParallaxLayer>
    </>
  );
};
