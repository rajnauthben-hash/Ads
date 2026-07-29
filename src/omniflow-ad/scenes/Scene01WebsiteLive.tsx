import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, cyanGlow } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { ease, prog, premiumEase, settleEase, COMPETITORS } from "../styles/geometry";
import { PremiumPanel } from "../components/PremiumPanel";
import { MaskedHeadline } from "../components/MaskedHeadline";
import { AnimatedCopy } from "../components/AnimatedCopy";
import { OmniFlowBrandLockup } from "../components/OmniFlowBrandLockup";
import { PhoneShell } from "../components/PhoneShell";
import { SearchInterface } from "../components/SearchInterface";
import { MasterMapWorld } from "../components/MasterMapWorld";
import { MapLabel } from "../components/MapLabel";
import { CrownHardwareCard } from "../components/CrownHardwareCard";
import { SearchPulseRoute } from "../components/SearchPulseRoute";
import { DiagnosticMetric } from "../components/ListItems";
import {
  GlobeIcon,
  TargetIcon,
  PulseCircleIcon,
  MonitorIcon,
  SearchIcon,
  RankBarsIcon,
  CustomersIcon,
} from "../components/Icons";

// Phone screen geometry (canvas coords)
const PHONE = { x: 480, y: 112, w: 556, h: 1272, r: 62 };
const SCREEN = { x: PHONE.x + 12, y: PHONE.y + 12, w: PHONE.w - 24, h: PHONE.h - 24 };
const MAP = { x: 20, y: 250, w: SCREEN.w - 40, h: 470 }; // relative to screen

