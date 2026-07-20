import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, EASE } from "../styles";
import { PARALLAX } from "../timeline";
import { prog, iv } from "../anim";
import { ParallaxLayer } from "../CameraRig";
import { KineticHeadline, BodyCopy } from "../components/KineticHeadline";
import { IsoStorefront } from "../components/IsoStorefront";
import { ChecklistPanel } from "../components/ChecklistPanel";
import { OmniFlowBrandLockup } from "../components/OmniFlowBrandLockup";
import { RoutePath } from "../components/RoutePath";

/** The resolved route: from the lower-middle foreground straight into Crown
 * Hardware's entrance. The store itself is the destination — no pin. */
export const ROUTE_4 =
  "M566,1826 C648,1736 604,1628 664,1548 C722,1470 690,1360 724,1282 C756,1206 726,1108 750,1024 C772,946 742,864 764,798 C776,762 782,744 762,726";

const DOOR = { x: 762, y: 724 };

/**
 * SCENE 4 — SOLUTION. OmniFlow completes the profile; the route reconnects
 * to Crown Hardware. Checklist fills, route resolves, brand lockup lands.
 */
export const Scene4Solution: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = iv(frame, [10, 64], [0, 1], EASE.inOut);
  const arrived = prog(frame, 60, 16);
  const storeGlow = iv(frame, [40, 90], [0.9, 1.08]);
  const now = prog(frame, 66, 20);

  return (
    <AbsoluteFill>
      {/* Crown Hardware — prominent upper-right, the destination */}
      <ParallaxLayer depth={PARALLAX.stores}>
        <div style={{ position: "absolute", left: 556, top: 300, width: 500, filter: `brightness(${0.94 + 0.12 * arrived})` }}>
          <IsoStorefront variant="crown" lit={storeGlow} showSubline />
        </div>
      </ParallaxLayer>

      {/* the reconnected route into the door */}
      <ParallaxLayer depth={PARALLAX.route}>
        <RoutePath d={ROUTE_4} progress={routeP} width={10} startNode pulse glow={1.15} destination={DOOR} destinationActive={arrived} />
      </ParallaxLayer>

      {/* headline */}
      <div style={{ position: "absolute", left: 68, top: 122 }}>
        <KineticHeadline lines={[["OmniFlow fixes the digital version"]]} delay={6} size={47} weight={800} lineHeight={1.1} track={-0.8} />
      </div>
      <div style={{ position: "absolute", left: 66, top: 190 }}>
        <KineticHeadline lines={[[{ t: "of ", c: C.cyanSoft }, { t: "your business.", c: C.cyan, d: 3 }]]} delay={12} size={82} weight={800} lineHeight={1.02} track={-1.5} />
      </div>
      <div style={{ position: "absolute", left: 70, top: 320 }}>
        <BodyCopy lines={["When your profile is complete and", "your information is clear, customers", "can finally reach you."]} delay={24} stagger={4} size={32} lineHeight={1.32} />
      </div>

      {/* checklist — middle-left */}
      <div style={{ position: "absolute", left: 62, top: 468 }}>
        <ChecklistPanel delay={6} width={470} />
      </div>

      {/* "Now the route reaches your door." card */}
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 1150,
          width: 470,
          borderRadius: 20,
          border: "1.5px solid rgba(0,217,255,0.28)",
          background: "rgba(5,12,18,0.7)",
          padding: "24px 26px",
          display: "flex",
          gap: 22,
          alignItems: "center",
          opacity: now,
          transform: `translateX(${(1 - now) * -24}px)`,
        }}
      >
        <div style={{ width: 62, height: 62, borderRadius: "50%", border: `2px solid ${C.goldOutline}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" width={34} height={34} fill={C.cyan}><path d="M12 2c3.9 0 7 3 7 6.8 0 4.3-4.6 9.4-6.3 11.2a1 1 0 0 1-1.4 0C9.6 18.2 5 13.1 5 8.8 5 5 8.1 2 12 2z" /><circle cx="12" cy="8.6" r="2.4" fill={C.bg} /></svg>
        </div>
        <div style={{ fontFamily: F.head, fontSize: 40, fontWeight: 800, lineHeight: 1.14, letterSpacing: -0.5 }}>
          <div style={{ color: C.white }}>Now the route</div>
          <div style={{ color: C.cyan }}>reaches your door.</div>
        </div>
      </div>

      {/* brand lockup — lower-left */}
      <div style={{ position: "absolute", left: 66, top: 1430 }}>
        <OmniFlowBrandLockup delay={30} />
      </div>
    </AbsoluteFill>
  );
};
