import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../styles/tokens";
import { EASE } from "../../omniflowad/theme";
import { fadeOut, iv, prog } from "../../omniflowad/ui/anim";
import { AnimatedHeadline, BodyCopy, SceneNumber } from "../components/text";
import { ResultCard } from "../components/ResultCard";
import { IncomingCallCard } from "../components/IncomingCallCard";
import { CyanRoute } from "../../omniflowad/ui/CyanRoute";
import { Storefront } from "../../omniflowad/ui/Storefront";
import { Bokeh, Rain, WetGround } from "../../omniflowad/ui/Atmos";
import { ReferenceOverlay } from "../components/ReferenceOverlay";

/** The signal climbs from the lower-left origin up the street toward the
 * storefront doorway in a tight zigzag, per the reference. */
const ROUTE_03 =
  "M255,1822 L620,1694 L588,1642 L668,1600 L612,1552 L692,1506 L628,1456 L706,1408 L646,1356 L718,1306 L658,1252 L728,1200 L664,1148 L610,1098 L564,1054";

/**
 * SCENE 03 — the easier-to-understand competitor gets selected and called.
 */
export const Scene03CompetitorCall: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 66, 38, EASE.inOut);
  const selectGlow = prog(frame, 40, 16);
  const exit = fadeOut(frame, 140, 14);
  const drift = iv(frame, [0, 162], [6, -10]);

  return (
    <AbsoluteFill>
      <Bokeh seed={57} count={10} frame={frame} opacity={0.4} region={{ left: 0, top: 55, width: 35, height: 40 }} cyanRatio={0.25} />

      <AbsoluteFill style={{ ...exit }}>
        <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
          {/* storefront right */}
          <div style={{ position: "absolute", left: 520, top: 350, width: 560, opacity: prog(frame, 0, 16) }}>
            <Storefront lightsOn={1} frame={frame} />
            <div
              style={{
                transform: "scaleY(-1) translateY(118px)",
                opacity: 0.26,
                filter: "blur(9px)",
                WebkitMaskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
                maskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
              }}
            >
              <Storefront lightsOn={1} frame={frame} />
            </div>
          </div>

          <WetGround frame={frame} top={1005} opacity={0.8} />

          {/* the climbing signal */}
          <CyanRoute d={ROUTE_03} progress={routeP} width={8} startDot />

          {/* headline block */}
          <div style={{ position: "absolute", left: 76, top: 148 }}>
            <AnimatedHeadline lines={[["Your competitor"], ["may not be better."]]} delay={2} stagger={7} size={62} lineHeight={1.16} />
          </div>
          <div style={{ position: "absolute", left: 76, top: 330 }}>
            <AnimatedHeadline
              lines={[
                [{ t: "They’re simply " }, { t: "easier", c: C.cyan, d: 4 }],
                [{ t: "to find, " }, { t: "trust", c: C.gold, d: 6 }, { t: " and " }, { t: "call.", c: C.cyan, d: 8 }],
              ]}
              delay={14}
              stagger={8}
              size={64}
              lineHeight={1.16}
            />
          </div>
          <div style={{ position: "absolute", left: 76, top: 542 }}>
            <BodyCopy lines={["The customer sees the businesses", "the map understands first—"]} delay={30} size={29} />
          </div>
          <div style={{ position: "absolute", left: 76, top: 648 }}>
            <BodyCopy lines={["so your business gets passed over", "before they ever reach your street."]} delay={40} size={29} />
          </div>

          {/* result cards — competitor object resolved into a card */}
          <div style={{ position: "absolute", left: 55, top: 782 }}>
            <div
              style={{
                borderRadius: 22,
                boxShadow: `0 0 ${34 * selectGlow}px rgba(0,216,242,${0.22 * selectGlow})`,
                outline: selectGlow > 0.05 ? `1.5px solid rgba(0,216,242,${0.5 * selectGlow})` : undefined,
                outlineOffset: -1,
              }}
            >
              <ResultCard variant="best-tools" delay={4} width={440} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 55, top: 964 }}>
            <ResultCard variant="crown-negative" delay={14} width={440} />
          </div>

          {/* incoming call grows from the selected result */}
          <div style={{ position: "absolute", left: 55, top: 1168 }}>
            <IncomingCallCard delay={44} width={410} />
          </div>

          {/* bottom copy */}
          <div style={{ position: "absolute", left: 76, top: 1548 }}>
            <BodyCopy
              lines={["The first business the map can understand", "is often the first business that gets the call."]}
              delay={100}
              size={29}
            />
          </div>

          <SceneNumber num="03" delay={0} />
        </AbsoluteFill>
      </AbsoluteFill>

      <Rain frame={frame} opacity={0.04} />
      <ReferenceOverlay scene={3} />
    </AbsoluteFill>
  );
};
