import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, EASE } from "../styles";
import { PARALLAX } from "../timeline";
import { prog, iv } from "../anim";
import { ParallaxLayer } from "../CameraRig";
import { KineticHeadline, BodyCopy } from "../components/KineticHeadline";
import { IsoStorefront } from "../components/IsoStorefront";
import { ComparisonCard } from "../components/ComparisonCard";
import { IncomingCallCard } from "../components/IncomingCallCard";
import { RoutePath } from "../components/RoutePath";

/** The route redirects away from Crown Hardware and reaches Best Tools TT.
 * A dim dotted path marks the unresolved route to Crown Hardware. */
export const ROUTE_3 =
  "M140,1560 C320,1520 460,1496 530,1436 C596,1380 548,1300 596,1244 C642,1190 620,1116 636,1024 C652,936 700,858 748,790";
export const ROUTE_3_DOTTED =
  "M186,1584 C380,1600 560,1556 690,1420 C760,1348 790,1262 800,1180";

const BEST_TOOLS_MARK = { x: 748, y: 786 };

/**
 * SCENE 3 — CONSEQUENCE. The competitor gets chosen because the map
 * understands it. Route redirects to Best Tools TT; Crown Hardware stays
 * dim and unresolved.
 */
export const Scene3Consequence: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = iv(frame, [8, 52], [0, 1], EASE.inOut);
  const dottedP = iv(frame, [4, 30], [0, 1], EASE.out);
  const arrived = prog(frame, 48, 16);
  const bestLit = 0.85 + 0.15 * prog(frame, 46, 14);
  const exit = prog(frame, 119, 8);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* Best Tools TT — upper-right, brighter + raised */}
      <ParallaxLayer depth={PARALLAX.stores}>
        <div style={{ position: "absolute", left: 566, top: 386, width: 410, opacity: prog(frame, 2, 16), filter: "brightness(1.05)" }}>
          <IsoStorefront variant="besttools" lit={bestLit} />
        </div>
        {/* Crown Hardware — lower-right, dimmer + inactive */}
        <div style={{ position: "absolute", left: 596, top: 858, width: 410, opacity: 0.9 * prog(frame, 6, 16), filter: "brightness(0.82) saturate(0.9)" }}>
          <IsoStorefront variant="crown" lit={0.72} />
        </div>
      </ParallaxLayer>

      {/* route + dotted alternative + active pin (all in one layer so the
          pin stays glued to the route end as the camera drifts) */}
      <ParallaxLayer depth={PARALLAX.route}>
        <RoutePath
          d={ROUTE_3}
          progress={routeP}
          width={9}
          startNode
          pulse
          dotted={ROUTE_3_DOTTED}
          dottedProgress={dottedP}
          destination={BEST_TOOLS_MARK}
          destinationActive={arrived}
        />
        <div style={{ position: "absolute", left: BEST_TOOLS_MARK.x - 34, top: BEST_TOOLS_MARK.y - 150, opacity: arrived }}>
          <svg viewBox="0 0 68 88" width={68} height={88}>
            <path d="M34 4c16 0 28 12 28 27 0 18-18 30-28 53C24 61 6 49 6 31 6 16 18 4 34 4z" fill="rgba(0,120,150,0.85)" stroke={C.cyan} strokeWidth={3} style={{ filter: "drop-shadow(0 0 10px rgba(0,217,255,0.5))" }} />
            <circle cx="34" cy="31" r="11" fill="#DFFBFF" />
          </svg>
        </div>
      </ParallaxLayer>

      {/* headline */}
      <div style={{ position: "absolute", left: 68, top: 116 }}>
        <KineticHeadline lines={[["Your competitor"], ["may not be better."]]} delay={2} stagger={7} size={62} weight={800} lineHeight={1.08} />
      </div>
      <div style={{ position: "absolute", left: 68, top: 296 }}>
        <KineticHeadline
          lines={[
            [{ t: "They may simply be " }, { t: "easier", c: C.cyan, d: 4 }],
            [{ t: "to find, " }, { t: "trust", c: C.gold, d: 6 }, { t: " and " }, { t: "call.", c: C.cyan, d: 8 }],
          ]}
          delay={12}
          stagger={7}
          size={64}
          weight={800}
          lineHeight={1.08}
        />
      </div>
      <div style={{ position: "absolute", left: 70, top: 500 }}>
        <BodyCopy lines={["Customers often choose the business", "that gives the map enough confidence", "to send them there first."]} delay={26} stagger={4} size={32} lineHeight={1.32} />
      </div>

      {/* comparison cards — middle-left */}
      <div style={{ position: "absolute", left: 48, top: 686 }}>
        <ComparisonCard variant="besttools" delay={30} width={430} />
      </div>
      <div style={{ position: "absolute", left: 48, top: 852 }}>
        <ComparisonCard variant="crown" delay={40} width={430} />
      </div>

      {/* incoming call — below */}
      <div style={{ position: "absolute", left: 48, top: 1040 }}>
        <IncomingCallCard delay={50} width={400} />
      </div>
    </AbsoluteFill>
  );
};