export const Scene01WebsiteLive: React.FC = () => {
  const f = useCurrentFrame();

  // --- transition (exit) helpers, local 150..179 ---
  const exit = prog(f, 150, 179, settleEase);
  const leftExitY = -exit * 40;
  const leftExitOp = 1 - exit;

  // Phone flatten/relocation 150..179
  const phoneScale = ease(f, 150, 179, 1.0, 1.32, settleEase);
  const phoneX = ease(f, 150, 179, PHONE.x, 365, settleEase);
  const phoneY = ease(f, 150, 179, PHONE.y, 470, settleEase);
  const phoneRadius = ease(f, 150, 179, PHONE.r, 22, settleEase);
  const bezelOffset = ease(f, 150, 179, 0, 90, premiumEase);

  // Panel entrances
  const panelA = prog(f, 20, 39, premiumEase);
  const panelAY = ease(f, 20, 39, 175, 145, premiumEase);
  const streakW = ease(f, 34, 50, 0, 96, premiumEase);
  const panelB = prog(f, 58, 88, premiumEase);
  const panelBY = ease(f, 58, 88, 633, 603, premiumEase);
  const globeDraw = prog(f, 58, 82);
  const panelC = prog(f, 78, 106, premiumEase);
  const panelCY = ease(f, 78, 106, 1080, 1050, premiumEase);
  const targetDraw = prog(f, 78, 100);

  // Phone entrance
  const phoneOpacity = prog(f, 8, 29, premiumEase);
  const phoneEntryBlur = ease(f, 8, 29, 12, 0, premiumEase);
  const screenReveal = prog(f, 18, 40);
  const searchBarScaleX = ease(f, 30, 52, 0.7, 1, premiumEase);
  const searchBarOp = prog(f, 30, 52);
  const queryProg = prog(f, 34, 56);
  const tabsProg = prog(f, 36, 60);
  const mapOpacity = prog(f, 45, 70);

  // Crown card entrance 54..80
  const crownP = prog(f, 54, 80, premiumEase);
  const crownScale = ease(f, 54, 80, 0.82, 1, premiumEase);
  const crownCyan = ease(f, 54, 80, 0, 0.65, premiumEase);

  // route 85..113 to 0.78
  const routeProg = ease(f, 85, 113, 0, 0.78, premiumEase);
  const routePulse = ((f - 85) / 40) % 1;

  // diagnostic panel 92..119
  const diagP = prog(f, 92, 119, premiumEase);
  const diagY = ease(f, 92, 119, 1535, 1495, premiumEase);
  const heading = prog(f, 96, 108);
  const heartbeat = prog(f, 104, 119);
  const m1 = prog(f, 100, 110);
  const m2 = prog(f, 104, 114);
  const m3 = prog(f, 108, 117);
  const m4 = prog(f, 111, 119);

  return (
    <AbsoluteFill>
      {/* ================= LEFT COLUMN ================= */}
      <div style={{ opacity: leftExitOp, transform: `translateY(${leftExitY}px)` }}>
        {/* Panel A — headline */}
        <PremiumPanel x={42} y={panelAY} width={420} height={430} border="gold" opacity={panelA} padding={38} drawProgress={panelA}>
          <MaskedHeadline
            lines={[
              { text: "Your", start: 22, end: 36 },
              { text: "website is live.", start: 27, end: 42 },
            ]}
            size={66}
            weight={800}
            lineHeight={1.02}
            letterSpacing="-0.02em"
            scaleX={0.66}
          />
          <div style={{ width: streakW, height: 3, marginTop: 26, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))`, boxShadow: cyanGlow(0, 0) }} />
          <AnimatedCopy
            start={34}
            phrases={[{ content: "But customers still may" }, { content: "not be reaching it." }]}
            wrapperStyle={{ marginTop: 28 }}
            style={{ fontFamily: FONTS.body, fontSize: 31, color: COLORS.mutedGray, lineHeight: 1.32 }}
          />
        </PremiumPanel>

        {/* Panel B — explanation */}
        <PremiumPanel x={42} y={panelBY} width={420} height={420} border="gold" opacity={panelB} padding={38} drawProgress={panelB}>
          <GlobeIcon size={54} color={COLORS.cyan} progress={globeDraw} />
          <AnimatedCopy
            start={66}
            stagger={4}
            phrases={[
              { content: "A polished website can" },
              { content: "exist online while remaining" },
              { content: "disconnected from the" },
              { content: "searches, map results and" },
              { content: "buying decisions happening" },
              { content: "around it." },
            ]}
            wrapperStyle={{ marginTop: 24 }}
            style={{ fontFamily: FONTS.body, fontSize: 27, color: COLORS.bodyGray, lineHeight: 1.42 }}
          />
        </PremiumPanel>

        {/* Panel C — recognition */}
        <PremiumPanel x={42} y={panelCY} width={420} height={304} border="gold" opacity={panelC} padding={38} drawProgress={panelC}>
          <TargetIcon size={54} color={COLORS.gold} progress={targetDraw} />
          <AnimatedCopy
            start={86}
            stagger={4}
            phrases={[
              { content: <>That means a <span style={{ color: COLORS.gold }}>real</span></> },
              { content: <><span style={{ color: COLORS.gold }}>customer</span> can search for</> },
              { content: "what you offer and still" },
              { content: "choose someone else first." },
            ]}
            wrapperStyle={{ marginTop: 22 }}
            style={{ fontFamily: FONTS.body, fontSize: 27, color: COLORS.headline, lineHeight: 1.4 }}
          />
        </PremiumPanel>

        {/* Brand lockup */}
        <div style={{ opacity: prog(f, 60, 80) }}>
          <OmniFlowBrandLockup x={46} y={1384} width={250} height={84} />
        </div>
      </div>

      {/* ================= PHONE ================= */}
      <PhoneShell
        x={phoneX}
        y={phoneY}
        width={PHONE.w}
        height={PHONE.h}
        radius={phoneRadius}
        scale={phoneScale}
        opacity={phoneOpacity}
        blur={phoneEntryBlur}
        bezelOffset={bezelOffset}
      >
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - screenReveal) * 100}% 0)` }}>
          <div style={{ padding: "30px 30px 0" }}>
            <SearchInterface width={SCREEN.w - 60} barScaleX={searchBarScaleX} barOpacity={searchBarOp} queryProgress={queryProg} tabsProgress={tabsProg} />
          </div>

          {/* MAP (relative to screen) */}
          <div style={{ position: "absolute", left: MAP.x, top: MAP.y, width: MAP.w, height: MAP.h, opacity: mapOpacity }}>
            <MasterMapWorld
              width={MAP.w}
              height={MAP.h}
              radius={16}
              glowSpot={{ x: 50, y: 32 }}
              labels={[
                { text: "RIVER OAKS", x: 18, y: 52 },
                { text: "PINE HILL", x: 80, y: 16 },
              ]}
            >
              <MapLabel x={26} y={20} name={COMPETITORS.homeMart.name} meta={COMPETITORS.homeMart.meta} />
              <MapLabel x={MAP.w - 150} y={92} name={COMPETITORS.buildWell.name} meta={COMPETITORS.buildWell.meta} />
              <MapLabel x={16} y={250} name={COMPETITORS.proTools.name} meta={COMPETITORS.proTools.meta} />
              <MapLabel x={16} y={330} name={COMPETITORS.fixitSupply.name} meta={COMPETITORS.fixitSupply.meta} />

              {/* origin dot */}
              <div style={{ position: "absolute", left: 250, top: 150, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: "50%", background: COLORS.cyan, boxShadow: cyanGlow(0.8, 16), opacity: routeProg > 0 ? 1 : 0 }} />

              {/* route */}
              <SearchPulseRoute
                d="M250 150 L250 196 L196 196 L196 250 L300 250 L300 278"
                width={MAP.w}
                height={MAP.h}
                progress={routeProg}
                pulsePos={0.2 + 0.6 * routePulse}
                showPulse={f > 90 && f < 150}
                intensity={0.7}
                core={5}
                glow={15}
              />

              {/* Crown card inside map */}
              <CrownHardwareCard x={142} y={270} width={344} height={188} variant="full" state="active" cyanIntensity={crownCyan / 0.65} scale={crownScale} opacity={crownP} />
            </MasterMapWorld>
          </div>

          {/* People also search for */}
          <div style={{ position: "absolute", left: 30, top: 760, width: SCREEN.w - 60, opacity: prog(f, 72, 101) }}>
            <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 24, color: COLORS.bodyGray, marginBottom: 14 }}>People also search for</div>
            {[
              { c: COMPETITORS.homeMart, s: 72 },
              { c: COMPETITORS.buildWell, s: 80 },
              { c: COMPETITORS.proTools, s: 88 },
            ].map(({ c, s }, i) => {
              const p = prog(f, s, s + 12, premiumEase);
              return (
                <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)`, display: "flex", alignItems: "center", gap: 14, height: 78, marginBottom: 10, padding: 10, borderRadius: 12, background: COLORS.panelInset, border: `1px solid ${COLORS.darkBorder}` }}>
                  <div style={{ width: 58, height: 58, borderRadius: 8, background: "linear-gradient(#241a10,#0d0a07)", flexShrink: 0, boxShadow: "inset 0 0 8px rgba(230,160,70,0.3)" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 25, color: COLORS.headline }}>{c.name}</div>
                    <div style={{ fontFamily: FONTS.ui, fontSize: 20, color: COLORS.bodyGray }}>{c.meta}</div>
                  </div>
                  <div style={{ fontFamily: FONTS.ui, fontWeight: 600, fontSize: 18, color: COLORS.cyan, border: `1px solid ${COLORS.cyanActiveBorder}`, borderRadius: 8, padding: "6px 12px", letterSpacing: "0.06em" }}>TOP RESULT</div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "absolute", left: 30, bottom: 22, fontFamily: FONTS.ui, fontSize: 20, color: COLORS.mutedGray, opacity: prog(f, 100, 116) }}>
            Some results may have limited visibility
          </div>
        </div>
      </PhoneShell>

      {/* ================= DIAGNOSTIC PANEL ================= */}
      <div style={{ opacity: exit > 0 ? 1 - exit : 1, transform: `translateY(${-exit * 300}px)` }}>
        <PremiumPanel x={42} y={diagY} width={996} height={340} border="gold" opacity={diagP} padding={34} drawProgress={diagP}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: heading }}>
            <PulseCircleIcon size={44} color={COLORS.cyan} progress={heading} />
            <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 40, color: COLORS.headline }}>Diagnostic indicators</div>
            <svg width={360} height={44} style={{ marginLeft: "auto" }} viewBox="0 0 360 44" fill="none">
              <path d="M0 22 H120 l14 -16 12 32 14 -22 10 12 H360" stroke={COLORS.cyan} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - heartbeat} opacity={0.85} />
            </svg>
          </div>
          <div style={{ display: "flex", marginTop: 34, gap: 8 }}>
            <DiagnosticMetric icon={<MonitorIcon size={52} color={COLORS.cyan} progress={m1} />} label="Website:" value="Online" progress={m1} />
            <DiagnosticMetric icon={<SearchIcon size={52} color={COLORS.gold} progress={m2} />} label="Search visibility:" value="Weak" progress={m2} />
            <DiagnosticMetric icon={<RankBarsIcon size={52} color={COLORS.cyan} progress={m3} />} label="Local rankings:" value="Low" progress={m3} />
            <DiagnosticMetric icon={<CustomersIcon size={52} color={COLORS.gold} progress={m4} />} label="Customer traffic:" value="Limited" progress={m4} />
          </div>
        </PremiumPanel>
      </div>
    </AbsoluteFill>
  );
};
