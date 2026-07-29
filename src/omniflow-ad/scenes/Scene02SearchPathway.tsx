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
import { PathwayNode } from "../components/PathwayNode";
import { RequirementRow } from "../components/ListItems";
import { SearchPulseRoute } from "../components/SearchPulseRoute";
import {
  GlobeIcon,
  TargetIcon,
  DocumentIcon,
  StorefrontIcon,
  PinIcon,
  PhoneIcon,
  ProfileStorefrontIcon,
  SearchIcon,
  CodeIcon,
} from "../components/Icons";

const RP = { x: 438, y: 664, w: 602, h: 884 }; // right pathway panel

const CircledIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 60, height: 60, borderRadius: "50%", border: `1.4px solid ${COLORS.darkBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </div>
);

export const Scene02SearchPathway: React.FC = () => {
  const f = useCurrentFrame();

  const exit = prog(f, 150, 179, settleEase);

  // headline
  const hlPanel = prog(f, 12, 31, premiumEase);
  const support = prog(f, 28, 45);
  const streakW = ease(f, 28, 45, 0, 104, premiumEase);
  const brandP = prog(f, 12, 31, premiumEase);

  // explanation
  const explP = prog(f, 32, 60, premiumEase);
  const explScaleX = ease(f, 32, 60, 0.88, 1, premiumEase);
  const globeDraw = prog(f, 34, 58);

  // requirements rows settle
  const rowSettle = (i: number) => {
    const settleFrames = [54, 62, 70, 78, 82, 90];
    const s = settleFrames[i];
    return prog(f, s - 14, s, premiumEase);
  };
  const sep = (i: number) => prog(f, 44 + i * 6, 52 + i * 6);

  // network
  const crownSettle = prog(f, 46, 70, premiumEase);
  const spine = ease(f, 60, 100, 0, 1, premiumEase);
  const nodeP = (s: number) => prog(f, s, s + 16, premiumEase);
  const warnActive = (s: number) => prog(f, s, s + 10);
  const netPulse = ((f - 82) / 40) % 1;

  // takeaway
  const takeP = prog(f, 92, 119, premiumEase);
  const takeY = ease(f, 92, 119, 1612, 1572, premiumEase);
  const line1 = prog(f, 96, 108);
  const line2 = prog(f, 101, 113);
  const heartbeat = prog(f, 100, 119);

  const reqs = [
    { icon: <DocumentIcon size={30} color={COLORS.cyan} />, label: "Clear service pages" },
    { icon: <StorefrontIcon size={30} color={COLORS.cyan} />, label: "Correct business information" },
    { icon: <PinIcon size={30} color={COLORS.cyan} />, label: "Strong location relevance" },
    { icon: <PhoneIcon size={30} color={COLORS.cyan} />, label: "Mobile-friendly performance" },
    { icon: <ProfileStorefrontIcon size={30} color={COLORS.cyan} />, label: "Connected Google Business Profile" },
    { icon: <SearchIcon size={30} color={COLORS.cyan} />, label: "Consistent categories and keywords" },
  ];

  return (
    <AbsoluteFill style={{ opacity: exit > 0 ? 1 - exit * 0.15 : 1 }}>
      {/* brand upper-right */}
      <div style={{ opacity: brandP }}>
        <OmniFlowBrandLockup x={792} y={38} width={238} height={76} />
      </div>

      {/* headline panel */}
      <PremiumPanel x={40} y={110} width={1000} height={330} border="gold" opacity={hlPanel} padding={44} drawProgress={hlPanel}>
        <MaskedHeadline
          lines={[
            { text: "A website needs", start: 14, end: 30 },
            { text: "more than a URL.", start: 19, end: 35 },
          ]}
          size={80}
          weight={800}
          lineHeight={1.0}
          scaleX={0.86}
          slide={16}
        />
        <div style={{ width: streakW, height: 3, marginTop: 20, marginBottom: 18, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))` }} />
        <div style={{ opacity: support, transform: `translateY(${(1 - support) * 10}px)`, fontFamily: FONTS.body, fontSize: 36, color: COLORS.mutedGray }}>
          It needs clear routes into search.
        </div>
      </PremiumPanel>

      {/* explanation panel */}
      <PremiumPanel x={40} y={466} width={1000} height={180} border="dark" opacity={explP} padding={0} drawProgress={explP}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 40px", gap: 28, transform: `scaleX(${explScaleX})`, transformOrigin: "left center" }}>
          <div style={{ flexShrink: 0 }}>
            <GlobeIcon size={72} color={COLORS.cyan} progress={globeDraw} />
          </div>
          <AnimatedCopy
            start={36}
            stagger={4}
            phrases={[
              { content: "Google uses your service information, location signals, page" },
              { content: "structure and business details to decide where your website" },
              { content: <>belongs&mdash;and when it should appear.</> },
            ]}
            style={{ fontFamily: FONTS.body, fontSize: 30, color: COLORS.bodyGray, lineHeight: 1.34 }}
          />
        </div>
      </PremiumPanel>

      {/* left requirements panel */}
      <PremiumPanel x={40} y={664} width={380} height={884} border="dark" opacity={prog(f, 40, 60)} padding={34} drawProgress={prog(f, 40, 60)}>
        <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 30, color: COLORS.headline }}>Search pathway requirements</div>
        <div style={{ width: 90, height: 3, marginTop: 14, background: `linear-gradient(90deg, ${COLORS.gold}, rgba(229,164,71,0))` }} />
        <div style={{ position: "relative", marginTop: 20, height: 700 }}>
          {reqs.map((r, i) => (
            <RequirementRow
              key={i}
              y={i * 116}
              height={116}
              width={312}
              icon={<CircledIcon>{r.icon}</CircledIcon>}
              label={r.label}
              sep={sep(i)}
              labelProgress={rowSettle(i)}
            />
          ))}
        </div>
      </PremiumPanel>

      {/* right pathway network panel */}
      <PremiumPanel x={RP.x} y={RP.y} width={RP.w} height={RP.h} border="dark" opacity={prog(f, 40, 60)} padding={0} drawProgress={prog(f, 40, 60)}>
        <MasterMapWorld
          width={RP.w}
          height={RP.h}
          labels={[
            { text: "RIVER OAKS", x: 22, y: 46 },
            { text: "PINE HILL", x: 82, y: 12 },
          ]}
        >
          {/* connectors */}
          <svg width={RP.w} height={RP.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d="M301 200 V640" stroke={COLORS.cyanDeep} strokeWidth={2} opacity={0.25} fill="none" />
            <path d="M301 300 H150 M301 300 H452" stroke={COLORS.cyan} strokeWidth={2.5} opacity={0.6 * spine} fill="none" />
            <path d="M301 470 H150 M301 470 H452" stroke={COLORS.cyan} strokeWidth={2.5} opacity={0.6 * spine} fill="none" />
            <path d="M301 610 H150 M301 610 H452" stroke={COLORS.mutedGray} strokeWidth={2} strokeDasharray="4 6" opacity={0.5} fill="none" />
          </svg>

          {/* central pulse route */}
          <SearchPulseRoute
            d="M301 200 V300 V470 V610"
            width={RP.w}
            height={RP.h}
            progress={spine}
            pulsePos={0.15 + 0.7 * netPulse}
            showPulse={f > 82 && f < 150}
            intensity={0.75}
            core={4.5}
            glow={13}
          />

          {/* Crown card upper-centre */}
          <CrownHardwareCard x={107} y={22} width={330} height={176} variant="full" state="active" cyanIntensity={crownSettle} opacity={crownSettle} />

          {/* nodes */}
          <PathwayNode x={20} y={250} width={200} height={110} progress={nodeP(46)} icon={<DocumentIcon size={22} color={COLORS.cyan} />} title="Service pages" lines={["/services/keys", "/services/locks", "+ more"]} />
          <PathwayNode x={382} y={250} width={200} height={110} progress={nodeP(52)} icon={<PinIcon size={22} color={COLORS.cyan} />} title="Location signals" lines={["Pine Hill", "0.9 mi"]} />
          <PathwayNode x={20} y={420} width={200} height={100} progress={nodeP(60)} icon={<ProfileStorefrontIcon size={22} color={COLORS.cyan} />} title="Google Business Profile" status="check" />
          <PathwayNode x={382} y={420} width={200} height={100} progress={nodeP(66)} icon={<PhoneIcon size={22} color={COLORS.cyan} />} title="Mobile performance" status="check" />
          <PathwayNode x={20} y={560} width={200} height={100} progress={nodeP(74)} icon={<CodeIcon size={22} color={COLORS.amber} />} title="Structured information" status="warn" warnActive={warnActive(82)} />
          <PathwayNode x={382} y={560} width={200} height={100} progress={nodeP(80)} icon={<SearchIcon size={22} color={COLORS.amber} />} title="Categories & keywords" status="warn" warnActive={warnActive(88)} />
        </MasterMapWorld>
      </PremiumPanel>

      {/* bottom takeaway panel */}
      <PremiumPanel x={40} y={takeY} width={1000} height={200} border="dark" opacity={takeP} padding={0} drawProgress={takeP}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 44px", gap: 30 }}>
          <div style={{ flexShrink: 0 }}>
            <TargetIcon size={70} color={COLORS.gold} progress={prog(f, 94, 116)} />
          </div>
          <div style={{ flex: 1, whiteSpace: "nowrap" }}>
            <div style={{ opacity: line1, transform: `translateY(${(1 - line1) * 8}px)`, fontFamily: FONTS.body, fontSize: 33, color: COLORS.mutedGray }}>When these signals are weak,</div>
            <div style={{ opacity: line2, transform: `translateY(${(1 - line2) * 8}px)`, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 34, color: COLORS.headline, marginTop: 6 }}>the route becomes difficult to follow.</div>
          </div>
          <svg width={170} height={60} viewBox="0 0 170 60" fill="none" style={{ flexShrink: 0 }}>
            <path d="M0 30 H50 l12 -20 12 40 14 -30 10 16 H170" stroke={COLORS.cyan} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - heartbeat} opacity={0.85} />
          </svg>
        </div>
      </PremiumPanel>
    </AbsoluteFill>
  );
};
