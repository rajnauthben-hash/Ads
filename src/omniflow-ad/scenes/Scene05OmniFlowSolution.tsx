import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, cyanGlow } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { ease, prog, premiumEase } from "../styles/geometry";
import { PremiumPanel } from "../components/PremiumPanel";
import { MaskedHeadline } from "../components/MaskedHeadline";
import { OmniFlowRing } from "../components/OmniFlowBrandLockup";
import { MasterMapWorld } from "../components/MasterMapWorld";
import { MapLabel } from "../components/MapLabel";
import { CrownHardwareCard } from "../components/CrownHardwareCard";
import { SearchPulseRoute } from "../components/SearchPulseRoute";
import { StepCard } from "../components/ListItems";
import {
  SitemapIcon,
  PinIcon,
  SearchIcon,
  InfoIcon,
  RisingChartIcon,
  GlobeIcon,
  ShieldIcon,
} from "../components/Icons";

const OM = { x: 382, y: 634, w: 664, h: 770 }; // outcome map panel

export const Scene05OmniFlowSolution: React.FC = () => {
  const f = useCurrentFrame();

  const mapP = prog(f, 0, 20, premiumEase);
  const hlPanel = prog(f, 12, 32, premiumEase);
  const streakW = ease(f, 28, 46, 0, 120, premiumEase);
  const support = prog(f, 30, 48);
  const introP = prog(f, 36, 61, premiumEase);
  const introScaleX = ease(f, 36, 61, 0.88, 1, premiumEase);

  const stepSettle = [58, 70, 82, 94];
  const stepP = (i: number) => prog(f, stepSettle[i] - 16, stepSettle[i], premiumEase);

  // corrected route reaches crown at local 106
  const routeProg = ease(f, 56, 106, 0, 1, premiumEase);
  const routePulse = ((f - 56) / 42) % 1;
  const crownBorder = ease(f, 76, 106, 0.45, 1.0, premiumEase);
  const destRing = prog(f, 106, 122);
  // final-hold pulse every 42 frames toward crown
  const holdPulse = f >= 120 ? ((f - 120) / 42) % 1 : routePulse;
  const glowBreath = 1 + Math.sin(f / 20) * 0.02;

  const outLine1 = prog(f, 90, 105);
  const outLine2 = prog(f, 95, 110);
  const payoffP = prog(f, 100, 116, premiumEase);
  const payoffY = ease(f, 100, 116, 18, 0, premiumEase);
  const brandPanelP = prog(f, 103, 119, premiumEase);
  const promiseP = (i: number) => prog(f, 103 + i * 4, 115 + i * 4);

  const steps = [
    { label: "STEP 1", copy: "Clear service\nstructure", icon: <SitemapIcon size={34} color={COLORS.gold} progress={prog(f, 46, 60)} /> },
    { label: "STEP 2", copy: "Correct local\ntargeting", icon: <PinIcon size={34} color={COLORS.gold} progress={prog(f, 58, 72)} /> },
    { label: "STEP 3", copy: "Stronger search\nrelevance", icon: <SearchIcon size={34} color={COLORS.gold} progress={prog(f, 70, 84)} /> },
    { label: "STEP 4", copy: "Connected business\ninformation", icon: <InfoIcon size={34} color={COLORS.gold} progress={prog(f, 82, 96)} /> },
  ];

  const cardH = (886 - 3 * 14) / 4;

  return (
    <AbsoluteFill>
      {/* headline panel */}
      <PremiumPanel x={34} y={100} width={1012} height={334} border="dark" opacity={hlPanel} padding={44} drawProgress={hlPanel}>
        <MaskedHeadline
          lines={[
            { text: "You are not", start: 14, end: 30 },
            { text: "completely invisible.", start: 19, end: 35 },
          ]}
          size={84}
          weight={800}
          lineHeight={1.0}
          scaleX={0.82}
          slide={16}
        />
        <div style={{ width: streakW, height: 3, marginTop: 22, marginBottom: 18, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))` }} />
        <div style={{ opacity: support, transform: `translateY(${(1 - support) * 10}px)`, fontFamily: FONTS.body, fontSize: 36, color: COLORS.mutedGray }}>
          Your digital pathway is obstructed.
        </div>
      </PremiumPanel>

      {/* intro explanation panel */}
      <PremiumPanel x={34} y={458} width={1012} height={150} border="cyan" borderWidth={1.25} opacity={introP} padding={0} drawProgress={introP} glow={cyanGlow(0.1, 22)}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 40px", gap: 30, transform: `scaleX(${introScaleX})`, transformOrigin: "left center" }}>
          <div style={{ flexShrink: 0 }}>
            <OmniFlowRing size={72} glow />
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.headline, lineHeight: 1.32 }}>
            <div><span style={{ color: COLORS.cyan, fontWeight: 600 }}>OmniFlow Digital</span> strengthens the signals</div>
            <div>connecting your business to active customer searches.</div>
          </div>
        </div>
      </PremiumPanel>

      {/* left process column */}
      {steps.map((s, i) => (
        <StepCard
          key={i}
          x={34}
          y={634 + i * (cardH + 14)}
          width={326}
          height={cardH}
          label={s.label}
          copy={s.copy}
          icon={s.icon}
          progress={stepP(i)}
        />
      ))}

      {/* right outcome map panel */}
      <PremiumPanel x={OM.x} y={OM.y} width={OM.w} height={OM.h} border="dark" opacity={mapP} padding={0} drawProgress={mapP}>
        <MasterMapWorld width={OM.w} height={OM.h} glowSpot={{ x: 20, y: 18 }} labels={[{ text: "PINE HILL", x: 80, y: 9 }, { text: "RIVER OAKS", x: 26, y: 60 }]}>
          {/* faint competitor labels */}
          <MapLabel x={64} y={44} name="HomeMart" meta="1.3 mi · ★ 4.3" opacity={0.5} size={18} />
          <MapLabel x={456} y={150} name="BuildWell" meta="0.8 mi · ★ 4.5" opacity={0.5} size={18} />
          <MapLabel x={64} y={330} name="Pro Tools" meta="1.6 mi · ★ 4.2" opacity={0.5} size={18} />
          <MapLabel x={64} y={452} name="Fixit Supply" meta="1.1 mi · ★ 4.1" opacity={0.5} size={18} />

          {/* corrected route to crown */}
          <SearchPulseRoute
            d="M120 130 L120 210 L215 210 L215 300 L300 300 L300 360"
            width={OM.w}
            height={OM.h}
            progress={routeProg}
            pulsePos={0.1 + 0.85 * holdPulse}
            showPulse
            intensity={1}
            core={5.5}
            glow={18}
            destination={routeProg >= 1 ? { x: 300, y: 362, ring: destRing < 1 ? destRing : 0 } : null}
          />
          {/* active search origin */}
          <div style={{ position: "absolute", left: 120, top: 130, width: 20, height: 20, marginLeft: -10, marginTop: -10, borderRadius: "50%", background: COLORS.cyan, boxShadow: cyanGlow(0.9, 18) }} />

          {/* Crown card prominent lower-right */}
          <div style={{ transform: `scale(${glowBreath})`, transformOrigin: "center" }}>
            <CrownHardwareCard x={218} y={366} width={370} height={196} variant="full" state="active" cyanIntensity={Math.min(crownBorder, 1)} />
          </div>

          {/* supporting outcome lines */}
          <div style={{ position: "absolute", left: 30, bottom: 60, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: outLine1, transform: `translateY(${(1 - outLine1) * 8}px)` }}>
              <PinIcon size={34} color={COLORS.cyan} />
              <span style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.headline }}>Improved Google Maps visibility</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: outLine2, transform: `translateY(${(1 - outLine2) * 8}px)` }}>
              <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 18 Q12 18 14 10" /><path d="M11 10h4v4" /></svg>
              <span style={{ fontFamily: FONTS.body, fontSize: 32, color: COLORS.headline }}>A direct <span style={{ textDecoration: "underline" }}>route</span> customers can follow</span>
            </div>
          </div>
        </MasterMapWorld>
      </PremiumPanel>

      {/* payoff panel */}
      <PremiumPanel x={382} y={1428} width={664} height={174} border="dark" opacity={payoffP} padding={30} drawProgress={payoffP} style={{ transform: `translateY(${payoffY}px)` }}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 26 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", border: `1.5px solid ${COLORS.cyanActiveBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: cyanGlow(0.15, 18) }}>
            <RisingChartIcon size={46} color={COLORS.cyan} progress={prog(f, 102, 118)} />
          </div>
          <div>
            <div style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 44, color: COLORS.headline, lineHeight: 1.05 }}>Now the search</div>
            <div style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 44, color: COLORS.headline, lineHeight: 1.05 }}>reaches your business.</div>
            <div style={{ width: 70, height: 3, marginTop: 8, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))` }} />
          </div>
        </div>
      </PremiumPanel>

      {/* bottom brand panel */}
      <PremiumPanel x={34} y={1626} width={1012} height={214} border="dark" opacity={brandPanelP} padding={0} drawProgress={brandPanelP}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 40px", gap: 30 }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 16 }}>
            <OmniFlowRing size={58} glow />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 38, color: COLORS.headline, lineHeight: 1 }}>OmniFlow</div>
              <div style={{ fontFamily: FONTS.ui, fontWeight: 500, fontSize: 15, color: COLORS.cyan, letterSpacing: "0.42em", marginTop: 5 }}>DIGITAL</div>
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
            {[
              { icon: <GlobeIcon size={40} color={COLORS.cyan} />, a: "Get ", b: "Found." },
              { icon: <ShieldIcon size={40} color={COLORS.cyan} />, a: "Look ", b: "Professional." },
              { icon: <RisingChartIcon size={40} color={COLORS.cyan} />, a: "Grow ", b: "Online." },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: promiseP(i), transform: `translateY(${(1 - promiseP(i)) * 8}px)`, borderLeft: i > 0 ? `1px solid ${COLORS.darkBorder}` : "none", paddingLeft: i > 0 ? 40 : 0, flex: 1 }}>
                {p.icon}
                <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 32 }}>
                  <span style={{ color: COLORS.headline }}>{p.a}</span>
                  <span style={{ color: COLORS.gold }}>{p.b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PremiumPanel>
    </AbsoluteFill>
  );
};
