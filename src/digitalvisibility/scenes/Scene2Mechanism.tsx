import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, EASE } from "../styles";
import { PARALLAX } from "../timeline";
import { prog, iv } from "../anim";
import { ParallaxLayer } from "../CameraRig";
import { KineticHeadline, BodyCopy } from "../components/KineticHeadline";
import { IsoStorefront } from "../components/IsoStorefront";
import { BusinessProfilePanel } from "../components/BusinessProfilePanel";
import { InfoCallout } from "../components/InfoCallout";
import { RoutePath } from "../components/RoutePath";

/** Route travels diagonally from the lower-left customer toward Crown
 * Hardware but breaks (red X) just before reaching the store. */
export const ROUTE_2 =
  "M235,1560 C300,1520 300,1470 360,1440 C430,1405 470,1420 530,1372 C598,1318 604,1250 690,1206 C760,1170 800,1150 852,1112";

/**
 * SCENE 2 — MECHANISM. The map can't confidently choose a business it can't
 * understand. Profile assembles with red missing values; the route breaks
 * before it reaches the store.
 */
export const Scene2Mechanism: React.FC = () => {
  const frame = useCurrentFrame();

  // route draws toward the store, then breaks (global ~171-198)
  const routeP = iv(frame, [18, 62], [0, 0.72], EASE.inOut);
  const broken = frame >= 66;
  const store = prog(frame, 4, 18);
  // fast fade-out over the boundary tail (route stays the continuous spine)
  const exit = prog(frame, 119, 8);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* Crown Hardware — upper-right */}
      <ParallaxLayer depth={PARALLAX.stores}>
        <div style={{ position: "absolute", left: 560, top: 388, width: 470, opacity: store }}>
          <IsoStorefront variant="crown" lit={0.92} />
        </div>
      </ParallaxLayer>

      {/* route with break */}
      <ParallaxLayer depth={PARALLAX.route}>
        <RoutePath
          d={ROUTE_2}
          progress={routeP}
          width={9}
          startNode
          flicker={broken ? iv(frame, [66, 80], [0, 0.6]) : 0}
          breakAt={broken ? 0.72 : undefined}
          pulse={!broken}
        />
      </ParallaxLayer>

      {/* text */}
      <div style={{ position: "absolute", left: 70, top: 118 }}>
        <div style={{ fontFamily: F.body, fontSize: 34, fontWeight: 600, color: C.gold, opacity: prog(frame, 2, 16), transform: `translateY(${(1 - prog(frame, 2, 16)) * 10}px)` }}>
          Why this happens
        </div>
      </div>
      <div style={{ position: "absolute", left: 68, top: 172 }}>
        <KineticHeadline lines={[["The map can’t confidently choose"]]} delay={8} size={48} weight={800} lineHeight={1.1} track={-0.8} />
      </div>
      <div style={{ position: "absolute", left: 66, top: 246 }}>
        <KineticHeadline
          lines={[["a business it"], [{ t: "can’t understand.", c: C.cyan, d: 4 }]]}
          delay={16}
          stagger={7}
          size={82}
          weight={800}
          lineHeight={1.04}
          track={-1.5}
        />
      </div>
      <div style={{ position: "absolute", left: 70, top: 468 }}>
        <BodyCopy lines={["If your profile is incomplete, inconsistent", "or unclear, search systems hesitate."]} delay={30} size={33} lineHeight={1.34} />
      </div>

      {/* profile panel — middle-left */}
      <div style={{ position: "absolute", left: 66, top: 592 }}>
        <BusinessProfilePanel delay={8} width={470} />
      </div>

      {/* warning callout — lower-right */}
      <div style={{ position: "absolute", left: 588, top: 968 }}>
        <InfoCallout lines={["When key details", "are missing, the route", "breaks before it", "reaches you."]} delay={34} width={392} />
      </div>
    </AbsoluteFill>
  );
};
