import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, cyanGlow } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { ease, prog, premiumEase, settleEase, SEARCH_QUERY } from "../styles/geometry";
import { PremiumPanel } from "../components/PremiumPanel";
import { MaskedHeadline } from "../components/MaskedHeadline";
import { OmniFlowBrandLockup } from "../components/OmniFlowBrandLockup";
import { MasterMapWorld } from "../components/MasterMapWorld";
import { CrownHardwareCard } from "../components/CrownHardwareCard";
import { CompetitorCard } from "../components/CompetitorCard";
import { HexObstruction } from "../components/HexObstruction";
import { MiniDiagramCard } from "../components/MiniDiagramCard";
import { SearchPulseRoute } from "../components/SearchPulseRoute";
import { DestinationRipple } from "../components/DestinationRipple";
import {
  SearchIcon,
  CheckCircleIcon,
  WarningIcon,
  MinusCircleIcon,
  DecliningChartIcon,
  CustomerIcon,
} from "../components/Icons";

const MP = { x: 30, y: 525, w: 688, h: 825 }; // main panel

// 12 fixed amber impact particles (deterministic offsets)
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12 + 0.3;
  const r = 12 + (i % 4) * 5;
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r };
});

const StatusRow: React.FC<{ label: string; value?: string; icon: React.ReactNode; progress: number; valueColor?: string }> = ({ label, value, icon, progress, valueColor }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, height: 46, opacity: progress, transform: `translateY(${(1 - progress) * 8}px)` }}>
    <div style={{ flexShrink: 0 }}>{icon}</div>
    <span style={{ fontFamily: FONTS.body, fontSize: 27, color: COLORS.bodyGray }}>{label}</span>
    {value && <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: valueColor }}>{value}</span>}
  </div>
);

