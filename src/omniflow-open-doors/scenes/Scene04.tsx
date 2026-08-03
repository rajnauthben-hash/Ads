import React from "react";
import { COLORS, FONTS } from "../constants";
import { ease } from "../anim";
import { EditorialHeadline, SupportingCopy, GoldLanding } from "../components/Typography";
import { GoldDivider } from "../components/GoldDivider";
import { StorefrontPlate } from "../components/StorefrontPlate";
import { BusinessInfoCard } from "../components/Cards";
import { RouteDraw, RoutePulse, CustomerMarker, DestinationRing } from "../components/Routes";
import { BrandLogoSlot, Tagline } from "../components/Brand";

const COPY = {
  headline: ["MAKE YOUR BUSINESS", "EASY TO FIND —", "AND EASY TO CHOOSE."],
  s1: ["When people search nearby, your business should feel", "clear, active, and worth visiting."],
  s2: [
    "OmniFlow Digital helps strengthen your visibility across",
    "search, maps, and the web so the right customers",
    "reach your door instead of someone else’s.",
  ],
  gold: ["You can’t win customers", "who never see your door."],
  tagline: "Get Found. Look Professional. Grow Online.",
};

const CARD = {
  businessName: "CROWN HARDWARE",
  status: "Active",
  addressLines: ["123 Main Street", "Riverside, CA 92501"],
  hoursLines: ["Mon–Sat 7:00 AM – 7:00 PM", "Sun 9:00 AM – 5:00 PM"],
  phone: "(951) 555–0198",
  website: "crownhardware.com",
  rating: "4.8",
  reviewCount: "(256 reviews)",
  proof: "Verified Business",
};

// Solid cyan route: Customer (lower-left) -> Market St -> 3rd St -> Main St -> Crown.
const ROUTE_D = "M185,1565 L430,1440 L500,1250 L560,1245 L690,1285 L820,1255";

const StreetLabel: React.FC<{ x: number; y: number; text: string; rot: number; opacity: number }> = ({
  x,
  y,
  text,
  rot,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `rotate(${rot}deg)`,
      color: COLORS.dimText,
      fontFamily: FONTS.interface,
      fontWeight: 600,
      fontSize: 19,
      letterSpacing: "0.14em",
      opacity,
    }}
  >
    {text}
  </div>
);

/** Scene 4 — OmniFlow reconnects the customer (frames 540-719). */
export const Scene04: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 532) return null;
  const f = frame - 540;

  const inOpacity = ease(frame, [540, 558], [0, 1]);
  const repair = ease(frame, [540, 596], [0, 1]); // dotted -> solid
  const cardExpand = ease(f, [8, 54], [0, 1]);
  const contentReveal = ease(f, [40, 96], [0, 1]);

  const pulseHead = frame >= 620 && frame <= 690 ? ((frame - 620) % 46) / 46 : -1;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: inOpacity }}>
      {/* Crown storefront returns, upper-right. */}
      <StorefrontPlate x={635} y={0} width={445} height={750} lightLevel={1} opacity={ease(frame, [540, 584], [0, 1])} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(6,9,13,0) 30%, rgba(6,9,13,0.65) 42%)`,
          pointerEvents: "none",
        }}
      />

      {/* Repairing route: dotted underlay fades as solid cyan draws. */}
      <RouteDraw id="s4-dotted" d={ROUTE_D} progress={1} variant="dotted" />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - repair }} />
      <RouteDraw id="s4-solid" d={ROUTE_D} progress={repair} variant="solid" />
      {pulseHead >= 0 && <RoutePulse d={ROUTE_D} head={pulseHead} />}
      <DestinationRing x={820} y={1255} diameter={34} active progress={repair} />

      {/* Street labels along the repaired route. */}
      <StreetLabel x={250} y={1520} text="MARKET ST" rot={-24} opacity={repair} />
      <StreetLabel x={452} y={1350} text="3RD ST" rot={-74} opacity={repair} />
      <StreetLabel x={600} y={1232} text="MAIN ST" rot={-14} opacity={repair} />

      {/* Persistent Customer marker (now a located pin, lower-left). */}
      <CustomerMarker x={190} y={1600} variant="pin" opacity={ease(frame, [540, 566], [0, 1])} />
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 1470,
          padding: "8px 16px",
          borderRadius: 10,
          background: "rgba(18,23,30,0.94)",
          border: `1px solid ${COLORS.cardBorder}`,
          textAlign: "center",
          opacity: ease(frame, [548, 574], [0, 1]),
        }}
      >
        <div style={{ fontFamily: FONTS.interface, fontWeight: 700, fontSize: 21, color: COLORS.white, letterSpacing: "0.06em" }}>
          CUSTOMER
        </div>
        <div style={{ fontFamily: FONTS.support, fontSize: 18, color: COLORS.dimText }}>You Are Here</div>
      </div>

      {/* Info card — expanded from the Scene 3 Weak-presence bubble. */}
      <div style={{ transform: `scale(${0.7 + 0.3 * cardExpand})`, transformOrigin: "top right", opacity: cardExpand }}>
        <BusinessInfoCard x={555} y={760} width={455} height={465} contentReveal={contentReveal} {...CARD} />
      </div>

      {/* Copy column (left). */}
      <div style={{ position: "absolute", left: 55, top: 162 }}>
        <EditorialHeadline lines={COPY.headline} frame={frame} start={566} stagger={6} fontSize={73} width={580} />
      </div>
      <div style={{ position: "absolute", left: 55, top: 540 }}>
        <SupportingCopy lines={COPY.s1} frame={frame} start={592} fontSize={24} width={570} />
      </div>
      <div style={{ position: "absolute", left: 55, top: 660 }}>
        <SupportingCopy lines={COPY.s2} frame={frame} start={608} fontSize={24} width={580} />
      </div>
      <GoldDivider x={55} y={848} width={110} frame={frame} start={648} />
      <div style={{ position: "absolute", left: 55, top: 890 }}>
        <GoldLanding lines={COPY.gold} frame={frame} start={650} fontSize={34} width={510} />
      </div>

      {/* Tagline + reserved logo slot. */}
      <Tagline x={55} y={1755} width={610} fontSize={23} text={COPY.tagline} style={{ opacity: ease(frame, [668, 692], [0, 1]) }} />
      <BrandLogoSlot x={700} y={1715} width={250} height={70} opacity={ease(frame, [668, 692], [0, 1])} />
    </div>
  );
};
