import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../styles/tokens";
import { EASE } from "../../omniflowad/theme";
import { fadeOut, prog, reveal } from "../../omniflowad/ui/anim";
import { AnimatedHeadline, BodyCopy } from "../components/text";
import { BusinessProfilePanel } from "../components/BusinessProfilePanel";
import { WarningPanel } from "../components/WarningPanel";
import { Callout, CustomerLocation, MapPin, StoreLocation } from "../components/StoreLocation";
import { CyanRoute } from "../../omniflowad/ui/CyanRoute";
import { Storefront } from "../../omniflowad/ui/Storefront";
import { ReferenceOverlay } from "../components/ReferenceOverlay";

/** CRITICAL: the route runs from YOUR CUSTOMER to COMPETITOR only.
 * Crown Hardware stays present but disconnected. */
const ROUTE_02 = "M470,1648 C424,1628 432,1560 398,1530 S342,1502 322,1492 S288,1470 270,1462";

/**
 * SCENE 02 — the map reads profile data, not the sign; missing data sends
 * the customer to the competitor.
 */
export const Scene02ProfileMismatch: React.FC = () => {
  const frame = useCurrentFrame();

  // Spec: diagram rises 184–228 (local 64–108); route draws inside that window.
  const routeP = prog(frame, 72, 24, EASE.inOut);
  const competitorLit = 0.7 + 0.3 * prog(frame, 96, 12);
  const exit = fadeOut(frame, 140, 14);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...exit }}>
        {/* storefront upper-right, warm but subtly dimmer than scene 01 */}
        <div style={{ position: "absolute", left: 690, top: 195, width: 390, opacity: prog(frame, 0, 16) }}>
          <Storefront lightsOn={0.85} frame={frame} showBoard={false} />
        </div>

        {/* headline + copy */}
        <div style={{ position: "absolute", left: 76, top: 158 }}>
          <AnimatedHeadline
            lines={[
              [{ t: "The map " }, { t: "can’t read", c: C.cyan, d: 4 }],
              ["your storefront sign."],
            ]}
            delay={2}
            stagger={8}
            size={60}
            lineHeight={1.16}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 352 }}>
          <BodyCopy lines={["It reads your category, location, hours,", "services, photos and reviews."]} delay={18} size={29} />
        </div>
        <div style={{ position: "absolute", left: 76, top: 458 }}>
          <BodyCopy
            lines={["When those details are missing or inconsistent,", "your business becomes harder to match."]}
            delay={30}
            size={29}
          />
        </div>

        {/* profile panel (inherits the scene 01 search-UI frame) */}
        <div style={{ position: "absolute", left: 55, top: 580 }}>
          <BusinessProfilePanel delay={8} width={500} />
        </div>

        {/* warning card */}
        <div style={{ position: "absolute", left: 655, top: 728 }}>
          <WarningPanel delay={38} width={306} />
        </div>

        {/* ---- bottom map diagram ---- */}
        {/* competitor (lower-left) */}
        <div style={{ position: "absolute", left: 66, top: 1288, width: 258, ...reveal(frame, 58, 20, 24) }}>
          <div style={{ position: "absolute", left: "50%", top: -66, marginLeft: -25 }}>
            <MapPin color={C.cyan} delay={82} />
          </div>
          <StoreLocation sign="BEST TOOLS" awning label="COMPETITOR" ring={C.cyan} lit={competitorLit} />
        </div>

        {/* your customer (bottom-centre) */}
        <div style={{ position: "absolute", left: 412, top: 1462, width: 272, ...reveal(frame, 54, 20, 24) }}>
          <CustomerLocation label="YOUR CUSTOMER" />
        </div>

        {/* Crown Hardware (lower-right) — present but disconnected */}
        <div style={{ position: "absolute", left: 752, top: 1395, width: 258, ...reveal(frame, 62, 20, 24), opacity: 0.94 * prog(frame, 62, 20) }}>
          <div style={{ position: "absolute", left: "50%", top: -62, marginLeft: -23 }}>
            <MapPin color="rgba(160,168,176,0.7)" size={50} delay={86} />
          </div>
          <StoreLocation sign="CROWN HARDWARE" label="CROWN HARDWARE" ring={null} lit={0.8} />
        </div>

        {/* the route: YOUR CUSTOMER → COMPETITOR only */}
        <CyanRoute d={ROUTE_02} progress={routeP} width={9} arrow />

        {/* callouts */}
        <div style={{ position: "absolute", left: 88, top: 1156 }}>
          <Callout lines={["They show up.", "They win the click."]} delay={80} width={252} align="center" />
        </div>
        <div style={{ position: "absolute", left: 742, top: 1242 }}>
          <Callout
            lines={["Your store stays", "hidden when the", "data is missing."]}
            color="rgba(215,161,68,0.8)"
            delay={84}
            width={252}
          />
        </div>
        <div style={{ position: "absolute", left: 328, top: 1756 }}>
          <Callout
            lines={["Missing information leads", "your customer to the competitor."]}
            delay={88}
            width={432}
            align="center"
          />
        </div>

      </AbsoluteFill>
      <ReferenceOverlay scene={2} />
    </AbsoluteFill>
  );
};