export const Scene03BlockedTraffic: React.FC = () => {
  const f = useCurrentFrame();
  const exit = prog(f, 150, 179, settleEase);

  const hlPanel = prog(f, 12, 31, premiumEase);
  const brandP = prog(f, 12, 31);
  const explP = prog(f, 28, 44, premiumEase);
  const explScaleX = ease(f, 28, 44, 0.82, 1, premiumEase);

  const mainP = prog(f, 30, 55, premiumEase);
  const heading = prog(f, 34, 50);
  const searchP = prog(f, 40, 60);
  const statusRow = (i: number) => prog(f, 44 + i * 6, 56 + i * 6, premiumEase);

  const crownP = prog(f, 50, 82, premiumEase);
  const customerP = prog(f, 50, 74, premiumEase);
  const ripple = prog(f, 58, 82);

  const routeProg = ease(f, 62, 98, 0, 1, premiumEase);
  const routePulse = ((f - 62) / 30) % 1;

  // impact 88..103
  const impact = interpolate(f, [88, 96, 103], [0, 1, 0.84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = f >= 88 && f <= 92 ? Math.sin(f * 8) * 2 : 0;
  const particleP = prog(f, 88, 103);
  const barrierOp = ease(f, 0, 13, 0.2, 0.72, premiumEase);

  const compCard = (s: number) => prog(f, s, s + 14, premiumEase);
  const rightP = prog(f, 78, 100, premiumEase);
  const rightX = ease(f, 78, 100, 770, 738, premiumEase);
  const rightText = (i: number) => prog(f, 84 + i * 4, 96 + i * 4);
  const miniP = (i: number) => prog(f, 98 + i * 4, 114 + i * 4, premiumEase);
  const takeP = prog(f, 110, 119, premiumEase);

  const rightLines = ["Weak rankings,", "unclear page", "information and", "disconnected", "local signals", "create friction", "between the", "customer’s", "search and", "your website."];

  return (
    <AbsoluteFill style={{ opacity: exit > 0 ? 1 - exit * 0.15 : 1 }}>
      {/* headline panel */}
      <PremiumPanel x={30} y={104} width={1020} height={280} border="dark" opacity={hlPanel} padding={40} drawProgress={hlPanel}>
        <MaskedHeadline
          lines={[
            { text: "Your customers", start: 14, end: 30 },
            { text: "are still searching.", start: 19, end: 35 },
          ]}
          size={78}
          weight={800}
          lineHeight={1.02}
          scaleX={0.82}
          slide={16}
        />
      </PremiumPanel>
      <div style={{ opacity: brandP }}>
        <OmniFlowBrandLockup x={760} y={140} width={238} height={72} />
      </div>

      {/* short explanation */}
      <PremiumPanel x={30} y={405} width={1020} height={98} border="dark" opacity={explP} drawProgress={explP}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", transform: `scaleX(${explScaleX})` }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 34, color: COLORS.bodyGray }}>The traffic is being blocked before it reaches you.</span>
        </div>
      </PremiumPanel>

      {/* main left diagnostic/map panel */}
      <PremiumPanel x={MP.x} y={MP.y} width={MP.w} height={MP.h} border="dark" opacity={mainP} padding={0} drawProgress={mainP}>
        <MasterMapWorld width={MP.w} height={MP.h} glowSpot={{ x: 68, y: 52 }} labels={[{ text: "RIVER OAKS", x: 30, y: 74 }]}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
            {/* heading */}
            <div style={{ position: "absolute", left: 28, top: 24, display: "flex", alignItems: "center", gap: 14, opacity: heading }}>
              <SearchIcon size={40} color={COLORS.cyan} progress={heading} />
              <span style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 40, color: COLORS.headline }}>Customer search</span>
            </div>
            {/* search bar */}
            <div style={{ position: "absolute", left: 28, top: 88, width: 400, height: 60, borderRadius: 30, background: COLORS.panelActive, border: `1px solid ${COLORS.darkBorder}`, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", opacity: searchP }}>
              <SearchIcon size={22} color={COLORS.bodyGray} />
              <span style={{ fontFamily: FONTS.body, fontSize: 24, color: COLORS.headline, clipPath: `inset(0 ${(1 - searchP) * 100}% 0 0)` }}>{SEARCH_QUERY}</span>
            </div>
            {/* status rows */}
            <div style={{ position: "absolute", left: 28, top: 172, width: 420 }}>
              <StatusRow icon={<CheckCircleIcon size={30} color={COLORS.cyan} />} label="Relevant service:" value="Yes" valueColor={COLORS.cyan} progress={statusRow(0)} />
              <StatusRow icon={<CheckCircleIcon size={30} color={COLORS.cyan} />} label="Nearby location:" value="Yes" valueColor={COLORS.cyan} progress={statusRow(1)} />
              <StatusRow icon={<WarningIcon size={30} color={COLORS.amber} />} label="Clear search signals:" value="No" valueColor={COLORS.amber} progress={statusRow(2)} />
              <StatusRow icon={<MinusCircleIcon size={30} color={COLORS.amber} />} label="Ranking position:" progress={statusRow(3)} />
              <div style={{ paddingLeft: 44, opacity: statusRow(3), fontFamily: FONTS.body, fontWeight: 600, fontSize: 27, color: COLORS.amber }}>Below competitors</div>
            </div>

            {/* barrier */}
            <div style={{ opacity: prog(f, 0, 30) }}>
              <HexObstruction x={440} y={150} width={64} height={540} rows={11} cols={2} opacity={barrierOp} impact={Math.max(impact, routeProg >= 1 ? 0.5 : 0)} impactY={0.46} />
            </div>
            {/* persistent impact glow once route arrives */}
            <div style={{ position: "absolute", left: 472, top: 400, width: 90, height: 90, marginLeft: -45, marginTop: -45, borderRadius: "50%", background: "radial-gradient(circle, rgba(234,251,255,0.85), rgba(242,163,61,0.35) 45%, transparent 70%)", opacity: prog(f, 90, 100) * (0.7 + 0.3 * impact), pointerEvents: "none" }} />

            {/* impact particles */}
            {particleP > 0 && PARTICLES.map((p, i) => (
              <div key={i} style={{ position: "absolute", left: 484 + p.dx * particleP, top: 400 + p.dy * particleP, width: 5, height: 5, borderRadius: "50%", background: COLORS.amber, opacity: (1 - particleP) * 0.6 + 0.15 }} />
            ))}

            {/* customer icon + ripple */}
            <div style={{ position: "absolute", left: 40, top: 430, opacity: customerP }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${COLORS.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: cyanGlow(0.4, 18) }}>
                <CustomerIcon size={34} color={COLORS.cyan} />
              </div>
            </div>
            <DestinationRipple x={72} y={462} progress={ripple} color={COLORS.cyan} maxR={44} />

            {/* route */}
            <SearchPulseRoute
              d="M95 462 L150 462 L150 430 L235 430 L235 452 L330 452 L330 420 L420 420 L484 400"
              width={MP.w}
              height={MP.h}
              progress={routeProg}
              pulsePos={routePulse}
              showPulse={f > 62 && f < 108}
              intensity={0.9}
              core={5}
              glow={16}
            />

            {/* Crown card lower-left */}
            <CrownHardwareCard x={28} y={560} width={404} height={184} variant="full" state="active" cyanIntensity={crownP} opacity={crownP} />

            {/* competitor cards beyond barrier */}
            <CompetitorCard x={512} y={150} width={168} height={150} variant="compact" name="HomeMart" meta="1.3 mi · ★ 4.3" advantage="In-store shopping" active={false} opacity={compCard(94)} />
            <CompetitorCard x={512} y={318} width={168} height={150} variant="compact" name="BuildWell" meta="0.8 mi · ★ 4.5" advantage="Open · Closes 8PM" active={false} opacity={compCard(100)} />
            <CompetitorCard x={512} y={486} width={168} height={150} variant="compact" name="Pro Tools" meta="1.6 mi · ★ 4.2" advantage="In-store shopping" active={false} opacity={compCard(106)} />

            {/* amber dotted fragments toward cards */}
            <svg width={MP.w} height={MP.h} style={{ position: "absolute", inset: 0, opacity: prog(f, 96, 112) }}>
              <path d="M500 400 L495 225" stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="3 6" fill="none" opacity={0.5} />
              <path d="M500 410 L495 393" stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="3 6" fill="none" opacity={0.5} />
              <path d="M500 420 L495 561" stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="3 6" fill="none" opacity={0.5} />
            </svg>
          </div>
        </MasterMapWorld>
      </PremiumPanel>

      {/* right explanation panel */}
      <PremiumPanel x={rightX} y={525} width={312} height={825} border="dark" opacity={rightP} padding={34} drawProgress={rightP}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", border: `1.5px solid ${COLORS.cyanActiveBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <DecliningChartIcon size={38} color={COLORS.cyan} progress={prog(f, 80, 100)} />
        </div>
        <div>
          {rightLines.map((l, i) => (
            <div key={i} style={{ opacity: rightText(i), transform: `translateY(${(1 - rightText(i)) * 6}px)`, fontFamily: FONTS.body, fontSize: 33, color: COLORS.headline, lineHeight: 1.5 }}>{l}</div>
          ))}
        </div>
      </PremiumPanel>

      {/* three mini panels */}
      <MiniDiagramCard x={30} y={1372} width={316} height={272} heading="Customer Start" kind="customer" progress={miniP(0)} />
      <MiniDiagramCard x={364} y={1372} width={316} height={272} heading="Competitor" kind="competitor" progress={miniP(1)} />
      <MiniDiagramCard x={698} y={1372} width={352} height={272} heading="Your Business" kind="business" progress={miniP(2)} />

      {/* bottom takeaway */}
      <PremiumPanel x={30} y={1664} width={1020} height={166} border="dark" opacity={takeP} drawProgress={takeP}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 26, paddingLeft: 10 }}>
          <div style={{ width: 74, height: 74, borderRadius: "50%", border: `1.5px solid ${COLORS.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WarningIcon size={40} color={COLORS.amber} progress={prog(f, 112, 119)} />
          </div>
          <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 35, whiteSpace: "nowrap" }}>
            <span style={{ color: COLORS.headline }}>The business exists. </span>
            <span style={{ color: COLORS.gold }}>The pathway does not work properly.</span>
          </div>
        </div>
      </PremiumPanel>
    </AbsoluteFill>
  );
};
