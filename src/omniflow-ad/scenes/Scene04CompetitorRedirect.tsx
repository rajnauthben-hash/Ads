import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { ease, prog, premiumEase, settleEase } from "../styles/geometry";
import { PremiumPanel } from "../components/PremiumPanel";
import { MaskedHeadline } from "../components/MaskedHeadline";
import { AnimatedCopy } from "../components/AnimatedCopy";
import { OmniFlowBrandLockup } from "../components/OmniFlowBrandLockup";
import { MasterMapWorld } from "../components/MasterMapWorld";
import { CrownHardwareCard } from "../components/CrownHardwareCard";
import { CompetitorCard } from "../components/CompetitorCard";
import { SearchPulseRoute } from "../components/SearchPulseRoute";
import { DestinationRipple } from "../components/DestinationRipple";
import { RerouteIcon, InfoIcon, WarningIcon, PinIcon } from "../components/Icons";

const VP = { x: 470, y: 94, w: 578, h: 1280, r: 56 };

const RoutePin: React.FC<{ x: number; y: number; active?: boolean; ripple?: number }> = ({ x, y, active = true, ripple = 0 }) => (
  <>
    {ripple > 0 && <DestinationRipple x={x} y={y + 6} progress={ripple} color={active ? COLORS.cyan : COLORS.mutedGray} maxR={30} />}
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-100%)" }}>
      <PinIcon size={38} color={active ? COLORS.cyan : COLORS.mutedGray} strokeWidth={2} style={{ filter: active ? "drop-shadow(0 0 8px rgba(24,216,255,0.6))" : undefined }} />
    </div>
  </>
);

