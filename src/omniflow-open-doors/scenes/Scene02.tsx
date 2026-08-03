import React from "react";
import { COLORS } from "../constants";
import { ease } from "../anim";
import { StorefrontPlate } from "../components/StorefrontPlate";
import { GoldDivider } from "../components/GoldDivider";
import { EditorialHeadline, SupportingCopy, GoldLanding } from "../components/Typography";
import { BusinessProfileCard } from "../components/Cards";

const COPY = {
  headline: ["THEY DIDN’T REJECT", "YOUR BUSINESS."],
  sub: "They never really saw it.",
  s1: [
    "An incomplete profile, unclear hours, few reviews,",
    "missing photos, or an outdated website can make",
    "a good business look inactive or uncertain online.",
  ],
  s2: [
    "Customers make fast decisions.",
    "If your business feels unclear,",
    "they move to the option that feels easier to trust.",
  ],
  gold: ["It isn’t a quality problem.", "It’s a visibility problem."],
};

const YOURS = {
  topLabel: "YOUR BUSINESS",
  businessName: "Crown Hardware",
  addressLines: ["123 Main Street", "Anytown, USA"],
  status: "CLOSED • Opens 10 AM",
  rating: "2.3",
  reviewCount: "(7)",
  details: ["Hours unclear", "No photos available", "Website outdated", "Few reviews"],
};
const COMP = {
  topLabel: "COMPETITOR",
  businessName: "Best Hardware Co.",
  addressLines: ["456 Oak Avenue", "Anytown, USA"],
  status: "OPEN • Closes 7 PM",
  rating: "4.8",
  reviewCount: "(312)",
  details: ["Open now • Closes 7 PM", "24+ photos", "Updated website", "312 reviews"],
};

/** Scene 2 — They never really saw it (frames 180-359). */
export const Scene02: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 172 || frame > 375) return null;
  const f = frame - 180;

  const introText = ease(frame, [188, 210], [0, 1]);
  const textOut = ease(f, [142, 172], [0, 1]);

  // Outro card travel (322-359) toward Scene 3 map destinations.
  const out = ease(f, [142, 179], [0, 1]);
  const compTf = `translate(${170 * out}px, ${-893 * out}px) scale(${1 - 0.5 * out})`;
  const yoursTf = `translate(${645 * out}px, ${470 * out}px) scale(${1 - 0.5 * out})`;
  const cardOpacity = 1 - ease(f, [148, 176], [0, 1]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: ease(frame, [176, 186], [0, 1]) }}>
      {/* Storefront environment continues, dim, upper-right. */}
      <StorefrontPlate
        x={620}
        y={0}
        width={460}
        height={760}
        dim
        opacity={ease(frame, [180, 212], [0, 1]) * (1 - textOut)}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(6,9,13,0) 30%, ${COLORS.bgBase} 44%)`,
          pointerEvents: "none",
        }}
      />

      {/* Copy column (fades/slices out into the transition). */}
      <div style={{ opacity: 1 - textOut, transform: `translateY(${-20 * textOut}px)` }}>
        <div style={{ position: "absolute", left: 68, top: 118 }}>
          <EditorialHeadline lines={COPY.headline} frame={frame} start={182} stagger={6} fontSize={82} width={760} />
        </div>
        <GoldDivider x={70} y={430} width={120} frame={frame} start={196} />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 452,
            opacity: introText,
            fontFamily: "Geist, Inter, sans-serif",
            fontWeight: 600,
            fontSize: 39,
            color: COLORS.warmGold,
            letterSpacing: "-0.01em",
          }}
        >
          {COPY.sub}
        </div>
        <div style={{ position: "absolute", left: 70, top: 535 }}>
          <SupportingCopy lines={COPY.s1} frame={frame} start={220} fontSize={24} width={710} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 680 }}>
          <SupportingCopy lines={COPY.s2} frame={frame} start={244} fontSize={24} width={710} />
        </div>
      </div>

      {/* Comparison cards. */}
      <div style={{ transform: compTf, opacity: cardOpacity }}>
        <BusinessProfileCard
          x={520}
          y={845}
          width={430}
          height={680}
          variant="strong"
          borderDraw={ease(frame, [250, 294], [0, 1])}
          {...COMP}
          scale={ease(frame, [200, 224], [0.92, 1])}
        />
      </div>
      <div style={{ transform: yoursTf, opacity: cardOpacity }}>
        <BusinessProfileCard
          x={60}
          y={845}
          width={430}
          height={680}
          variant="weak"
          {...YOURS}
          scale={ease(frame, [190, 216], [0.9, 1])}
        />
      </div>

      {/* Gold landing. */}
      <div style={{ position: "absolute", left: 70, top: 1600, opacity: 1 - textOut }}>
        <GoldLanding lines={COPY.gold} frame={frame} start={286} fontSize={33} width={660} />
      </div>
    </div>
  );
};
