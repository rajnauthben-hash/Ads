import React from "react";
import { useCurrentFrame } from "remotion";
import { ParallaxLayer } from "../components/CameraRig";
import { EditorialHeadline } from "../components/EditorialHeadline";
import { SupportingCopy } from "../components/SupportingCopy";
import { FactorCard, FactorRow } from "../components/FactorCard";
import { SignalRoute, MovingPulse } from "../components/SignalRoute";
import { BrandLockup } from "../components/BrandLockup";
import { FONT_UI } from "../styles/fonts";
import { clamp01, pulsePosition, revealProgress, routeDrawProgress, SCENES } from "../timeline/framePlan";
import { COLORS, LAYER } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * SCENE 5 — VISIBILITY IS A CONNECTED SYSTEM (frames 504–644).
 * Reference: futuristic_business_visibility_infographic.
 */
const S = SCENES.s5;

const HUB: Pt = { x: 445, y: 900 };

// Card frames: left column x82, right column x=515. Three rows.
const CARDS = [
  { col: 0, row: 0, in: 540, conn: 547 },
  { col: 1, row: 0, in: 547, conn: 554 },
  { col: 0, row: 1, in: 555, conn: 562 },
  { col: 1, row: 1, in: 562, conn: 569 },
  { col: 0, row: 2, in: 570, conn: 577 },
  { col: 1, row: 2, in: 578, conn: 588 },
];
const COL_X = [82, 515];
const ROW_Y = [560, 828, 1096];
const CARD_W = 300;

// connector anchor points (inner edge of each card, toward HUB)
function anchor(col: number, row: number): Pt {
  const x = col === 0 ? COL_X[0] + CARD_W : COL_X[1];
  const y = ROW_Y[row] + 70;
  return { x, y };
}