export const Scene04CompetitorRedirect: React.FC = () => {
  const f = useCurrentFrame();
  const exit = prog(f, 150, 179, settleEase);

  const vpP = prog(f, 0, 20, premiumEase);
  const hlPanel = prog(f, 12, 31, premiumEase);
  const streakW = ease(f, 24, 42, 0, 96, premiumEase);
  const redirectP = prog(f, 27, 47, premiumEase);
  const explP = prog(f, 40, 74, premiumEase);
  const resultP = prog(f, 90, 116, premiumEase);
  const brandP = prog(f, 90, 112);
  const takeP = prog(f, 95, 119, premiumEase);

  const cardP = (s: number) => prog(f, s, s + 18, premiumEase);
  const routeProg = ease(f, 46, 104, 0, 1, premiumEase);
  const routePulse = ((f - 46) / 34) % 1;
  const crownP = ease(f, 80, 110, 0.55, 0.86, premiumEase);
  const pinRipple = (s: number) => prog(f, s, s + 12);

  const cards = [
    { name: "Pro Tools", meta: "1.6 mi · ★ 4.8", adv: "Correct category", s: 42, hi: true },
    { name: "BuildWell", meta: "0.8 mi · ★ 4.5", adv: "Complete business profile", s: 50, hi: false },
    { name: "HomeMart", meta: "1.3 mi · ★ 4.3", adv: "Location pages connected", s: 58, hi: false },
    { name: "Fixit Supply", meta: "1.1 mi · ★ 4.1", adv: "Services clearly explained", s: 66, hi: false },
  ];

  return (
    <AbsoluteFill style={{ opacity: exit > 0 ? 1 - exit * 0.15 : 1 }}>
      {/* ---------- LEFT COLUMN ---------- */}
      <PremiumPanel x={34} y={150} width={408} height={290} border="dark" opacity={hlPanel} padding={34} drawProgress={hlPanel}>
        <MaskedHeadline
          lines={[
            { text: "Blocked traffic", start: 14, end: 30 },
            { text: "does not disappear.", start: 19, end: 35 },
          ]}
          size={52}
          weight={800}
          lineHeight={1.08}
          scaleX={0.64}
          slide={14}
        />
        <div style={{ width: streakW, height: 3, marginTop: 24, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))` }} />
      </PremiumPanel>

      <PremiumPanel x={34} y={456} width={408} height={190} border="dark" opacity={redirectP} padding={30} drawProgress={redirectP}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", border: `1.5px solid ${COLORS.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RerouteIcon size={34} color={COLORS.gold} progress={prog(f, 30, 50)} />
          </div>
          <AnimatedCopy
            start={34}
            phrases={[{ content: "It gets redirected to" }, { content: "a clearer option." }]}
            style={{ fontFamily: FONTS.body, fontSize: 33, color: COLORS.bodyGray, lineHeight: 1.3 }}
          />
        </div>
      </PremiumPanel>

      <PremiumPanel x={34} y={666} width={408} height={456} border="dark" opacity={explP} padding={34} drawProgress={explP}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", border: `1.5px solid ${COLORS.cyanActiveBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
          <InfoIcon size={34} color={COLORS.cyan} progress={prog(f, 42, 64)} />
        </div>
        <AnimatedCopy
          start={46}
          stagger={4}
          phrases={[
            { content: "A competitor may not" },
            { content: "have the better service." },
            { content: "Their website may simply" },
            { content: "give Google stronger" },
            { content: "information and give" },
            { content: "customers an easier" },
            { content: "path to follow." },
          ]}
          style={{ fontFamily: FONTS.body, fontSize: 30, color: COLORS.bodyGray, lineHeight: 1.42 }}
        />
      </PremiumPanel>

      <PremiumPanel x={34} y={1142} width={408} height={222} border="dark" opacity={resultP} padding={30} drawProgress={resultP}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: `1.5px solid ${COLORS.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WarningIcon size={32} color={COLORS.amber} progress={prog(f, 92, 112)} />
          </div>
          <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 34, color: COLORS.gold }}>Result:</div>
        </div>
        <AnimatedCopy
          start={98}
          phrases={[{ content: "They receive the click," }, { content: "call or direction request." }]}
          style={{ fontFamily: FONTS.body, fontSize: 28, color: COLORS.bodyGray, lineHeight: 1.32 }}
        />
      </PremiumPanel>

      <div style={{ opacity: brandP }}>
        <OmniFlowBrandLockup x={42} y={1385} width={250} height={82} />
      </div>

      {/* ---------- RIGHT VIEWPORT ---------- */}
      <div style={{ position: "absolute", left: VP.x, top: VP.y, width: VP.w, height: VP.h, opacity: vpP, borderRadius: VP.r, overflow: "hidden", border: `2px solid rgba(190,200,210,0.18)`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <MasterMapWorld width={VP.w} height={VP.h} labels={[{ text: "PINE HILL", x: 24, y: 12 }, { text: "RIVER OAKS", x: 26, y: 60 }]}>
          <div style={{ position: "absolute", top: 28, right: 30, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 34, color: COLORS.headline }}>Competitor visibility</div>

          {/* route through pins */}
          <SearchPulseRoute
            d="M110 205 L96 300 L96 405 L130 500 L140 605 L112 700 L112 805 L150 900 L150 1000"
            width={VP.w}
            height={VP.h}
            progress={routeProg}
            pulsePos={0.1 + 0.8 * routePulse}
            showPulse={f > 46 && f < 150}
            intensity={0.95}
            core={5}
            glow={16}
          />
          <RoutePin x={110} y={210} ripple={pinRipple(60)} />
          <RoutePin x={96} y={410} ripple={pinRipple(70)} />
          <RoutePin x={140} y={610} ripple={pinRipple(80)} />
          <RoutePin x={112} y={810} ripple={pinRipple(90)} />
          <RoutePin x={150} y={1010} active={false} />

          {/* competitor cards */}
          {cards.map((c, i) => (
            <CompetitorCard
              key={i}
              x={180}
              y={120 + i * 200}
              width={374}
              height={168}
              variant="thumb"
              name={c.name}
              meta={c.meta}
              advantage={c.adv}
              active={c.hi}
              opacity={cardP(c.s)}
            />
          ))}

          {/* Crown card (dim) */}
          <CrownHardwareCard x={180} y={920} width={374} height={166} variant="compact" state="dim" tagline="Weaker visibility" opacity={crownP} />
        </MasterMapWorld>
      </div>

      {/* ---------- BOTTOM TAKEAWAY ---------- */}
      <PremiumPanel x={34} y={1490} width={1014} height={350} border="dark" opacity={takeP} padding={44} drawProgress={takeP}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <div style={{ flex: 1 }}>
            <MaskedHeadline
              lines={[{ text: "Clearer signals", start: 95, end: 111 }]}
              size={72}
              weight={800}
              scaleX={0.8}
              lineHeight={1.04}
              slide={14}
              color={COLORS.headline}
            />
            <MaskedHeadline
              lines={[
                { text: "create the path", start: 99, end: 115 },
                { text: "customers follow.", start: 103, end: 119 },
              ]}
              size={72}
              weight={800}
              scaleX={0.8}
              lineHeight={1.04}
              slide={14}
              color={COLORS.cyan}
            />
          </div>
          {/* route diagram on right */}
          <svg width={360} height={260} viewBox="0 0 360 260" style={{ flexShrink: 0 }}>
            <path d="M20 200 L90 180 L120 140 L200 150 L250 90 L320 70" stroke={COLORS.cyan} strokeWidth={3} fill="none" opacity={0.5 + 0.5 * takeP} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, 100, 119)} />
            <circle cx="20" cy="200" r="5" fill={COLORS.cyan} opacity={takeP} />
            <circle cx="120" cy="140" r="4" fill={COLORS.cyan} opacity={takeP} />
            <g transform="translate(320,70)" opacity={takeP} style={{ filter: "drop-shadow(0 0 10px rgba(24,216,255,0.7))" }}>
              <path d="M0 -6 c 14 0 22 10 22 22 c 0 16 -22 34 -22 34 c 0 0 -22 -18 -22 -34 c 0 -12 8 -22 22 -22 z" fill={COLORS.cyan} transform="scale(0.9)" />
            </g>
          </svg>
        </div>
      </PremiumPanel>
    </AbsoluteFill>
  );
};
