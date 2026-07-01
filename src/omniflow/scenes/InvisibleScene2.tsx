import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";
import { SceneFade, TextReveal, FadeIn } from "../TextReveal";

// A single search result row
const SearchRow: React.FC<{
  rank: number;
  title: string;
  url: string;
  snippet: string;
  delay: number;
  isCompetitor?: boolean;
  isDimmed?: boolean;
}> = ({ rank, title, url, snippet, delay, isCompetitor = false, isDimmed = false }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const slideX = interpolate(f, [0, 22], [-24, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  const baseOpacity = isDimmed ? 0.35 : 1;

  return (
    <div
      style={{
        opacity: opacity * baseOpacity,
        translate: `${slideX}px 0px`,
        padding: "16px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {/* Rank number */}
        <div
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 700,
            color: isCompetitor ? C.amber : "rgba(255,255,255,0.2)",
            minWidth: 28,
            marginTop: 2,
          }}
        >
          {rank}
        </div>
        <div style={{ flex: 1 }}>
          {/* URL breadcrumb */}
          <div
            style={{
              fontFamily,
              fontSize: 14,
              color: isCompetitor ? "rgba(0,180,120,0.8)" : "rgba(255,255,255,0.3)",
              marginBottom: 4,
              letterSpacing: "0.01em",
            }}
          >
            {url}
          </div>
          {/* Title */}
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 600,
              color: isCompetitor ? C.white : "rgba(255,255,255,0.45)",
              marginBottom: 6,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
            {isCompetitor && (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "rgba(244,165,53,0.18)",
                  color: C.amber,
                  verticalAlign: "middle",
                }}
              >
                Top Pick
              </span>
            )}
          </div>
          {/* Snippet */}
          <div
            style={{
              fontFamily,
              fontSize: 16,
              color: "rgba(255,255,255,0.28)",
              lineHeight: 1.5,
            }}
          >
            {snippet}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cursor that scrolls down the list
const ScrollCursor: React.FC<{ startDelay: number }> = ({ startDelay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - startDelay);

  const opacity = interpolate(f, [0, 8, 60, 80], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const y = interpolate(f, [0, 70], [220, 820], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Simple pointer cursor SVG */}
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <path
          d="M3 2L3 22L8 17L12 26L14.5 25L10.5 16L18 16L3 2Z"
          fill="white"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export const InvisibleScene2: React.FC = () => {
  return (
    <SceneFade totalFrames={115} fadeIn={10} fadeOut={12}>
      <AbsoluteFill style={{ background: "#030912" }}>

        {/* Search results panel */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 60px",
            paddingTop: 160,
          }}
        >
          {/* Search bar */}
          <FadeIn delay={4} duration={16}>
            <div
              style={{
                fontFamily,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 18, opacity: 0.4 }}>🔍</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 22, fontFamily }}>
                best digital agency near me
              </span>
            </div>
            {/* Results count */}
            <div style={{ fontFamily, color: "rgba(255,255,255,0.2)", fontSize: 15, marginBottom: 20, paddingLeft: 4 }}>
              About 14,200 results
            </div>
          </FadeIn>

          {/* Search result rows */}
          <SearchRow
            rank={1}
            title="TopRank Digital Agency"
            url="toprankdigital.com › services"
            snippet="Award-winning agency. Premium websites, local SEO & automation. Book your free audit."
            delay={12}
            isCompetitor
          />
          <SearchRow
            rank={2}
            title="ProWeb Solutions"
            url="prowebsolutions.com.au › get-started"
            snippet="Trusted by 500+ businesses. Fast websites, Google Maps rankings & lead funnels."
            delay={20}
            isCompetitor
          />
          <SearchRow
            rank={3}
            title="DigitalBoost Co."
            url="digitalboost.co › packages"
            snippet="Specialists in visibility. Google Business, SEO, web design for local businesses."
            delay={28}
          />
          <SearchRow
            rank={4}
            title="Nexus Media Group"
            url="nexusmediagroup.net › contact"
            snippet="Web design and digital marketing. Over 10 years experience."
            delay={36}
            isDimmed
          />
          <SearchRow
            rank={5}
            title="Your Business Name"
            url="yourbusiness.com.au"
            snippet="Welcome to our website. Services. About. Contact."
            delay={44}
            isDimmed
          />

          {/* Scroll cursor passes over result #5 */}
          <ScrollCursor startDelay={52} />
        </AbsoluteFill>

        {/* Bottom text */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 80px 160px",
          }}
        >
          <TextReveal delay={58} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.offWhite,
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: 16,
              }}
            >
              Customers judge you
            </div>
          </TextReveal>
          <TextReveal delay={72} duration={22}>
            <div
              style={{
                fontFamily,
                textAlign: "center",
                color: C.textSub,
                fontSize: 52,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.35,
              }}
            >
              before they{" "}
              <span style={{ color: C.cyan }}>contact you.</span>
            </div>
          </TextReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneFade>
  );
};