export const Scene05VisibilitySystem: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < S.start || frame > S.end + 1) return null;

  const payoff = revealProgress(frame, 606, 620);
  const merge = revealProgress(frame, 636, 649);
  const exitMask = revealProgress(frame, 637, 649);

  return (
    <>
      {/* Connectors from each card to the central business system */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.routes}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {CARDS.map((c, i) => {
            const a = anchor(c.col, c.row);
            const mid: Pt = { x: (a.x + HUB.x) / 2, y: a.y };
            const pts = [a, mid, HUB];
            const draw = routeDrawProgress(frame, c.conn, c.conn + 15);
            return (
              <g key={i}>
                <SignalRoute points={pts} progress={draw} core={2.6} glow={8} radius={20} />
                {frame >= 618 && frame < 636 && <MovingPulse points={pts} t={pulsePosition(frame, 618, 26)} size={5} maxProgress={draw} />}
              </g>
            );
          })}
          {/* merged corrected route forming beneath the storefront */}
          {merge > 0 && (
            <SignalRoute
              points={[
                { x: HUB.x, y: HUB.y + 60 },
                { x: HUB.x, y: 1300 },
              ]}
              progress={merge}
              core={3.4}
              glow={11}
            />
          )}
        </svg>
      </ParallaxLayer>

      {/* Factor cards */}
      <ParallaxLayer depth="foregroundUI" zIndex={LAYER.ui} shareScale={false}>
        {(() => {
          const rev = (c: (typeof CARDS)[number]) =>
            clamp01(revealProgress(frame, c.in, c.in + 12) * (1 - (frame >= 637 ? exitMask : 0)));
          const pos = (c: (typeof CARDS)[number]) => ({ x: COL_X[c.col], y: ROW_Y[c.row] });
          return (
            <>
              <FactorCard {...pos(CARDS[0])} width={CARD_W} n={1} titleTop="ACCURATE" titleBottom="CATEGORIES" reveal={rev(CARDS[0])}>
                <FactorRow>Hair Salon</FactorRow>
                <FactorRow>Beauty Salon</FactorRow>
                <FactorRow>Local Service</FactorRow>
              </FactorCard>

              <FactorCard {...pos(CARDS[1])} width={CARD_W} n={2} titleTop="COMPLETE" titleBottom="HOURS" reveal={rev(CARDS[1])}>
                <HoursRow d="Mon–Fri" t="9:00 AM–7:00 PM" />
                <HoursRow d="Sat" t="9:00 AM–6:00 PM" />
                <HoursRow d="Sun" t="10:00 AM–4:00 PM" />
              </FactorCard>

              <FactorCard {...pos(CARDS[2])} width={CARD_W} n={3} titleTop="USEFUL" titleBottom="PHOTOS" reveal={rev(CARDS[2])}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[0, 1, 2, 3].map((k) => (
                    <div key={k} style={{ height: 44, borderRadius: 6, background: "linear-gradient(135deg,#241c14,#3a2c1c)", border: "1px solid rgba(228,179,99,0.25)" }} />
                  ))}
                </div>
              </FactorCard>

              <FactorCard {...pos(CARDS[3])} width={CARD_W} n={4} titleTop="CREDIBLE" titleBottom="REVIEWS" reveal={rev(CARDS[3])}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: FONT_UI, fontSize: 24, color: COLORS.white }}>4.8</span>
                  <span style={{ color: COLORS.gold, fontSize: 18 }}>★★★★★</span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 16, color: COLORS.grey }}>(256)</span>
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 17, color: COLORS.grey, marginTop: 6, lineHeight: 1.3 }}>
                  “Amazing service and friendly staff. Highly recommended!”
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 16, color: COLORS.white, marginTop: 6 }}>Sarah J.</div>
              </FactorCard>

              <FactorCard {...pos(CARDS[4])} width={CARD_W} n={5} titleTop="CLEAR" titleBottom="SERVICES" reveal={rev(CARDS[4])}>
                <div style={{ fontFamily: FONT_UI, fontSize: 17, color: COLORS.white, lineHeight: 1.7 }}>
                  Haircut &amp; Styling
                  <br />
                  Hair Colour
                  <br />
                  Treatment
                  <br />
                  Blow Dry
                  <br />
                  Bookings
                </div>
              </FactorCard>

              <FactorCard {...pos(CARDS[5])} width={CARD_W} n={6} titleTop="WEBSITE THAT" titleBottom="CONFIRMS TRUST" reveal={rev(CARDS[5])}>
                <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ background: "rgba(30,36,44,0.9)", padding: "6px 10px", fontFamily: FONT_UI, fontSize: 15, color: COLORS.grey }}>
                    yourbusiness.com
                  </div>
                  <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: COLORS.green, fontSize: 13 }}>🔒</span>
                    <span style={{ fontFamily: FONT_UI, fontSize: 14, color: COLORS.white }}>
                      Secure <span style={{ color: COLORS.grey }}>https://yourbusiness.com</span>
                    </span>
                  </div>
                  <div style={{ height: 40, background: "linear-gradient(135deg,#241c14,#3a2c1c)" }} />
                  <div style={{ padding: "6px 10px", fontFamily: FONT_UI, fontSize: 14, color: COLORS.grey, lineHeight: 1.3 }}>
                    Professional care. Trusted by our community.
                  </div>
                </div>
              </FactorCard>
            </>
          );
        })()}

        {/* Bottom payoff */}
        <div style={{ position: "absolute", left: 82, top: 1350, width: 745, opacity: payoff }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderRadius: 16,
              border: "1.5px solid rgba(18,211,238,0.5)",
              background: "rgba(11,16,22,0.55)",
              padding: "18px 22px",
            }}
          >
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth={2.4}>
              <circle cx={12} cy={12} r={10} />
              <path d="M7 12.5 L11 16 L17 8.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontFamily: FONT_UI, fontSize: 24, lineHeight: 1.3 }}>
              <span style={{ color: COLORS.white, fontWeight: 500 }}>Connected. Complete. Credible.</span>
              <br />
              <span style={{ color: COLORS.cyan }}>That’s how visibility grows.</span>
            </div>
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
            { lines: ["Visibility is not controlled"], color: COLORS.white, inStart: 512, inEnd: 525, outStart: 637, outEnd: 649, sliceDir: -1 },
            { lines: ["by one switch."], color: COLORS.cyan, inStart: 522, inEnd: 537, outStart: 637, outEnd: 649, sliceDir: 1 },
          ]}
        />
        <SupportingCopy
          x={84}
          y={420}
          width={720}
          size={26}
          lines={[
            "It is strengthened through accurate",
            "categories, complete hours, useful photos,",
            "credible reviews, clear services and a",
            "website that confirms trust.",
          ]}
          inStart={533}
          inEnd={549}
        />
      </ParallaxLayer>
    </>
  );
};

const HoursRow: React.FC<{ d: string; t: string }> = ({ d, t }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 4px", fontFamily: FONT_UI, fontSize: 16 }}>
    <span style={{ color: COLORS.white }}>{d}</span>
    <span style={{ color: COLORS.grey }}>{t}</span>
  </div>
);
