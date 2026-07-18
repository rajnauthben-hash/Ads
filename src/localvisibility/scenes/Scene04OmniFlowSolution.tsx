import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { EASE } from "../../omniflowad/theme";
import { iv, prog } from "../../omniflowad/ui/anim";
import { AnimatedHeadline, BodyCopy, SceneNumber } from "../components/text";
import { CyanRoute } from "../../omniflowad/ui/CyanRoute";
import { Storefront } from "../../omniflowad/ui/Storefront";
import { Checklist, CustomerMarker } from "../../omniflowad/ui/Panels";
import { ReferenceOverlay } from "../components/ReferenceOverlay";

/** The reversed signal: customer (lower-left) directly to Crown Hardware
 * (upper-right). The storefront itself is the destination — no pin. */
const ROUTE_04 =
  "M320,1560 C430,1500 400,1410 470,1352 C540,1294 502,1224 562,1178 C622,1132 592,1062 642,1016 C692,970 662,900 706,858 C750,816 730,780 758,742 C780,712 792,690 800,662";

const CHECKLIST = [
  "Complete & accurate profile",
  "Right categories",
  "Correct location",
  "Updated hours",
  "Clear services",
  "Quality photos",
  "More reviews",
] as const;

/**
 * SCENE 04 — OmniFlow Digital fixes the digital version; the route finally
 * connects the customer to Crown Hardware.
 */
export const Scene04OmniFlowSolution: React.FC = () => {
  const frame = useCurrentFrame();

  // Spec: route draws 400–442 (local 40–82); arrival warms the store.
  const routeP = prog(frame, 40, 42, EASE.inOut);
  const arriveT = prog(frame, 78, 16);
  const storeGlow = iv(frame, [0, 90], [0.9, 1.06]);

  // Brand resolves 446–472 (local 86–112).
  const brandT = prog(frame, 82, 22);
  const digitalT = prog(frame, 88, 22);
  const tagT = prog(frame, 94, 20);
  const tagTrack = iv(frame, [94, 124], [9, 6.5]);

  return (
    <AbsoluteFill>
      {/* the destination storefront (no pin — the store itself) */}
      <div style={{ position: "absolute", left: 676, top: 205, width: 330 }}>
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 300,
            width: 420,
            height: 190,
            background: `radial-gradient(ellipse, rgba(255,182,92,${0.12 + 0.12 * arriveT}), transparent 70%)`,
          }}
        />
        <Storefront lightsOn={storeGlow} frame={frame} showBoard={false} />
      </div>

      {/* clean connected route with arrival glow */}
      <CyanRoute d={ROUTE_04} progress={routeP} width={10} travelPulse />
      <div
        style={{
          position: "absolute",
          left: 800 - 34,
          top: 662 - 17,
          width: 68,
          height: 34,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,216,242,0.75), rgba(0,216,242,0) 70%)",
          opacity: arriveT,
        }}
      />

      {/* customer marker, one restrained activation pulse */}
      <div style={{ position: "absolute", left: 139, top: 1452 }}>
        <CustomerMarker size={250} delay={30} />
      </div>

      {/* headline */}
      <div style={{ position: "absolute", left: 76, top: 152 }}>
        <AnimatedHeadline
          lines={[
            ["We fix the"],
            [{ t: "digital version", c: C.gold, d: 4 }],
            ["of your business."],
          ]}
          delay={14}
          stagger={8}
          size={76}
          lineHeight={1.14}
        />
      </div>

      {/* service list */}
      <div style={{ position: "absolute", left: 76, top: 476 }}>
        <BodyCopy
          lines={["Accurate information.", "Right categories.", "Updated hours.", "Clear services.", "Strong photos and reviews."]}
          delay={26}
          stagger={4}
          size={30}
        />
      </div>

      {/* explanatory sentence */}
      <div style={{ position: "absolute", left: 76, top: 736 }}>
        <BodyCopy
          lines={[
            ["So the map can understand your business"],
            [{ t: "and " }, { t: "send nearby customers your way.", c: C.cyan }],
          ]}
          delay={80}
          size={29}
        />
      </div>

      {/* checklist — grown out of the scene 03 call/result frames */}
      <div style={{ position: "absolute", left: 76, top: 856, fontFamily: F.body }}>
        <Checklist items={CHECKLIST} delay={4} stagger={6} />
      </div>

      {/* gold payoff */}
      <div style={{ position: "absolute", left: 76, top: 1316 }}>
        <AnimatedHeadline
          lines={[
            [{ t: "You get found.", c: C.gold }],
            [{ t: "You get chosen.", c: C.gold, d: 4 }],
          ]}
          delay={80}
          stagger={6}
          size={44}
          weight={800}
          lineHeight={1.3}
          font={F.body}
        />
      </div>

      {/* brand lockup */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1668, textAlign: "center" }}>
        <div
          style={{
            fontFamily: F.headline,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: iv(frame, [82, 118], [3, -0.5]),
            whiteSpace: "pre",
          }}
        >
          <span
            style={{
              color: C.white,
              opacity: brandT,
              filter: `blur(${(1 - brandT) * 10}px)`,
            }}
          >
            OmniFlow
          </span>
          <span
            style={{
              color: C.cyan,
              fontWeight: 500,
              opacity: digitalT,
              filter: `blur(${(1 - digitalT) * 10}px)`,
              WebkitTextStroke: digitalT < 1 ? `1.5px rgba(0,216,242,${0.9 - 0.4 * digitalT})` : undefined,
            }}
          >
            {" "}
            Digital
          </span>
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: F.label,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: tagTrack,
            color: C.white,
            opacity: tagT,
            transform: `translateY(${(1 - tagT) * 12}px)`,
          }}
        >
          GET FOUND. LOOK PROFESSIONAL. GROW ONLINE.
        </div>
      </div>

      <SceneNumber num="04" delay={0} />
      <ReferenceOverlay scene={4} />
    </AbsoluteFill>
  );
};
