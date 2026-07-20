import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../styles";
import { PARALLAX } from "../timeline";
import { prog, iv } from "../anim";
import { EASE } from "../styles";
import { ParallaxLayer } from "../CameraRig";
import { KineticHeadline, BodyCopy } from "../components/KineticHeadline";
import { IsoStorefront } from "../components/IsoStorefront";
import { PhoneSearchUI } from "../components/PhoneSearchUI";
import { RoutePath } from "../components/RoutePath";

/** Route: search origin (lower-mid) up toward Crown Hardware's pavement. It
 * stops just short of the store by scene end, ready to hand to scene 2. */
export const ROUTE_1 =
  "M470,1740 C560,1690 610,1650 640,1600 C672,1548 640,1490 690,1452 C742,1412 786,1400 806,1352 C826,1306 802,1268 828,1210 C846,1170 872,1150 892,1112";

const PersonIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width={36} height={36} fill="none" stroke={C.gold} strokeWidth={1.8}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 20c.6-3.6 3.2-5.4 6.5-5.4s5.9 1.8 6.5 5.4" strokeLinecap="round" />
  </svg>
);
const SearchIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke={C.cyan} strokeWidth={2.2} strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15 L20 20" />
  </svg>
);

/**
 * SCENE 1 — HOOK. "Your business can look open. And still be hard to find."
 * Phone rises from lower-left, search activates, cyan route begins toward
 * the store. Crown Hardware sits upper-right on the map.
 */
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // route draws from ~f55, stops short of the store by scene end
  const routeP = iv(frame, [55, 104], [0, 0.82], EASE.inOut);

  // phone rise 20→42
  const phoneT = prog(frame, 20, 22, EASE.out);
  const phoneY = (1 - phoneT) * 180;
  const phoneRotZ = -8 + phoneT * 5;
  const phoneRotY = -12 + phoneT * 12;
  const phoneScale = 0.92 + phoneT * 0.08;

  // exit hand-off: phone rotates down & slides offscreen; scene fades over tail
  const exitT = prog(frame, 96, 16, EASE.inOut);
  const fade = prog(frame, 104, 8);
  const store = prog(frame, 6, 20);

  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      {/* storefront — upper-right on the map */}
      <ParallaxLayer depth={PARALLAX.stores}>
        <div style={{ position: "absolute", left: 470, top: 470, width: 560, opacity: store }}>
          <IsoStorefront variant="crown" lit={1} />
        </div>
      </ParallaxLayer>

      {/* the persistent route (starts drawing mid-scene) */}
      <ParallaxLayer depth={PARALLAX.route}>
        <RoutePath d={ROUTE_1} progress={routeP} width={9} startNode pulse />
      </ParallaxLayer>

      {/* text column — upper-left */}
      <AbsoluteFill style={{ opacity: 1 - exitT * 0.15 }}>
        <div style={{ position: "absolute", left: 70, top: 128 }}>
          <KineticHeadline
            lines={[["Your business"], [{ t: "can look " }, { t: "open.", c: C.gold, d: 4 }]]}
            delay={10}
            stagger={7}
            size={78}
            weight={800}
            lineHeight={1.08}
          />
        </div>
        <div style={{ position: "absolute", left: 70, top: 300 }}>
          <KineticHeadline lines={[["And still be"]]} delay={26} size={78} weight={800} lineHeight={1.1} />
        </div>
        <div style={{ position: "absolute", left: 66, top: 388 }}>
          <KineticHeadline
            lines={[[{ t: "hard ", c: C.white }, { t: "to ", c: C.cyanSoft, d: 3 }, { t: "find.", c: C.cyan, d: 6 }]]}
            delay={32}
            size={128}
            weight={800}
            lineHeight={1.0}
            track={-2.5}
          />
        </div>

        {/* two small labelled rows */}
        <div style={{ position: "absolute", left: 74, top: 560, display: "flex", gap: 20, alignItems: "flex-start", opacity: prog(frame, 44, 18), transform: `translateY(${(1 - prog(frame, 44, 18)) * 12}px)` }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", border: `1.5px solid ${C.goldOutline}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><PersonIcon /></div>
          <BodyCopy lines={["Nearby customers aren’t", "driving around looking", "for your sign."]} delay={46} stagger={4} size={34} lineHeight={1.32} />
        </div>
        <div style={{ position: "absolute", left: 74, top: 760, display: "flex", gap: 20, alignItems: "flex-start", opacity: prog(frame, 54, 18), transform: `translateY(${(1 - prog(frame, 54, 18)) * 12}px)` }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", border: `1.5px solid ${C.panelOutline}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SearchIcon /></div>
          <BodyCopy lines={[[{ t: "They’re searching on", c: C.cyanSoft }], [{ t: "their phones first.", c: C.cyanSoft }]]} delay={56} stagger={4} size={34} lineHeight={1.32} />
        </div>
      </AbsoluteFill>

      {/* phone — lower-left foreground */}
      <ParallaxLayer depth={PARALLAX.phone}>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 900,
            opacity: Math.min(1, phoneT * 1.4),
            transform: `translateY(${phoneY + exitT * 340}px) perspective(1500px) rotateZ(${phoneRotZ + exitT * 6}deg) rotateY(${phoneRotY - exitT * 10}deg) scale(${phoneScale})`,
            transformOrigin: "50% 100%",
            filter: phoneT < 1 ? `blur(${(1 - phoneT) * 6}px)` : undefined,
          }}
        >
          <PhoneSearchUI delay={42} />
        </div>
      </ParallaxLayer>
    </AbsoluteFill>
  );
};
